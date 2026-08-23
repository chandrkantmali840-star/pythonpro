import type { KnowledgeArticle } from "./types";

export const simpleDefinitions: Record<string, string> = {
  "Python Fundamentals":
    "Python is a programming language designed to be clear and easy to read.",
  Variables: "A variable is a name that points to a value in your program.",
  "Data Types":
    "A data type tells Python what kind of value something is and what it can do.",
  Operators:
    "Operators are symbols and words that calculate, compare, or check values.",
  "Input and Output":
    "Input brings information into a program, and output shows the result.",
  "Conditional Statements":
    "Conditions let a program choose which code to run.",
  Loops: "Loops repeat code for each item or until a condition changes.",
  Strings: "A string stores text as a sequence of characters.",
  Lists: "A list stores items in order and can be changed after it is created.",
  Tuples:
    "A tuple stores items in order and cannot be changed after it is created.",
  Sets: "A set stores unique items and is useful for fast membership checks.",
  Dictionaries:
    "A dictionary stores values under unique keys, like labels in a lookup table.",
  Functions:
    "A function is a named block of code that performs a task and can be reused.",
  Scope: "Scope decides where a variable name can be used.",
  "Lambda Functions":
    "A lambda is a small unnamed function written as one expression.",
  Recursion:
    "Recursion happens when a function calls itself to solve a smaller version of a problem.",
  Comprehensions:
    "A comprehension is a short way to build a collection from other values.",
  Modules: "A module is a Python file that groups related code.",
  Packages: "A package is a folder-like group of related Python modules.",
  "Exception Handling":
    "Exception handling lets a program respond safely when something goes wrong.",
  "File Handling":
    "File handling lets a program read saved data and write new data.",
  JSON: "JSON is a text format used to store and exchange simple data.",
  OOP: "Object-oriented programming groups related data and actions inside objects.",
  "Classes and Objects":
    "A class is a plan for creating objects, and an object is one item made from that plan.",
  Constructors: "A constructor sets up a new object with its starting values.",
  Inheritance:
    "Inheritance lets one class reuse and improve another class's behavior.",
  Polymorphism:
    "Polymorphism lets different objects use the same action in their own way.",
  Encapsulation:
    "Encapsulation keeps data and the code that protects it together.",
  Abstraction:
    "Abstraction shows the useful controls while hiding unnecessary details.",
  Iterators:
    "An iterator gives one item at a time and remembers its current position.",
  Generators:
    "A generator creates values one at a time instead of storing them all at once.",
  Decorators:
    "A decorator adds or changes behavior around a function or class.",
  "Regular Expressions":
    "A regular expression is a pattern used to find or check text.",
  "Type Hints":
    "Type hints describe the kinds of values a function expects and returns.",
  Dataclasses:
    "A dataclass is a shorter way to create a class mainly used for storing data.",
  "Date and Time":
    "Python's date and time tools represent dates, times, and lengths of time.",
  Math: "The math module provides common mathematical functions and constants.",
  Random:
    "The random module creates values that appear random for games, samples, and simulations.",
  Collections:
    "The collections module provides useful containers for common data tasks.",
  Itertools:
    "The itertools module helps process values one at a time with little memory.",
  OS: "The os module helps Python work with the operating system and environment settings.",
  Pathlib:
    "Pathlib provides clear, object-based tools for file and folder paths.",
  Searching: "Searching means finding a value or checking whether it exists.",
  Sorting: "Sorting places values into a chosen order.",
  Stack: "A stack removes the newest item first, like a stack of plates.",
  Queue: "A queue removes the oldest item first, like people waiting in line.",
  "Time Complexity":
    "Time complexity describes how work grows when the amount of input grows.",
  Testing:
    "Testing checks that code gives the expected result for known situations.",
  Debugging:
    "Debugging means finding the reason for a problem and fixing it carefully.",
  "Python Interview Concepts":
    "Interview concepts are important Python ideas you should be able to explain and use.",
};

const glossary: Record<string, string> = {
  object: "A value Python can store and work with.",
  mutable: "Can be changed after it is created.",
  immutable: "Cannot be changed after it is created.",
  iterable: "Something a loop can read one item at a time.",
  iterator: "An object that gives the next item when asked.",
  method: "A function that belongs to an object or class.",
  instance: "One object created from a class.",
  attribute: "A value or function stored on an object.",
  scope: "The part of a program where a name is available.",
  exception: "A Python object that reports a problem during execution.",
  hashable: "Stable enough to be used as a dictionary key or set item.",
  callback: "A function passed to other code so it can be called later.",
  lazy: "Produces values only when they are requested.",
  recursion:
    "A function solving a problem by calling itself on a smaller case.",
  protocol: "A set of operations an object agrees to support.",
  "time complexity":
    "A way to describe how an algorithm's work grows with its input.",
};

export function wordsToKnow(article: KnowledgeArticle) {
  const text = [
    article.definition,
    article.overview,
    ...article.howItWorks,
    ...article.rules,
  ]
    .join(" ")
    .toLowerCase();
  return Object.entries(glossary)
    .filter(
      ([word]) =>
        text.includes(word) ||
        (word === "mutable" && text.includes("can be changed after")) ||
        (word === "immutable" && text.includes("cannot be changed after")),
    )
    .slice(0, 6)
    .map(([word, meaning]) => ({ word, meaning }));
}
