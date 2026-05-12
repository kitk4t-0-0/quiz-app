import { z } from 'zod/v4';
import {
  scoringConfigSchema,
  securityConfigSchema,
  timeConfigSchema,
} from './exam-config';
import { questionSchema, studentAnswerSchema } from './question';

export type { ScoringConfig, SecurityConfig, TimeConfig } from './exam-config';
export type {
  MCQQuestion,
  Question,
  ShortAnswerQuestion,
  StudentAnswer,
  TrueFalseQuestion,
} from './question';

// Re-export for convenience
export { QuestionType } from './question';

/**
 * Question Set (can group related questions, e.g., T/F with shared context)
 *
 * Weighted Scoring for True/False Questions:
 * When useWeightedScoring is true, uses formula: (1/2)^(totalQuestions - correctAnswers), rounded to 0.05
 *
 * Example for 4 questions:
 * - 4 correct = (1/2)^0 = 1.0
 * - 3 correct = (1/2)^1 = 0.5
 * - 2 correct = (1/2)^2 = 0.25
 * - 1 correct = (1/2)^3 = 0.125 → rounds to 0.10
 * - 0 correct = (1/2)^4 = 0.0625 → rounds to 0.05
 *
 * When false, uses standard scoring: (correctAnswers / totalQuestions) * points
 */
export const questionSetSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  context: z
    .string()
    .optional()
    .describe('Shared context/story for all questions in this set'),
  questions: z.array(questionSchema).min(1, 'At least one question required'),
  shuffleQuestions: z.boolean().default(false),
  useWeightedScoring: z
    .boolean()
    .optional()
    .default(true)
    .describe('Use weighted scoring formula for T/F questions (default: true)'),
});

export type QuestionSet = z.infer<typeof questionSetSchema>;

/**
 * Main Exam/Training Schema
 */
export const examSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Exam name is required'),
  course: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  instructions: z.string().optional(),

  // Security
  security: securityConfigSchema,

  // Timing
  timeConfig: timeConfigSchema,

  // Scoring
  scoringConfig: scoringConfigSchema,

  // Questions
  questionSets: z
    .array(questionSetSchema)
    .min(1, 'At least one question set required'),

  // Metadata
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  createdBy: z.string().optional(),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export type Exam = z.infer<typeof examSchema>;

/**
 * Exam Attempt/Submission Schema
 */
export const examSubmissionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  studentId: z.string().optional(),
  studentName: z.string().optional(),

  answers: z.array(studentAnswerSchema),

  startedAt: z.string().datetime({ offset: true }),
  submittedAt: z.string().datetime({ offset: true }).optional(),

  score: z.number().min(0).optional(),
  grade: z.string().optional(),
  passed: z.boolean().optional(),

  totalPoints: z.number().optional(),
  earnedPoints: z.number().optional(),

  attemptNumber: z.number().int().positive().default(1),
  isLateSubmission: z.boolean().default(false),

  feedback: z.string().optional(),
});

export type ExamSubmission = z.infer<typeof examSubmissionSchema>;
