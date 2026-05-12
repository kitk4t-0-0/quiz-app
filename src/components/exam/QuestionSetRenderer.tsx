import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AnswerState } from '@/lib/exam/session';
import type {
  QuestionSet,
  TrueFalseQuestion as TrueFalseQuestionType,
} from '@/types';
import { MCQQuestion } from './MCQQuestion';
import { QuestionCard } from './QuestionCard';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';

interface QuestionSetRendererProps {
  questionSets: QuestionSet[];
  answers: AnswerState;
  onAnswerChange: (
    questionId: string,
    value: string | string[] | boolean,
  ) => void;
}

export function QuestionSetRenderer({
  questionSets,
  answers,
  onAnswerChange,
}: QuestionSetRendererProps) {
  let questionCounter = 0;

  return (
    <div className="space-y-8">
      {questionSets.map((set, setIndex) => {
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
                          onAnswerChange(question.id, value)
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
                            onAnswerChange(question.id, value)
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
                            onAnswerChange(question.id, value)
                          }
                        />
                      )}

                      {question.type === 'short_answer' && (
                        <ShortAnswerQuestion
                          question={question}
                          value={(answers[question.id] as string) || ''}
                          onChange={(value) =>
                            onAnswerChange(question.id, value)
                          }
                        />
                      )}
                    </QuestionCard>
                  );
                })}
              </div>
            )}

            {/* Separator between sets */}
            {setIndex < questionSets.length - 1 && (
              <Separator className="my-8" />
            )}
          </div>
        );
      })}
    </div>
  );
}
