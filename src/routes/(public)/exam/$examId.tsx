import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle, FileText } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ExamFooter,
  ExamHeader,
  MCQQuestion,
  QuestionCard,
  ShortAnswerQuestion,
  TrueFalseQuestion,
} from '@/components/exam';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLayout } from '@/contexts';
import { loadExamById } from '@/lib/exam';
import type { Exam, TrueFalseQuestion as TrueFalseQuestionType } from '@/types';

export const Route = createFileRoute('/(public)/exam/$examId')({
  component: ExamPage,
});

interface AnswerState {
  [questionId: string]: string | string[] | boolean;
}

function ExamPage() {
  const { examId } = Route.useParams();
  const { setHeader, setFooter } = useLayout();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load exam data
  useEffect(() => {
    try {
      const examData = loadExamById(examId);

      if (!examData) {
        setError('Không tìm thấy bài thi. Vui lòng quay lại trang chủ.');
        return;
      }

      setExam(examData);

      // Initialize timer if duration is set
      if (examData.timeConfig?.duration) {
        setTimeRemaining(examData.timeConfig.duration * 60); // Convert to seconds
      }
    } catch (err) {
      console.error('Error loading exam:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải bài thi');
    }
  }, [examId]);

  // Flatten all questions from question sets
  const allQuestions = useMemo(() => {
    if (!exam) return [];
    return exam.questionSets.flatMap((set) => set.questions);
  }, [exam]);

  // Count answered questions
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((key) => {
      const answer = answers[key];
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === 'boolean') return true;
      return answer !== '' && answer !== null && answer !== undefined;
    }).length;
  }, [answers]);

  const handleAnswerChange = (
    questionId: string,
    value: string | string[] | boolean,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Use ref to track if submission is in progress to avoid race conditions
  const isSubmittingRef = useRef(false);

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

      alert('Bài thi đã được nộp thành công!');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, []); // Empty dependencies - stable reference

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === undefined || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === undefined || prev <= 1) {
          // Auto submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit]);

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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Loading state
  if (!exam) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Đang tải bài thi...</p>
        </CardContent>
      </Card>
    );
  }

  let questionCounter = 0;

  return (
    <>
      {/* Instructions */}
      {exam.instructions && (
        <Alert className="mb-6">
          <FileText className="h-4 w-4" />
          <AlertTitle>Hướng dẫn làm bài</AlertTitle>
          <AlertDescription className="mt-2">
            {exam.instructions}
          </AlertDescription>
        </Alert>
      )}

      {/* Question Sets */}
      <div className="space-y-8">
        {exam.questionSets.map((set, setIndex) => {
          // Check if this set contains only True/False questions with multiple items
          const isTrueFalseSet =
            set.questions.length > 1 &&
            set.questions.every((q) => q.type === 'true_false');

          return (
            <div key={set.id}>
              {/* Set Title */}
              {set.title && (
                <div className="mb-4">
                  <h2 className="font-semibold text-xl tracking-tight">
                    {set.title}
                  </h2>
                  {set.context && (
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                      {set.context}
                    </p>
                  )}
                  <Separator className="mt-4" />
                </div>
              )}

              {/* True/False Set - Multiple questions in one card */}
              {isTrueFalseSet ? (
                <Card className="p-6">
                  <div className="space-y-0">
                    {set.questions.map((question) => {
                      questionCounter++;
                      const currentQuestionNumber = questionCounter;

                      return (
                        <TrueFalseQuestion
                          key={question.id}
                          question={question as TrueFalseQuestionType}
                          questionNumber={currentQuestionNumber}
                          value={
                            typeof answers[question.id] === 'boolean'
                              ? (answers[question.id] as boolean)
                              : null
                          }
                          onChange={(value: boolean) =>
                            handleAnswerChange(question.id, value)
                          }
                        />
                      );
                    })}
                  </div>
                </Card>
              ) : (
                /* Regular Questions - Each in its own card */
                <div className="space-y-6">
                  {set.questions.map((question) => {
                    questionCounter++;
                    const currentQuestionNumber = questionCounter;

                    // True/False single question
                    if (question.type === 'true_false') {
                      return (
                        <Card key={question.id} className="p-6">
                          <TrueFalseQuestion
                            question={question as TrueFalseQuestionType}
                            questionNumber={currentQuestionNumber}
                            value={
                              typeof answers[question.id] === 'boolean'
                                ? (answers[question.id] as boolean)
                                : null
                            }
                            onChange={(value: boolean) =>
                              handleAnswerChange(question.id, value)
                            }
                          />
                        </Card>
                      );
                    }

                    // MCQ and Short Answer questions
                    return (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        questionNumber={currentQuestionNumber}
                      >
                        {question.type === 'mcq' && (
                          <MCQQuestion
                            question={question}
                            value={
                              answers[question.id] !== undefined &&
                              typeof answers[question.id] !== 'boolean'
                                ? (answers[question.id] as string | string[])
                                : question.allowMultiple
                                  ? []
                                  : ''
                            }
                            onChange={(value) =>
                              handleAnswerChange(question.id, value)
                            }
                          />
                        )}

                        {question.type === 'short_answer' && (
                          <ShortAnswerQuestion
                            question={question}
                            value={(answers[question.id] as string) || ''}
                            onChange={(value) =>
                              handleAnswerChange(question.id, value)
                            }
                          />
                        )}
                      </QuestionCard>
                    );
                  })}
                </div>
              )}

              {/* Separator between sets */}
              {setIndex < exam.questionSets.length - 1 && (
                <Separator className="my-8" />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
