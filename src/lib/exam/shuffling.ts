import type { Exam, Question } from '@/types/exam';
import { QuestionType } from '@/types/exam';

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle questions in an exam based on security settings
 */
export function shuffleExamQuestions(exam: Exam): Exam {
  if (!exam.security.shuffleQuestions) {
    return exam;
  }

  const shuffledSets = exam.questionSets.map((set) => ({
    ...set,
    questions: set.shuffleQuestions
      ? shuffleArray(set.questions)
      : set.questions,
  }));

  return {
    ...exam,
    questionSets: shuffleArray(shuffledSets),
  };
}

/**
 * Shuffle options in MCQ questions based on security settings
 */
export function shuffleQuestionOptions(question: Question): Question {
  if (question.type !== QuestionType.MCQ) {
    return question;
  }

  return {
    ...question,
    options: shuffleArray(question.options),
  };
}
