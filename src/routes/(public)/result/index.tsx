import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLayout } from "@/contexts";
import { loadExamById } from "@/lib/exam";
import { getSubmission, getSubmissionIds } from "@/lib/exam/submission";
import type { Exam, ExamSubmission } from "@/types/exam";

export const Route = createFileRoute("/(public)/result/")({
  component: ResultIndexPage,
});

interface SubmissionWithExam {
  submission: ExamSubmission;
  exam: Exam | null;
}

function ResultIndexPage() {
  const navigate = useNavigate();
  const { setHeader, setFooter } = useLayout();

  const [submissions, setSubmissions] = useState<SubmissionWithExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set header
  useEffect(() => {
    setHeader(<Header />);
    setFooter(null);
  }, [setHeader, setFooter]);

  // Load all submissions on client side
  useEffect(() => {
    const submissionIds = getSubmissionIds();

    if (submissionIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const loadedSubmissions: SubmissionWithExam[] = [];

    for (const id of submissionIds) {
      const submission = getSubmission(id);
      if (submission) {
        const exam = loadExamById(submission.examId);
        loadedSubmissions.push({ submission, exam });
      }
    }

    // Sort by submission date (newest first)
    loadedSubmissions.sort((a, b) => {
      const dateA = new Date(a.submission.submittedAt || 0).getTime();
      const dateB = new Date(b.submission.submittedAt || 0).getTime();
      return dateB - dateA;
    });

    setSubmissions(loadedSubmissions);
    setIsLoading(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Đang tải kết quả...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (submissions.length === 0) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lịch Sử Bài Thi
            </CardTitle>
            <CardDescription>
              Xem lại kết quả các bài thi và bài luyện tập đã hoàn thành
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chưa có kết quả</AlertTitle>
              <AlertDescription>
                Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu làm bài để xem kết
                quả tại đây.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate({ to: "/" })}>
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const passedSubmissions = submissions.filter(
    (s) => s.submission.passed,
  ).length;
  const averageScore =
    submissions.reduce((sum, s) => sum + (s.submission.score || 0), 0) /
    totalSubmissions;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Lịch Sử Bài Thi</h1>
        <p className="text-muted-foreground">
          Xem lại kết quả các bài thi và bài luyện tập đã hoàn thành
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng Bài Thi</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalSubmissions}</div>
            <p className="text-muted-foreground text-xs">
              Bài thi đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tỷ Lệ Đạt</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {((passedSubmissions / totalSubmissions) * 100).toFixed(0)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {passedSubmissions}/{totalSubmissions} bài đạt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Điểm Trung Bình
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{averageScore.toFixed(1)}</div>
            <p className="text-muted-foreground text-xs">Trên 10 điểm</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Kết Quả</CardTitle>
          <CardDescription>
            Nhấn vào bài thi để xem chi tiết kết quả
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.map(({ submission, exam }, index) => (
            <div key={submission.id}>
              {index > 0 && <Separator className="my-4" />}
              <SubmissionCard
                submission={submission}
                exam={exam}
                onClick={() =>
                  navigate({
                    to: "/result/$submissionId",
                    params: { submissionId: submission.id },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}

interface SubmissionCardProps {
  submission: ExamSubmission;
  exam: Exam | null;
  onClick: () => void;
}

function SubmissionCard({ submission, exam, onClick }: SubmissionCardProps) {
  const isPassed = submission.passed ?? false;
  const score = submission.score ?? 0;
  const earnedPoints = submission.earnedPoints ?? 0;
  const totalPoints = submission.totalPoints ?? 0;

  // Format date
  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt)
    : null;
  const formattedDate = submittedDate
    ? submittedDate.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Không rõ";

  // Calculate duration
  const startTime = submission.startedAt
    ? new Date(submission.startedAt).getTime()
    : 0;
  const endTime = submittedDate ? submittedDate.getTime() : 0;
  const durationMinutes = Math.round((endTime - startTime) / 1000 / 60);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Exam Name */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              {exam?.name || "Bài thi không xác định"}
            </h3>
            {isPassed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>

          {/* Course */}
          {exam?.course && (
            <p className="text-muted-foreground text-sm">{exam.course}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {durationMinutes > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{durationMinutes} phút</span>
              </div>
            )}
          </div>

          {/* Student Info */}
          {submission.studentName && (
            <p className="text-sm">
              <span className="text-muted-foreground">Học sinh: </span>
              <span className="font-medium">{submission.studentName}</span>
              {submission.studentId && (
                <span className="text-muted-foreground">
                  {" "}
                  - {submission.studentId}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Score Display */}
        <div className="text-right">
          <div
            className={`font-bold text-3xl ${
              isPassed ? "text-green-600" : "text-red-600"
            }`}
          >
            {score.toFixed(1)}
          </div>
          <div className="text-muted-foreground text-sm">
            {earnedPoints}/{totalPoints} điểm
          </div>
          <div className="mt-1">
            <span
              className={`inline-block rounded-full px-2 py-1 font-medium text-xs ${
                isPassed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isPassed ? "Đạt" : "Chưa đạt"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
