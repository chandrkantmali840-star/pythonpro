export type KnowledgeLevel = "Beginner" | "Intermediate" | "Advanced";
export type KnowledgeKind =
  | "Concept"
  | "Syntax"
  | "Method"
  | "Function"
  | "Error"
  | "OOP"
  | "Data Structure"
  | "Cheat Sheet";

export type ReferenceRow = {
  label: string;
  meaning: string;
  example?: string;
  result?: string;
};

export type MethodReference = {
  name: string;
  purpose: string;
  syntax: string;
  example: string;
  result: string;
  note?: string;
};

export type KnowledgePractice = {
  mcq: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  prediction: {
    question: string;
    code: string;
    answer: string;
    explanation: string;
  };
  challenge: {
    prompt: string;
    starterCode: string;
    hint: string;
  };
};

export interface KnowledgeArticle {
  id: string;
  title: string;
  name: string;
  definition: string;
  description: string;
  category: string;
  level: KnowledgeLevel;
  kind: KnowledgeKind;
  tags: string[];
  keywords: string[];
  overview: string;
  whyUsed: string;
  syntax: string;
  example: string;
  output: string;
  howItWorks: string[];
  rules: string[];
  operations: ReferenceRow[];
  methods: MethodReference[];
  mistakes: string[];
  bestPractices: string[];
  realWorld: string;
  quickReference: ReferenceRow[];
  interviewNote: string;
  related: string[];
  practice: KnowledgePractice;
}
