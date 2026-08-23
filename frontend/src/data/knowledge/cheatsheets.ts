import { topicArticle } from "./helpers";

const sheets = [
  {
    name: "Python Basics",
    syntax: "# comment\nname = 'Asha'\nprint(f'Hello {name}')",
    tips: [
      "Indent blocks with four spaces.",
      "Names are case-sensitive.",
      "Use type(value) to inspect a type.",
    ],
    related: ["Python Fundamentals", "Variables", "Data Types"],
  },
  {
    name: "Conditions",
    syntax: "if condition:\n    ...\nelif other:\n    ...\nelse:\n    ...",
    tips: [
      "Use == for equality and is for identity.",
      "and/or short-circuit.",
      "Empty values are usually falsey.",
    ],
    related: ["Conditional Statements", "Operators"],
  },
  {
    name: "Loops",
    syntax: "for item in iterable:\n    ...\nwhile condition:\n    ...",
    tips: [
      "enumerate() gives index and value.",
      "zip() traverses together.",
      "break exits; continue skips.",
    ],
    related: ["Loops", "Iterators"],
  },
  {
    name: "Strings",
    syntax: "text[0]\ntext[-1]\ntext[start:stop:step]",
    tips: [
      "Strings are immutable.",
      "split() separates; join() combines.",
      "Use f-strings for readable formatting.",
    ],
    related: ["Strings", "String Methods"],
  },
  {
    name: "Lists",
    syntax: "items.append(value)\nitems[index] = value\nitems[start:stop]",
    tips: [
      "Lists are mutable and ordered.",
      "sort() mutates; sorted() returns new.",
      "copy() is shallow.",
    ],
    related: ["Lists", "List Methods"],
  },
  {
    name: "Dictionaries",
    syntax:
      "value = data[key]\nsafe = data.get(key, default)\nfor key, value in data.items(): ...",
    tips: [
      "Keys must be hashable.",
      "Membership tests keys.",
      "Insertion order is preserved.",
    ],
    related: ["Dictionaries", "Dictionary Methods"],
  },
  {
    name: "Functions",
    syntax:
      "def name(required, optional=0, *args, **kwargs):\n    return result",
    tips: [
      "Parameters define; arguments supply.",
      "Avoid mutable defaults.",
      "A missing return produces None.",
    ],
    related: ["Functions", "Scope"],
  },
  {
    name: "OOP",
    syntax:
      "class Name:\n    def __init__(self, value):\n        self.value = value",
    tips: [
      "self is the instance.",
      "Use super() for cooperative inheritance.",
      "Prefer composition for has-a relationships.",
    ],
    related: ["OOP", "Classes and Objects", "Inheritance"],
  },
  {
    name: "File Handling",
    syntax:
      "with open(path, 'r', encoding='utf-8') as file:\n    text = file.read()",
    tips: [
      "with closes resources reliably.",
      "Text mode uses str; binary mode uses bytes.",
      "w truncates existing files.",
    ],
    related: ["File Handling", "Pathlib"],
  },
  {
    name: "Exceptions",
    syntax:
      "try:\n    ...\nexcept SpecificError as exc:\n    ...\nfinally:\n    ...",
    tips: [
      "Catch narrow expected errors.",
      "Use else for the success path.",
      "Do not silently swallow Exception.",
    ],
    related: ["Exception Handling", "Error Guide"],
  },
];

export const cheatSheetArticles = sheets.map((sheet) =>
  topicArticle({
    title: `${sheet.name} Cheat Sheet`,
    definition: `A compact revision guide for ${sheet.name.toLowerCase()}.`,
    category: "Cheat Sheets",
    kind: "Cheat Sheet",
    syntax: sheet.syntax,
    example: sheet.syntax,
    output: "See each statement's result in the linked detailed reference.",
    details: sheet.tips,
    why: "Use this sheet for rapid recall before practice, debugging, or an exam.",
    realWorld:
      "Scan the syntax, then open a related article when a rule needs more context.",
    related: sheet.related,
    keywords: ["cheat sheet", sheet.name, ...sheet.tips],
    challenge: `Write one tiny example using the ${sheet.name.toLowerCase()} syntax without looking back.`,
  }),
);
