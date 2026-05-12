import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { TrueFalseQuestion as TrueFalseQuestionType } from '@/types';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  questionNumber: number;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function TrueFalseQuestion({
  question,
  questionNumber,
  value,
  onChange,
}: TrueFalseQuestionProps) {
  const stringValue = value === null ? '' : value.toString();

  return (
    <div className="flex items-start gap-4 border-b py-3 last:border-b-0">
      {/* Question Number */}
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
        {questionNumber}
      </div>

      {/* Question Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed">{question.question}</p>
      </div>

      {/* True/False Options */}
      <RadioGroup
        value={stringValue}
        onValueChange={(newValue) => onChange(newValue === 'true')}
        className="flex flex-shrink-0 gap-2"
      >
        {/* True */}
        <Label
          htmlFor={`${question.id}-true`}
          className={`flex h-9 w-12 cursor-pointer items-center justify-center rounded-md border transition-colors ${
            value === true
              ? 'border-green-600 bg-green-100 dark:border-green-400 dark:bg-green-900/30'
              : 'border-border hover:bg-accent'
          }`}
        >
          <RadioGroupItem
            value="true"
            id={`${question.id}-true`}
            className="sr-only"
          />
          <Check
            className={`h-4 w-4 ${
              value === true
                ? 'text-green-700 dark:text-green-400'
                : 'text-muted-foreground'
            }`}
          />
        </Label>

        {/* False */}
        <Label
          htmlFor={`${question.id}-false`}
          className={`flex h-9 w-12 cursor-pointer items-center justify-center rounded-md border transition-colors ${
            value === false
              ? 'border-red-600 bg-red-100 dark:border-red-400 dark:bg-red-900/30'
              : 'border-border hover:bg-accent'
          }`}
        >
          <RadioGroupItem
            value="false"
            id={`${question.id}-false`}
            className="sr-only"
          />
          <X
            className={`h-4 w-4 ${
              value === false
                ? 'text-red-700 dark:text-red-400'
                : 'text-muted-foreground'
            }`}
          />
        </Label>
      </RadioGroup>
    </div>
  );
}
