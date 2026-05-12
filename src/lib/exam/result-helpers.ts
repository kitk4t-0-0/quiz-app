import type {
  Exam,
  ExamSubmission,
  Question,
  StudentAnswer,
} from "@/types/exam";
import { QuestionType } from "@/types/exam";
import { checkAnswer } from "./grading";
import { calculateTFWeight } from "./scoring";

/**
 * Generate a security code for exam submission
 * Format: XXXX-XXXX-XXXX (12 characters)
 */
export function generateSecurityCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = 3;
  const segmentLength = 4;

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join("");
  }).join("-");

  return code;
}

/**
 * Question type statistics
 */
export interface QuestionTypeStats {
  type: string;
  correct: number;
  total: number;
  earnedPoints: number;
  totalPoints: number;
}

/**
 * Individual question result
 */
export interface QuestionResult {
  questionNumber: number;
  questionId: string;
  questionType: string;
  questionText: string;
  isCorrect: boolean;
  earnedPoints: number;
  totalPoints: number;
  scaledEarnedPoints: number;
  scaledTotalPoints: number;
  question: Question;
  answer: StudentAnswer | undefined;
}

/**
 * Detailed result data for display
 */
export interface DetailedResultData {
  questionTypeStats: QuestionTypeStats[];
  questionResults: QuestionResult[];
  totalCorrect: number;
  totalQuestions: number;
}

/**
 * Calculate detailed result data for an exam submission
 */
export function calculateDetailedResults(
  exam: Exam,
  submission: ExamSubmission,
): DetailedResultData {
  const questionResults: QuestionResult[] = [];
  const typeStatsMap = new Map<
    string,
    {
      correct: number;
      total: number;
      earnedPoints: number;
      totalPoints: number;
    }
  >();

  let questionNumber = 0;
  let totalCorrect = 0;

  // Create answer map for quick lookup
  const answerMap = new Map<string, StudentAnswer>();
  for (const answer of submission.answers) {
    answerMap.set(answer.questionId, answer);
  }

  // Calculate raw total points and scale factor
  let rawTotalPoints = 0;
  for (const set of exam.questionSets) {
    for (const question of set.questions) {
      rawTotalPoints += question.points;
    }
  }

  const maxScore = exam.scoringConfig.maxScore;
  const scaleFactor = rawTotalPoints > 0 ? maxScore / rawTotalPoints : 1;

  // Process each question
  for (const set of exam.questionSets) {
    for (const question of set.questions) {
      questionNumber++;
      const answer = answerMap.get(question.id);
      const isCorrect = answer ? checkAnswer(question, answer) : false;

      // Calculate earned points for this question (raw)
      let earnedPoints = 0;
      let correctSubCount = 0;
      let totalSubCount = 0;

      if (answer) {
        if (question.type === QuestionType.TRUE_FALSE_SET) {
          // Calculate weighted score for True/False sets
          const tfAnswer = answer.answer as Record<string, boolean>;
          let correctCount = 0;

          for (const subQ of question.subQuestions) {
            totalSubCount++;
            if (tfAnswer[subQ.id] === subQ.correctAnswer) {
              correctCount++;
              correctSubCount++;
            }
          }

          const totalSubQuestions = question.subQuestions.length;

          if (question.useWeightedScoring) {
            const weight = calculateTFWeight(totalSubQuestions, correctCount);
            earnedPoints = question.points * weight;
          } else {
            const pointsPerSubQuestion = question.points / totalSubQuestions;
            earnedPoints = correctCount * pointsPerSubQuestion;
          }
        } else {
          // Standard scoring for MCQ and Short Answer
          earnedPoints = isCorrect ? question.points : 0;
          totalSubCount = 1;
          correctSubCount = isCorrect ? 1 : 0;
        }
      } else {
        // No answer provided
        if (question.type === QuestionType.TRUE_FALSE_SET) {
          totalSubCount = question.subQuestions.length;
        } else {
          totalSubCount = 1;
        }
      }

      // Scale points to maxScore
      const scaledEarnedPoints = earnedPoints * scaleFactor;
      const scaledTotalPoints = question.points * scaleFactor;

      // Update type statistics (using scaled points and sub-question counts)
      if (!typeStatsMap.has(question.type)) {
        typeStatsMap.set(question.type, {
          correct: 0,
          total: 0,
          earnedPoints: 0,
          totalPoints: 0,
        });
      }

      const typeStats = typeStatsMap.get(question.type);
      if (!typeStats) continue;

      typeStats.total += totalSubCount; // Count sub-questions for TF
      typeStats.totalPoints += scaledTotalPoints;
      typeStats.earnedPoints += scaledEarnedPoints;
      typeStats.correct += correctSubCount; // Count correct sub-questions

      // For overall total, count sub-questions
      totalCorrect += correctSubCount;

      // Add to question results
      questionResults.push({
        questionNumber,
        questionId: question.id,
        questionType: question.type,
        questionText: question.question,
        isCorrect,
        earnedPoints,
        totalPoints: question.points,
        scaledEarnedPoints,
        scaledTotalPoints,
        question,
        answer,
      });
    }
  }

  // Convert type stats map to array
  const questionTypeStats: QuestionTypeStats[] = Array.from(
    typeStatsMap.entries(),
  ).map(([type, stats]) => ({
    type,
    ...stats,
  }));

  // Calculate total questions including sub-questions
  let totalQuestionsCount = 0;
  for (const set of exam.questionSets) {
    for (const question of set.questions) {
      if (question.type === QuestionType.TRUE_FALSE_SET) {
        totalQuestionsCount += question.subQuestions.length;
      } else {
        totalQuestionsCount += 1;
      }
    }
  }

  return {
    questionTypeStats,
    questionResults,
    totalCorrect,
    totalQuestions: totalQuestionsCount,
  };
}
