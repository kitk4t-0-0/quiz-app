import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import { ExamResultView } from "@/components/result";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLayout } from "@/contexts";
import { getSubmission, loadExamById } from "@/lib/exam";
import type { Exam, ExamSubmission } from "@/types/exam";

export const Route = createFileRoute("/(public)/result/$submissionId")({
  component: ResultPage,
});

function ResultPage() {
  const { submissionId } = Route.useParams();
  const navigate = useNavigate();
  const { setHeader, setFooter } = useLayout();

  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set header for result page
  useEffect(() => {
    setHeader(<Header />);
    setFooter(null);
  }, [setHeader, setFooter]);

  // Load data on client side only
  useEffect(() => {
    // Load submission
    const loadedSubmission = getSubmission(submissionId);
    if (!loadedSubmission) {
      setError("Không tìm thấy kết quả bài thi. Vui lòng kiểm tra lại.");
      setIsLoading(false);
      return;
    }

    setSubmission(loadedSubmission);
    // Load exam based on submission
    const loadedExam = loadExamById(loadedSubmission.examId);
    if (!loadedExam) {
      setError("Không tìm thấy bài thi. Vui lòng quay lại trang chủ.");
      setIsLoading(false);
      return;
    }

    setExam(loadedExam);
    setIsLoading(false);
  }, [submissionId]);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Đang tải kết quả...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !submission || !exam) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription className="mb-4">
            {error || "Không thể tải kết quả bài thi."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate({ to: "/" })}>
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return <ExamResultView exam={exam} submission={submission} />;
}
