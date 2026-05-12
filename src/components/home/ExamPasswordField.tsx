import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ExamPasswordFieldProps {
  password: string;
  onPasswordChange: (value: string) => void;
}

export function ExamPasswordField({
  password,
  onPasswordChange,
}: ExamPasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Exam Password *
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter exam password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
      />
      <p className="text-muted-foreground text-xs">
        This exam is password protected. Please enter the password provided by
        your instructor.
      </p>
    </div>
  );
}
