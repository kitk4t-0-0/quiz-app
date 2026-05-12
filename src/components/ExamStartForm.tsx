import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ExamMetadata } from '@/lib/exam';
import { loadExam, loadExamIndex } from '@/lib/exam';
import { ExamInfoCard } from './home/ExamInfoCard';
import { ExamPasswordField } from './home/ExamPasswordField';
import { ExamSelector } from './home/ExamSelector';
import { StudentInfoFields } from './home/StudentInfoFields';

export function ExamStartForm() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Load available exams
  useEffect(() => {
    try {
      const data = loadExamIndex();

      if (data.length === 0) {
        setError(
          'No exams available. Please check your connection and try again.',
        );
        setLoading(false);
        return;
      }

      setExams(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load exams:', error);
      setError('Failed to load available exams. Please refresh the page.');
      setLoading(false);
    }
  }, []);

  const selectedExam = exams.find((exam) => exam.id === selectedExamId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!studentName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!studentClass.trim()) {
      setError('Please enter your class');
      return;
    }

    if (!selectedExamId || !selectedExam) {
      setError('Please select an exam');
      return;
    }

    if (selectedExam.requirePassword && !password.trim()) {
      setError('This exam requires a password');
      return;
    }

    // Load the full exam data
    const examData = loadExam(selectedExam.file);
    if (!examData) {
      setError('Failed to load exam data');
      return;
    }

    // Store student info and navigate to exam
    // TODO: Verify password if required
    sessionStorage.setItem(
      'examSession',
      JSON.stringify({
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        examId: selectedExamId,
        startedAt: new Date().toISOString(),
      }),
    );

    // Navigate to exam page (we'll create this later)
    navigate({ to: '/exam/$examId', params: { examId: selectedExamId } });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Loading available exams...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Start Your Exam</CardTitle>
        <CardDescription>
          Please fill in all required information before beginning
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
              setPassword(''); // Clear password when changing exam
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
            Begin Exam
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
