import { type Exam, examSchema } from "@/types/exam";
import { shuffleExamQuestions, shuffleQuestionOptions } from "./shuffling";

/**
 * Exam metadata for listing
 */
export interface ExamMetadata {
  id: string;
  name: string;
  course: string;
  description: string;
  requirePassword: boolean;
  duration?: number;
  totalQuestions: number;
  totalPoints: number;
  maxScore: number;
  tags: string[];
  file: string;
}

/**
 * Import all exam JSON files using Vite's import.meta.glob
 * With { eager: true }, all files are bundled at build time (no fetch requests)
 * Using 'as' assertion for better JSON handling
 */
const examModules = import.meta.glob<{ default: unknown }>(
  "../../data/exams/*.json",
  {
    eager: true,
    import: "default",
  },
);

/**
 * Cache for loaded exams
 */
const examCache = new Map<string, Exam>();
const metadataCache: ExamMetadata[] = [];

/**
 * Initialize exam cache from bundled modules
 * Validates each exam with Zod schema
 */
function initializeExamCache(): void {
  if (examCache.size > 0) return;

  try {
    for (const [path, module] of Object.entries(examModules)) {
      const filename = path.split("/").pop() || "";

      try {
        // When using import: 'default', module is the data directly
        const examData =
          typeof module === "object" && module !== null && "default" in module
            ? (module as { default: unknown }).default
            : module;

        // Validate exam data with Zod schema
        const exam = examSchema.parse(examData);
        examCache.set(filename, exam);
        metadataCache.push(generateMetadata(exam, filename));
      } catch (error) {
        console.error(`Failed to validate exam from ${filename}:`, error);
        // Skip invalid exams instead of crashing
      }
    }
  } catch (error) {
    console.error("Failed to initialize exam cache:", error);
    // If import.meta.glob fails, the cache will remain empty
    // This prevents the app from crashing
  }
}

/**
 * Auto-generate exam metadata from exam data
 */
function generateMetadata(exam: Exam, filename: string): ExamMetadata {
  const totalQuestions = exam.questionSets.reduce(
    (total, set) => total + set.questions.length,
    0,
  );

  // Calculate total points - all questions now have points field
  const totalPoints = exam.questionSets.reduce((total, set) => {
    return (
      total +
      set.questions.reduce((setTotal, question) => {
        return setTotal + question.points;
      }, 0)
    );
  }, 0);

  return {
    id: exam.id,
    name: exam.name,
    course: exam.course,
    description: exam.description || "",
    requirePassword: exam.security.requirePassword,
    duration: exam.timeConfig.duration,
    totalQuestions,
    totalPoints,
    maxScore: exam.scoringConfig.maxScore,
    tags: exam.tags || [],
    file: filename,
  };
}

/**
 * Load all exam metadata (synchronous, uses bundled data)
 */
export function loadExamIndex(): ExamMetadata[] {
  initializeExamCache();
  return metadataCache;
}

/**
 * Load a specific exam by filename (synchronous, uses bundled data)
 */
export function loadExam(filename: string): Exam | null {
  initializeExamCache();
  return examCache.get(filename) || null;
}

/**
 * Load exam by ID (synchronous, uses bundled data)
 * Optionally accepts a seed for deterministic shuffling
 */
export function loadExamById(examId: string, seed?: number): Exam | null {
  initializeExamCache();
  const metadata = metadataCache.find((exam) => exam.id === examId);

  if (!metadata) {
    console.error(`Exam not found with ID: ${examId}`);
    return null;
  }

  const exam = loadExam(metadata.file);
  if (!exam) return null;

  // Apply shuffling based on security settings
  return applyShuffling(exam, seed);
}

/**
 * Apply question and option shuffling based on exam security settings
 * Uses seed for deterministic shuffling
 */
function applyShuffling(exam: Exam, seed?: number): Exam {
  // First, shuffle questions if enabled
  let shuffledExam = exam.security.shuffleQuestions
    ? shuffleExamQuestions(exam, seed)
    : exam;

  // Then, shuffle options for each question if enabled
  if (exam.security.shuffleOptions) {
    shuffledExam = {
      ...shuffledExam,
      questionSets: shuffledExam.questionSets.map((set) => ({
        ...set,
        questions: set.questions.map((question, qIndex) =>
          shuffleQuestionOptions(
            question,
            seed ? seed + qIndex + 1000 : undefined,
          ),
        ),
      })),
    };
  }

  return shuffledExam;
}
