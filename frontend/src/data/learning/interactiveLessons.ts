import { lessons } from "../content";
import type { MicroActivity } from "../../types";
type Profile = {
  code: string;
  question: string;
  options: string[];
  answer: string;
  fill: string;
  blank: string;
  bug: string;
  fix: string;
  lines: string[];
  output: string;
  expected: string;
};
const profiles: Record<string, Profile> = {
  Variables: {
    code: 'name = "Yash"\nprint(name)',
    question: "What value is stored in name?",
    options: ["Yash", "name", "str", "Nothing"],
    answer: "Yash",
    fill: "score ___ 10",
    blank: "=",
    bug: '2name = "Ana"\nprint(2name)',
    fix: "name2",
    lines: ['name = "Yash"', 'greeting = "Hello " + name', "print(greeting)"],
    output: "Hello Yash",
    expected: "Hello",
  },
  "For Loops": {
    code: "for i in range(3):\n    print(i)",
    question: "What is the final number printed?",
    options: ["0", "1", "2", "3"],
    answer: "2",
    fill: "for i ___ range(5):",
    blank: "in",
    bug: "for i in range(3)\n    print(i)",
    fix: ":",
    lines: ["for number in range(1, 4):", "    print(number)", 'print("Done")'],
    output: "1\n2\n3",
    expected: "range",
  },
  "Conditional Statements": {
    code: 'age = 20\nprint("Adult" if age >= 18 else "Minor")',
    question: "What is printed?",
    options: ["Adult", "Minor", "True", "Error"],
    answer: "Adult",
    fill: "if score >= 50___",
    blank: ":",
    bug: 'if age >= 18\nprint("Adult")',
    fix: ":",
    lines: ["age = 20", "if age >= 18:", '    print("Adult")'],
    output: "Adult",
    expected: "if",
  },
  Strings: {
    code: 'word = "Python"\nprint(word[-1])',
    question: "What is printed?",
    options: ["P", "y", "n", "Error"],
    answer: "n",
    fill: "name = ___Yash___",
    blank: '"',
    bug: 'name = "Ada"\nprint(Name)',
    fix: "name",
    lines: ['word = "python"', "result = word.upper()", "print(result)"],
    output: "PYTHON",
    expected: "upper",
  },
  Lists: {
    code: 'fruits = ["Apple", "Mango", "Banana"]\nprint(fruits[1])',
    question: "What does fruits[1] return?",
    options: ["Apple", "Mango", "Banana", "Error"],
    answer: "Mango",
    fill: 'fruits.___("Orange")',
    blank: "append",
    bug: 'fruits = ["Apple", "Mango"]\nprint(fruits[2])',
    fix: "IndexError",
    lines: [
      'fruits = ["Apple", "Mango"]',
      'fruits.append("Orange")',
      "print(fruits)",
    ],
    output: "['Apple', 'Mango', 'Orange']",
    expected: "append",
  },
  Dictionaries: {
    code: 'student = {"name": "Asha", "score": 90}\nprint(student["score"])',
    question: "What is printed?",
    options: ["name", "score", "90", "Error"],
    answer: "90",
    fill: 'student___"name"___',
    blank: "[",
    bug: 'data = {"x": 1}\nprint(data["y"])',
    fix: "KeyError",
    lines: [
      'student = {"name": "Asha"}',
      'student["score"] = 90',
      "print(student)",
    ],
    output: "{'name': 'Asha', 'score': 90}",
    expected: "[",
  },
  Functions: {
    code: "def double(value):\n    return value * 2\nprint(double(4))",
    question: "What does double(4) return?",
    options: ["2", "4", "8", "None"],
    answer: "8",
    fill: "___ greet(name):",
    blank: "def",
    bug: "def add(a, b):\n    a + b\nprint(add(2, 3))",
    fix: "return",
    lines: [
      "def greet(name):",
      '    return "Hello " + name',
      'print(greet("Yash"))',
    ],
    output: "Hello Yash",
    expected: "return",
  },
  "Object-Oriented Programming": {
    code: 'class Cat:\n    sound = "meow"\nprint(Cat.sound)',
    question: "What is printed?",
    options: ["Cat", "sound", "meow", "Error"],
    answer: "meow",
    fill: "___ Player:",
    blank: "class",
    bug: "class User:\n    def __init__(self, name):\n        name = name",
    fix: "self.name",
    lines: [
      "class Greeter:",
      "    def hello(self):",
      '        return "Hello"',
      "print(Greeter().hello())",
    ],
    output: "Hello",
    expected: "class",
  },
};
const fallback = (topic: string): Profile => ({
  code: `topic = "${topic}"\nprint(f"Learning {topic}")`,
  question: "What is printed by this code?",
  options: [topic, "topic", "None", "Error"],
  answer: topic,
  fill: "value ___ 42",
  blank: "=",
  bug: "value = 42\nprint(Value)",
  fix: "value",
  lines: [
    `topic = "${topic}"`,
    'message = f"Learning {topic}"',
    "print(message)",
  ],
  output: `Learning ${topic}`,
  expected: "print",
});

