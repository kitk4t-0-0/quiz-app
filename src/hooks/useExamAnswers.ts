import { useMemo, useState } from "react";
import type { AnswerState } from "@/lib/exam/session";

/**
 * Hook to manage exam answers state and counting
 */
export function useExamAnswers() {
  const [answers, setAnswers] = useState<AnswerState>({});

  // Count answered questions
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((key) => {
      const answer = answers[key];
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === "boolean") return true;
      if (typeof answer === "object" && answer !== null) {
        // For True/False Set: check if at least one sub-question is answered
        return Object.keys(answer).length > 0;
      }
      return answer !== "" && answer !== null && answer !== undefined;
    }).length;
  }, [answers]);

  const handleAnswerChange = (
    questionId: string,
    value: string | string[] | boolean | Record<string, boolean>,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return {
    answers,
    setAnswers,
    answeredCount,
    handleAnswerChange,
  };
}
