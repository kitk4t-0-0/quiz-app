/**
 * Exam utilities barrel export
 * Provides a single entry point for all exam-related functionality
 */

// Factory
export {
  createExam,
  createMCQQuestion,
  createPasswordProtectedExam,
  createQuestionSet,
  createScoringConfig,
  createSecurityConfig,
  createShortAnswerQuestion,
  createTimeConfig,
  createTrueFalseQuestion,
} from './factory';

// Grading
export { checkAnswer, gradeSubmission } from './grading';
// Helpers
export {
  calculateRemainingTime,
  calculateTotalPoints,
  getAllQuestions,
  getQuestionById,
} from './helpers';
// Loader
export type { ExamMetadata } from './loader';
export { loadExam, loadExamById, loadExamIndex } from './loader';
// Scoring
export { calculateTFWeight } from './scoring';

// Shuffling
export {
  shuffleArray,
  shuffleExamQuestions,
  shuffleQuestionOptions,
} from './shuffling';

// Validation
export { isExamAvailable, isLateSubmission, validateExam } from './validation';
