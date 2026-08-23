import { topicArticle } from "./helpers";

export const fundamentalsArticles = [
  topicArticle({
    title: "Python Fundamentals",
    definition:
      "Python is a high-level, general-purpose language built around readable code and objects.",
    category: "Python Fundamentals",
    syntax: 'message = "Hello, Python"\nprint(message)',
    example: 'language = "Python"\nprint(f"Learning {language}")',
    output: "Learning Python",
    details: [
      "A Python program executes statements from top to bottom unless control flow changes the order.",
      "Indentation defines blocks, names are case-sensitive, and comments begin with #.",
      "Values are objects; variables are names that refer to those objects.",
    ],
    why: "Python is used for automation, web services, data work, testing, teaching, and general software development.",
    realWorld:
      "A short script can rename files, validate a spreadsheet export, or call a web API.",
    related: ["Variables", "Data Types", "Input and Output"],
    keywords: ["python basics", "statement", "indentation", "comment"],
    challenge:
      "Print your name, course, and one reason you are learning Python.",
  }),
  topicArticle({
    title: "Variables",
    definition:
      "A variable is a name bound to an object; assignment creates or changes that binding.",
    category: "Python Fundamentals",
    syntax: "name = value",
    example: "score = 72\nscore = score + 8\nprint(score)",
    output: "80",
    details: [
      "Python does not require a type declaration before assignment.",
      "Names may contain letters, digits, and underscores but cannot start with a digit or be a keyword.",
      "Assignment copies a reference, not necessarily the underlying object.",
    ],
    why: "Names let programs retain values, express calculations, and pass data between operations.",
    realWorld:
      "Store a cart total, authenticated user, file path, or current game score.",
    related: ["Data Types", "Scope", "Mutable vs Immutable"],
    mistakes: [
      "Using an undefined name, which raises NameError.",
      "Shadowing built-ins with names such as list or str.",
    ],
    practices: [
      "Use snake_case descriptive names.",
      "Use constants such as TAX_RATE by convention for values that should not change.",
    ],
    keywords: ["assignment", "name", "binding", "dynamic typing"],
  }),
  topicArticle({
    title: "Data Types",
    definition:
      "A data type determines a value's behavior, supported operations, and representation.",
    category: "Python Fundamentals",
    syntax: "type(value)",
    example:
      'values = [42, 3.5, "Python", True]\nprint([type(x).__name__ for x in values])',
    output: "['int', 'float', 'str', 'bool']",
    details: [
      "Core scalar types include int, float, complex, bool, str, bytes, and NoneType.",
      "Core containers include list, tuple, set, frozenset, dict, and range.",
      "Type belongs to the object, while a variable can later refer to an object of another type.",
    ],
    why: "Understanding types prevents invalid operations and helps choose the right representation.",
    realWorld:
      "An order can use a decimal-compatible amount, a string identifier, a list of items, and a Boolean status.",
    related: ["Variables", "Mutable vs Immutable", "Lists"],
    keywords: ["int", "float", "str", "bool", "list", "tuple", "set", "dict"],
  }),
  topicArticle({
    title: "Operators",
    definition:
      "Operators combine, compare, or transform values using compact syntax.",
    category: "Python Fundamentals",
    syntax: "left operator right",
    example: "total = 5 + 2 * 3\nprint(total, 7 in [5, 7])",
    output: "11 True",
    details: [
      "Arithmetic operators perform numeric work; comparison operators produce booleans.",
      "Logical operators short-circuit and return an operand, not necessarily a bool.",
      "Identity checks object identity with is; equality compares values with ==.",
    ],
    why: "Operators express calculations, decisions, membership tests, and bit-level work.",
    realWorld:
      "Calculate totals, compare thresholds, combine validation rules, and test permissions.",
    related: [
      "Data Types",
      "Conditional Statements",
      "Python Interview Concepts",
    ],
    keywords: [
      "arithmetic",
      "comparison",
      "logical",
      "identity",
      "membership",
      "bitwise",
    ],
    interviewNote:
      "Know the difference between == and is, / and //, and logical short-circuiting.",
  }),
  topicArticle({
    title: "Input and Output",
    definition:
      "Input reads data into a program; output presents data to a user, file, or stream.",
    category: "Python Fundamentals",
    syntax: 'name = input("Name: ")\nprint(name)',
    example: 'name = "Asha"\nscore = 9\nprint(f"{name}: {score}/10")',
    output: "Asha: 9/10",
    details: [
      "input() always returns a string, so numeric input needs explicit conversion.",
      "print() accepts multiple objects plus sep, end, file, and flush options.",
      "F-strings embed expressions inside braces and support formatting specifications.",
    ],
    why: "Programs need a boundary for receiving information and communicating results.",
    realWorld:
      "Read a menu choice and print a validated receipt or status message.",
    related: ["Built-in Functions", "Strings", "File Handling"],
    mistakes: [
      "Adding input text to a number without int() or float().",
      "Using eval() on untrusted input.",
    ],
    keywords: ["input", "print", "f-string", "formatting"],
  }),
  topicArticle({
    title: "Conditional Statements",
    definition:
      "Conditional statements run different blocks depending on truth-tested expressions.",
    category: "Control Flow",
    syntax:
      "if condition:\n    ...\nelif other_condition:\n    ...\nelse:\n    ...",
    example:
      "score = 82\nif score >= 80:\n    print('Distinction')\nelse:\n    print('Keep practicing')",
    output: "Distinction",
    details: [
      "if tests the first condition; elif adds mutually exclusive alternatives; else is the fallback.",
      "Empty collections, numeric zero, None, and False are falsey; most other values are truthy.",
      "Indentation must be consistent and a colon ends each clause header.",
    ],
    why: "Branches let software respond to validation, permissions, thresholds, and user choices.",
    realWorld:
      "Choose shipping fees, grade bands, or access rules from current data.",
    related: ["Operators", "Loops", "Debugging"],
    keywords: ["if", "elif", "else", "truthy", "falsey"],
  }),
  topicArticle({
    title: "Loops",
    definition:
      "Loops repeat a block for items in an iterable or while a condition remains true.",
    category: "Control Flow",
    syntax: "for item in iterable:\n    ...\n\nwhile condition:\n    ...",
    example:
      "total = 0\nfor number in range(1, 4):\n    total += number\nprint(total)",
    output: "6",
    details: [
      "for consumes an iterable; while reevaluates a condition before each iteration.",
      "break exits, continue skips to the next iteration, and an optional else runs after normal exhaustion.",
      "enumerate() gives positions and values; zip() traverses iterables together.",
    ],
    why: "Iteration processes collections, repeats validation, and drives stateful workflows.",
    realWorld:
      "Total invoice lines, retry an operation, or process every row in a file.",
    related: ["Iterators", "Generators", "Comprehensions"],
    mistakes: [
      "Creating a while loop whose condition never changes.",
      "Changing a list while iterating over it without a deliberate strategy.",
    ],
    keywords: ["for", "while", "break", "continue", "range", "enumerate"],
  }),
  topicArticle({
    title: "Scope",
    definition: "Scope controls where a name can be read or assigned.",
    category: "Functions",
    level: "Intermediate",
    syntax: "global_name = 1\ndef outer():\n    local_name = 2",
    example:
      "rate = 2\ndef calculate(value):\n    bonus = 3\n    return value * rate + bonus\nprint(calculate(4))",
    output: "11",
    details: [
      "Python resolves unqualified names through Local, Enclosing, Global, then Built-in scopes (LEGB).",
      "Assignment inside a function creates a local name unless global or nonlocal says otherwise.",
      "Objects can outlive a call when a closure retains an enclosing binding.",
    ],
    why: "Clear name ownership prevents accidental state changes and confusing dependencies.",
    realWorld:
      "Keep request-specific variables local while configuration is passed explicitly.",
    related: ["Functions", "Lambda Functions", "Decorators"],
    mistakes: [
      "Reading a name before a local assignment, causing UnboundLocalError.",
      "Using global when a parameter or return value would be clearer.",
    ],
    keywords: ["LEGB", "local", "global", "nonlocal", "closure"],
  }),
  topicArticle({
    title: "Lambda Functions",
    definition:
      "A lambda expression creates a small anonymous function containing one expression.",
    category: "Functions",
    level: "Intermediate",
    syntax: "lambda parameters: expression",
    example:
      "records = [('A', 3), ('B', 1)]\nprint(sorted(records, key=lambda item: item[1]))",
    output: "[('B', 1), ('A', 3)]",
    details: [
      "A lambda returns the value of its expression automatically.",
      "It follows normal scope rules and can close over enclosing names.",
      "Use def when logic needs statements, documentation, annotations, or reuse.",
    ],
    why: "Lambdas are concise callback or key functions at the point of use.",
    realWorld: "Select a sort key or provide a short transformation to map().",
    related: ["Functions", "Scope", "Sorting"],
    keywords: ["anonymous function", "callback", "key function"],
  }),
  topicArticle({
    title: "Recursion",
    definition:
      "Recursion is a technique where a function solves a problem by calling itself on a smaller case.",
    category: "Functions",
    level: "Intermediate",
    syntax:
      "def solve(value):\n    if base_case:\n        return result\n    return solve(smaller_value)",
    example:
      "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\nprint(factorial(4))",
    output: "24",
    details: [
      "A base case stops further calls; the recursive case must move toward it.",
      "Each active call has its own local frame and consumes stack space.",
      "Python does not optimize tail recursion, so loops are often better for very deep linear work.",
    ],
    why: "Recursive definitions naturally match trees, nested structures, divide-and-conquer, and backtracking.",
    realWorld: "Walk nested folders or traverse an expression tree.",
    related: ["Functions", "Trees", "Stacks"],
    mistakes: [
      "Forgetting the base case, causing RecursionError.",
      "Recursing without reducing the problem.",
    ],
    keywords: ["base case", "recursive case", "call stack", "RecursionError"],
  }),
  topicArticle({
    title: "Comprehensions",
    definition:
      "A comprehension constructs a collection from an iterable using an expression and optional filters.",
    category: "Functions",
    level: "Intermediate",
    syntax: "[expression for item in iterable if condition]",
    example:
      "squares = [n * n for n in range(6) if n % 2 == 0]\nprint(squares)",
    output: "[0, 4, 16]",
    details: [
      "List, set, and dictionary comprehensions build concrete collections.",
      "Generator expressions use parentheses and produce values lazily.",
      "Read clauses left to right in the same nesting order as equivalent loops.",
    ],
    why: "Comprehensions make simple transform-and-filter operations concise.",
    realWorld: "Normalize selected records or build a lookup table from rows.",
    related: ["Loops", "Generators", "Lists"],
    mistakes: [
      "Packing complicated side effects or too many clauses into one expression.",
      "Using square brackets when lazy iteration would save memory.",
    ],
    keywords: [
      "list comprehension",
      "dict comprehension",
      "set comprehension",
      "generator expression",
    ],
  }),
  topicArticle({
    title: "Modules",
    definition:
      "A module is a Python file or module object that groups reusable names.",
    category: "Modules and Packages",
    level: "Intermediate",
    syntax: "import module\nfrom module import name",
    example: "import math\nprint(math.isqrt(81))",
    output: "9",
    details: [
      "Import executes a module's top-level code once per interpreter session and creates a module object.",
      "Qualified names such as math.isqrt make ownership visible.",
      "The main guard prevents selected code from running when a file is imported.",
    ],
    why: "Modules organize code, prevent one global namespace, and enable reuse.",
    realWorld:
      "Separate validation, database access, formatting, and CLI entry points.",
    related: ["Packages", "Scope", "Testing"],
    keywords: ["import", "module", "__name__", "__main__", "sys.path"],
  }),
  topicArticle({
    title: "Packages",
    definition:
      "A package organizes related modules under a hierarchical import name.",
    category: "Modules and Packages",
    level: "Intermediate",
    syntax: "from package.module import name",
    example: "from pathlib import Path\nprint(Path('notes.txt').suffix)",
    output: ".txt",
    details: [
      "Regular packages commonly contain __init__.py; namespace packages can span locations without it.",
      "Absolute imports name the package from its root; explicit relative imports use leading dots inside a package.",
      "A project's packaging metadata is separate from its runtime package directories.",
    ],
    why: "Packages make larger codebases navigable and distributable.",
    realWorld:
      "Group an application's users, billing, reports, and shared utilities.",
    related: ["Modules", "Pathlib", "Testing"],
    keywords: ["package", "__init__.py", "relative import", "pyproject.toml"],
  }),
  topicArticle({
    title: "Exception Handling",
    definition:
      "Exception handling separates normal execution from recoverable error paths.",
    category: "Errors and Debugging",
    level: "Intermediate",
    syntax:
      "try:\n    risky_operation()\nexcept SpecificError as exc:\n    handle(exc)\nelse:\n    success()\nfinally:\n    cleanup()",
    example:
      "try:\n    value = int('12')\nexcept ValueError:\n    print('Invalid')\nelse:\n    print(value * 2)",
    output: "24",
    details: [
      "except matches the raised exception type and its subclasses.",
      "else runs only when the try block succeeds; finally runs whether or not an exception occurs.",
      "raise reports a failure; raise NewError(...) from exc preserves an explicit cause.",
    ],
    why: "Handlers recover where useful while preserving clear failure information.",
    realWorld:
      "Validate input, roll back a transaction, or translate a low-level error at an API boundary.",
    related: ["Error Guide", "File Handling", "Debugging"],
    mistakes: [
      "Catching Exception and silently passing.",
      "Wrapping too much code in one try block.",
    ],
    practices: [
      "Catch the narrowest expected exception.",
      "Use context managers for resources and retain useful error context.",
    ],
    keywords: ["try", "except", "else", "finally", "raise"],
  }),
  topicArticle({
    title: "File Handling",
    definition:
      "File handling reads and writes persistent text or binary data through file objects.",
    category: "Files and Data",
    level: "Intermediate",
    syntax:
      "with open(path, mode, encoding='utf-8') as file:\n    data = file.read()",
    example:
      "from io import StringIO\nfile = StringIO('alpha\\nbeta')\nprint(file.readline().strip())",
    output: "alpha",
    details: [
      "Text mode decodes bytes using an encoding; binary mode reads and writes bytes directly.",
      "A with block closes the file even when an exception occurs.",
      "Common modes include r, w, a, x, with optional b or +.",
    ],
    why: "Files provide durable configuration, logs, exports, and datasets.",
    realWorld: "Read a CSV export or save a JSON configuration file.",
    related: ["Pathlib", "JSON", "Exception Handling"],
    mistakes: [
      "Relying on the platform's default text encoding.",
      "Using w when existing content must not be truncated.",
    ],
    keywords: ["open", "read", "write", "with", "encoding", "file mode"],
  }),
  topicArticle({
    title: "JSON",
    definition:
      "JSON is a text format for objects, arrays, strings, numbers, booleans, and null.",
    category: "Files and Data",
    level: "Intermediate",
    syntax: "json.dumps(value)\njson.loads(text)",
    example:
      "import json\ntext = json.dumps({'active': True, 'score': 8})\nprint(json.loads(text)['score'])",
    output: "8",
    details: [
      "Python dict/list/str/int/float/bool/None map to JSON object/array/string/number/boolean/null.",
      "dumps and loads work with strings; dump and load work with file objects.",
      "JSON object keys are strings and the format cannot directly store arbitrary Python objects.",
    ],
    why: "JSON is a common interchange format for APIs, configuration, and browser storage.",
    realWorld: "Serialize an API request or read a settings file.",
    related: ["Dictionaries", "File Handling", "APIs"],
    keywords: ["json", "serialize", "deserialize", "dumps", "loads"],
  }),
  topicArticle({
    title: "Regular Expressions",
    definition:
      "A regular expression describes a pattern for finding, validating, or transforming text.",
    category: "Text Processing",
    level: "Intermediate",
    syntax: "re.search(pattern, text)",
    example:
      "import re\nmatch = re.search(r'\\d+', 'Order 204 ready')\nprint(match.group())",
    output: "204",
    details: [
      "Raw string literals reduce double escaping in Python regex patterns.",
      "search scans for a match; fullmatch requires the entire string; findall returns matching text.",
      "Groups capture subpatterns and named groups improve maintainability.",
    ],
    why: "Regex is useful when text follows a pattern but is not a full parser-friendly format.",
    realWorld:
      "Validate a simple identifier or extract reference numbers from logs.",
    related: ["Strings", "File Handling", "Debugging"],
    keywords: ["regex", "re", "search", "fullmatch", "group"],
  }),
  topicArticle({
    title: "Type Hints",
    definition:
      "Type hints annotate expected value shapes for readers and static analysis tools.",
    category: "Modern Python",
    level: "Intermediate",
    syntax: "def greet(name: str) -> str:\n    return f'Hello {name}'",
    example:
      "def double(values: list[int]) -> list[int]:\n    return [value * 2 for value in values]\nprint(double([2, 3]))",
    output: "[4, 6]",
    details: [
      "Annotations are not runtime enforcement by default.",
      "Use | for unions in modern Python and collections.abc for many callable or iterable protocols.",
      "Type checkers catch inconsistent assumptions before code runs.",
    ],
    why: "Hints document interfaces and improve editor completion, refactoring, and static checks.",
    realWorld:
      "Define a clear service boundary for request data and return values.",
    related: ["Functions", "Dataclasses", "Testing"],
    keywords: [
      "typing",
      "annotation",
      "union",
      "static analysis",
      "mypy",
      "pyright",
    ],
  }),
  topicArticle({
    title: "Dataclasses",
    definition:
      "A dataclass generates common data-focused class methods from annotated fields.",
    category: "Modern Python",
    level: "Intermediate",
    syntax: "@dataclass\nclass Name:\n    field: type",
    example:
      "from dataclasses import dataclass\n@dataclass\nclass Point:\n    x: int\n    y: int\nprint(Point(2, 4))",
    output: "Point(x=2, y=4)",
    details: [
      "@dataclass normally generates __init__, __repr__, and __eq__.",
      "Use field(default_factory=list) for a fresh mutable default per instance.",
      "frozen=True prevents normal field assignment but is not deep immutability.",
    ],
    why: "Dataclasses reduce boilerplate for records while retaining normal class behavior.",
    realWorld:
      "Represent configuration, coordinates, or validated domain values.",
    related: ["Classes and Objects", "Type Hints", "Mutable vs Immutable"],
    mistakes: [
      "Using a mutable literal as a shared default.",
      "Treating a dataclass as automatic input validation.",
    ],
    keywords: ["dataclass", "field", "default_factory", "frozen"],
  }),
  topicArticle({
    title: "Date and Time",
    definition:
      "The datetime module represents dates, times, timedeltas, and time-zone-aware timestamps.",
    category: "Standard Library",
    level: "Intermediate",
    syntax: "from datetime import datetime, timezone",
    example:
      "from datetime import date, timedelta\ndue = date(2026, 8, 23) + timedelta(days=7)\nprint(due.isoformat())",
    output: "2026-08-30",
    details: [
      "date stores a calendar date; datetime combines date and time; timedelta stores a duration.",
      "Use aware datetimes with zone information for real instants.",
      "isoformat and strptime/strftime convert between objects and text.",
    ],
    why: "Applications schedule events, calculate durations, and record timestamps.",
    realWorld: "Compute a due date or store an auditable UTC creation time.",
    related: ["File Handling", "JSON", "Python Interview Concepts"],
    keywords: ["datetime", "date", "time", "timedelta", "timezone"],
  }),
];
