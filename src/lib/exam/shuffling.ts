import type { Exam, Question } from "@/types/exam";
import { QuestionType } from "@/types/exam";

/**
 * Seeded random number generator (Mulberry32)
 * Returns a function that generates deterministic random numbers
 */
function createSeededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    currentSeed += 0x6d2b79f5;
    let t = currentSeed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle an array using Fisher-Yates algorithm with optional seed
 */
export function shuffleArray<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle questions in an exam based on security settings
 * Uses seed for deterministic shuffling
 *
 * Behavior:
 * - If exam.security.shuffleQuestions is true: shuffles ALL questions in ALL sets
 * - If exam.security.shuffleQuestions is false: respects per-set shuffleQuestions flag
 * - Always shuffles the order of question sets when exam-level shuffling is enabled
 */
export function shuffleExamQuestions(exam: Exam, seed?: number): Exam {
  const examLevelShuffle = exam.security.shuffleQuestions;

  // Shuffle questions within each set
  const shuffledSets = exam.questionSets.map((set, setIndex) => {
    // Shuffle if exam-level is enabled OR if set-level is enabled
    const shouldShuffleThisSet = examLevelShuffle || set.shuffleQuestions;

    return {
      ...set,
      questions: shouldShuffleThisSet
        ? shuffleArray(set.questions, seed ? seed + setIndex : undefined)
        : set.questions,
    };
  });

  // Shuffle the order of question sets only if exam-level shuffling is enabled
  return {
    ...exam,
    questionSets: examLevelShuffle
      ? shuffleArray(shuffledSets, seed)
      : shuffledSets,
  };
}

/**
 * Shuffle options in MCQ questions based on security settings
 * Uses seed for deterministic shuffling
 */
export function shuffleQuestionOptions(
  question: Question,
  seed?: number,
): Question {
  if (question.type !== QuestionType.MCQ) {
    return question;
  }

  return {
    ...question,
    options: shuffleArray(question.options, seed),
  };
}
