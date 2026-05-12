# Quiz App

A modern, full-featured online examination platform built with React 19, TypeScript, and TanStack Router. Create, manage, and take exams with advanced security features, multiple question types, and comprehensive result tracking.

## ✨ Features

### 📝 Multiple Question Types
- **Multiple Choice Questions (MCQ)**: Support for single or multiple correct answers
- **True/False Set Questions**: Multiple true/false statements with optional context
- **Short Answer Questions**: Text-based answers with support for numeric validation and tolerance

### 🔒 Security & Anti-Cheating
- **Password Protection**: Secure exam access with PBKDF2 password hashing
- **Data Encryption**: AES-GCM encryption for sensitive exam data
- **Question Shuffling**: Randomize question order for each student
- **Option Shuffling**: Randomize answer choices to prevent cheating
- **Attempt Limits**: Configure maximum number of exam attempts
- **Tab Switch Detection**: Monitor when students leave the exam window
- **Copy/Paste Prevention**: Disable clipboard operations during exams
- **Fullscreen Mode**: Lock students into fullscreen during exam

### 📊 Grading & Results
- **Automatic Grading**: Instant scoring for all question types
- **Flexible Scoring**: Configure point values per question
- **Passing Scores**: Set minimum scores required to pass
- **Grade Ranges**: Custom grade levels (A, B, C, D, F)
- **Detailed Feedback**: Show correct answers and explanations after submission
- **Result Download**: Export exam results as images
- **Security Codes**: Unique verification codes for each submission

### ⏱️ Time Management
- **Timed Exams**: Set duration limits with countdown timer
- **Scheduled Exams**: Configure start and end dates
- **Late Submissions**: Optional support with configurable penalties
- **Auto-Submit**: Automatically submit when time expires

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Built-in theme switching
- **Progress Tracking**: Visual progress indicators during exams
- **Question Navigation**: Easy navigation between questions
- **Review Mode**: Review answers before final submission
- **Accessibility**: WCAG-compliant UI components

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **Package Manager**: pnpm (recommended), npm, or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quiz-app

# Install dependencies
pnpm install
# or
npm install
# or
yarn install

# Start development server
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

> **Note**: This project was developed with pnpm for better performance and disk efficiency, but npm and yarn are fully compatible.

### Build for Production

```bash
# Create production build
pnpm build
# or
npm run build
# or
yarn build

# Preview production build
pnpm preview
# or
npm run preview
# or
yarn preview
```

## 🛠️ Development

### Available Scripts

All commands work with pnpm, npm, or yarn:

```bash
# Development
pnpm dev              # Start dev server on port 3000
npm run dev           # (or with npm)
yarn dev              # (or with yarn)

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm check            # Check code quality with Biome
pnpm check:fix        # Auto-fix code quality issues
pnpm format           # Check code formatting
pnpm format:fix       # Auto-fix formatting issues
pnpm lint             # Lint code
pnpm lint:fix         # Auto-fix linting issues
```

### Code Quality Tools

This project uses **Biome** for linting and formatting, providing fast and consistent code quality checks. Pre-commit hooks are configured with Husky to ensure code quality before commits.

## 📚 Creating Exams

Exams are defined as JSON files in the `src/data/exams/` directory.

### Basic Exam Structure

```json
{
  "id": "my-exam-001",
  "name": "Introduction to Programming",
  "course": "CS101",
  "description": "Basic programming concepts and syntax",
  "securityConfig": {
    "requirePassword": true,
    "passwordHash": "hashed-password-here",
    "maxAttempts": 3,
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "preventCopyPaste": true,
    "requireFullscreen": false,
    "detectTabSwitch": true
  },
  "timeConfig": {
    "duration": 60,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "allowLateSubmission": false
  },
  "scoringConfig": {
    "passingScore": 70,
    "maxScore": 100,
    "showScoreImmediately": true,
    "showCorrectAnswers": true,
    "gradeRanges": [
      { "min": 90, "max": 100, "grade": "A" },
      { "min": 80, "max": 89, "grade": "B" },
      { "min": 70, "max": 79, "grade": "C" },
      { "min": 60, "max": 69, "grade": "D" },
      { "min": 0, "max": 59, "grade": "F" }
    ]
  },
  "questionSets": [
    {
      "id": "set-001",
      "title": "Section 1: Basics",
      "description": "Fundamental concepts",
      "questions": [
        // Questions go here
      ]
    }
  ]
}
```

