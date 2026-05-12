import { BookOpen } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { ExamMetadata } from '@/lib/exam';

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
      <Label htmlFor="examSelect" className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Chọn Bộ Đề *
      </Label>
      <select
        id="examSelect"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={selectedExamId}
        onChange={(e) => onExamChange(e.target.value)}
        required
      >
        <option value="">-- Chọn bộ đề --</option>
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.name} ({exam.course})
          </option>
        ))}
      </select>
    </div>
  );
}
