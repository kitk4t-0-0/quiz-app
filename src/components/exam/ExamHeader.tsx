import { AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExamHeaderProps {
  examName: string;
  courseName: string;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining?: number; // in seconds
}

export function ExamHeader({
  examName,
  courseName,
  totalQuestions,
  answeredQuestions,
  timeRemaining,
}: ExamHeaderProps) {
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  const isLowTime = timeRemaining !== undefined && timeRemaining < 300; // < 5 minutes

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container py-4">
        <div className="flex flex-col gap-4">
          {/* Title and Course */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-bold text-2xl tracking-tight">
                {examName}
              </h1>
              <p className="mt-1 text-muted-foreground text-sm">{courseName}</p>
            </div>

            {/* Timer */}
            {timeRemaining !== undefined && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                  isLowTime
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'bg-muted'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="font-mono font-semibold text-lg tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Đã trả lời: {answeredQuestions}/{totalQuestions} câu
              </span>
              <Badge variant="secondary">{Math.round(progress)}%</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Low time warning */}
          {isLowTime && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Thời gian sắp hết! Vui lòng kiểm tra và nộp bài.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
