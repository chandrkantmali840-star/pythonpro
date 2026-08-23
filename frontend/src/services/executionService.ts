export type ExecutionStatus =
  "success" | "empty" | "error" | "unsupported" | "rejected";

export type ExecutionResult = {
  status: ExecutionStatus;
  output: string;
  message: string;
  error?: { type: string; line?: number; detail: string; tip?: string };
};

interface PythonList extends Array<Value> {}
interface PythonDictionary {
  [key: string]: Value;
}
type Value = string | number | boolean | null | PythonList | PythonDictionary;
type FunctionValue = { parameters: string[]; expression: string };

export const executionService = {
  mode: "safe-mock" as const,
  async run({ code, stdin = "" }: { code: string; stdin?: string }) {
    await new Promise((resolve) => globalThis.setTimeout(resolve, 120));
    return simulate(code, stdin);
  },
};

export function simulate(code: string, stdin = ""): ExecutionResult {
  const source = code.replace(/\r\n?/g, "\n");
  if (source.length > 20_000)
    return result("rejected", "", "Code must be under 20 KB.");
  if (!source.trim())
    return result("empty", "", "Program finished with no output.");
  const syntaxError = checkSyntax(source);
  if (syntaxError) return syntaxError;
  if (source.includes("class ")) {
    const classOutput = simpleClassOutput(source);
    if (classOutput !== null)
      return result("success", classOutput, "Program finished successfully.");
  }

  try {
    const variables = new Map<string, Value>(),
      functions = new Map<string, FunctionValue>(),
      inputLines = stdin.replace(/\r\n?/g, "\n").split("\n"),
      output: string[] = [],
      lines = source.split("\n");
    let inputIndex = 0;

    for (let index = 0; index < lines.length; index++) {
      const raw = lines[index],
        line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      const functionMatch = line.match(/^def\s+([A-Za-z_]\w*)\(([^)]*)\):$/);
      if (functionMatch) {
        const body = lines[index + 1]?.trim(),
          returnMatch = body?.match(/^return\s+(.+)$/);
        if (!returnMatch)
          return unsupported(
            index + 1,
            "This demo runner supports simple functions with one return line.",
          );
        functions.set(functionMatch[1], {
          parameters: functionMatch[2]
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          expression: returnMatch[1],
        });
        index++;
        continue;
      }

      const loopMatch = line.match(
        /^for\s+([A-Za-z_]\w*)\s+in\s+range\(([^)]*)\):$/,
      );
      if (loopMatch) {
        const body = lines[index + 1];
        if (!body || indentation(body) <= indentation(raw))
          return indentationError(index + 2);
        const range = parseRange(loopMatch[2], variables);
        if (!range)
          return unsupported(
            index + 1,
            "Use integer values inside range() in this demo.",
          );
        for (const number of range) {
          variables.set(loopMatch[1], number);
          const bodyResult = runSimpleStatement(
            body.trim(),
            variables,
            functions,
            output,
          );
          if (bodyResult) return bodyResult;
        }
        index++;
        continue;
      }

      const appendMatch = line.match(/^([A-Za-z_]\w*)\.append\((.+)\)$/);
      if (appendMatch) {
        const current = variables.get(appendMatch[1]);
        if (!Array.isArray(current))
          return typeError(index + 1, "append() needs a list.");
        const value = evaluate(appendMatch[2], variables, functions);
        if (value === UNSUPPORTED) return unsupported(index + 1);
        current.push(value);
        continue;
      }

      const indexedAssignment = line.match(
        /^([A-Za-z_]\w*)\[(-?\d+)\]\s*=\s*(.+)$/,
      );
      if (indexedAssignment) {
        const current = variables.get(indexedAssignment[1]),
          position = Number(indexedAssignment[2]);
        if (!Array.isArray(current))
          return typeError(index + 1, "Indexed assignment needs a list.");
        const actual = position < 0 ? current.length + position : position;
        if (actual < 0 || actual >= current.length)
          return indexError(index + 1);
        const value = evaluate(indexedAssignment[3], variables, functions);
        if (value === UNSUPPORTED) return unsupported(index + 1);
        current[actual] = value;
        continue;
      }

      const inputAssignment = line.match(
        /^([A-Za-z_]\w*)\s*=\s*input\((.*)\)$/,
      );
      if (inputAssignment) {
        if (!stdin && inputIndex === 0)
          return result(
            "unsupported",
            "",
            "This program needs input. Add it in the Input box, then run again.",
          );
        const prompt = evaluate(inputAssignment[2], variables, functions);
        if (inputAssignment[2].trim() && prompt !== UNSUPPORTED)
          output.push(formatPython(prompt));
        variables.set(inputAssignment[1], inputLines[inputIndex++] ?? "");
        continue;
      }

      const assignment = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (assignment) {
        const value = evaluate(assignment[2], variables, functions);
        if (value === UNSUPPORTED) return unsupported(index + 1);
        variables.set(assignment[1], value);
        continue;
      }

      const statementResult = runSimpleStatement(
        line,
        variables,
        functions,
        output,
      );
      if (statementResult) return statementResult;
    }
    return output.length
      ? result("success", output.join("\n"), "Program finished successfully.")
      : result("empty", "", "Program finished with no output.");
  } catch {
    return unsupported(
      undefined,
      "This code is outside the safe demo runner's supported examples.",
    );
  }
}

