import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Exam, ExamSubmission } from "@/types/exam";

interface ResultHeaderProps {
  exam: Exam;
  submission: ExamSubmission;
  securityCode: string;
}

export function ResultHeader({
  exam,
  submission,
  securityCode,
}: ResultHeaderProps) {
  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const isPassed = submission.passed ?? false;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center font-bold text-2xl">
          Kết Quả Bài Thi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Họ và Tên</p>
            <p className="font-semibold text-lg">
              {submission.studentName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Lớp/Khóa học</p>
            <p className="font-semibold text-lg">{exam.course}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Tên Bài Thi</p>
            <p className="font-semibold text-lg">{exam.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Ngày Nộp Bài</p>
            <p className="font-semibold text-lg">{submittedDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-muted-foreground text-sm">Mã Bảo Mật</p>
            <p className="font-bold font-mono text-lg">{securityCode}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Kết Quả</p>
            <Badge
              variant={isPassed ? "default" : "destructive"}
              className="px-3 py-1 text-lg"
            >
              {isPassed ? "ĐẠT" : "CHƯA ĐẠT"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
