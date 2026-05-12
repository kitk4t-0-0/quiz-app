import { AlertCircle, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
  const unansweredCount = totalQuestions - answeredQuestions;
  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="sticky bottom-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container py-6">
        <div className="flex flex-col gap-4">
          {/* Warning if unanswered */}
          {hasUnanswered && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Bạn còn <strong>{unansweredCount}</strong> câu chưa trả lời. Bạn
                có chắc muốn nộp bài?
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              {answeredQuestions === totalQuestions ? (
                <span className="font-medium text-green-600 dark:text-green-400">
                  ✓ Đã hoàn thành tất cả câu hỏi
                </span>
              ) : (
                <span>
                  Đã trả lời {answeredQuestions}/{totalQuestions} câu
                </span>
              )}
            </div>

            <Button
              size="lg"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Đang nộp bài...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Nộp bài
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
