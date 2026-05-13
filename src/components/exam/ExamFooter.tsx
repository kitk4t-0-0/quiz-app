import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamFooterProps {
  totalQuestions: number;
  answeredQuestions: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ExamFooter({
  totalQuestions,
  answeredQuestions,
  onSubmit,
  isSubmitting = false,
}: ExamFooterProps) {
  return (
    <div className="sticky bottom-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container py-4">
        <div className="flex flex-col gap-4">
          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              {answeredQuestions === totalQuestions ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400">
                  <span>✓</span>
                  <span>Đã hoàn thành tất cả câu hỏi</span>
                </span>
              ) : (
                <span className="font-bold">
                  Đã trả lời {answeredQuestions}/{totalQuestions} câu
                </span>
              )}
            </div>

            <Button
              size="lg"
              onClick={() => onSubmit()}
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>Đang nộp bài...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Nộp bài</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
