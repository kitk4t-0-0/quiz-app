import { User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentInfoFieldsProps {
  studentName: string;
  studentClass: string;
  onStudentNameChange: (value: string) => void;
  onStudentClassChange: (value: string) => void;
}

export function StudentInfoFields({
  studentName,
  studentClass,
  onStudentNameChange,
  onStudentClassChange,
}: StudentInfoFieldsProps) {
  return (
    <>
      {/* Student Name */}
      <div className="space-y-2">
        <Label htmlFor="studentName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Họ và Tên *
        </Label>
        <Input
          id="studentName"
          type="text"
          placeholder="Nhập họ và tên đầy đủ"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          required
        />
      </div>

      {/* Class */}
      <div className="space-y-2">
        <Label htmlFor="studentClass" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Lớp *
        </Label>
        <Input
          id="studentClass"
          type="text"
          placeholder="Ví dụ: 10A, CS-2024"
          value={studentClass}
          onChange={(e) => onStudentClassChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
