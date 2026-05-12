import { z } from 'zod/v4';

/**
 * Question Types
 */
export const QuestionType = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
} as const;

export type QuestionTypeValue =
  (typeof QuestionType)[keyof typeof QuestionType];

/**
 * Base Question Schema
 */
const baseQuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    QuestionType.MCQ,
    QuestionType.TRUE_FALSE,
    QuestionType.SHORT_ANSWER,
  ]),
  question: z.string().min(1, 'Question text is required'),
  points: z.number().positive('Points must be positive'),
  explanation: z.string().optional(),
});

/**
 * Multiple Choice Question (MCQ)
 */
export const mcqQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.MCQ),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, 'Option text is required'),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, 'At least 2 options required')
    .refine(
      (options) => options.filter((opt) => opt.isCorrect).length >= 1,
      'At least one correct answer is required',
    ),
  allowMultiple: z.boolean().default(false),
});

export type MCQQuestion = z.infer<typeof mcqQuestionSchema>;

/**
 * True/False Question with optional context
 * Note: When used in weighted scoring sets, points come from the set level, not individual questions
 */
export const trueFalseQuestionSchema = baseQuestionSchema
  .omit({ points: true })
  .extend({
    type: z.literal(QuestionType.TRUE_FALSE),
    correctAnswer: z.boolean(),
    context: z
      .string()
      .optional()
      .describe('Optional story/context for the question'),
  });

export type TrueFalseQuestion = z.infer<typeof trueFalseQuestionSchema>;

/**
 * Short Answer Question (for numbers or short text)
 */
export const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.SHORT_ANSWER),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  maxLength: z
    .number()
    .int()
    .positive()
    .default(50)
    .describe('Maximum characters allowed'),
  caseSensitive: z.boolean().default(false),
  acceptableAnswers: z
    .array(z.string())
    .optional()
    .describe('Alternative acceptable answers'),
  isNumeric: z
    .boolean()
    .default(false)
    .describe('Whether the answer should be validated as a number'),
  numericTolerance: z
    .number()
    .optional()
    .describe('Tolerance for numeric answers (e.g., 0.01 for ±0.01)'),
});

export type ShortAnswerQuestion = z.infer<typeof shortAnswerQuestionSchema>;

/**
 * Union of all question types
 */
export const questionSchema = z.discriminatedUnion('type', [
  mcqQuestionSchema,
  trueFalseQuestionSchema,
  shortAnswerQuestionSchema,
]);

export type Question = z.infer<typeof questionSchema>;

/**
 * Student Answer Schema
 */
export const studentAnswerSchema = z.object({
  questionId: z.string(),
  questionType: z.enum([
    QuestionType.MCQ,
    QuestionType.TRUE_FALSE,
    QuestionType.SHORT_ANSWER,
  ]),
  answer: z.union([
    z.string(), // For short answer and single MCQ
    z.array(z.string()), // For multiple choice MCQ
    z.boolean(), // For true/false
  ]),
  timeSpent: z.number().optional().describe('Time spent in seconds'),
  flagged: z.boolean().default(false),
});

export type StudentAnswer = z.infer<typeof studentAnswerSchema>;