### Question Type Examples

#### Multiple Choice Question (Single Answer)

```json
{
  "id": "q1",
  "type": "mcq",
  "question": "What is the correct syntax for a Python function?",
  "points": 2,
  "options": [
    { "id": "a", "text": "function myFunc():", "isCorrect": false },
    { "id": "b", "text": "def myFunc():", "isCorrect": true },
    { "id": "c", "text": "func myFunc():", "isCorrect": false },
    { "id": "d", "text": "define myFunc():", "isCorrect": false }
  ],
  "allowMultiple": false,
  "explanation": "In Python, functions are defined using the 'def' keyword."
}
```

#### Multiple Choice Question (Multiple Answers)

```json
{
  "id": "q2",
  "type": "mcq",
  "question": "Which of the following are programming languages?",
  "points": 3,
  "options": [
    { "id": "a", "text": "Python", "isCorrect": true },
    { "id": "b", "text": "HTML", "isCorrect": false },
    { "id": "c", "text": "JavaScript", "isCorrect": true },
    { "id": "d", "text": "CSS", "isCorrect": false }
  ],
  "allowMultiple": true,
  "explanation": "Python and JavaScript are programming languages, while HTML and CSS are markup/styling languages."
}
```

#### True/False Set Question

```json
{
  "id": "q3",
  "type": "true_false_set",
  "question": "Determine if the following statements are true or false:",
  "points": 4,
  "context": "Consider the following code snippet: x = [1, 2, 3]",
  "subQuestions": [
    {
      "id": "tf1",
      "statement": "x is a list",
      "correctAnswer": true,
      "explanation": "Square brackets [] denote a list in Python"
    },
    {
      "id": "tf2",
      "statement": "x is immutable",
      "correctAnswer": false,
      "explanation": "Lists are mutable in Python"
    }
  ]
}
```

#### Short Answer Question

```json
{
  "id": "q4",
  "type": "short_answer",
  "question": "What is the value of π (pi) to 2 decimal places?",
  "points": 2,
  "correctAnswer": "3.14",
  "caseSensitive": false,
  "maxLength": 10,
  "isNumeric": true,
  "numericTolerance": 0.01,
  "acceptableAnswers": ["3.14", "3.1416"],
  "explanation": "π (pi) is approximately 3.14159..."
}
```

### Password Hashing

To generate a password hash for your exam:

```javascript
// Use the crypto utility in your browser console or Node.js
import { hashPassword } from './src/lib/crypto';

const hash = await hashPassword('your-password');
console.log(hash); // Use this in your exam JSON
```

## 🎯 Usage Flow

1. **Home Page**: Students enter their name and select an exam
2. **Password Entry**: If required, students enter the exam password
3. **Exam Interface**: Students answer questions with timer and progress tracking
4. **Review**: Students can review their answers before submission
5. **Submit**: Final submission with confirmation
6. **Results**: Detailed results page with score, feedback, and downloadable certificate

## 🏗️ Tech Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router v1.169
- **Language**: TypeScript 6
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI + shadcn/ui
- **Validation**: Zod v4
- **Icons**: Lucide React
- **Fonts**: Inter, Geist, Cal Sans, Roboto Mono
- **Code Quality**: Biome 2.4
- **Git Hooks**: Husky + lint-staged

## 📦 Key Dependencies

- `@tanstack/react-router` - Type-safe routing
- `@tanstack/react-start` - Full-stack React framework
- `zod` - Schema validation
- `html2canvas` - Result export functionality
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all quality checks:
```bash
pnpm check:fix && pnpm format:fix && pnpm lint:fix
# or
npm run check:fix && npm run format:fix && npm run lint:fix
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons by [Lucide](https://lucide.dev/)
- Powered by [TanStack Router](https://tanstack.com/router)
