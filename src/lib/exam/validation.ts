import type { Exam } from '@/types/exam';
import { QuestionType } from '@/types/exam';
import { getAllQuestions } from './helpers';

/**
 * Check if exam is currently available
 */
export function isExamAvailable(exam: Exam): {
  available: boolean;
  reason?: string;
} {
  if (!exam.isPublished) {
    return { available: false, reason: 'Exam is not published' };
  }

  const now = new Date();

  if (exam.timeConfig.startTime) {
    const startTime = new Date(exam.timeConfig.startTime);
    if (now < startTime) {
      return {
        available: false,
        reason: `Exam starts at ${startTime.toLocaleString()}`,
      };
    }
  }

  if (exam.timeConfig.endTime) {
    const endTime = new Date(exam.timeConfig.endTime);
    if (now > endTime && !exam.timeConfig.allowLateSubmission) {
      return { available: false, reason: 'Exam has ended' };
    }
  }

  return { available: true };
}

/**
 * Check if submission is late
 */
export function isLateSubmission(exam: Exam, submittedAt: string): boolean {
  if (!exam.timeConfig.endTime) {
    return false;
  }

  const endTime = new Date(exam.timeConfig.endTime);
  const submitTime = new Date(submittedAt);

  return submitTime > endTime;
}

/**
 * Validate exam structure
 */
export function validateExam(exam: Exam): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (exam.questionSets.length === 0) {
    errors.push('Exam must have at least one question set');
  }

  const totalQuestions = getAllQuestions(exam).length;
  if (totalQuestions === 0) {
    errors.push('Exam must have at least one question');
  }

  // Check for duplicate question IDs
  const questionIds = new Set<string>();
  for (const question of getAllQuestions(exam)) {
    if (questionIds.has(question.id)) {
      errors.push(`Duplicate question ID: ${question.id}`);
    }
    questionIds.add(question.id);
  }

  // Validate scoring config
  if (exam.scoringConfig.passingScore > exam.scoringConfig.maxScore) {
    errors.push(
      `Passing score (${exam.scoringConfig.passingScore}) cannot exceed max score (${exam.scoringConfig.maxScore})`,
    );
  }

  if (exam.scoringConfig.passingScore < 0) {
    errors.push('Passing score cannot be negative');
  }

  // Validate MCQ questions have at least one correct answer
  for (const question of getAllQuestions(exam)) {
    if (question.type === QuestionType.MCQ) {
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      if (correctOptions.length === 0) {
        errors.push(
          `MCQ question "${question.id}" must have at least one correct answer`,
        );
      }

      // Check for duplicate option IDs
      const optionIds = new Set<string>();
      for (const option of question.options) {
        if (optionIds.has(option.id)) {
          errors.push(
            `Duplicate option ID "${option.id}" in question "${question.id}"`,
          );
        }
        optionIds.add(option.id);
      }
    }
  }

  // Validate weighted scoring sets
  for (const set of exam.questionSets) {
    // Check if this is a T/F set
    const tfQuestions = set.questions.filter(
      (q) => q.type === QuestionType.TRUE_FALSE,
    );
    const isTFSet = tfQuestions.length === set.questions.length;
    const hasTFQuestions = tfQuestions.length > 0;

    // Prevent mixing T/F with other question types in the same set
    if (hasTFQuestions && !isTFSet) {
      errors.push(
        `Question set "${set.id}" mixes True/False questions with other question types. T/F questions must be in their own set.`,
      );
    }

    if (set.useWeightedScoring) {
      // Weighted scoring only applies to T/F questions
      if (!isTFSet) {
        errors.push(
          `Question set "${set.id}" has weighted scoring enabled but contains non-True/False questions`,
        );
      }

      // Ensure weighted T/F sets have set-level points defined
      if (set.points === undefined || set.points <= 0) {
        errors.push(
          `Question set "${set.id}" uses weighted scoring but does not have a valid 'points' value defined at the set level`,
        );
      }
    }

    // Validate that non-T/F questions have points
    for (const question of set.questions) {
      if (question.type !== QuestionType.TRUE_FALSE) {
        if (question.points === undefined || question.points <= 0) {
          errors.push(
            `Question "${question.id}" must have a positive points value`,
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
