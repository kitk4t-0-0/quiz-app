import type {
  Exam,
  ExamSubmission,
  MCQQuestion,
  Question,
  QuestionSet,
  ShortAnswerQuestion,
  StudentAnswer,
  TrueFalseSetQuestion,
} from "@/types/exam";
import { QuestionType } from "@/types/exam";
import { calculateTotalPoints } from "./helpers";
import { calculateTFWeight } from "./scoring";

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
    case QuestionType.TRUE_FALSE_SET:
      return checkTrueFalseSetAnswer(question, answer);
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
  if (typeof answer.answer !== "string") {
    return false;
  }
  return correctOptionIds.includes(answer.answer);
}

/**
 * Check True/False Set answer
 */
function checkTrueFalseSetAnswer(
  question: TrueFalseSetQuestion,
  answer: StudentAnswer,
): boolean {
  // Answer should be a record of subQuestionId -> boolean
  if (typeof answer.answer !== "object" || Array.isArray(answer.answer)) {
    return false;
  }

  const answers = answer.answer as Record<string, boolean>;

  // Check if all sub-questions are answered correctly
  return question.subQuestions.every((subQ) => {
    const studentAnswer = answers[subQ.id];
    return studentAnswer === subQ.correctAnswer;
  });
}

/**
 * Check Short Answer
 */
function checkShortAnswer(
  question: ShortAnswerQuestion,
  answer: StudentAnswer,
): boolean {
  if (typeof answer.answer !== "string") {
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

    // Score each question individually
    for (const answer of setAnswers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      // Handle True/False Set with weighted scoring
      if (question.type === QuestionType.TRUE_FALSE_SET) {
        const tfAnswer = answer.answer as Record<string, boolean>;
        let correctCount = 0;

        // Count correct sub-answers
        for (const subQ of question.subQuestions) {
          if (tfAnswer[subQ.id] === subQ.correctAnswer) {
            correctCount++;
          }
        }

        const totalSubQuestions = question.subQuestions.length;

        if (question.useWeightedScoring) {
          // Weighted scoring: use formula (1/2)^(total - correct)
          const weight = calculateTFWeight(totalSubQuestions, correctCount);
          rawEarnedPoints += question.points * weight;
        } else {
          // Non-weighted scoring: divide points equally among sub-questions
          const pointsPerSubQuestion = question.points / totalSubQuestions;
          rawEarnedPoints += correctCount * pointsPerSubQuestion;
        }
      } else {
        // Standard scoring for MCQ and Short Answer
        if (checkAnswer(question, answer)) {
          rawEarnedPoints += question.points;
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
