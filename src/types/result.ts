import type { Question, StudentAnswer } from "./exam";

/**
 * Statistics for a specific question type (MCQ, True/False, Short Answer)
 */
export interface QuestionTypeStats {
  type: string;
  correct: number;
  total: number;
  earnedPoints: number;
  totalPoints: number;
}

/**
 * Individual question result with student's answer and scoring
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
 * Detailed result data for display including all statistics
 */
export interface DetailedResultData {
  questionTypeStats: QuestionTypeStats[];
  questionResults: QuestionResult[];
  totalCorrect: number;
  totalQuestions: number;
}
