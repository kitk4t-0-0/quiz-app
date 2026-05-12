import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type MCQQuestion,
  type Question,
  QuestionType,
  type ShortAnswerQuestion,
  type TrueFalseSetQuestion,
} from "@/types/exam";
import type { QuestionResult } from "@/types/result";

interface QuestionResultTableProps {
  results: QuestionResult[];
}

export function QuestionResultTable({ results }: QuestionResultTableProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case QuestionType.MCQ:
        return "Trắc Nghiệm";
      case QuestionType.TRUE_FALSE_SET:
        return "Đúng/Sai";
      case QuestionType.SHORT_ANSWER:
        return "Tự Luận";
      default:
        return type;
    }
  };

  const getStudentAnswer = (result: QuestionResult): string => {
    if (!result.answer) return "Chưa trả lời";

    const { question, answer } = result;

    switch (question.type) {
      case QuestionType.MCQ: {
        const mcqQuestion = question as MCQQuestion;
        const studentAnswers = Array.isArray(answer.answer)
          ? answer.answer
          : [answer.answer as string];

        return studentAnswers
          .map((id) => {
            const option = mcqQuestion.options.find((opt) => opt.id === id);
            return option ? option.id.toUpperCase() : id;
          })
          .join(", ");
      }

      case QuestionType.SHORT_ANSWER: {
        return (answer.answer as string) || "Chưa trả lời";
      }

      case QuestionType.TRUE_FALSE_SET: {
        return "Xem chi tiết";
      }

      default:
        return "N/A";
    }
  };

  const getCorrectAnswer = (question: Question): string => {
    switch (question.type) {
      case QuestionType.MCQ: {
        const mcqQuestion = question as MCQQuestion;
        const correctOptions = mcqQuestion.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id.toUpperCase());
        return correctOptions.join(", ");
      }

      case QuestionType.SHORT_ANSWER: {
        const shortQuestion = question as ShortAnswerQuestion;
        return shortQuestion.correctAnswer;
      }

      case QuestionType.TRUE_FALSE_SET: {
        return "Xem chi tiết";
      }

      default:
        return "N/A";
    }
  };

  const renderTrueFalseDetails = (result: QuestionResult) => {
    const question = result.question as TrueFalseSetQuestion;
    const answer = result.answer;
    const studentAnswers = (answer?.answer as Record<string, boolean>) || {};

    return (
      <tr key={`${result.questionId}-details`} className="bg-muted/20">
        <td colSpan={6} className="p-4">
          <div className="space-y-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">STT</th>
                  <th className="p-2 text-left font-medium">Phát biểu</th>
                  <th className="p-2 text-center font-medium">Đáp án HS</th>
                  <th className="p-2 text-center font-medium">Đáp án đúng</th>
                  <th className="p-2 text-center font-medium">Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {question.subQuestions.map((subQ, index) => {
                  const studentAnswer = studentAnswers[subQ.id];
                  const isCorrect = studentAnswer === subQ.correctAnswer;

                  return (
                    <tr key={subQ.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{subQ.statement}</td>
                      <td className="p-2 text-center">
                        {studentAnswer === undefined ? (
                          <span className="text-muted-foreground">
                            Chưa trả lời
                          </span>
                        ) : (
                          <span
                            className={
                              studentAnswer ? "text-green-600" : "text-red-600"
                            }
                          >
                            {studentAnswer ? "Đúng" : "Sai"}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <span className="font-medium text-green-600">
                          {subQ.correctAnswer ? "Đúng" : "Sai"}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {isCorrect ? (
                          <span className="font-bold text-green-600">✓</span>
                        ) : (
                          <span className="font-bold text-red-600">✗</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Bảng Tổng Hợp Kết Quả</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-semibold">Câu</th>
                <th className="p-3 text-left font-semibold">Loại</th>
                <th className="p-3 text-left font-semibold">Nội Dung</th>
                <th className="p-3 text-center font-semibold">Đáp án HS</th>
                <th className="p-3 text-center font-semibold">Đáp án đúng</th>
                <th className="p-3 text-right font-semibold">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <>
                  <tr
                    key={result.questionId}
                    className="border-b hover:bg-muted/30"
                  >
                    <td className="p-3 font-medium">{result.questionNumber}</td>
                    <td className="p-3 text-sm">
                      {getTypeLabel(result.questionType)}
                    </td>
                    <td className="max-w-md truncate p-3 text-sm">
                      {result.questionText}
                    </td>
                    <td className="p-3 text-center text-sm">
                      <span
                        className={
                          result.isCorrect
                            ? "font-medium text-green-600"
                            : "font-medium text-red-600"
                        }
                      >
                        {getStudentAnswer(result)}
                      </span>
                    </td>
                    <td className="p-3 text-center font-medium text-green-600 text-sm">
                      {getCorrectAnswer(result.question)}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {result.scaledEarnedPoints.toFixed(2)}/
                      {result.scaledTotalPoints.toFixed(2)}
                    </td>
                  </tr>
                  {result.questionType === QuestionType.TRUE_FALSE_SET &&
                    renderTrueFalseDetails(result)}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
