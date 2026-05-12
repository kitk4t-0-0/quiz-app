/**
 * Types barrel export
 * Provides a single entry point for all type definitions
 */

// Exam types
export {
  type Exam,
  type ExamSubmission,
  examSchema,
  examSubmissionSchema,
  type QuestionSet,
  questionSetSchema,
} from './exam';

// Config types
export {
  type ScoringConfig,
  type SecurityConfig,
  scoringConfigSchema,
  securityConfigSchema,
  type TimeConfig,
  timeConfigSchema,
} from './exam-config';
// Question types
export {
  type MCQQuestion,
  mcqQuestionSchema,
  type Question,
  QuestionType,
  type QuestionTypeValue,
  questionSchema,
  type ShortAnswerQuestion,
  type StudentAnswer,
  shortAnswerQuestionSchema,
  studentAnswerSchema,
  type TrueFalseQuestion,
  trueFalseQuestionSchema,
} from './question';
