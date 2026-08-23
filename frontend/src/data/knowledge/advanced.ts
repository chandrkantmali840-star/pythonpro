import { topicArticle } from "./helpers";

export const advancedArticles = [
  topicArticle({
    title: "Math",
    definition:
      "The math module provides real-number mathematical constants and functions.",
    category: "Standard Library",
    syntax: "import math\nmath.function(value)",
    example: "import math\nprint(math.sqrt(81), math.ceil(2.1), math.pi > 3)",
    output: "9.0 3 True",
    details: [
      "math includes sqrt, floor, ceil, factorial, gcd, trigonometric functions, logarithms, pi, e, inf, and nan.",
      "Most functions operate on real numbers; cmath supports complex-number equivalents.",
      "Use math.isclose() for tolerance-based floating-point comparisons.",
    ],
    why: "It provides tested numerical primitives beyond built-in arithmetic.",
    realWorld: "Calculate distances, angles, growth, and numeric bounds.",
    related: ["Operators", "Random", "Time Complexity"],
    keywords: ["math", "sqrt", "ceil", "floor", "factorial", "gcd", "isclose"],
  }),
  topicArticle({
    title: "Random",
    definition:
      "The random module generates deterministic pseudo-random values for simulation and non-security uses.",
    category: "Standard Library",
    syntax: "import random\nrandom.choice(sequence)",
    example: "import random\nrng = random.Random(7)\nprint(rng.randint(1, 10))",
    output: "6",
    details: [
      "Random instances can be seeded for reproducible tests and simulations.",
      "choice selects one item; sample selects unique items; shuffle mutates a list in place.",
      "Use the secrets module for passwords, tokens, and security-sensitive randomness.",
    ],
    why: "Pseudo-randomness supports games, sampling, simulation, and randomized testing.",
    realWorld: "Shuffle quiz questions with a local generator.",
    related: ["Math", "Testing", "Python Interview Concepts"],
    mistakes: [
      "Using random for security tokens.",
      "Expecting the same sequence without controlling the seed.",
    ],
    keywords: [
      "random",
      "randint",
      "choice",
      "sample",
      "shuffle",
      "seed",
      "secrets",
    ],
  }),
  topicArticle({
    title: "Collections",
    definition:
      "The collections module supplies specialized containers beyond the core built-in types.",
    category: "Standard Library",
    level: "Intermediate",
    syntax: "from collections import Counter, defaultdict, deque",
    example:
      "from collections import Counter\ncounts = Counter('banana')\nprint(counts.most_common(2))",
    output: "[('a', 3), ('n', 2)]",
    details: [
      "Counter counts hashable values; defaultdict creates missing values through a factory.",
      "deque provides efficient append and pop operations at both ends.",
      "namedtuple creates lightweight tuple subclasses with named fields; ChainMap searches multiple mappings.",
    ],
    why: "Specialized containers express intent and improve performance for common patterns.",
    realWorld: "Count words, group records, or maintain a queue.",
    related: ["Dictionaries", "Queue", "Python Interview Concepts"],
    keywords: ["Counter", "defaultdict", "deque", "namedtuple", "ChainMap"],
  }),
  topicArticle({
    title: "Itertools",
    definition:
      "The itertools module builds fast, memory-efficient iterator pipelines.",
    category: "Standard Library",
    level: "Advanced",
    syntax: "from itertools import chain, islice",
    example:
      "from itertools import islice, count\nprint(list(islice(count(10, 2), 4)))",
    output: "[10, 12, 14, 16]",
    details: [
      "Infinite iterators include count, cycle, and repeat and must be bounded when materialized.",
      "chain combines sources; islice slices lazily; pairwise exposes adjacent pairs.",
      "product, permutations, and combinations generate combinatorial arrangements.",
    ],
    why: "Iterator composition processes streams without intermediate lists.",
    realWorld:
      "Page through a generated sequence or combine several data sources lazily.",
    related: ["Iterators", "Generators", "Comprehensions"],
    keywords: [
      "itertools",
      "chain",
      "islice",
      "count",
      "cycle",
      "product",
      "combinations",
    ],
  }),
  topicArticle({
    title: "OS",
    definition:
      "The os module exposes portable interfaces to operating-system services and process environments.",
    category: "Standard Library",
    level: "Intermediate",
    syntax: "import os\nos.getenv('NAME')",
    example: "import os\nprint(os.path.basename('/tmp/report.txt'))",
    output: "report.txt",
    details: [
      "os.environ provides environment variables; getenv reads an optional value.",
      "os offers process, permission, directory, and low-level path operations.",
      "Prefer pathlib for most application-level path manipulation.",
    ],
    why: "Programs often need environment configuration and controlled interaction with the host system.",
    realWorld: "Read a deployment setting or inspect a process environment.",
    related: ["Pathlib", "File Handling", "Packages"],
    keywords: ["os", "environment", "getenv", "os.path", "directory"],
  }),
  topicArticle({
    title: "Pathlib",
    definition:
      "pathlib represents filesystem paths as objects with cross-platform operations.",
    category: "Standard Library",
    level: "Intermediate",
    syntax: "from pathlib import Path\npath = Path('folder') / 'file.txt'",
    example:
      "from pathlib import Path\npath = Path('reports') / 'august.csv'\nprint(path.name, path.suffix)",
    output: "august.csv .csv",
    details: [
      "The / operator joins path components without manual separators.",
      "name, suffix, stem, parent, and parts inspect path structure.",
      "exists, is_file, glob, read_text, and write_text perform common filesystem work.",
    ],
    why: "Path objects make path code readable and portable.",
    realWorld: "Find every .py file or construct an export location.",
    related: ["OS", "File Handling", "Exception Handling"],
    keywords: ["pathlib", "Path", "glob", "read_text", "write_text", "suffix"],
  }),
  topicArticle({
    title: "Searching",
    definition:
      "Searching locates a target or determines whether it exists in a collection.",
    category: "Algorithms",
    level: "Intermediate",
    syntax: "target in collection\n# or binary search on sorted data",
    example:
      "from bisect import bisect_left\nvalues = [2, 5, 8, 12]\ni = bisect_left(values, 8)\nprint(i)",
    output: "2",
    details: [
      "Linear search is O(n) and works on any sequence.",
      "Binary search is O(log n) but requires sorted, indexable data.",
      "Dictionary and set membership is average O(1) because they use hashing.",
    ],
    why: "The data structure and invariants determine the most suitable search strategy.",
    realWorld:
      "Look up a user by ID or find an insertion point in a sorted score table.",
    related: ["Sorting", "Time Complexity", "Dictionaries"],
    keywords: ["linear search", "binary search", "bisect", "membership"],
  }),
  topicArticle({
    title: "Sorting",
    definition: "Sorting arranges values according to an ordering or key.",
    category: "Algorithms",
    level: "Intermediate",
    syntax:
      "sorted(iterable, key=None, reverse=False)\nlist.sort(key=None, reverse=False)",
    example:
      "records = [('A', 3), ('B', 1)]\nprint(sorted(records, key=lambda row: row[1]))",
    output: "[('B', 1), ('A', 3)]",
    details: [
      "sorted() returns a new list from any iterable; list.sort() mutates and returns None.",
      "Python's sort is stable, so equal keys retain their original relative order.",
      "A key function is called once per item and should return comparable values.",
    ],
    why: "Ordered data is easier to present and enables strategies such as binary search.",
    realWorld:
      "Order products by price while preserving original order for ties.",
    related: ["Lists", "Lambda Functions", "Searching"],
    keywords: ["sorted", "sort", "key", "reverse", "stable", "Timsort"],
  }),
  topicArticle({
    title: "Stack",
    definition: "A stack is a last-in, first-out collection.",
    category: "Algorithms",
    level: "Intermediate",
    kind: "Data Structure",
    syntax: "stack.append(item)\nitem = stack.pop()",
    example:
      "stack = []\nstack.append('first')\nstack.append('second')\nprint(stack.pop())",
    output: "second",
    details: [
      "The most recently pushed item is the first one popped.",
      "A Python list provides efficient append and pop at the end.",
      "Stacks support nested work such as parsing, backtracking, and call management.",
    ],
    why: "LIFO order matches undo history and nested traversal.",
    realWorld: "Implement undo or depth-first search.",
    related: ["Lists", "Recursion", "Queue"],
    keywords: ["stack", "LIFO", "push", "pop"],
  }),
  topicArticle({
    title: "Queue",
    definition: "A queue is a first-in, first-out collection.",
    category: "Algorithms",
    level: "Intermediate",
    kind: "Data Structure",
    syntax: "queue.append(item)\nitem = queue.popleft()",
    example:
      "from collections import deque\nqueue = deque(['first', 'second'])\nprint(queue.popleft())",
    output: "first",
    details: [
      "deque supports O(1) operations at both ends.",
      "list.pop(0) is O(n) because remaining items shift.",
      "queue.Queue adds locking for communication between threads.",
    ],
    why: "FIFO order models fair task arrival and breadth-first processing.",
    realWorld: "Schedule print jobs or implement breadth-first search.",
    related: ["Collections", "Stack", "Time Complexity"],
    keywords: ["queue", "FIFO", "deque", "popleft"],
  }),
  topicArticle({
    title: "Time Complexity",
    definition:
      "Time complexity describes how an algorithm's work grows with input size.",
    category: "Algorithms",
    level: "Intermediate",
    syntax: "O(1), O(log n), O(n), O(n log n), O(n²)",
    example: "values = [4, 8, 15]\nprint(15 in values)  # linear scan: O(n)",
    output: "True",
    details: [
      "Big-O communicates a growth upper bound and usually ignores constants.",
      "List indexing is O(1), list membership is O(n), and dictionary lookup is average O(1).",
      "Nested full scans are often O(n²); sorting comparison data is typically O(n log n).",
      "Space complexity tracks additional memory growth.",
    ],
    why: "Complexity predicts scalability and helps choose data structures.",
    realWorld:
      "Replace repeated list scans with a set when processing many records.",
    related: ["Searching", "Sorting", "Lists", "Dictionaries"],
    keywords: ["Big O", "complexity", "O(1)", "O(n)", "space complexity"],
  }),
  topicArticle({
    title: "Testing",
    definition:
      "Testing executes code under controlled conditions and checks observed behavior against expectations.",
    category: "Errors and Debugging",
    level: "Intermediate",
    syntax: "def test_behavior():\n    assert actual == expected",
    example:
      "def add(a, b): return a + b\ndef test_add(): assert add(2, 3) == 5\ntest_add(); print('passed')",
    output: "passed",
    details: [
      "Unit tests isolate small behavior; integration tests verify components working together.",
      "Arrange inputs, act once, and assert observable outcomes including errors.",
      "Fixtures set up reusable context; mocks replace boundaries when isolation is necessary.",
    ],
    why: "Tests detect regressions, document contracts, and support safe refactoring.",
    realWorld:
      "Verify price calculations and invalid-input handling before deployment.",
    related: ["Debugging", "Exception Handling", "Functions"],
    keywords: ["test", "assert", "pytest", "fixture", "mock", "unit test"],
  }),
  topicArticle({
    title: "Debugging",
    definition:
      "Debugging is the disciplined process of reproducing, locating, explaining, and correcting defects.",
    category: "Errors and Debugging",
    level: "Intermediate",
    syntax: "breakpoint()\n# inspect values and step through execution",
    example:
      "values = [2, 4, 6]\nexpected = 12\nactual = sum(values)\nprint(actual == expected)",
    output: "True",
    details: [
      "Start with a minimal repeatable case and read the complete traceback from the final line upward.",
      "Inspect assumptions at boundaries instead of changing several things at once.",
      "Use logging, assertions, a debugger, and targeted tests to gather evidence.",
    ],
    why: "A repeatable method fixes causes rather than hiding symptoms.",
    realWorld: "Trace why a specific request produces the wrong total.",
    related: ["Error Guide", "Testing", "Exception Handling"],
    keywords: ["debugging", "traceback", "breakpoint", "logging", "reproduce"],
  }),
  topicArticle({
    title: "Python Interview Concepts",
    definition:
      "Interview concepts connect Python behavior, design choices, data structures, and clear problem-solving communication.",
    category: "Interview Reference",
    level: "Advanced",
    syntax: "# explain behavior, complexity, trade-offs, then code",
    example: "a = [1, 2]\nb = a\nc = a.copy()\nprint(a is b, a is c, a == c)",
    output: "True False True",
    details: [
      "Know identity versus equality, mutability, shallow versus deep copy, and argument binding.",
      "Explain list/tuple, set/dict, iterator/iterable, generator/list, and instance/class method trade-offs.",
      "Trace scope, closures, default arguments, exceptions, context managers, and method resolution.",
      "For algorithms, state assumptions, test edge cases, and discuss time and space complexity.",
    ],
    why: "Strong interviews test reasoning and communication, not memorized trivia alone.",
    realWorld:
      "Explain a production trade-off before implementing and testing it.",
    related: ["Data Types", "Functions", "OOP", "Time Complexity"],
    keywords: [
      "interview",
      "identity",
      "equality",
      "mutability",
      "GIL",
      "MRO",
      "complexity",
    ],
  }),
];
