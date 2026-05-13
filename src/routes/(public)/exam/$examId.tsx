import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, FileText } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExamFooter, ExamHeader, QuestionSetRenderer } from "@/components/exam";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLayout } from "@/contexts";
import { useExamAnswers } from "@/hooks/useExamAnswers";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { useAnswerPersistence, useExamSession } from "@/hooks/useExamSession";
import { useExamTimer } from "@/hooks/useExamTimer";
import { clearExamSession } from "@/lib/exam/session";

export const Route = createFileRoute("/(public)/exam/$examId")({
  component: ExamPage,
});

function ExamPage() {
  const { examId } = Route.useParams();
  const navigate = useNavigate();
  const { setHeader, setFooter } = useLayout();

  // Load exam and session
  const { exam, session, error, isLoading } = useExamSession(examId);

  // Manage answers
  const { answers, setAnswers, answeredCount, handleAnswerChange } =
    useExamAnswers();

  // Restore saved answers from session
  useEffect(() => {
    if (session?.answers) {
      setAnswers(session.answers);
    }
  }, [session, setAnswers]);

  // Persist answers to session storage
  useAnswerPersistence(session, answers);

  // Use ref to track if submission is in progress to avoid race conditions
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (isForfeited: boolean = false) => {
      // Prevent multiple simultaneous submissions
      if (isSubmittingRef.current || !exam || !session) return;

      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        // Dynamically import submission functions to avoid circular dependencies
        const { createExamSubmission, saveSubmission } = await import(
          "@/lib/exam/submission"
        );

        // Get current answers (empty if forfeited)
        const currentAnswers = isForfeited ? {} : answers;

        // Create submission
        const submissionData = createExamSubmission(
          exam,
          session.studentName,
          session.studentClass,
          currentAnswers,
          session.startedAt,
        );

        // If forfeited, override score to 0
        if (isForfeited) {
          submissionData.score = 0;
          submissionData.earnedPoints = 0;
          submissionData.passed = false;
        }

        // Save submission to localStorage
        saveSubmission(submissionData);

        // Clear session after successful submission
        clearExamSession();

        // Navigate to result page
        await navigate({
          to: "/result/$submissionId",
          params: {
            submissionId: submissionData.id,
          },
          replace: true,
        });
      } catch (error) {
        console.error("❌ Submission error:", error);
        alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [exam, session, answers, navigate],
  );

  // Handle security violation limit reached
  const handleViolationLimitReached = useCallback(() => {
    handleSubmit(true); // Submit with forfeit flag
  }, [handleSubmit]);

  // Security features (tab switch detection, fullscreen mode)
  const { violationCount } = useExamSecurity({
    exam,
    onViolationLimitReached: handleViolationLimitReached,
    maxViolations: 3,
  });

  // Timer countdown
  const timeRemaining = useExamTimer(exam, session, handleSubmit);

  // Flatten all questions from question sets
  const allQuestions = useMemo(() => {
    if (!exam) return [];
    return exam.questionSets.flatMap((set) => set.questions);
  }, [exam]);

  // Update header and footer when exam data or answers change
  useEffect(() => {
    if (!exam) {
      setHeader(null);
      setFooter(null);
      return;
    }

    setHeader(
      <ExamHeader
        examName={exam.name}
        courseName={exam.course}
        totalQuestions={allQuestions.length}
        answeredQuestions={answeredCount}
        timeRemaining={timeRemaining}
        violationCount={violationCount}
        maxViolations={3}
      />,
    );

    setFooter(
      <ExamFooter
        totalQuestions={allQuestions.length}
        answeredQuestions={answeredCount}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />,
    );

    // Cleanup on unmount
    return () => {
      setHeader(null);
      setFooter(null);
    };
  }, [
    exam,
    answeredCount,
    timeRemaining,
    isSubmitting,
    allQuestions.length,
    violationCount,
    setHeader,
    setFooter,
    handleSubmit,
  ]);

  // Error state
  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate({ to: "/" })}>
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !exam) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Đang tải bài thi...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Instructions */}
      {exam.instructions && (
        <Alert className="mb-6">
          <FileText className="h-4 w-4" />
          <AlertTitle className="font-bold">Hướng dẫn làm bài</AlertTitle>
          <AlertDescription className="mt-2">
            {exam.instructions}
          </AlertDescription>
        </Alert>
      )}

      {/* Question Sets */}
      <QuestionSetRenderer
        questionSets={exam.questionSets}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
    </>
  );
}
