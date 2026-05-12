import { useEffect, useState } from "react";
import { loadExamById } from "@/lib/exam";
import {
  type AnswerState,
  type ExamSession,
  getExamSession,
  saveExamSession,
} from "@/lib/exam/session";
import { isExamAvailable } from "@/lib/exam/validation";
import type { Exam } from "@/types";

interface UseExamSessionResult {
  exam: Exam | null;
  session: ExamSession | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook to load and validate exam session
 */
export function useExamSession(examId: string): UseExamSessionResult {
  const [exam, setExam] = useState<Exam | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const examData = loadExamById(examId);

      if (!examData) {
        setError("Không tìm thấy bài thi. Vui lòng quay lại trang chủ.");
        setIsLoading(false);
        return;
      }

      // Validate exam availability (published, time window, etc.)
      const availabilityCheck = isExamAvailable(examData);
      if (!availabilityCheck.available) {
        setError(
          availabilityCheck.reason ||
            "Bài thi không khả dụng. Vui lòng liên hệ giáo viên.",
        );
        setIsLoading(false);
        return;
      }

      // Validate session
      const examSession = getExamSession(examId);
      if (!examSession) {
        setError(
          "Phiên làm bài không hợp lệ. Vui lòng bắt đầu lại từ trang chủ.",
        );
        setIsLoading(false);
        return;
      }

      setSession(examSession);
      setExam(examData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading exam:", err);
      setError(err instanceof Error ? err.message : "Không thể tải bài thi");
      setIsLoading(false);
    }
  }, [examId]);

  return { exam, session, error, isLoading };
}

/**
 * Hook to persist answers to session storage
 */
export function useAnswerPersistence(
  session: ExamSession | null,
  answers: AnswerState,
) {
  useEffect(() => {
    if (session && Object.keys(answers).length > 0) {
      const updatedSession: ExamSession = {
        ...session,
        answers,
      };
      saveExamSession(updatedSession);
    }
  }, [answers, session]);
}