const fixedBug = (profile: Profile) => {
  if (profile.bug.includes("2name"))
    return profile.bug.replaceAll("2name", "name2");
  if (profile.bug.startsWith("for "))
    return profile.bug.replace("range(3)", "range(3):");
  if (profile.bug.startsWith("if ")) {
    const [condition, body] = profile.bug.split("\n");
    return `${condition}:\n    ${body.trim()}`;
  }
  if (profile.bug.includes("print(Name)"))
    return profile.bug.replace("Name", "name");
  if (profile.bug.includes("fruits[2]"))
    return profile.bug.replace("fruits[2]", "fruits[1]");
  if (profile.bug.includes('data["y"]'))
    return profile.bug.replace('data["y"]', 'data.get("y")');
  if (profile.bug.includes("    a + b"))
    return profile.bug.replace("    a + b", "    return a + b");
  if (profile.bug.includes("        name = name"))
    return profile.bug.replace(
      "        name = name",
      "        self.name = name",
    );
  return profile.bug.replace("Value", "value");
};
const bugFixTokens = (profile: Profile) => {
  if (profile.bug.includes("2name")) return ["name2"];
  if (profile.bug.startsWith("for ") || profile.bug.startsWith("if "))
    return [":"];
  if (profile.bug.includes("print(Name)")) return ["print(name)"];
  if (profile.bug.includes("fruits[2]")) return ["fruits[1]"];
  if (profile.bug.includes('data["y"]')) return [".get("];
  if (profile.bug.includes("    a + b")) return ["return"];
  if (profile.bug.includes("        name = name")) return ["self.name"];
  return ["print(value)"];
};
const xp = {
  concept: 5,
  predict: 10,
  "try-code": 15,
  "fill-code": 15,
  "bug-hunt": 20,
  rearrange: 15,
  "mini-challenge": 25,
  "quick-quiz": 10,
} as const;
export function activitiesForLesson(lessonId: string): MicroActivity[] {
  const lesson = lessons.find((x) => x.id === lessonId);
  if (!lesson) return [];
  const p = profiles[lesson.module] || fallback(lesson.module),
    base = (
      kind: MicroActivity["kind"],
      title: string,
      instruction: string,
      explanation: string,
    ): MicroActivity => ({
      id: `${lesson.id}-${kind}`,
      lessonId: lesson.id,
      topic: lesson.module,
      kind,
      title,
      instruction,
      explanation,
      xp: xp[kind],
    });
  return [
    {
      ...base("concept", "Micro lesson", lesson.overview, lesson.explanation),
      code: p.code,
    },
    {
      ...base(
        "predict",
        "Predict the output",
        p.question,
        `Correct: ${p.answer}. Trace values one expression at a time.`,
      ),
      code: p.code,
      options: p.options,
      correctAnswer: p.answer,
    },
    {
      ...base(
        "try-code",
        "Try it yourself",
        `Edit the program so it produces: ${p.output}`,
        "Small edits are the fastest way to test your mental model.",
      ),
      starterCode: p.code,
      expectedCode: p.expected,
      expectedOutput: p.output,
      validation: { strategy: "output" },
      hints: [
        "Change only one meaningful part first.",
        `Your code should use ${p.expected}.`,
      ],
      solution: p.lines.join("\n"),
    },
    {
      ...base(
        "fill-code",
        "Fill the missing code",
        "Replace the blank with valid Python syntax.",
        `The missing token is ${p.blank}.`,
      ),
      template: p.fill,
      blankAnswers:
        lesson.module === "Dictionaries"
          ? ["[", "]"]
          : Array.from(
              { length: (p.fill.match(/___/g) || []).length },
              () => p.blank,
            ),
      correctAnswer: p.blank,
      hints: [
        "Read the expression aloud.",
        `The answer contains ${p.blank.length} character(s).`,
      ],
    },
    {
      ...base(
        "bug-hunt",
        "Bug Hunter",
        "Fix or identify the error in this program.",
        `The important correction is ${p.fix}.`,
      ),
      starterCode: p.bug,
      expectedCode: p.fix,
      validation: {
        strategy: "custom",
        requiredTokens: bugFixTokens(p),
      },
      hints: [
        "Check names, punctuation, indentation, and boundaries.",
        `Focus on: ${p.fix}.`,
      ],
      solution: fixedBug(p),
    },
    {
      ...base(
        "rearrange",
        "Arrange the code",
        "Move the lines into a valid, logical order.",
        "Python runs statements top to bottom, and indentation expresses blocks.",
      ),
      lines: [...p.lines].reverse(),
      correctOrder: p.lines,
    },
    {
      ...base(
        "mini-challenge",
        "Mini challenge",
        `Write a short ${lesson.module} program that includes ${p.expected}.`,
        "A focused working solution is more valuable than a large unfinished one.",
      ),
      starterCode: "# Build your solution here\n",
      expectedCode: p.expected,
      expectedOutput: p.output,
      validation: { strategy: "structure", requiredTokens: [p.expected] },
      hints: [
        "Reuse the concept from the previous activity.",
        `Include ${p.expected} in your solution.`,
      ],
      solution: p.lines.join("\n"),
    },
    {
      ...base(
        "quick-quiz",
        "Quick quiz",
        `Which statement best shows understanding of ${lesson.module}?`,
        "Readable code makes behavior and intent easy to verify.",
      ),
      options: [
        "Use clear names and test edge cases.",
        "Hide every error.",
        "Prefer global state.",
        "Skip input validation.",
      ],
      correctAnswer: "Use clear names and test edge cases.",
    },
  ];
}
