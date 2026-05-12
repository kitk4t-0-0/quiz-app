import { useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExamMetadata } from "@/lib/exam";
import { loadExam, loadExamIndex } from "@/lib/exam";
import { isExamAvailable } from "@/lib/exam/validation";
import { ExamInfoCard } from "./home/ExamInfoCard";
import { ExamPasswordField } from "./home/ExamPasswordField";
import { ExamSelector } from "./home/ExamSelector";
import { StudentInfoFields } from "./home/StudentInfoFields";

export function ExamStartForm() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Load available exams
  useEffect(() => {
    try {
      const data = loadExamIndex();

      if (data.length === 0) {
        setError("Không có bài thi nào. Vui lòng kiểm tra kết nối và thử lại.");
        setLoading(false);
        return;
      }

      setExams(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load exams:", error);
      setError("Không thể tải danh sách bài thi. Vui lòng tải lại trang.");
      setLoading(false);
    }
  }, []);

  const selectedExam = exams.find((exam) => exam.id === selectedExamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!studentName.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }

    if (!studentClass.trim()) {
      setError("Vui lòng nhập lớp của bạn");
      return;
    }

    if (!selectedExamId || !selectedExam) {
      setError("Vui lòng chọn bài thi");
      return;
    }

    if (selectedExam.requirePassword && !password.trim()) {
      setError("Bài thi này yêu cầu mật khẩu");
      return;
    }

    // Validate exam availability before starting
    try {
      const fullExam = loadExam(selectedExam.file);
      if (!fullExam) {
        setError("Không thể tải thông tin bài thi. Vui lòng thử lại.");
        return;
      }

      const availabilityCheck = isExamAvailable(fullExam);
      if (!availabilityCheck.available) {
        setError(
          availabilityCheck.reason ||
            "Bài thi không khả dụng. Vui lòng liên hệ giáo viên.",
        );
        return;
      }

      // TODO: Verify password if required
      // if (selectedExam.requirePassword) {
      //   const isPasswordValid = await verifyPassword(password, fullExam.security.passwordHash);
      //   if (!isPasswordValid) {
      //     setError('Mật khẩu không đúng');
      //     return;
      //   }
      // }
    } catch (error) {
      console.error("Error validating exam:", error);
      setError("Không thể xác thực bài thi. Vui lòng thử lại.");
      return;
    }

    // Store student info and navigate to exam
    sessionStorage.setItem(
      "examSession",
      JSON.stringify({
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        examId: selectedExamId,
        startedAt: new Date().toISOString(),
      }),
    );

    // Navigate to exam page immediately (no need to preload exam data)
    navigate({ to: "/exam/$examId", params: { examId: selectedExamId } });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Đang tải danh sách bộ đề...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-semibold text-xl">Bắt Đầu Bài Thi</CardTitle>
        <CardDescription>
          Vui lòng điền đầy đủ thông tin trước khi bắt đầu
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <StudentInfoFields
            studentName={studentName}
            studentClass={studentClass}
            onStudentNameChange={setStudentName}
            onStudentClassChange={setStudentClass}
          />

          <ExamSelector
            exams={exams}
            selectedExamId={selectedExamId}
            onExamChange={(examId) => {
              setSelectedExamId(examId);
              setPassword(""); // Clear password when changing exam
            }}
          />

          {/* Exam Information */}
          {selectedExam && <ExamInfoCard exam={selectedExam} />}

          {/* Password (if required) */}
          {selectedExam?.requirePassword && (
            <ExamPasswordField
              password={password}
              onPasswordChange={setPassword}
            />
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!selectedExamId || !studentName || !studentClass}
          >
            Bắt Đầu Thi
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
