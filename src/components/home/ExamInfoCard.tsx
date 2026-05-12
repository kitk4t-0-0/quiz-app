import { BookOpen, Clock, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ExamMetadata } from '@/lib/exam';

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
        <Badge variant="secondary" className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {exam.totalQuestions} Câu hỏi
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {exam.duration ? `${exam.duration} phút` : 'Không giới hạn'}
        </Badge>
        <Badge variant="secondary">Điểm tối đa: {exam.maxScore}</Badge>
        {exam.requirePassword && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Yêu cầu mật khẩu
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
