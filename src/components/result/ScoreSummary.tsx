import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreSummaryProps {
  score: number;
  totalPoints: number;
  passingScore: number;
}

export function ScoreSummary({
  score,
  totalPoints,
  passingScore,
}: ScoreSummaryProps) {
  const percentage = (score / totalPoints) * 100;
  const passingPercentage = (passingScore / totalPoints) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Tổng Điểm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <div className="mb-2 font-bold text-5xl text-primary">
            {score.toFixed(2)}
            <span className="text-2xl text-muted-foreground">
              /{totalPoints}
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">
            Điểm đạt: {passingScore}/{totalPoints}
          </p>
        </div>
        <Progress value={percentage} className="h-3" />
        {percentage >= passingPercentage && (
          <p className="mt-4 text-center font-semibold text-green-600">
            🎉 Chúc mừng! Bạn đã vượt qua bài thi!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
