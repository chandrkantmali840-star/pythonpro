import { advancedArticles } from "./advanced";
import { builtinArticles, builtinsOverview } from "./builtins";
import { cheatSheetArticles } from "./cheatsheets";
import {
  dataStructureArticles,
  dataTypeReference,
  methodArticles,
  methodOverviewArticles,
} from "./dataStructures";
import { errorArticles, errorGuide } from "./errors";
import { fundamentalsArticles } from "./fundamentals";
import { functionArticles } from "./functions";
import { oopArticles } from "./oop";
import type { KnowledgeArticle, ReferenceRow } from "./types";

const operatorRows: ReferenceRow[] = [
  ["+", "Addition", "5 + 2", "7"],
  ["-", "Subtraction", "5 - 2", "3"],
  ["*", "Multiplication", "5 * 2", "10"],
  ["/", "True division", "5 / 2", "2.5"],
  ["//", "Floor division", "5 // 2", "2"],
  ["%", "Remainder", "5 % 2", "1"],
  ["**", "Exponentiation", "5 ** 2", "25"],
  ["==", "Equal values", "3 == 3.0", "True"],
  ["!=", "Unequal values", "3 != 4", "True"],
  ["< <= > >=", "Ordering comparisons", "3 < 4", "True"],
  ["=", "Assignment", "x = 5", "x refers to 5"],
  ["+= -= *= /=", "Augmented assignment", "x += 2", "Assigns x + 2"],
  ["and", "Both truth tests must pass", "True and False", "False"],
  [
    "or",
    "Returns after the first truthy operand",
    "'' or 'fallback'",
    "'fallback'",
  ],
  ["not", "Boolean negation", "not 0", "True"],
  ["is / is not", "Object identity", "x is None", "Identity test"],
  ["in / not in", "Membership", "'py' in 'python'", "True"],
  ["&", "Bitwise AND", "6 & 3", "2"],
  ["|", "Bitwise OR", "6 | 3", "7"],
  ["^", "Bitwise XOR", "6 ^ 3", "5"],
  ["~", "Bitwise inversion", "~5", "-6"],
  ["<< / >>", "Bit shifts", "3 << 2", "12"],
].map(([label, meaning, example, result]) => ({
  label,
  meaning,
  example,
  result,
}));

const primary = [
  ...fundamentalsArticles,
  ...dataStructureArticles,
  ...functionArticles,
  ...oopArticles,
  ...advancedArticles,
].map((item) =>
  item.title === "Operators"
    ? { ...item, operations: operatorRows, quickReference: operatorRows }
    : item,
);

export const knowledge: KnowledgeArticle[] = [
  ...primary,
  dataTypeReference,
  builtinsOverview,
  errorGuide,
  ...methodOverviewArticles,
  ...builtinArticles,
  ...methodArticles,
  ...errorArticles,
  ...cheatSheetArticles,
];

export const primaryKnowledge = primary;
export type { KnowledgeArticle, KnowledgeKind, KnowledgeLevel } from "./types";
