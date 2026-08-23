import { describe, expect, it } from "vitest";
import { simulate } from "./executionService";

describe("safe Python execution service", () => {
  it.each([
    ['print("Hello Python")', "Hello Python"],
    ["a = 10\nb = 20\nprint(a + b)", "30"],
    ["for i in range(3):\n    print(i)", "0\n1\n2"],
    ["numbers = [10, 20, 30]\nprint(numbers[1])", "20"],
    [
      "fruits = ['Apple', 'Mango', 'Banana']\nfruits.append('Orange')\nfruits[1] = 'Pear'\nprint(fruits[-2:])",
      "['Banana', 'Orange']",
    ],
  ])("runs a supported beginner program", (code, output) => {
    expect(simulate(code)).toMatchObject({ status: "success", output });
  });

  it("shows a syntax error with its line", () => {
    expect(simulate('if True\n    print("Hello")')).toMatchObject({
      status: "error",
      error: { type: "SyntaxError", line: 1 },
    });
  });

  it("shows a clear no-output state", () => {
    expect(simulate("x = 10")).toMatchObject({
      status: "empty",
      message: "Program finished with no output.",
    });
  });

  it("accepts simple stdin without executing Python", () => {
    expect(
      simulate('name = input("Name: ")\nprint(name)', "Yash"),
    ).toMatchObject({ status: "success", output: "Name: \nYash" });
  });

  it("clearly reports code outside the safe runner", () => {
    expect(simulate("import os\nos.system('whoami')").status).toBe(
      "unsupported",
    );
  });
});
