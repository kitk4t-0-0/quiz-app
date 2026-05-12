import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Label htmlFor="password" className="inline-flex items-center gap-2">
        <Lock className="h-4 w-4" />
        <span>Mật Khẩu Bài Thi *</span>
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Nhập mật khẩu bài thi"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
      />
      <p className="text-muted-foreground text-xs">
        Bài thi này được bảo vệ bằng mật khẩu. Vui lòng nhập mật khẩu do giáo
        viên cung cấp.
      </p>
    </div>
  );
}
