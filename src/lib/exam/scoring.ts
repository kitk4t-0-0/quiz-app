/**
 * Constants for weighted scoring
 */
const WEIGHTED_SCORING_BASE = 0.5; // Base for exponential penalty: (1/2)^incorrectCount
const WEIGHTED_SCORING_ROUNDING_PRECISION = 0.05; // Round to nearest 0.05

/**
 * Calculate weighted score for True/False question sets
 *
 * Formula: (1/2)^(totalQuestions - correctAnswers), rounded to nearest 0.05
 *
 * This creates an exponential penalty for incorrect answers:
 * - All correct = 1.0 (full points)
 * - 1 wrong = 0.5 (half points)
 * - 2 wrong = 0.25 (quarter points)
 * - 3 wrong = 0.125 → 0.10 (rounded)
 * - 4 wrong = 0.0625 → 0.05 (rounded)
 *
 * @param totalQuestions - Total number of questions in the set
 * @param correctAnswers - Number of correct answers
 * @returns Weight multiplier (0.0 to 1.0)
 *
 * @example
 * calculateTFWeight(4, 4) // 1.0 - all correct
 * calculateTFWeight(4, 3) // 0.5 - one wrong
 * calculateTFWeight(4, 2) // 0.25 - two wrong
 * calculateTFWeight(4, 1) // 0.10 - three wrong (0.125 rounded)
 * calculateTFWeight(4, 0) // 0.05 - all wrong (0.0625 rounded)
 */
export function calculateTFWeight(
  totalQuestions: number,
  correctAnswers: number,
): number {
  if (totalQuestions === 0) return 0;
  if (correctAnswers < 0 || correctAnswers > totalQuestions) return 0;

  const incorrectCount = totalQuestions - correctAnswers;
  const rawWeight = WEIGHTED_SCORING_BASE ** incorrectCount;

  // Round to nearest precision (0.05)
  return (
    Math.round(rawWeight / WEIGHTED_SCORING_ROUNDING_PRECISION) *
    WEIGHTED_SCORING_ROUNDING_PRECISION
  );
}
