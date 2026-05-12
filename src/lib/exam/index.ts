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
  createTrueFalseSetQuestion,
  createTrueFalseSubQuestion,
} from "./factory";

// Grading
export { checkAnswer, gradeSubmission } from "./grading";
// Helpers
export {
  calculateRemainingTime,
  calculateTotalPoints,
  getAllQuestions,
  getQuestionById,
} from "./helpers";
// Loader
export type { ExamMetadata } from "./loader";
export { loadExam, loadExamById, loadExamIndex } from "./loader";
// Result Helpers
export type {
  DetailedResultData,
  QuestionResult,
  QuestionTypeStats,
} from "./result-helpers";
export {
  calculateDetailedResults,
  generateSecurityCode,
} from "./result-helpers";
// Scoring
export { calculateTFWeight } from "./scoring";

// Shuffling
export {
  shuffleArray,
  shuffleExamQuestions,
  shuffleQuestionOptions,
} from "./shuffling";

// Submission
export {
  convertAnswersToSubmission,
  createExamSubmission,
  getExamSubmissions,
  getSubmission,
  getSubmissionIds,
  saveSubmission,
} from "./submission";

// Validation
export { isExamAvailable, isLateSubmission, validateExam } from "./validation";
