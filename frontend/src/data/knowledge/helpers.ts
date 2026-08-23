import type {
  KnowledgeArticle,
  KnowledgeKind,
  KnowledgeLevel,
  KnowledgePractice,
  MethodReference,
  ReferenceRow,
} from "./types";
import { simpleDefinitions } from "./plainLanguage";

export const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[()_*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type ArticleInput = {
  title: string;
  definition: string;
  category: string;
  level?: KnowledgeLevel;
  kind?: KnowledgeKind;
  overview: string;
  whyUsed: string;
  syntax: string;
  example: string;
  output: string;
  keyIdeas: string[];
  operations?: ReferenceRow[];
  methods?: MethodReference[];
  mistakes: string[];
  bestPractices: string[];
  realWorld: string;
  interviewNote?: string;
  related: string[];
  tags?: string[];
  keywords?: string[];
  practice?: KnowledgePractice;
  challenge?: string;
};

export function article(input: ArticleInput): KnowledgeArticle {
  const id = slug(input.title);
  const definition = simpleDefinitions[input.title] || input.definition;
  const practice =
    input.practice ||
    defaultPractice(
      input.title,
      input.definition,
      input.example,
      input.output,
      input.challenge || `Use ${input.title} in a small, readable program.`,
    );
  return {
    id,
    title: input.title,
    name: input.title,
    definition,
    description: definition,
    category: input.category,
    level: input.level || "Beginner",
    kind: input.kind || "Concept",
    tags: input.tags || [input.category, input.title],
    keywords: input.keywords || [],
    overview: input.overview.startsWith(input.definition)
      ? input.overview.replace(input.definition, definition)
      : input.overview,
    whyUsed: input.whyUsed,
    syntax: input.syntax,
    example: input.example,
    output: input.output,
    howItWorks: input.keyIdeas,
    rules: input.keyIdeas,
    operations: input.operations || [],
    methods: input.methods || [],
    mistakes: input.mistakes,
    bestPractices: input.bestPractices,
    realWorld: input.realWorld,
    quickReference:
      input.operations?.slice(0, 8) ||
      input.keyIdeas.map((idea, index) => ({
        label: `Rule ${index + 1}`,
        meaning: idea,
      })),
    interviewNote:
      input.interviewNote ||
      `Be ready to explain ${input.title.toLowerCase()} in terms of behavior, trade-offs, and one concise example.`,
    related: input.related.map((value) => relatedAlias(slug(value))),
    practice,
  };
}

export function methodArticle(
  owner: string,
  method: MethodReference,
  related: string[],
  level: KnowledgeLevel = "Beginner",
): KnowledgeArticle {
  const title = `${owner}.${method.name}`;
  return article({
    title,
    definition: method.purpose,
    category: `${owner} Methods`,
    level,
    kind: "Method",
    overview: `${title} is a focused ${owner.toLowerCase()} operation. ${method.purpose}`,
    whyUsed: `It expresses this operation directly and keeps ${owner.toLowerCase()} code readable.`,
    syntax: method.syntax,
    example: method.example,
    output: method.result,
    keyIdeas: [
      method.note ||
        `The operation follows the documented ${owner} method contract.`,
      `Check whether the method mutates the object or returns a new value.`,
    ],
    operations: [
      {
        label: method.name,
        meaning: method.purpose,
        example: method.syntax,
        result: method.result,
      },
    ],
    mistakes: [
      `Using ${method.name} with an unsupported argument.`,
      "Assuming every method returns the modified collection.",
    ],
    bestPractices: [
      "Use descriptive variable names around the operation.",
      "Check edge cases such as empty values and missing items.",
    ],
    realWorld: `Use ${title} while cleaning, updating, or validating application data.`,
    related,
    keywords: [method.name, method.syntax, owner],
    challenge: `Create a ${owner.toLowerCase()} value and apply ${method.name} to it.`,
  });
}

const relatedAlias = (id: string) =>
  ({
    "mutable-vs-immutable": "built-in-data-type-reference",
    "shallow-copy": "built-in-data-type-reference",
    frozenset: "built-in-data-type-reference",
    trees: "searching",
    stacks: "stack",
    apis: "json",
    composition: "oop",
  })[id] || id;

export function defaultPractice(
  title: string,
  definition: string,
  code: string,
  output: string,
  challenge: string,
): KnowledgePractice {
  const distractors = [
    "It always converts a value to text.",
    "It is valid only inside a class definition.",
    "It always modifies every argument in place.",
  ];
  return {
    mcq: {
      question: `Which statement best describes ${title}?`,
      options: [definition, ...distractors],
      correctAnswer: definition,
      explanation: definition,
    },
    prediction: {
      question: "What does this example output?",
      code,
      answer: output,
      explanation: `The statements run in order and produce the documented result for ${title}.`,
    },
    challenge: {
      prompt: challenge,
      starterCode: code,
      hint: `Start from the reference example and change one value at a time.`,
    },
  };
}

export function topicArticle(input: {
  title: string;
  definition: string;
  category: string;
  level?: KnowledgeLevel;
  kind?: KnowledgeKind;
  syntax: string;
  example: string;
  output: string;
  details: string[];
  why: string;
  realWorld: string;
  related: string[];
  operations?: ReferenceRow[];
  methods?: MethodReference[];
  mistakes?: string[];
  practices?: string[];
  keywords?: string[];
  interviewNote?: string;
  challenge?: string;
}) {
  return article({
    ...input,
    overview: `${input.definition} ${input.details[0]}`,
    whyUsed: input.why,
    keyIdeas: input.details,
    mistakes: input.mistakes || [
      `Applying ${input.title.toLowerCase()} without checking input types or boundary cases.`,
      "Reading only the happy path and overlooking empty or missing values.",
    ],
    bestPractices: input.practices || [
      "Prefer explicit, readable code over clever shortcuts.",
      "Use a small example or test to confirm boundary behavior.",
    ],
  });
}
