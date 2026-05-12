# Quiz & Exam Application

A modern, feature-rich exam and training platform built with React, TypeScript, and TanStack Router.

## Features

### Exam Management
- **Multiple Question Types**:
  - Multiple Choice Questions (MCQ) - single or multiple answers
  - True/False Questions - with optional context/story
  - Short Answer Questions - supports numeric answers with tolerance

### Security Features
- Password protection with bcrypt-like hashing (PBKDF2)
- AES-GCM encryption for sensitive data
- Question and option shuffling
- Maximum attempt limits
- Copy/paste prevention (optional)
- Full-screen mode (optional)
- Tab switch detection (optional)

### Grading System
- Configurable passing scores
- Custom grade ranges (A, B, C, D, F)
- Automatic grading with detailed feedback
- Immediate or delayed score display
- Review mode for students

### Time Management
- Timed or untimed exams
- Scheduled start and end times
- Late submission support with penalties
- Real-time countdown timer

## Project Structure

```
quiz-app/
├── public/
│   └── exams/              # JSON exam data files
│       ├── index.json      # List of available exams
│       ├── sample-exam.json
│       └── math-basics.json
├── src/
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── ExamStartForm.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── crypto.ts      # Password hashing & encryption
│   │   ├── exam-utils.ts  # Exam grading & validation
│   │   ├── exam-factory.ts # Exam creation helpers
│   │   └── exam-loader.ts # JSON exam loading
│   ├── routes/
│   │   └── (public)/
│   │       ├── index.tsx  # Home/Start page
│   │       └── exam.$examId.tsx # Exam page (WIP)
│   ├── types/
│   │   └── exam.ts        # TypeScript types & Zod schemas
│   └── styles/
│       └── global.css
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Commands

```bash
# Linting & Formatting
pnpm check          # Check code quality
pnpm check:fix      # Fix issues automatically
pnpm format         # Check formatting
pnpm format:fix     # Fix formatting
pnpm lint           # Lint code
pnpm lint:fix       # Fix linting issues
```

## Creating Custom Exams

Exams are stored as JSON files in `public/exams/`. Here's the structure:

### 1. Create an exam JSON file

```json
{
  "id": "exam-003",
  "name": "Your Exam Name",
  "course": "COURSE101",
  "description": "Exam description",
  "security": {
    "requirePassword": true,
    "passwordHash": "...",
    "maxAttempts": 3,
    "shuffleQuestions": true,
    "shuffleOptions": true
  },
  "timeConfig": {
    "duration": 60
  },
  "gradingConfig": {
    "passingScore": 70
  },
  "questionSets": [
    {
      "id": "set-001",
      "title": "Section 1",
      "questions": [
        {
          "id": "q1",
          "type": "mcq",
          "question": "What is 2+2?",
          "points": 1,
          "options": [
            { "id": "a", "text": "3", "isCorrect": false },
            { "id": "b", "text": "4", "isCorrect": true }
          ],
          "allowMultiple": false
        }
      ]
    }
  ]
}
```

### 2. Add to index.json

```json
{
  "exams": [
    {
      "id": "exam-003",
      "name": "Your Exam Name",
      "course": "COURSE101",
      "description": "...",
      "requirePassword": true,
      "duration": 60,
      "totalQuestions": 10,
      "totalPoints": 15,
      "tags": ["tag1", "tag2"],
      "file": "your-exam.json"
    }
  ]
}
```

## Question Types

### Multiple Choice (MCQ)
```json
{
  "type": "mcq",
  "question": "Select all programming languages:",
  "points": 2,
  "options": [
    { "id": "a", "text": "Python", "isCorrect": true },
    { "id": "b", "text": "HTML", "isCorrect": false }
  ],
  "allowMultiple": true
}
```

### True/False
```json
{
  "type": "true_false",
  "question": "The Earth is flat.",
  "points": 1,
  "correctAnswer": false,
  "context": "Optional context or story",
  "explanation": "The Earth is a sphere."
}
```

### Short Answer
```json
{
  "type": "short_answer",
  "question": "What is π to 2 decimal places?",
  "points": 2,
  "correctAnswer": "3.14",
  "maxLength": 10,
  "isNumeric": true,
  "numericTolerance": 0.01,
  "acceptableAnswers": ["3.14", "3.1416"]
}
```

## Tech Stack

- **Framework**: React 19 with TanStack Router
- **Language**: TypeScript 6
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod v4
- **Code Quality**: Biome (linting & formatting)
- **Git Hooks**: Husky + lint-staged

## Current Status

✅ **Completed**:
- Type system and data models
- Exam loading from JSON
- Password hashing and encryption utilities
- Grading and validation logic
- Home page with exam selection form
- UI component library setup

🚧 **In Progress**:
- Exam taking interface
- Timer functionality
- Answer submission
- Results page

## License

MIT
