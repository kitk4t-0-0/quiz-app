import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  children: React.ReactNode;
  showContext?: boolean;
  context?: string;
}

export function QuestionCard({
  question,
  questionNumber,
  children,
  showContext = false,
  context,
}: QuestionCardProps) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq':
        return 'Trắc nghiệm';
      case 'true_false_set':
        return 'Đúng/Sai';
      case 'short_answer':
        return 'Tự luận ngắn';
      default:
        return type;
    }
  };

  return (
    <Card className="scroll-mt-24 p-6" id={`question-${question.id}`}>
      {/* Question Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-sm">
            {questionNumber}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getQuestionTypeLabel(question.type)}
              </Badge>
              {'points' in question && question.points !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {question.points} điểm
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context (if provided) */}
      {showContext && context && (
        <div className="mb-4 rounded-lg border border-border/50 bg-muted/50 p-4">
          <p className="text-muted-foreground text-sm italic leading-relaxed">
            {context}
          </p>
        </div>
      )}

      {/* Question Text */}
      <div className="mb-4 pl-11">
        <p className="font-medium text-base leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Answer Area */}
      <div className="pl-11">{children}</div>
    </Card>
  );
}
