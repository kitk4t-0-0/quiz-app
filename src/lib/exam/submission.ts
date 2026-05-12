import type {
  Exam,
  ExamSubmission,
  Question,
  StudentAnswer,
} from "@/types/exam";
import { generateId } from "../id-generator";
import { gradeSubmission } from "./grading";
import type { AnswerState } from "./session";

/**
 * Convert AnswerState to StudentAnswer array
 */
export function convertAnswersToSubmission(
  answers: AnswerState,
  exam: Exam,
): StudentAnswer[] {
  // Create a map of questions for quick lookup
  const questionMap = new Map<string, Question>();
  for (const set of exam.questionSets) {
    for (const question of set.questions) {
      questionMap.set(question.id, question);
    }
  }

  return Object.entries(answers).map(([questionId, answer]) => {
    const question = questionMap.get(questionId);

    // Use the actual question type from the exam
    const questionType = question?.type || "mcq";

    return {
      questionId,
      questionType,
      answer,
      flagged: false,
    };
  });
}

/**
 * Create an exam submission from session data
 */
export function createExamSubmission(
  exam: Exam,
  studentName: string,
  studentClass: string,
  answers: AnswerState,
  startedAt: string,
): ExamSubmission {
  const submissionId = generateId();
  const studentAnswers = convertAnswersToSubmission(answers, exam);

  // Create base submission
  const submission: ExamSubmission = {
    id: submissionId,
    examId: exam.id,
    studentName,
    studentId: studentClass, // Using class as student ID for now
    answers: studentAnswers,
    startedAt,
    submittedAt: new Date().toISOString(),
    attemptNumber: 1,
    isLateSubmission: false,
  };

  // Grade the submission
  const gradingResult = gradeSubmission(exam, submission);

  // Update submission with grading results
  submission.score = gradingResult.score;
  submission.totalPoints = gradingResult.totalPoints;
  submission.earnedPoints = gradingResult.earnedPoints;
  submission.passed = gradingResult.passed;

  return submission;
}

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * Save submission to localStorage
 */
export function saveSubmission(submission: ExamSubmission): void {
  if (!isBrowser()) {
    console.warn("saveSubmission called on server, skipping");
    return;
  }

  try {
    const key = `submission_${submission.id}`;
    localStorage.setItem(key, JSON.stringify(submission));

    // Also save to a list of submission IDs for easy retrieval
    const submissionIds = getSubmissionIds();
    if (!submissionIds.includes(submission.id)) {
      submissionIds.push(submission.id);
      localStorage.setItem("submissionIds", JSON.stringify(submissionIds));
    }
  } catch (error) {
    console.error("Failed to save submission:", error);
  }
}

/**
 * Get submission by ID from localStorage
 */
export function getSubmission(submissionId: string): ExamSubmission | null {
  if (!isBrowser()) {
    console.warn("getSubmission called on server, returning null");
    return null;
  }

  try {
    const key = `submission_${submissionId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    return JSON.parse(data) as ExamSubmission;
  } catch (error) {
    console.error("Failed to get submission:", error);
    return null;
  }
}

/**
 * Get all submission IDs
 */
export function getSubmissionIds(): string[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const data = localStorage.getItem("submissionIds");
    if (!data) return [];
    return JSON.parse(data) as string[];
  } catch (error) {
    console.error("Failed to get submission IDs:", error);
    return [];
  }
}

/**
 * Get all submissions for a specific exam
 */
export function getExamSubmissions(examId: string): ExamSubmission[] {
  if (!isBrowser()) {
    return [];
  }

  const submissionIds = getSubmissionIds();
  const submissions: ExamSubmission[] = [];

  for (const id of submissionIds) {
    const submission = getSubmission(id);
    if (submission && submission.examId === examId) {
      submissions.push(submission);
    }
  }

  return submissions;
}
