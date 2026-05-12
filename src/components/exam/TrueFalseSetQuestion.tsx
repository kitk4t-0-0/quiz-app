import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { TrueFalseSetQuestion as TrueFalseSetQuestionType } from '@/types';

interface TrueFalseSetQuestionProps {
  question: TrueFalseSetQuestionType;
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
}

export function TrueFalseSetQuestion({
  question,
  value,
  onChange,
}: TrueFalseSetQuestionProps) {
  const handleSubQuestionChange = (subQuestionId: string, answer: boolean) => {
    onChange({
      ...value,
      [subQuestionId]: answer,
    });
  };

  return (
    <div className="space-y-3">
      {question.subQuestions.map((subQ, index) => {
        const subValue = value[subQ.id];
        const stringValue = subValue === undefined ? '' : subValue.toString();

        return (
          <div
            key={subQ.id}
            className="flex items-start items-center gap-4 border-b py-3 last:border-b-0"
          >
            {/* Sub-question Number */}
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
              {index + 1}
            </div>

            {/* Statement Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed">{subQ.statement}</p>
            </div>

            {/* True/False Options */}
            <RadioGroup
              value={stringValue}
              onValueChange={(newValue) =>
                handleSubQuestionChange(subQ.id, newValue === 'true')
              }
              className="flex flex-shrink-0 gap-2"
            >
              {/* True */}
              <Label
                htmlFor={`${subQ.id}-true`}
                className={`flex h-9 w-12 cursor-pointer items-center justify-center rounded-md border transition-colors ${
                  subValue === true
                    ? 'border-green-600 bg-green-100 dark:border-green-400 dark:bg-green-900/30'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <RadioGroupItem
                  value="true"
                  id={`${subQ.id}-true`}
                  className="sr-only"
                />
                <Check
                  className={`h-4 w-4 ${
                    subValue === true
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Label>

              {/* False */}
              <Label
                htmlFor={`${subQ.id}-false`}
                className={`flex h-9 w-12 cursor-pointer items-center justify-center rounded-md border transition-colors ${
                  subValue === false
                    ? 'border-red-600 bg-red-100 dark:border-red-400 dark:bg-red-900/30'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <RadioGroupItem
                  value="false"
                  id={`${subQ.id}-false`}
                  className="sr-only"
                />
                <X
                  className={`h-4 w-4 ${
                    subValue === false
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Label>
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
}
