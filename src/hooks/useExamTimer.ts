import { useEffect, useState } from 'react';
import { calculateRemainingTime, type ExamSession } from '@/lib/exam/session';
import type { Exam } from '@/types';

/**
 * Hook to manage exam timer countdown
 */
export function useExamTimer(
  exam: Exam | null,
  session: ExamSession | null,
  onTimeUp: () => void,
) {
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>();

  // Initialize timer on mount
  useEffect(() => {
    if (!exam?.timeConfig?.duration || !session) return;

    const remaining = calculateRemainingTime(
      session.startedAt,
      exam.timeConfig.duration,
    );

    setTimeRemaining(remaining);

    // If time is already up, trigger callback immediately
    if (remaining <= 0) {
      onTimeUp();
    }
  }, [exam, session, onTimeUp]);

  // Timer countdown - recalculates from start time every second
  useEffect(() => {
    if (!exam?.timeConfig?.duration || !session) return;
    if (timeRemaining === undefined) return;

    // If time is already up, submit immediately
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      // Recalculate from actual start time to prevent manipulation
      const remaining = calculateRemainingTime(
        session.startedAt,
        exam.timeConfig.duration ?? 0,
      );

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, session, timeRemaining, onTimeUp]);

  return timeRemaining;
}
