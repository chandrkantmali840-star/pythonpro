import { topicArticle } from "./helpers";

const errors = [
  {
    name: "SyntaxError",
    meaning: "Python could not parse the source as valid syntax.",
    broken: "if ready\n    print('Go')",
    fixed: "ready = True\nif ready:\n    print('Go')",
    output: "Go",
    cause: "A required colon was missing.",
    avoid:
      "Read the location and nearby tokens; the actual omission may be just before the marker.",
  },
  {
    name: "IndentationError",
    meaning: "Block indentation is missing or inconsistent.",
    broken: "if True:\nprint('Go')",
    fixed: "if True:\n    print('Go')",
    output: "Go",
    cause: "The statement belonging to if was not indented.",
    avoid:
      "Use four spaces consistently and let an editor show invisible whitespace.",
  },
  {
    name: "NameError",
    meaning: "A name could not be found in the active scopes.",
    broken: "print(total)  # total was never assigned",
    fixed: "total = 12\nprint(total)",
    output: "12",
    cause: "The code read an undefined name.",
    avoid: "Check spelling, case, execution order, and scope.",
  },
  {
    name: "TypeError",
    meaning:
      "An operation received an object of an unsupported type or call shape.",
    broken: "print('Age: ' + 18)",
    fixed: "print('Age: ' + str(18))",
    output: "Age: 18",
    cause: "String concatenation cannot directly combine str and int.",
    avoid: "Define clear input types and convert at system boundaries.",
  },
  {
    name: "ValueError",
    meaning:
      "An argument has the right general type but an unacceptable value.",
    broken: "number = int('three')",
    fixed: "number = int('3')\nprint(number)",
    output: "3",
    cause: "The string is not a valid base-10 integer literal.",
    avoid:
      "Validate external text and catch ValueError only where recovery is possible.",
  },
  {
    name: "IndexError",
    meaning: "A sequence index is outside the valid range.",
    broken: "items = ['a', 'b']\nprint(items[2])",
    fixed: "items = ['a', 'b']\nprint(items[-1])",
    output: "b",
    cause: "A two-item list has valid positive indexes 0 and 1.",
    avoid:
      "Use index < len(sequence), iteration, or a deliberate boundary check.",
  },
  {
    name: "KeyError",
    meaning: "A requested mapping key is absent.",
    broken: "profile = {'name': 'Asha'}\nprint(profile['score'])",
    fixed: "profile = {'name': 'Asha'}\nprint(profile.get('score', 0))",
    output: "0",
    cause: "Bracket lookup requires the key to exist.",
    avoid:
      "Use get() when absence is normal; use [] when missing data is exceptional.",
  },
  {
    name: "AttributeError",
    meaning: "An object does not provide the requested attribute.",
    broken: "items = (1, 2)\nitems.append(3)",
    fixed: "items = [1, 2]\nitems.append(3)\nprint(items)",
    output: "[1, 2, 3]",
    cause: "Tuples do not have the mutable-list append() method.",
    avoid: "Confirm the object's type and consult dir() or documentation.",
  },
  {
    name: "ZeroDivisionError",
    meaning:
      "A numeric division or remainder operation used zero as the divisor.",
    broken: "print(10 / 0)",
    fixed: "divisor = 2\nprint(10 / divisor)",
    output: "5.0",
    cause: "Division by numeric zero is undefined.",
    avoid: "Validate a divisor before the operation when zero is possible.",
  },
  {
    name: "FileNotFoundError",
    meaning:
      "A requested file or directory does not exist at the resolved path.",
    broken: "open('missing.txt').read()",
    fixed:
      "from pathlib import Path\npath = Path('missing.txt')\nprint(path.exists())",
    output: "False",
    cause:
      "The relative path was resolved from the current working directory and no file existed there.",
    avoid:
      "Use explicit Path objects, check configuration, and handle absence at the appropriate boundary.",
  },
  {
    name: "ImportError",
    meaning: "An import could not load a requested module name or symbol.",
    broken: "from math import missing_function",
    fixed: "from math import sqrt\nprint(sqrt(16))",
    output: "4.0",
    cause: "The math module has no exported name missing_function.",
    avoid:
      "Check the module path, symbol spelling, environment, and circular imports.",
  },
];

export const errorArticles = errors.map((error) =>
  topicArticle({
    title: error.name,
    definition: error.meaning,
    category: "Error Guide",
    level:
      error.name === "SyntaxError" ||
      error.name === "NameError" ||
      error.name === "TypeError"
        ? "Beginner"
        : "Intermediate",
    kind: "Error",
    syntax: error.name,
    example: error.fixed,
    output: error.output,
    details: [
      `Why it happens: ${error.cause}`,
      `Broken code: ${error.broken.replace(/\n/g, " / ")}`,
      `Correct approach: ${error.fixed.replace(/\n/g, " / ")}`,
    ],
    why: "Recognizing the exception type narrows the failed assumption and guides a focused correction.",
    realWorld:
      "Use the final traceback line and failing operation to reproduce and fix this error.",
    related: ["Error Guide", "Debugging", "Exception Handling"],
    mistakes: [
      "Hiding the failure with a broad except block.",
      "Changing code before reproducing and understanding the failing input.",
    ],
    practices: [
      error.avoid,
      "Add a focused test for the corrected boundary case.",
    ],
    operations: [
      {
        label: "Broken code",
        meaning: error.cause,
        example: error.broken,
        result: error.name,
      },
      {
        label: "Corrected code",
        meaning: error.avoid,
        example: error.fixed,
        result: error.output,
      },
    ],
    keywords: [error.name, error.meaning, error.cause],
  }),
);

export const errorGuide = topicArticle({
  title: "Error Guide",
  definition:
    "Python exceptions identify the category and context of failures detected during parsing or execution.",
  category: "Error Guide",
  kind: "Error",
  syntax: "Traceback (most recent call last):\n    ...\nExceptionType: message",
  example:
    "try:\n    int('not-a-number')\nexcept ValueError as exc:\n    print(type(exc).__name__)",
  output: "ValueError",
  details: [
    "Read a traceback from the final exception line upward to the first relevant application frame.",
    "Syntax and indentation failures occur before normal execution; most other exceptions occur at runtime.",
    "Catch only errors a layer can meaningfully recover from, and preserve context when translating exceptions.",
  ],
  why: "Specific error knowledge turns debugging into evidence-based diagnosis.",
  realWorld:
    "Diagnose a failed request or invalid imported file without hiding the cause.",
  related: ["Debugging", "Exception Handling", "Testing"],
  keywords: errors.flatMap((x) => [x.name, x.meaning]),
});
