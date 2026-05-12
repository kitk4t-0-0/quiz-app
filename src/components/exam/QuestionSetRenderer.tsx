import { Separator } from '@/components/ui/separator';
import type { AnswerState } from '@/lib/exam/session';
import type { QuestionSet } from '@/types';
import { MCQQuestion } from './MCQQuestion';
import { QuestionCard } from './QuestionCard';
import { ShortAnswerQuestion } from './ShortAnswerQuestion';
import { TrueFalseSetQuestion } from './TrueFalseSetQuestion';

interface QuestionSetRendererProps {
  questionSets: QuestionSet[];
  answers: AnswerState;
  onAnswerChange: (
    questionId: string,
    value: string | string[] | boolean | Record<string, boolean>,
  ) => void;
}

/**
 * Helper to check if a value is a plain object (Record) and not an array
 */
function isRecord(value: unknown): value is Record<string, boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
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

            {/* Questions */}
            <div className="space-y-6">
              {set.questions.map((question) => {
                questionCounter++;
                const currentQuestionNumber = questionCounter;

                // True/False Set Question
                if (question.type === 'true_false_set') {
                  return (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      questionNumber={currentQuestionNumber}
                      showContext={!!question.context}
                      context={question.context}
                    >
                      <TrueFalseSetQuestion
                        question={question}
                        value={
                          (answers[question.id] as Record<string, boolean>) ||
                          {}
                        }
                        onChange={(value) => onAnswerChange(question.id, value)}
                      />
                    </QuestionCard>
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
                          typeof answers[question.id] !== 'boolean' &&
                          !isRecord(answers[question.id])
                            ? (answers[question.id] as string | string[])
                            : question.allowMultiple
                              ? []
                              : ''
                        }
                        onChange={(value) => onAnswerChange(question.id, value)}
                      />
                    )}

                    {question.type === 'short_answer' && (
                      <ShortAnswerQuestion
                        question={question}
                        value={(answers[question.id] as string) || ''}
                        onChange={(value) => onAnswerChange(question.id, value)}
                      />
                    )}
                  </QuestionCard>
                );
              })}
            </div>

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
