import { describe, expect, it } from "vitest";
import { knowledge, primaryKnowledge } from "../data/knowledge";
import { knowledgeService } from "./knowledgeService";
import { wordsToKnow } from "../data/knowledge/plainLanguage";

const requestedTopics = [
  "Python Fundamentals",
  "Variables",
  "Data Types",
  "Operators",
  "Input and Output",
  "Conditional Statements",
  "Loops",
  "Strings",
  "Lists",
  "Tuples",
  "Sets",
  "Dictionaries",
  "Functions",
  "Scope",
  "Lambda Functions",
  "Recursion",
  "Comprehensions",
  "Modules",
  "Packages",
  "Exception Handling",
  "File Handling",
  "JSON",
  "OOP",
  "Classes and Objects",
  "Constructors",
  "Inheritance",
  "Polymorphism",
  "Encapsulation",
  "Abstraction",
  "Iterators",
  "Generators",
  "Decorators",
  "Regular Expressions",
  "Type Hints",
  "Dataclasses",
  "Date and Time",
  "Math",
  "Random",
  "Collections",
  "Itertools",
  "OS",
  "Pathlib",
  "Searching",
  "Sorting",
  "Stack",
  "Queue",
  "Time Complexity",
  "Testing",
  "Debugging",
  "Python Interview Concepts",
];

describe("knowledge content", () => {
  it("contains every requested core topic exactly once", () => {
    expect(primaryKnowledge).toHaveLength(50);
    expect(new Set(primaryKnowledge.map((item) => item.title))).toEqual(
      new Set(requestedTopics),
    );
  });

  it("has unique ids and complete structured content", () => {
    expect(new Set(knowledge.map((item) => item.id)).size).toBe(
      knowledge.length,
    );
    for (const item of knowledge) {
      expect(item.title).toBeTruthy();
      expect(item.definition).toBeTruthy();
      expect(item.overview).toBeTruthy();
      expect(item.whyUsed).toBeTruthy();
      expect(item.syntax).toBeTruthy();
      expect(item.example).toBeTruthy();
      expect(item.output).toBeTruthy();
      expect(item.howItWorks.length).toBeGreaterThan(0);
      expect(item.rules.length).toBeGreaterThan(0);
      expect(item.mistakes.length).toBeGreaterThan(0);
      expect(item.bestPractices.length).toBeGreaterThan(0);
      expect(item.practice.mcq.options).toHaveLength(4);
      expect(item.practice.mcq.options).toContain(
        item.practice.mcq.correctAnswer,
      );
      expect(item.practice.prediction.answer).toBeTruthy();
      expect(item.practice.challenge.starterCode).toBeTruthy();
    }
  });

  it("resolves every related-topic link", () => {
    const ids = new Set(knowledge.map((item) => item.id));
    const broken = knowledge.flatMap((item) =>
      item.related
        .filter((id) => !ids.has(id))
        .map((id) => `${item.id} -> ${id}`),
    );
    expect(broken).toEqual([]);
  });

  it.each([
    ["append", "List.append()"],
    ["IndexError", "IndexError"],
    ["inheritance", "Inheritance"],
    ["enumerate", "enumerate()"],
    ["recursion", "Recursion"],
  ])("finds %s in indexed fields", (query, title) => {
    expect(knowledgeService.search(query).map((item) => item.title)).toContain(
      title,
    );
  });

  it("applies level and kind filters", () => {
    expect(
      knowledgeService
        .search("", "Advanced", "OOP")
        .every((item) => item.level === "Advanced" && item.kind === "OOP"),
    ).toBe(true);
    expect(knowledgeService.search("", "", "Error").length).toBeGreaterThan(10);
  });

  it("uses plain core definitions and explains technical words", () => {
    const variables = knowledgeService.get("variables"),
      lists = knowledgeService.get("lists");
    expect(variables?.definition).toBe(
      "A variable is a name that points to a value in your program.",
    );
    expect(lists && wordsToKnow(lists).map((item) => item.word)).toContain(
      "mutable",
    );
  });
});
