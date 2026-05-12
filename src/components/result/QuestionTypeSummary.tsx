import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionType } from "@/types/exam";
import type { QuestionTypeStats } from "@/types/result";

interface QuestionTypeSummaryProps {
  stats: QuestionTypeStats[];
}

export function QuestionTypeSummary({ stats }: QuestionTypeSummaryProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case QuestionType.MCQ:
        return "Trắc Nghiệm";
      case QuestionType.TRUE_FALSE_SET:
        return "Đúng/Sai";
      case QuestionType.SHORT_ANSWER:
        return "Tự Luận Ngắn";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case QuestionType.MCQ:
        return "📝";
      case QuestionType.TRUE_FALSE_SET:
        return "✓✗";
      case QuestionType.SHORT_ANSWER:
        return "✍️";
      default:
        return "📋";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Thống Kê Theo Loại Câu Hỏi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => {
            const correctPercentage =
              stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
            const pointsPercentage =
              stat.totalPoints > 0
                ? (stat.earnedPoints / stat.totalPoints) * 100
                : 0;

            return (
              <div
                key={stat.type}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(stat.type)}</span>
                    <p className="font-semibold text-lg">
                      {getTypeLabel(stat.type)}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Số câu đúng:
                      </span>
                      <span className="font-medium">
                        {stat.correct}/{stat.total}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        ({correctPercentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Điểm đạt:</span>
                      <span className="font-medium">
                        {stat.earnedPoints.toFixed(2)}/
                        {stat.totalPoints.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        ({pointsPercentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-bold text-3xl text-primary">
                    {stat.earnedPoints.toFixed(2)}
                  </p>
                  <p className="text-muted-foreground text-xs">điểm</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
