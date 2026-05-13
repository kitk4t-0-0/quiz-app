/**
 * Exam session management utilities
 */

export interface AnswerState {
  [questionId: string]: string | string[] | boolean | Record<string, boolean>;
}

export interface ExamSession {
  studentName: string;
  studentClass: string;
  examId: string;
  startedAt: string; // ISO timestamp
  answers?: AnswerState;
  shuffleSeed?: number; // Seed for deterministic shuffling
}

/**
 * Get exam session from sessionStorage
 */
export function getExamSession(examId: string): ExamSession | null {
  try {
    const sessionData = sessionStorage.getItem("examSession");
    if (!sessionData) return null;

    const session: ExamSession = JSON.parse(sessionData);

    // Validate session matches current exam
    if (session.examId !== examId) return null;

    // Validate required fields
    if (!session.studentName || !session.studentClass || !session.startedAt) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to parse exam session:", error);
    return null;
  }
}

/**
 * Save exam session to sessionStorage
 */
export function saveExamSession(session: ExamSession): void {
  try {
    sessionStorage.setItem("examSession", JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save exam session:", error);
  }
}

/**
 * Clear exam session from sessionStorage
 */
export function clearExamSession(): void {
  try {
    sessionStorage.removeItem("examSession");
  } catch (error) {
    console.error("Failed to clear exam session:", error);
  }
}

/**
 * Calculate remaining time based on start time and duration
 */
export function calculateRemainingTime(
  startedAt: string,
  durationMinutes: number,
): number {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  const totalSeconds = durationMinutes * 60;
  const remaining = totalSeconds - elapsedSeconds;

  return Math.max(0, remaining);
}
