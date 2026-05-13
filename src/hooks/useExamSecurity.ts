import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Exam } from "@/types/exam";

interface UseExamSecurityOptions {
  exam: Exam | null;
  onViolationLimitReached: () => void;
  maxViolations?: number;
}

interface ExamSecurityState {
  violationCount: number;
  isFullscreen: boolean;
  lastViolationType: "tab_switch" | "fullscreen_exit" | null;
}

const renderToastDescription = (text: string) =>
  text.split("\n").flatMap((line, index, lines) => {
    const nodes: Array<string | ReturnType<typeof createElement>> = [line];
    if (index < lines.length - 1) {
      nodes.push(createElement("br", { key: `br-${index}` }));
    }
    return nodes;
  });

const VIOLATION_TOAST_ID = "exam-security-violation";
const LIMIT_TOAST_ID = "exam-security-limit";
const RULES_TOAST_ID = "exam-security-rules";

// Extended Document and Element types for cross-browser fullscreen support
interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * Hook to manage exam security features:
 * - Tab switch detection
 * - Fullscreen mode enforcement
 * - Violation tracking with automatic forfeit
 */
export function useExamSecurity({
  exam,
  onViolationLimitReached,
  maxViolations = 3,
}: UseExamSecurityOptions): ExamSecurityState {
  const [violationCount, setViolationCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastViolationType, setLastViolationType] = useState<
    "tab_switch" | "fullscreen_exit" | null
  >(null);

  // Use refs to track state
  const hasShownWarningRef = useRef(false);
  const isInitializedRef = useRef(false);
  const hasReachedLimitRef = useRef(false);
  const lastViolationTimeRef = useRef<number>(0);
  const COOLDOWN_MS = 1500; // 1.5 second cooldown between violations

  // Check if security features are enabled
  const preventTabSwitch = exam?.security.preventTabSwitch ?? false;
  const fullScreenMode = exam?.security.fullScreenMode ?? false;

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement as ExtendedHTMLElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        // Safari support
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE11 support
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as ExtendedDocument;
      if (doc.fullscreenElement) {
        await doc.exitFullscreen();
      } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.msFullscreenElement && doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, []);

  // Handle violation
  const handleViolation = useCallback(
    (type: "tab_switch" | "fullscreen_exit") => {
      // Check if already reached limit
      if (hasReachedLimitRef.current) {
        return;
      }

      // Cooldown check - prevent double-counting from multiple events
      const now = Date.now();
      if (now - lastViolationTimeRef.current < COOLDOWN_MS) {
        return;
      }
      lastViolationTimeRef.current = now;

      setLastViolationType(type);
      setViolationCount((prev) => {
        const newCount = prev + 1;
        const remainingAttempts = maxViolations - newCount;

        if (remainingAttempts > 0) {
          const violationMessage =
            type === "tab_switch"
              ? "Bạn đã chuyển tab hoặc cửa sổ!"
              : "Bạn đã thoát chế độ toàn màn hình!";

          toast.error("CẢNH BÁO VI PHẠM", {
            id: VIOLATION_TOAST_ID,
            description: renderToastDescription(
              `${violationMessage}\n\nVi phạm: ${newCount}/${maxViolations}\nCòn lại: ${remainingAttempts} lần cảnh báo\n\nNếu vi phạm ${remainingAttempts} lần nữa, bài thi sẽ tự động nộp với điểm 0.`,
            ),
            duration: 5000,
            style: {
              minWidth: "500px",
              maxWidth: "600px",
            },
          });
        } else {
          // Limit reached
          hasReachedLimitRef.current = true;

          toast.error("VI PHẠM QUÁ NHIỀU", {
            id: LIMIT_TOAST_ID,
            description: renderToastDescription(
              `Bạn đã vi phạm quá ${maxViolations} lần!\n\nBài thi sẽ được tự động nộp với điểm 0.`,
            ),
            duration: 10000,
            style: {
              minWidth: "500px",
              maxWidth: "600px",
            },
          });

          // Delay submission slightly to ensure toast is visible
          setTimeout(() => {
            onViolationLimitReached();
          }, 500);
        }

        return newCount;
      });
    },
    [maxViolations, onViolationLimitReached],
  );

  // Tab switch detection
  useEffect(() => {
    if (!preventTabSwitch || !exam) return;

    const handleVisibilityChange = () => {
      // Only track violations when tab becomes hidden
      if (document.hidden && isInitializedRef.current) {
        handleViolation("tab_switch");
      }
    };

    const handleBlur = () => {
      if (!isInitializedRef.current) {
        return;
      }

      // Some fullscreen alt-tab flows do not set document.hidden, but do lose focus.
      const shouldCountViolation = document.hidden || !document.hasFocus();
      if (shouldCountViolation) {
        handleViolation("tab_switch");
      }
    };

    // Mark as initialized after a short delay to avoid false positives on mount
    const initTimer = setTimeout(() => {
      isInitializedRef.current = true;
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      clearTimeout(initTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [preventTabSwitch, exam, handleViolation]);

  // Fullscreen mode enforcement
  useEffect(() => {
    if (!fullScreenMode || !exam) return;

    const handleFullscreenChange = () => {
      const doc = document as ExtendedDocument;
      const isCurrentlyFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      // If user exits fullscreen and we're initialized, it's a violation
      if (
        !isCurrentlyFullscreen &&
        isInitializedRef.current &&
        !hasReachedLimitRef.current
      ) {
        handleViolation("fullscreen_exit");
        // Try to re-enter fullscreen after a short delay
        setTimeout(() => {
          if (!hasReachedLimitRef.current) {
            requestFullscreen();
          }
        }, 500);
      }
    };

    // Request fullscreen on mount
    const enterFullscreen = async () => {
      await requestFullscreen();
      // Mark as initialized after entering fullscreen
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 1000);
    };

    enterFullscreen();

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    // Cleanup: exit fullscreen when component unmounts
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange,
      );
      exitFullscreen();
    };
  }, [
    fullScreenMode,
    exam,
    handleViolation,
    requestFullscreen,
    exitFullscreen,
  ]);

  // Show initial warning about security features
  useEffect(() => {
    if (!exam || hasShownWarningRef.current) return;

    const warnings: string[] = [];
    if (preventTabSwitch) {
      warnings.push("• Không được chuyển tab hoặc cửa sổ");
    }
    if (fullScreenMode) {
      warnings.push("• Phải giữ chế độ toàn màn hình");
    }

    if (warnings.length > 0) {
      hasShownWarningRef.current = true;

      toast.warning("QUY ĐỊNH BẢO MẬT", {
        id: RULES_TOAST_ID,
        description: renderToastDescription(
          `${warnings.join("\n")}\n\nVi phạm quá ${maxViolations} lần sẽ bị tự động nộp bài với điểm 0.`,
        ),
        duration: 8000,
        style: {
          minWidth: "500px",
          maxWidth: "600px",
        },
      });
    }
  }, [exam, preventTabSwitch, fullScreenMode, maxViolations]);

  return {
    violationCount,
    isFullscreen,
    lastViolationType,
  };
}
