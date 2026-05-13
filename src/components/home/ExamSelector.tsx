import { BookOpen } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExamMetadata } from "@/lib/exam";

interface ExamSelectorProps {
  exams: ExamMetadata[];
  selectedExamId: string;
  onExamChange: (examId: string) => void;
}

export function ExamSelector({
  exams,
  selectedExamId,
  onExamChange,
}: ExamSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="examSelect" className="inline-flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        <span>Chọn Bộ Đề *</span>
      </Label>
      <Select value={selectedExamId} onValueChange={onExamChange}>
        <SelectTrigger id="examSelect">
          <SelectValue placeholder="-- Chọn bộ đề --" />
        </SelectTrigger>
        <SelectContent>
          {exams.map((exam) => (
            <SelectItem key={exam.id} value={exam.id}>
              {exam.name} ({exam.course})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
