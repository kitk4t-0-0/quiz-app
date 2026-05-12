import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircle, FileText } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExamFooter, ExamHeader, QuestionSetRenderer } from '@/components/exam';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLayout } from '@/contexts';
import { useExamAnswers } from '@/hooks/useExamAnswers';
import { useAnswerPersistence, useExamSession } from '@/hooks/useExamSession';
import { useExamTimer } from '@/hooks/useExamTimer';
import { clearExamSession } from '@/lib/exam/session';

export const Route = createFileRoute('/(public)/exam/$examId')({
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
  useMemo(() => {
    if (session?.answers) {
      setAnswers(session.answers);
    }
  }, [session, setAnswers]);

  // Persist answers to session storage
  useAnswerPersistence(session, answers);

  // Use ref to track if submission is in progress to avoid race conditions
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    // Prevent multiple simultaneous submissions
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      // TODO: Implement actual submission logic
      // For now, just simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Access current answers via state setter to avoid stale closure
      setAnswers((currentAnswers) => {
        console.log('Submitting answers:', currentAnswers);
        return currentAnswers;
      });

      // Clear session after successful submission
      clearExamSession();

      alert('Bài thi đã được nộp thành công!');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [setAnswers]);

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
          <Button onClick={() => navigate({ to: '/' })}>
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