const UNSUPPORTED = Symbol("unsupported");

function runSimpleStatement(
  line: string,
  variables: Map<string, Value>,
  functions: Map<string, FunctionValue>,
  output: string[],
): ExecutionResult | null {
  const printMatch = line.match(/^print\((.*)\)$/);
  if (!printMatch) return unsupported(undefined);
  const parts = splitArguments(printMatch[1]),
    values: Value[] = [];
  for (const part of parts) {
    const value = evaluate(part, variables, functions);
    if (value === UNSUPPORTED) return unsupported(undefined);
    values.push(value);
  }
  output.push(values.map(formatPython).join(" "));
  return null;
}

function evaluate(
  expression: string,
  variables: Map<string, Value>,
  functions: Map<string, FunctionValue>,
): Value | typeof UNSUPPORTED {
  const value = expression.trim();
  if (/^(['"]).*\1$/.test(value))
    return value.slice(1, -1).replace(/\\n/g, "\n");
  if (/^f(['"]).*\1$/.test(value))
    return value
      .slice(2, -1)
      .replace(/\{([A-Za-z_]\w*)\}/g, (_, name) =>
        formatPython(variables.get(name) ?? ""),
      );
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === "True") return true;
  if (value === "False") return false;
  if (value === "None") return null;

  const list = parseList(value, variables, functions);
  if (list) return list;
  const dict = parseDictionary(value, variables, functions);
  if (dict) return dict;

  const ternary = value.match(/^(.+)\s+if\s+(.+)\s+else\s+(.+)$/);
  if (ternary) {
    const condition = evaluateCondition(ternary[2], variables);
    return evaluate(condition ? ternary[1] : ternary[3], variables, functions);
  }

  const functionCall = value.match(/^([A-Za-z_]\w*)\((.*)\)$/);
  if (functionCall && functions.has(functionCall[1])) {
    const fn = functions.get(functionCall[1])!,
      args = splitArguments(functionCall[2]).map((arg) =>
        evaluate(arg, variables, functions),
      );
    if (args.some((arg) => arg === UNSUPPORTED)) return UNSUPPORTED;
    const local = new Map(variables);
    fn.parameters.forEach((name, index) =>
      local.set(name, args[index] as Value),
    );
    return evaluate(fn.expression, local, functions);
  }

  const indexMatch = value.match(/^([A-Za-z_]\w*)\[(-?\d+)\]$/);
  if (indexMatch) {
    const container = variables.get(indexMatch[1]),
      position = Number(indexMatch[2]);
    if (Array.isArray(container) || typeof container === "string")
      return (
        container[position < 0 ? container.length + position : position] ??
        UNSUPPORTED
      );
  }
  const sliceMatch = value.match(/^([A-Za-z_]\w*)\[(-?\d*)?:(-?\d*)?\]$/);
  if (sliceMatch) {
    const container = variables.get(sliceMatch[1]);
    if (Array.isArray(container) || typeof container === "string") {
      const start = sliceMatch[2]
          ? normalizeIndex(Number(sliceMatch[2]), container.length)
          : 0,
        end = sliceMatch[3]
          ? normalizeIndex(Number(sliceMatch[3]), container.length)
          : container.length;
      return container.slice(start, end) as Value;
    }
  }
  const keyMatch = value.match(/^([A-Za-z_]\w*)\[(['"])(.+)\2\]$/);
  if (keyMatch) {
    const container = variables.get(keyMatch[1]);
    if (container && !Array.isArray(container) && typeof container === "object")
      return container[keyMatch[3]] ?? UNSUPPORTED;
  }
  const getMatch = value.match(
    /^([A-Za-z_]\w*)\.get\((['"])(.+)\2(?:,\s*(.+))?\)$/,
  );
  if (getMatch) {
    const container = variables.get(getMatch[1]);
    if (
      container &&
      !Array.isArray(container) &&
      typeof container === "object"
    ) {
      if (Object.hasOwn(container, getMatch[3])) return container[getMatch[3]];
      if (getMatch[4]) return evaluate(getMatch[4], variables, functions);
      return null;
    }
  }

  const binary = value.match(/^(.+?)\s*([+*\-])\s*(.+)$/);
  if (binary) {
    const left = evaluate(binary[1], variables, functions),
      right = evaluate(binary[3], variables, functions);
    if (left === UNSUPPORTED || right === UNSUPPORTED) return UNSUPPORTED;
    if (
      binary[2] === "+" &&
      typeof left === "number" &&
      typeof right === "number"
    )
      return left + right;
    if (
      binary[2] === "+" &&
      typeof left === "string" &&
      typeof right === "string"
    )
      return left + right;
    if (
      binary[2] === "*" &&
      typeof left === "number" &&
      typeof right === "number"
    )
      return left * right;
    if (
      binary[2] === "-" &&
      typeof left === "number" &&
      typeof right === "number"
    )
      return left - right;
    return UNSUPPORTED;
  }
  if (variables.has(value)) return variables.get(value)!;
  const classAttribute = value.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)$/);
  if (classAttribute) return UNSUPPORTED;
  return UNSUPPORTED;
}

function checkSyntax(source: string): ExecutionResult | null {
  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    if (
      /^(if|elif|else|for|while|def|class)\b/.test(line) &&
      !line.endsWith(":")
    )
      return syntaxError(index + 1, "Add : at the end of this line.");
    if (/^\d+[A-Za-z_]\w*\s*=/.test(line))
      return syntaxError(
        index + 1,
        "A variable name cannot start with a number.",
      );
    if (line.endsWith(":")) {
      const next = lines.slice(index + 1).find((candidate) => candidate.trim());
      if (next && indentation(next) <= indentation(lines[index]))
        return indentationError(index + 2);
    }
  }
  return null;
}

function parseRange(text: string, variables: Map<string, Value>) {
  const parts = splitArguments(text).map((part) => {
    const value = /^-?\d+$/.test(part.trim())
      ? Number(part)
      : variables.get(part.trim());
    return typeof value === "number" && Number.isInteger(value) ? value : NaN;
  });
  if (parts.some(Number.isNaN) || parts.length < 1 || parts.length > 3)
    return null;
  const [start, stop, step] =
    parts.length === 1
      ? [0, parts[0], 1]
      : parts.length === 2
        ? [parts[0], parts[1], 1]
        : parts;
  if (step === 0) return null;
  const values: number[] = [];
  for (
    let value = start;
    step > 0 ? value < stop : value > stop;
    value += step
  ) {
    if (values.length > 10_000) return null;
    values.push(value);
  }
  return values;
}

function parseList(
  text: string,
  variables: Map<string, Value>,
  functions: Map<string, FunctionValue>,
) {
  if (!text.startsWith("[") || !text.endsWith("]")) return null;
  if (text === "[]") return [];
  const values = splitArguments(text.slice(1, -1)).map((part) =>
    evaluate(part, variables, functions),
  );
  return values.some((value) => value === UNSUPPORTED)
    ? null
    : (values as Value[]);
}

function parseDictionary(
  text: string,
  variables: Map<string, Value>,
  functions: Map<string, FunctionValue>,
) {
  if (!text.startsWith("{") || !text.endsWith("}")) return null;
  const record: Record<string, Value> = {};
  if (text === "{}") return record;
  for (const pair of splitArguments(text.slice(1, -1))) {
    const match = pair.match(/^(['"])(.+)\1\s*:\s*(.+)$/);
    if (!match) return null;
    const value = evaluate(match[3], variables, functions);
    if (value === UNSUPPORTED) return null;
    record[match[2]] = value;
  }
  return record;
}

function evaluateCondition(text: string, variables: Map<string, Value>) {
  const match = text
    .trim()
    .match(/^([A-Za-z_]\w*)\s*(>=|<=|==|>|<)\s*(-?\d+)$/);
  if (!match) return false;
  const left = variables.get(match[1]),
    right = Number(match[3]);
  if (typeof left !== "number") return false;
  return match[2] === ">="
    ? left >= right
    : match[2] === "<="
      ? left <= right
      : match[2] === ">"
        ? left > right
        : match[2] === "<"
          ? left < right
          : left === right;
}

function simpleClassOutput(source: string) {
  const attribute = source.match(/^\s*([A-Za-z_]\w*)\s*=\s*(['"])(.*?)\2\s*$/m),
    printedAttribute = source.match(/print\([A-Za-z_]\w*\.([A-Za-z_]\w*)\)/);
  if (attribute && printedAttribute && attribute[1] === printedAttribute[1])
    return attribute[3];
  const returned = source.match(/return\s+(['"])(.*?)\1/),
    methodPrint = source.match(/print\([A-Za-z_]\w*\(\)\.[A-Za-z_]\w*\(\)\)/);
  return returned && methodPrint ? returned[2] : null;
}

function splitArguments(text: string) {
  const parts: string[] = [];
  let current = "",
    quote = "",
    depth = 0;
  for (const character of text) {
    if ((character === "'" || character === '"') && !quote) quote = character;
    else if (character === quote) quote = "";
    if (!quote && "[({".includes(character)) depth++;
    if (!quote && "])}".includes(character)) depth--;
    if (character === "," && !quote && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += character;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export function formatPython(value: Value): string {
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return `[${value.map((item) => (typeof item === "string" ? `'${item}'` : formatPython(item))).join(", ")}]`;
  if (typeof value === "object")
    return `{${Object.entries(value)
      .map(
        ([key, item]) =>
          `'${key}': ${typeof item === "string" ? `'${item}'` : formatPython(item)}`,
      )
      .join(", ")}}`;
  return String(value);
}

const indentation = (line: string) =>
  line.match(/^\s*/)?.[0].replace(/\t/g, "    ").length || 0;
const normalizeIndex = (index: number, length: number) =>
  index < 0 ? length + index : index;
const result = (
  status: ExecutionStatus,
  output: string,
  message: string,
): ExecutionResult => ({ status, output, message });
const unsupported = (
  line?: number,
  detail = "This safe demo supports beginner print, variables, arithmetic, lists, input, simple loops, and simple functions.",
): ExecutionResult => ({
  status: "unsupported",
  output: "",
  message: detail,
  error: {
    type: "Demo limitation",
    line,
    detail,
    tip: "Try a smaller beginner example, or connect a secure Python sandbox for full execution.",
  },
});
const syntaxError = (line: number, detail: string): ExecutionResult => ({
  status: "error",
  output: "",
  message: "Python found a syntax problem.",
  error: {
    type: "SyntaxError",
    line,
    detail,
    tip: "Check for a missing colon, bracket, quote, or indentation.",
  },
});
const indentationError = (line: number): ExecutionResult => ({
  status: "error",
  output: "",
  message: "Python found an indentation problem.",
  error: {
    type: "IndentationError",
    line,
    detail: "The code block must be indented.",
    tip: "Use four spaces inside if, loop, function, and class blocks.",
  },
});
const typeError = (line: number, detail: string): ExecutionResult => ({
  status: "error",
  output: "",
  message: "This operation used the wrong kind of value.",
  error: {
    type: "TypeError",
    line,
    detail,
    tip: "Check the value's type and the operation you are using.",
  },
});
const indexError = (line: number): ExecutionResult => ({
  status: "error",
  output: "",
  message: "The list position does not exist.",
  error: {
    type: "IndexError",
    line,
    detail: "The index is outside the list.",
    tip: "List positions start at 0. The last valid positive index is len(list) - 1.",
  },
});
