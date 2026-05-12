import type { Exam, Question } from '@/types/exam';

/**
 * Calculate total raw points for an exam (sum of all question points)
 * Note: This is different from scoringConfig.maxScore which is the display scale
 *
 * For T/F sets with set.points defined, uses the set's total points.
 * Otherwise, sums individual question points (MCQ and Short Answer).
 */
export function calculateTotalPoints(exam: Exam): number {
  return exam.questionSets.reduce((total, set) => {
    // Check if this is a T/F set
    const isTFSet = set.questions.every((q) => q.type === 'true_false');

    if (isTFSet) {
      // For T/F sets, use set.points if defined, otherwise default to 1 point per question
      const setPoints = set.points ?? set.questions.length;
      return total + setPoints;
    }

    // For non-T/F sets (MCQ, Short Answer), sum individual question points
    return (
      total +
      set.questions.reduce((setTotal, question) => {
        // Type guard: only MCQ and Short Answer have points field
        if (question.type !== 'true_false') {
          return setTotal + question.points;
        }
        return setTotal;
      }, 0)
    );
  }, 0);
}

/**
 * Calculate remaining time for an exam attempt
 */
export function calculateRemainingTime(
  exam: Exam,
  startedAt: string,
): number | null {
  if (!exam.timeConfig.duration) {
    return null; // Untimed exam
  }

  const started = new Date(startedAt);
  const now = new Date();
  const elapsedMinutes = (now.getTime() - started.getTime()) / 1000 / 60;
  const remainingMinutes = exam.timeConfig.duration - elapsedMinutes;

  return Math.max(0, Math.floor(remainingMinutes));
}

/**
 * Get all questions from an exam (flattened)
 */
export function getAllQuestions(exam: Exam): Question[] {
  return exam.questionSets.flatMap((set) => set.questions);
}

/**
 * Get question by ID
 */
export function getQuestionById(
  exam: Exam,
  questionId: string,
): Question | undefined {
  for (const set of exam.questionSets) {
    const question = set.questions.find((q) => q.id === questionId);
    if (question) {
      return question;
    }
  }
  return undefined;
}
