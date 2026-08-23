import { topicArticle } from "./helpers";

export const functionArticles = [
  topicArticle({
    title: "Functions",
    definition:
      "A function is a reusable callable block with parameters, local state, and an optional return value.",
    category: "Functions",
    syntax: "def name(parameters):\n    return value",
    example:
      "def total(price, quantity=1):\n    return price * quantity\nprint(total(12, quantity=3))",
    output: "36",
    details: [
      "def binds a function object to a name; the body runs only when called.",
      "Parameters define the interface; arguments are values supplied by a caller.",
      "Arguments may be positional or keyword; defaults are evaluated once when def executes.",
      "*args collects extra positional arguments into a tuple; **kwargs collects extra keyword arguments into a dictionary.",
      "return ends the call and supplies a value; falling off the end returns None.",
    ],
    why: "Functions reduce repetition, create testable units, and name business operations.",
    realWorld: "Calculate an invoice total or validate a registration payload.",
    related: ["Scope", "Lambda Functions", "Recursion", "Type Hints"],
    mistakes: [
      "Calling a function before its definition has executed.",
      "Using a mutable object as a default and unintentionally sharing it between calls.",
      "Printing a result when callers need a returned value.",
    ],
    practices: [
      "Keep one clear responsibility and document non-obvious behavior.",
      "Prefer keyword-only parameters for ambiguous options.",
      "Annotate public interfaces where type checking helps.",
    ],
    keywords: [
      "def",
      "call",
      "parameter",
      "argument",
      "return",
      "default",
      "positional",
      "keyword",
      "*args",
      "**kwargs",
    ],
  }),
  topicArticle({
    title: "Iterators",
    definition:
      "An iterator produces one item at a time through __next__() and remembers its traversal state.",
    category: "Iteration",
    level: "Intermediate",
    syntax: "iterator = iter(iterable)\nitem = next(iterator)",
    example:
      "iterator = iter(['a', 'b'])\nprint(next(iterator))\nprint(next(iterator))",
    output: "a\nb",
    details: [
      "An iterable supplies an iterator through __iter__(); an iterator returns itself from __iter__().",
      "next() raises StopIteration when the sequence is exhausted.",
      "A for loop handles iter(), next(), and StopIteration automatically.",
    ],
    why: "The iterator protocol lets many data sources share one streaming interface.",
    realWorld:
      "Consume file lines, database rows, or generated values without loading everything.",
    related: ["Loops", "Generators", "Itertools"],
    keywords: ["iter", "next", "iterable", "iterator", "StopIteration"],
  }),
  topicArticle({
    title: "Generators",
    definition:
      "A generator is an iterator produced by a function containing yield or by a generator expression.",
    category: "Iteration",
    level: "Intermediate",
    syntax: "def generate():\n    yield value",
    example:
      "def countdown(n):\n    while n:\n        yield n\n        n -= 1\nprint(list(countdown(3)))",
    output: "[3, 2, 1]",
    details: [
      "Calling a generator function returns a generator without running the body immediately.",
      "Each next() resumes after the previous yield with local state preserved.",
      "Generators are usually single-pass and can model large or unbounded streams.",
    ],
    why: "Lazy production can reduce memory use and separate data pipelines into stages.",
    realWorld: "Stream log records or batches from a large source.",
    related: ["Iterators", "Comprehensions", "Itertools"],
    mistakes: [
      "Trying to iterate the same exhausted generator again.",
      "Converting a generator to a list when streaming was the goal.",
    ],
    keywords: ["yield", "lazy", "generator expression", "send"],
  }),
  topicArticle({
    title: "Decorators",
    definition:
      "A decorator transforms a function or class and rebinds its name to the result.",
    category: "Functions",
    level: "Advanced",
    syntax: "@decorator\ndef function():\n    ...",
    example:
      "from functools import wraps\ndef traced(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        print(fn.__name__)\n        return fn(*args, **kwargs)\n    return wrapper\n@traced\ndef greet(): return 'Hi'\nprint(greet())",
    output: "greet\nHi",
    details: [
      "@decorator above a definition is equivalent to name = decorator(name).",
      "A closure can retain the wrapped callable and configuration.",
      "functools.wraps preserves metadata used by help, debugging, and tools.",
    ],
    why: "Decorators apply cross-cutting behavior such as authorization, caching, registration, or timing.",
    realWorld: "Protect a web route or cache an expensive pure function.",
    related: ["Functions", "Scope", "OOP"],
    mistakes: [
      "Forgetting to return the wrapper or its result.",
      "Dropping *args/**kwargs and function metadata.",
    ],
    keywords: ["decorator", "wrapper", "functools.wraps", "closure"],
  }),
];
