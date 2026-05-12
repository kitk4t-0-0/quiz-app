import type {
  Exam,
  MCQQuestion,
  QuestionSet,
  ScoringConfig,
  SecurityConfig,
  ShortAnswerQuestion,
  TimeConfig,
  TrueFalseQuestion,
} from '@/types/exam';
import { QuestionType } from '@/types/exam';
import { generateEncryptionKey, hashPassword } from '../crypto';
import { generateId } from '../id-generator';

/**
 * Factory functions to create exam components with sensible defaults
 */

/**
 * Create a new MCQ question
 */
export function createMCQQuestion(
  data: Partial<MCQQuestion> & { question: string },
): MCQQuestion {
  return {
    id: data.id || generateId(),
    type: QuestionType.MCQ,
    question: data.question,
    points: data.points || 1,
    explanation: data.explanation,
    options: data.options || [],
    allowMultiple: data.allowMultiple || false,
  };
}

/**
 * Create a new True/False question
 */
export function createTrueFalseQuestion(
  data: Partial<TrueFalseQuestion> & {
    question: string;
    correctAnswer: boolean;
  },
): TrueFalseQuestion {
  return {
    id: data.id || generateId(),
    type: QuestionType.TRUE_FALSE,
    question: data.question,
    points: data.points || 1,
    explanation: data.explanation,
    correctAnswer: data.correctAnswer,
    context: data.context,
  };
}

/**
 * Create a new Short Answer question
 */
export function createShortAnswerQuestion(
  data: Partial<ShortAnswerQuestion> & {
    question: string;
    correctAnswer: string;
  },
): ShortAnswerQuestion {
  return {
    id: data.id || generateId(),
    type: QuestionType.SHORT_ANSWER,
    question: data.question,
    points: data.points || 1,
    explanation: data.explanation,
    correctAnswer: data.correctAnswer,
    maxLength: data.maxLength || 50,
    caseSensitive: data.caseSensitive || false,
    acceptableAnswers: data.acceptableAnswers,
    isNumeric: data.isNumeric || false,
    numericTolerance: data.numericTolerance,
  };
}

/**
 * Create a new question set
 */
export function createQuestionSet(
  data: Partial<QuestionSet> & { questions: QuestionSet['questions'] },
): QuestionSet {
  return {
    id: data.id || generateId(),
    title: data.title,
    context: data.context,
    questions: data.questions,
    shuffleQuestions: data.shuffleQuestions || false,
    useWeightedScoring: data.useWeightedScoring,
  };
}

/**
 * Create default security configuration
 */
export function createSecurityConfig(
  data?: Partial<SecurityConfig>,
): SecurityConfig {
  return {
    requirePassword: data?.requirePassword || false,
    passwordHash: data?.passwordHash,
    encryptionKey: data?.encryptionKey,
    maxAttempts: data?.maxAttempts,
    shuffleQuestions: data?.shuffleQuestions || false,
    shuffleOptions: data?.shuffleOptions || false,
    preventCopyPaste: data?.preventCopyPaste || false,
    fullScreenMode: data?.fullScreenMode || false,
    preventTabSwitch: data?.preventTabSwitch || false,
  };
}

/**
 * Create default time configuration
 */
export function createTimeConfig(data?: Partial<TimeConfig>): TimeConfig {
  return {
    duration: data?.duration,
    startTime: data?.startTime,
    endTime: data?.endTime,
    allowLateSubmission: data?.allowLateSubmission || false,
    lateSubmissionPenalty: data?.lateSubmissionPenalty,
  };
}

/**
 * Create default scoring configuration
 */
export function createScoringConfig(
  data?: Partial<ScoringConfig>,
): ScoringConfig {
  return {
    maxScore: data?.maxScore ?? 10,
    passingScore: data?.passingScore ?? 0,
    showScoreImmediately: data?.showScoreImmediately ?? true,
    showCorrectAnswers: data?.showCorrectAnswers ?? true,
    allowReview: data?.allowReview ?? true,
  };
}

/**
 * Create a new exam with defaults
 */
export function createExam(
  data: Partial<Exam> & {
    name: string;
    course: string;
    questionSets: QuestionSet[];
  },
): Exam {
  const now = new Date().toISOString();

  return {
    id: data.id || generateId(),
    name: data.name,
    course: data.course,
    description: data.description,
    instructions: data.instructions,
    security: data.security || createSecurityConfig(),
    timeConfig: data.timeConfig || createTimeConfig(),
    scoringConfig: data.scoringConfig || createScoringConfig(),
    questionSets: data.questionSets,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    createdBy: data.createdBy,
    isPublished: data.isPublished || false,
    tags: data.tags,
  };
}

/**
 * Create an exam with password protection
 */
export async function createPasswordProtectedExam(
  data: Partial<Exam> & {
    name: string;
    course: string;
    questionSets: QuestionSet[];
    password: string;
  },
): Promise<Exam> {
  const passwordHash = await hashPassword(data.password);
  const encryptionKey = await generateEncryptionKey();

  return createExam({
    ...data,
    security: createSecurityConfig({
      ...data.security,
      requirePassword: true,
      passwordHash,
      encryptionKey,
    }),
  });
}
