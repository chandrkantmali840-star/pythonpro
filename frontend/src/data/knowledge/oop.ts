import { topicArticle } from "./helpers";

export const oopArticles = [
  topicArticle({
    title: "OOP",
    definition:
      "Object-oriented programming organizes state and behavior around objects created from classes.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax: "class ClassName:\n    ...\nobject_name = ClassName()",
    example:
      "class Counter:\n    total = 0\n    def increment(self):\n        self.total += 1\nc = Counter(); c.increment(); print(c.total)",
    output: "1",
    details: [
      "A class defines shared behavior; each instance can hold its own state.",
      "Attributes are found on the instance, then its class and base classes according to the method resolution order.",
      "Composition models has-a relationships; inheritance models is-a specialization and should preserve the base contract.",
      "Instance, class, and static methods differ in the object automatically supplied to the function.",
    ],
    why: "OOP can model domain entities and create reusable interfaces with encapsulated state.",
    realWorld:
      "Model accounts, orders, users, and services with clear responsibilities.",
    related: [
      "Classes and Objects",
      "Inheritance",
      "Polymorphism",
      "Encapsulation",
    ],
    keywords: [
      "class",
      "object",
      "attribute",
      "method",
      "composition",
      "instance",
    ],
  }),
  topicArticle({
    title: "Classes and Objects",
    definition:
      "A class is a runtime object defining behavior; an object is a particular instance with identity and state.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax: "class Student:\n    def describe(self):\n        return self.name",
    example:
      "class Student:\n    school = 'PythonPro'\n    def describe(self): return f'{self.name} @ {self.school}'\ns = Student(); s.name = 'Asha'; print(s.describe())",
    output: "Asha @ PythonPro",
    details: [
      "self is the instance passed to a normal bound method.",
      "Instance attributes usually hold per-object state; class attributes are shared defaults or class-level state.",
      "Methods are functions stored on a class and become bound when accessed through an instance.",
    ],
    why: "Classes define reusable object behavior while instances represent concrete values.",
    realWorld:
      "Create many student records with the same behavior but independent data.",
    related: ["OOP", "Constructors", "Type Hints"],
    keywords: [
      "class",
      "object",
      "self",
      "attribute",
      "method",
      "instance variable",
      "class variable",
    ],
  }),
  topicArticle({
    title: "Constructors",
    definition:
      "In everyday Python usage, __init__ initializes a newly created instance after __new__ creates it.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax:
      "class Name:\n    def __init__(self, value):\n        self.value = value",
    example:
      "class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\np = Product('Book', 250)\nprint(p.name, p.price)",
    output: "Book 250",
    details: [
      "Instantiation calls the class and normally invokes __new__ followed by __init__.",
      "__init__ must return None; it establishes valid initial state.",
      "A subclass initializer can call super().__init__(...) to initialize its base portion.",
    ],
    why: "Initialization makes every new object start with required, consistent data.",
    realWorld: "Require an order ID and items when constructing an Order.",
    related: ["Classes and Objects", "Inheritance", "Dataclasses"],
    mistakes: [
      "Returning a value from __init__.",
      "Forgetting self when assigning instance attributes.",
    ],
    keywords: ["constructor", "__init__", "__new__", "super"],
  }),
  topicArticle({
    title: "Inheritance",
    definition:
      "Inheritance creates a subclass that reuses and specializes behavior from one or more base classes.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax: "class Child(Parent):\n    ...",
    example:
      "class Animal:\n    def speak(self): return 'sound'\nclass Dog(Animal):\n    def speak(self): return 'woof'\nprint(Dog().speak())",
    output: "woof",
    details: [
      "Method overriding replaces inherited behavior for subclass instances.",
      "super() delegates according to the method resolution order, not simply a named parent.",
      "isinstance() checks an object's class lineage; issubclass() checks class relationships.",
    ],
    why: "Inheritance shares a stable contract across true is-a specializations.",
    realWorld:
      "Implement several notification channels behind a common send() interface.",
    related: ["OOP", "Polymorphism", "Composition"],
    mistakes: [
      "Using inheritance only to reuse code when composition is a clearer relationship.",
      "Calling a base class by name instead of cooperative super() in multiple inheritance.",
    ],
    keywords: [
      "base class",
      "subclass",
      "override",
      "super",
      "MRO",
      "isinstance",
    ],
  }),
  topicArticle({
    title: "Polymorphism",
    definition:
      "Polymorphism lets different objects respond to the same operation according to their own behavior.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax: "for item in objects:\n    item.render()",
    example:
      "class Email:\n    def send(self): return 'email'\nclass SMS:\n    def send(self): return 'sms'\nprint([item.send() for item in (Email(), SMS())])",
    output: "['email', 'sms']",
    details: [
      "Python commonly uses duck typing: behavior matters more than a declared common base.",
      "Overriding is one route to polymorphism; protocols and ordinary compatible methods are another.",
      "Callers should depend on the smallest useful interface.",
    ],
    why: "Polymorphism removes repetitive type checks and keeps callers extensible.",
    realWorld:
      "Send messages through email, SMS, or push providers using one operation.",
    related: ["Inheritance", "Abstraction", "Type Hints"],
    keywords: ["duck typing", "override", "protocol", "interface"],
  }),
  topicArticle({
    title: "Encapsulation",
    definition:
      "Encapsulation keeps state and the operations that maintain it behind a deliberate interface.",
    category: "Object-Oriented Python",
    level: "Intermediate",
    kind: "OOP",
    syntax:
      "class Account:\n    @property\n    def balance(self): return self._balance",
    example:
      "class Account:\n    def __init__(self): self._balance = 0\n    def deposit(self, amount):\n        if amount <= 0: raise ValueError('positive amount required')\n        self._balance += amount\n    @property\n    def balance(self): return self._balance\na=Account(); a.deposit(50); print(a.balance)",
    output: "50",
    details: [
      "A leading underscore signals non-public implementation by convention.",
      "Double-leading names trigger name mangling but do not provide security.",
      "Properties can expose attribute-like access while validating or computing values.",
    ],
    why: "Encapsulation protects invariants and gives implementations room to change.",
    realWorld:
      "Prevent an account balance from being changed without validation.",
    related: ["Classes and Objects", "Abstraction", "Decorators"],
    keywords: [
      "private",
      "underscore",
      "name mangling",
      "property",
      "invariant",
    ],
  }),
  topicArticle({
    title: "Abstraction",
    definition:
      "Abstraction exposes essential operations while hiding unnecessary implementation detail.",
    category: "Object-Oriented Python",
    level: "Advanced",
    kind: "OOP",
    syntax:
      "from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...",
    example:
      "from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\nclass Square(Shape):\n    def __init__(self, side): self.side=side\n    def area(self): return self.side**2\nprint(Square(4).area())",
    output: "16",
    details: [
      "An abstract base class can prevent instantiation until abstract methods are implemented.",
      "Abstraction is also achieved with small functions, modules, protocols, and service boundaries.",
      "A useful abstraction states what is guaranteed without exposing how it is achieved.",
    ],
    why: "Stable abstractions reduce coupling and make alternate implementations possible.",
    realWorld:
      "Define a storage interface backed by memory, files, or a database.",
    related: ["Polymorphism", "Inheritance", "Type Hints"],
    keywords: ["abc", "ABC", "abstractmethod", "interface", "protocol"],
  }),
];
