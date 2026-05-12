import type { Exam } from "@/types/exam";
import { QuestionType } from "@/types/exam";
import { getAllQuestions } from "./helpers";

/**
 * Check if exam is currently available
 */
export function isExamAvailable(exam: Exam): {
  available: boolean;
  reason?: string;
} {
  if (!exam.isPublished) {
    return { available: false, reason: "Exam is not published" };
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
      return { available: false, reason: "Exam has ended" };
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
    errors.push("Exam must have at least one question set");
  }

  const totalQuestions = getAllQuestions(exam).length;
  if (totalQuestions === 0) {
    errors.push("Exam must have at least one question");
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
    errors.push("Passing score cannot be negative");
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

    // Validate True/False Set questions
    if (question.type === QuestionType.TRUE_FALSE_SET) {
      if (question.subQuestions.length === 0) {
        errors.push(
          `True/False Set question "${question.id}" must have at least one sub-question`,
        );
      }

      // Check for duplicate sub-question IDs
      const subQuestionIds = new Set<string>();
      for (const subQ of question.subQuestions) {
        if (subQuestionIds.has(subQ.id)) {
          errors.push(
            `Duplicate sub-question ID "${subQ.id}" in question "${question.id}"`,
          );
        }
        subQuestionIds.add(subQ.id);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
