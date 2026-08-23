export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType =
  | "Concept MCQ"
  | "Output Prediction"
  | "Debugging"
  | "Code Understanding"
  | "Syntax"
  | "Best Practices / Interview";
export interface User {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  course: string;
  year: string;
}
export interface Question {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  learningObjective: string;
  tags: string[];
}
export interface Lesson {
  id: string;
  slug: string;
  module: string;
  title: string;
  difficulty: Difficulty;
  minutes: number;
  overview: string;
  why: string;
  explanation: string;
  syntax: string;
  example: string;
  output: string;
  points: string[];
  mistakes: string[];
  bestPractices: string[];
  quickCheck: string;
  related: string[];
}
export type ActivityKind =
  | "concept"
  | "predict"
  | "try-code"
  | "fill-code"
  | "bug-hunt"
  | "rearrange"
  | "mini-challenge"
  | "quick-quiz";
export interface MicroActivity {
  id: string;
  lessonId: string;
  topic: string;
  kind: ActivityKind;
  title: string;
  instruction: string;
  explanation: string;
  xp: number;
  code?: string;
  options?: string[];
  correctAnswer?: string;
  starterCode?: string;
  expectedCode?: string;
  expectedOutput?: string;
  template?: string;
  blankAnswers?: string[];
  lines?: string[];
  correctOrder?: string[];
  hints?: string[];
  solution?: string;
  validation?: {
    strategy: "output" | "structure" | "custom";
    preserveWhitespace?: boolean;
    requiredTokens?: string[];
  };
}
export interface LearningActivityResult {
  activityId: string;
  topic: string;
  kind: ActivityKind;
  correct: boolean;
  at: string;
}
export interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  updatedAt: string;
}
export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  activeDates: string[];
  recordedActivityIds: string[];
}
export interface AppState {
  user: User | null;
  completedLessons: string[];
  attempts: {
    questionId: string;
    answer: string;
    correct: boolean;
    at: string;
  }[];
  quizAttempts: {
    id: string;
    score: number;
    total: number;
    at: string;
    seconds: number;
  }[];
  solvedChallenges: string[];
  completedProjects: string[];
  xp: number;
  claimedXpActivities: string[];
  learningActivityResults: LearningActivityResult[];
  bugsFixed: number;
  bossBattlesPassed: string[];
  dailyChallengesCompleted: string[];
  savedSnippets: SavedSnippet[];
  knowledgeHistory: string[];
  selectedPath: string;
  bookmarks: { kind: string; id: string; title: string; path: string }[];
  streak: StudyStreak;
  settings: {
    theme: "light" | "dark" | "system";
    fontSize: number;
    notifications: boolean;
    sound: boolean;
  };
}
