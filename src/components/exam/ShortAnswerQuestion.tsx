import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ShortAnswerQuestion as ShortAnswerQuestionType } from "@/types";

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionType;
  value: string;
  onChange: (value: string) => void;
}

export function ShortAnswerQuestion({
  question,
  value,
  onChange,
}: ShortAnswerQuestionProps) {
  const { maxLength, isNumeric } = question;
  const currentLength = value.length;

  return (
    <div className="space-y-3">
      <Label htmlFor={question.id} className="text-muted-foreground text-sm">
        {isNumeric ? "Nhập câu trả lời (số)" : "Nhập câu trả lời"}
      </Label>
      <Input
        id={question.id}
        type={isNumeric ? "text" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={isNumeric ? "Ví dụ: 42" : "Nhập câu trả lời của bạn..."}
        className="text-base"
        inputMode={isNumeric ? "decimal" : "text"}
      />
      <div className="flex items-center justify-between text-muted-foreground text-xs">
        <span>
          {isNumeric && "Chỉ nhập số"}
          {!isNumeric && "Câu trả lời ngắn gọn"}
        </span>
        <span>
          {currentLength}/{maxLength} ký tự
        </span>
      </div>
    </div>
  );
}
