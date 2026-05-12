import { z } from "zod/v4";

/**
 * Scoring Configuration
 */
export const scoringConfigSchema = z.object({
  maxScore: z.number().positive().default(10).describe("Maximum score"),
  passingScore: z
    .number()
    .min(0)
    .describe("Minimum score to pass (e.g., 5 for base-10, 50 for base-100)"),
  showScoreImmediately: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  allowReview: z.boolean().default(true),
});

export type ScoringConfig = z.infer<typeof scoringConfigSchema>;

/**
 * Time Configuration
 */
export const timeConfigSchema = z.object({
  duration: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Duration in minutes (optional for untimed exams)"),
  startTime: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("When the exam becomes available"),
  endTime: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("When the exam closes"),
  allowLateSubmission: z.boolean().default(false),
  lateSubmissionPenalty: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Percentage penalty for late submission"),
});

export type TimeConfig = z.infer<typeof timeConfigSchema>;

/**
 * Exam/Training Security Configuration
 */
export const securityConfigSchema = z.object({
  requirePassword: z.boolean().default(false),
  passwordHash: z
    .string()
    .optional()
    .describe("Hashed password (bcrypt) for exam access"),
  encryptionKey: z
    .string()
    .optional()
    .describe("AES encryption key for sensitive data"),
  maxAttempts: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Maximum number of attempts allowed"),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(false),
  preventCopyPaste: z.boolean().default(false),
  fullScreenMode: z.boolean().default(false),
  preventTabSwitch: z.boolean().default(false),
});

export type SecurityConfig = z.infer<typeof securityConfigSchema>;
