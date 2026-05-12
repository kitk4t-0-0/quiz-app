import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { MCQQuestion as MCQQuestionType } from "@/types";

interface MCQQuestionProps {
  question: MCQQuestionType;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function MCQQuestion({ question, value, onChange }: MCQQuestionProps) {
  const { options, allowMultiple } = question;

  // Single choice
  if (!allowMultiple) {
    return (
      <RadioGroup
        value={typeof value === "string" ? value : value[0] || ""}
        onValueChange={(newValue) => onChange(newValue)}
        className="space-y-3"
      >
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <Label
              key={option.id}
              htmlFor={`${question.id}-${option.id}`}
              className={`flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              <RadioGroupItem
                value={option.id}
                id={`${question.id}-${option.id}`}
                className="mt-0.5 flex-shrink-0"
              />
              <span className="flex-1 font-normal leading-relaxed">
                {option.text}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    );
  }

  // Multiple choice
  const selectedValues = Array.isArray(value) ? value : [];

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionId]);
    } else {
      onChange(selectedValues.filter((id) => id !== optionId));
    }
  };

  return (
    <div className="space-y-3">
      <p className="mb-4 text-muted-foreground text-sm">
        Chọn tất cả đáp án đúng
      </p>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);

        return (
          <Label
            key={option.id}
            htmlFor={`${question.id}-${option.id}`}
            className={`flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-accent/50"
            }`}
          >
            <Checkbox
              id={`${question.id}-${option.id}`}
              checked={isSelected}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.id, checked === true)
              }
              className="mt-0.5 flex-shrink-0"
            />
            <span className="flex-1 font-normal leading-relaxed">
              {option.text}
            </span>
          </Label>
        );
      })}
    </div>
  );
}
