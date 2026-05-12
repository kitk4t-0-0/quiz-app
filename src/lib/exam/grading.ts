import type {
  Exam,
  ExamSubmission,
  MCQQuestion,
  Question,
  QuestionSet,
  ShortAnswerQuestion,
  StudentAnswer,
  TrueFalseQuestion,
} from '@/types/exam';
import { QuestionType } from '@/types/exam';
import { calculateTotalPoints } from './helpers';
import { calculateTFWeight } from './scoring';

/**
 * Check if an answer is correct
 */
export function checkAnswer(
  question: Question,
  answer: StudentAnswer,
): boolean {
  if (question.id !== answer.questionId) {
    return false;
  }

  if (question.type !== answer.questionType) {
    return false;
  }

  switch (question.type) {
    case QuestionType.MCQ:
      return checkMCQAnswer(question, answer);
    case QuestionType.TRUE_FALSE:
      return checkTrueFalseAnswer(question, answer);
    case QuestionType.SHORT_ANSWER:
      return checkShortAnswer(question, answer);
    default:
      return false;
  }
}

/**
 * Check MCQ answer
 */
function checkMCQAnswer(question: MCQQuestion, answer: StudentAnswer): boolean {
  const correctOptionIds = question.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.id)
    .sort();

  if (question.allowMultiple) {
    if (!Array.isArray(answer.answer)) {
      return false;
    }
    const studentAnswers = [...answer.answer].sort();
    return (
      correctOptionIds.length === studentAnswers.length &&
      correctOptionIds.every((id, index) => id === studentAnswers[index])
    );
  }

  // Single choice
  if (typeof answer.answer !== 'string') {
    return false;
  }
  return correctOptionIds.includes(answer.answer);
}

/**
 * Check True/False answer
 */
function checkTrueFalseAnswer(
  question: TrueFalseQuestion,
  answer: StudentAnswer,
): boolean {
  if (typeof answer.answer !== 'boolean') {
    return false;
  }
  return answer.answer === question.correctAnswer;
}

/**
 * Check Short Answer
 */
function checkShortAnswer(
  question: ShortAnswerQuestion,
  answer: StudentAnswer,
): boolean {
  if (typeof answer.answer !== 'string') {
    return false;
  }

  const studentAnswer = question.caseSensitive
    ? answer.answer.trim()
    : answer.answer.trim().toLowerCase();

  const correctAnswer = question.caseSensitive
    ? question.correctAnswer.trim()
    : question.correctAnswer.trim().toLowerCase();

  // Check if it's a numeric answer
  if (question.isNumeric) {
    const studentNum = Number.parseFloat(studentAnswer);
    const correctNum = Number.parseFloat(correctAnswer);

    if (Number.isNaN(studentNum) || Number.isNaN(correctNum)) {
      return false;
    }

    // Use numeric tolerance if provided, otherwise default to 0 for exact numeric match
    const tolerance = question.numericTolerance ?? 0;
    return Math.abs(studentNum - correctNum) <= tolerance;
  }

  // Check exact match
  if (studentAnswer === correctAnswer) {
    return true;
  }

  // Check acceptable answers
  if (question.acceptableAnswers) {
    const acceptableAnswers = question.acceptableAnswers.map((ans) =>
      question.caseSensitive ? ans.trim() : ans.trim().toLowerCase(),
    );
    return acceptableAnswers.includes(studentAnswer);
  }

  return false;
}

/**
 * Grade an exam submission
 *
 * Scoring Logic:
 * 1. Calculate raw earned points from questions
 * 2. Normalize to exam's maxScore (display scale)
 * 3. Compare against passingScore to determine pass/fail
 *
 * Example: If questions total 15 raw points, student earns 10, and maxScore is 100:
 * - earnedPoints = 10 (raw)
 * - totalPoints = 100 (maxScore, the display scale)
 * - score = (10/15) * 100 = 66.67
 */
export function gradeSubmission(
  exam: Exam,
  submission: ExamSubmission,
): {
  earnedPoints: number;
  totalPoints: number;
  score: number;
  passed: boolean;
} {
  const maxScore = exam.scoringConfig.maxScore;
  let rawEarnedPoints = 0;

  // Create a map of questions for quick lookup
  const questionMap = new Map<string, Question>();
  const questionSetMap = new Map<string, QuestionSet>();

  for (const set of exam.questionSets) {
    for (const question of set.questions) {
      questionMap.set(question.id, question);
      questionSetMap.set(question.id, set);
    }
  }

  // Group answers by question set for weighted scoring
  const answersBySet = new Map<string, StudentAnswer[]>();
  for (const answer of submission.answers) {
    const set = questionSetMap.get(answer.questionId);
    if (set) {
      if (!answersBySet.has(set.id)) {
        answersBySet.set(set.id, []);
      }
      answersBySet.get(set.id)?.push(answer);
    }
  }

  // Calculate points for each question set
  for (const set of exam.questionSets) {
    const setAnswers = answersBySet.get(set.id) || [];

    // Check if this is a pure T/F set (all questions are T/F)
    const isTFSet = set.questions.every(
      (q) => q.type === QuestionType.TRUE_FALSE,
    );

    if (isTFSet) {
      // True/False question set - handle as a group
      let correctCount = 0;

      // Count correct answers (unanswered questions count as incorrect)
      for (const question of set.questions) {
        const answer = setAnswers.find((a) => a.questionId === question.id);
        if (answer && checkAnswer(question, answer)) {
          correctCount++;
        }
      }

      const totalQuestions = set.questions.length;
      const setTotalPoints = set.points ?? totalQuestions; // Default to 1 point per question if not specified

      if (set.useWeightedScoring) {
        // Weighted scoring: use formula (1/2)^(totalQuestions - correctAnswers)
        // Unanswered questions count as incorrect
        const weight = calculateTFWeight(totalQuestions, correctCount);
        rawEarnedPoints += setTotalPoints * weight;
      } else {
        // Non-weighted scoring: divide set points equally among questions
        // Only count answered questions that are correct
        const pointsPerQuestion = setTotalPoints / totalQuestions;
        rawEarnedPoints += correctCount * pointsPerQuestion;
      }
    } else {
      // Mixed or non-T/F set - score each question individually
      for (const answer of setAnswers) {
        const question = questionMap.get(answer.questionId);
        if (question && checkAnswer(question, answer)) {
          // Only MCQ and Short Answer have individual points
          // T/F questions in mixed sets should not exist (validation should catch this)
          if (question.type !== QuestionType.TRUE_FALSE) {
            rawEarnedPoints += question.points;
          }
        }
      }
    }
  }

  // Normalize to max score (display scale)
  const rawTotal = calculateTotalPoints(exam);
  const normalizedScore =
    rawTotal > 0 ? (rawEarnedPoints / rawTotal) * maxScore : 0;

  const passed = normalizedScore >= exam.scoringConfig.passingScore;

  return {
    earnedPoints: Number(rawEarnedPoints.toFixed(2)),
    totalPoints: maxScore,
    score: Number(normalizedScore.toFixed(2)),
    passed,
  };
}
