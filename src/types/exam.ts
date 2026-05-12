import { z } from "zod/v4";
import {
  scoringConfigSchema,
  securityConfigSchema,
  timeConfigSchema,
} from "./exam-config";
import { questionSchema, studentAnswerSchema } from "./question";

export type { ScoringConfig, SecurityConfig, TimeConfig } from "./exam-config";
export type {
  MCQQuestion,
  Question,
  ShortAnswerQuestion,
  StudentAnswer,
  TrueFalseSetQuestion,
  TrueFalseSubQuestion,
} from "./question";

// Re-export for convenience
export { QuestionType } from "./question";

/**
 * Question Set (can group related questions)
 */
export const questionSetSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  context: z
    .string()
    .optional()
    .describe("Shared context/story for all questions in this set"),
  questions: z.array(questionSchema).min(1, "At least one question required"),
  shuffleQuestions: z.boolean().default(false),
});

export type QuestionSet = z.infer<typeof questionSetSchema>;

/**
 * Main Exam/Training Schema
 */
export const examSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Exam name is required"),
  course: z.string().min(1, "Course name is required"),
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
    .min(1, "At least one question set required"),

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
