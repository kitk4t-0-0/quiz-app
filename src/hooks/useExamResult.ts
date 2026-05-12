import { useMemo } from "react";
import { calculateTotalPoints } from "@/lib/exam/helpers";
import {
  calculateDetailedResults,
  generateSecurityCode,
} from "@/lib/exam/result-helpers";
import type { Exam, ExamSubmission } from "@/types/exam";
import type { DetailedResultData } from "@/types/result";

interface UseExamResultReturn {
  detailedResults: DetailedResultData;
  securityCode: string;
  rawTotalPoints: number;
}

/**
 * Hook to calculate and manage exam result data
 */
export function useExamResult(
  exam: Exam,
  submission: ExamSubmission,
): UseExamResultReturn {
  // Generate security code (memoized to stay consistent)
  const securityCode = useMemo(() => {
    return generateSecurityCode();
  }, []);

  // Calculate detailed results
  const detailedResults = useMemo(() => {
    return calculateDetailedResults(exam, submission);
  }, [exam, submission]);

  // Calculate raw total points (before scaling)
  const rawTotalPoints = useMemo(() => {
    return calculateTotalPoints(exam);
  }, [exam]);

  return {
    detailedResults,
    securityCode,
    rawTotalPoints,
  };
}
