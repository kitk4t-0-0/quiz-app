import { useNavigate } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useExamResult } from "@/hooks/useExamResult";
import type { Exam, ExamSubmission } from "@/types/exam";
import { DetailedAnswerReview } from "./DetailedAnswerReview";
import { DownloadResultButton } from "./DownloadResultButton";
import { QuestionResultTable } from "./QuestionResultTable";
import { QuestionTypeSummary } from "./QuestionTypeSummary";
import { ResultHeader } from "./ResultHeader";
import { ScoreSummary } from "./ScoreSummary";

interface ExamResultViewProps {
  exam: Exam;
  submission: ExamSubmission;
}

export function ExamResultView({ exam, submission }: ExamResultViewProps) {
  const navigate = useNavigate();
  const { detailedResults, securityCode } = useExamResult(exam, submission);

  const handleBackToHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Downloadable Section */}
      <div id="exam-result-card" className="bg-background">
        <ResultHeader
          exam={exam}
          submission={submission}
          securityCode={securityCode}
        />

        <ScoreSummary
          score={submission.score ?? 0}
          totalPoints={submission.totalPoints ?? exam.scoringConfig.maxScore}
          passingScore={exam.scoringConfig.passingScore}
        />

        <QuestionTypeSummary stats={detailedResults.questionTypeStats} />

        <QuestionResultTable results={detailedResults.questionResults} />
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <DownloadResultButton
          targetId="exam-result-card"
          fileName={`ket-qua-${exam.id}-${submission.studentName || "student"}.png`}
        />
        <Button
          onClick={handleBackToHome}
          variant="outline"
          size="lg"
          className="w-full md:w-auto"
        >
          <Home className="mr-2 h-5 w-5" />
          Về Trang Chủ
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Detailed Answer Review */}
      {exam.scoringConfig.showCorrectAnswers && (
        <div>
          <h2 className="mb-6 font-bold text-2xl">Chi Tiết Từng Câu Hỏi</h2>
          <div className="space-y-4">
            {detailedResults.questionResults.map((result) => (
              <DetailedAnswerReview
                key={result.questionId}
                question={result.question}
                answer={result.answer}
                questionNumber={result.questionNumber}
                isCorrect={result.isCorrect}
                earnedPoints={result.earnedPoints}
                scaledEarnedPoints={result.scaledEarnedPoints}
                scaledTotalPoints={result.scaledTotalPoints}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
