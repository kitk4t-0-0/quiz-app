import { z } from "zod/v4";

/**
 * Question Types
 */
export const QuestionType = {
  MCQ: "mcq",
  TRUE_FALSE_SET: "true_false_set",
  SHORT_ANSWER: "short_answer",
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
    QuestionType.TRUE_FALSE_SET,
    QuestionType.SHORT_ANSWER,
  ]),
  question: z.string().min(1, "Question text is required"),
  points: z.number().positive("Points must be positive"),
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
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "At least 2 options required")
    .refine(
      (options) => options.filter((opt) => opt.isCorrect).length >= 1,
      "At least one correct answer is required",
    ),
  allowMultiple: z.boolean().default(false),
});

export type MCQQuestion = z.infer<typeof mcqQuestionSchema>;

/**
 * True/False Sub-Question (part of a True/False Set)
 */
export const trueFalseSubQuestionSchema = z.object({
  id: z.string(),
  statement: z.string().min(1, "Statement text is required"),
  correctAnswer: z.boolean(),
  explanation: z.string().optional(),
});

export type TrueFalseSubQuestion = z.infer<typeof trueFalseSubQuestionSchema>;

/**
 * True/False Question Set (composite question with multiple sub-questions)
 * This is a single question that contains multiple true/false statements.
 * Supports weighted scoring where incorrect answers have exponential penalty.
 */
export const trueFalseSetQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.TRUE_FALSE_SET),
  context: z
    .string()
    .optional()
    .describe("Context or instructions for the entire set"),
  subQuestions: z
    .array(trueFalseSubQuestionSchema)
    .min(1, "At least one sub-question required"),
  useWeightedScoring: z
    .boolean()
    .default(true)
    .describe(
      "Use weighted scoring formula: (1/2)^(total - correct), rounded to 0.05",
    ),
});

export type TrueFalseSetQuestion = z.infer<typeof trueFalseSetQuestionSchema>;

/**
 * Short Answer Question (for numbers or short text)
 */
export const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionType.SHORT_ANSWER),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  maxLength: z
    .number()
    .int()
    .positive()
    .default(50)
    .describe("Maximum characters allowed"),
  caseSensitive: z.boolean().default(false),
  acceptableAnswers: z
    .array(z.string())
    .optional()
    .describe("Alternative acceptable answers"),
  isNumeric: z
    .boolean()
    .default(false)
    .describe("Whether the answer should be validated as a number"),
  numericTolerance: z
    .number()
    .optional()
    .describe("Tolerance for numeric answers (e.g., 0.01 for ±0.01)"),
});

export type ShortAnswerQuestion = z.infer<typeof shortAnswerQuestionSchema>;

/**
 * Union of all question types
 */
export const questionSchema = z.discriminatedUnion("type", [
  mcqQuestionSchema,
  trueFalseSetQuestionSchema,
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
    QuestionType.TRUE_FALSE_SET,
    QuestionType.SHORT_ANSWER,
  ]),
  answer: z.union([
    z.string(), // For short answer and single MCQ
    z.array(z.string()), // For multiple choice MCQ
    z.record(z.string(), z.boolean()), // For true/false set: { "subQuestionId": true/false }
  ]),
  timeSpent: z.number().optional().describe("Time spent in seconds"),
  flagged: z.boolean().default(false),
});

export type StudentAnswer = z.infer<typeof studentAnswerSchema>;
