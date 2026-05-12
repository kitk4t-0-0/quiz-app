import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/(public)/exam/$examId')({
  component: ExamPage,
});

function ExamPage() {
  const { examId } = Route.useParams();

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle>Exam Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Exam ID: {examId}</p>
          <p className="mt-4 text-sm">
            This is a placeholder for the exam page. We'll build this next!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
