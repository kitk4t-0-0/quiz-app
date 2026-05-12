import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type MCQQuestion,
  type Question,
  QuestionType,
  type ShortAnswerQuestion,
  type StudentAnswer,
  type TrueFalseSetQuestion,
} from "@/types/exam";

interface DetailedAnswerReviewProps {
  question: Question;
  answer: StudentAnswer | undefined;
  questionNumber: number;
  isCorrect: boolean;
  scaledEarnedPoints: number;
  scaledTotalPoints: number;
}

export function DetailedAnswerReview({
  question,
  answer,
  questionNumber,
  isCorrect,
  scaledEarnedPoints,
  scaledTotalPoints,
}: DetailedAnswerReviewProps) {
  const renderMCQAnswer = (q: MCQQuestion, ans: StudentAnswer | undefined) => {
    const studentAnswers = ans?.answer
      ? Array.isArray(ans.answer)
        ? ans.answer
        : [ans.answer as string]
      : [];

    return (
      <div className="space-y-2">
        {q.options.map((option) => {
          const isSelected = studentAnswers.includes(option.id);
          const isCorrectOption = option.isCorrect;

          return (
            <div
              key={option.id}
              className={`rounded-lg border-2 p-3 ${
                isCorrectOption
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : isSelected
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-semibold">
                  {option.id.toUpperCase()}.
                </span>
                <div className="flex-1">
                  <p>{option.text}</p>
                  {isSelected && !isCorrectOption && (
                    <p className="mt-1 text-red-600 text-sm">
                      ✗ Bạn đã chọn (Sai)
                    </p>
                  )}
                  {isSelected && isCorrectOption && (
                    <p className="mt-1 text-green-600 text-sm">
                      ✓ Bạn đã chọn (Đúng)
                    </p>
                  )}
                  {!isSelected && isCorrectOption && (
                    <p className="mt-1 text-green-600 text-sm">✓ Đáp án đúng</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTrueFalseAnswer = (
    q: TrueFalseSetQuestion,
    ans: StudentAnswer | undefined,
  ) => {
    const studentAnswers = (ans?.answer as Record<string, boolean>) || {};

    return (
      <div className="space-y-3">
        {q.context && (
          <p className="mb-4 text-muted-foreground text-sm italic">
            {q.context}
          </p>
        )}
        {q.subQuestions.map((subQ, index) => {
          const studentAnswer = studentAnswers[subQ.id];
          const isSubCorrect = studentAnswer === subQ.correctAnswer;

          return (
            <div
              key={subQ.id}
              className={`rounded-lg border-2 p-3 ${
                isSubCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
              }`}
            >
              <p className="mb-2 font-medium">
                {index + 1}. {subQ.statement}
              </p>
              <div className="flex gap-4 text-sm">
                <p>
                  <span className="font-semibold">Câu trả lời của bạn:</span>{" "}
                  {studentAnswer === undefined
                    ? "Chưa trả lời"
                    : studentAnswer
                      ? "Đúng"
                      : "Sai"}
                </p>
                <p>
                  <span className="font-semibold">Đáp án đúng:</span>{" "}
                  {subQ.correctAnswer ? "Đúng" : "Sai"}
                </p>
              </div>
              {subQ.explanation && (
                <p className="mt-2 text-muted-foreground text-sm">
                  💡 {subQ.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderShortAnswer = (
    q: ShortAnswerQuestion,
    ans: StudentAnswer | undefined,
  ) => {
    const studentAnswer = (ans?.answer as string) || "";

    return (
      <div className="space-y-3">
        <div
          className={`rounded-lg border-2 p-3 ${
            isCorrect
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-500 bg-red-50 dark:bg-red-950"
          }`}
        >
          <p className="mb-1 font-semibold">Câu trả lời của bạn:</p>
          <p className="text-lg">
            {studentAnswer || (
              <span className="text-muted-foreground">Chưa trả lời</span>
            )}
          </p>
        </div>
        <div className="rounded-lg border-2 border-green-500 bg-green-50 p-3 dark:bg-green-950">
          <p className="mb-1 font-semibold">Đáp án đúng:</p>
          <p className="text-lg">{q.correctAnswer}</p>
          {q.acceptableAnswers && q.acceptableAnswers.length > 0 && (
            <p className="mt-2 text-muted-foreground text-sm">
              Các đáp án chấp nhận: {q.acceptableAnswers.join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Câu {questionNumber}: {question.question}
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Loại:{" "}
              {question.type === QuestionType.MCQ
                ? "Trắc Nghiệm"
                : question.type === QuestionType.TRUE_FALSE_SET
                  ? "Đúng/Sai"
                  : "Tự Luận Ngắn"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl text-primary">
              {scaledEarnedPoints.toFixed(2)}
            </p>
            <p className="text-muted-foreground text-sm">
              /{scaledTotalPoints.toFixed(2)} điểm
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {question.type === QuestionType.MCQ &&
          renderMCQAnswer(question as MCQQuestion, answer)}
        {question.type === QuestionType.TRUE_FALSE_SET &&
          renderTrueFalseAnswer(question as TrueFalseSetQuestion, answer)}
        {question.type === QuestionType.SHORT_ANSWER &&
          renderShortAnswer(question as ShortAnswerQuestion, answer)}

        {question.explanation && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <p className="mb-1 font-semibold text-sm">💡 Giải Thích:</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
