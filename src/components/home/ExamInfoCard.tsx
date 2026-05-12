import { BookOpen, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ExamMetadata } from "@/lib/exam";

interface ExamInfoCardProps {
  exam: ExamMetadata;
}

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      <div>
        <h3 className="font-semibold text-sm">Thông Tin Bài Thi</h3>
        <p className="mt-1 text-muted-foreground text-sm">{exam.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{exam.totalQuestions} Câu hỏi</span>
        </Badge>
        <Badge variant="secondary" className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {exam.duration ? `${exam.duration} phút` : "Không giới hạn"}
          </span>
        </Badge>
        <Badge variant="secondary">
          <span>Điểm tối đa: {exam.maxScore}</span>
        </Badge>
        {exam.requirePassword && (
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Yêu cầu mật khẩu</span>
          </Badge>
        )}
      </div>

      {exam.tags && exam.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {exam.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
