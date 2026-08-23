import { describe, expect, it } from "vitest";
import type { MicroActivity } from "../types";
import {
  normalizeOutput,
  validateChallenge,
} from "./challengeValidationService";

const activity = (values: Partial<MicroActivity>): MicroActivity => ({
  id: "lesson-1-try",
  lessonId: "lesson-1",
  topic: "Python Basics",
  kind: "try-code",
  title: "Try it",
  instruction: "Print Hello",
  explanation: "print() displays a value.",
  xp: 15,
  ...values,
});

describe("challenge validation", () => {
  it("ignores harmless final newlines and trailing spaces", () => {
    expect(normalizeOutput("Hello  \n")).toBe("Hello");
    expect(
      validateChallenge(
        activity({
          expectedOutput: "Hello",
          validation: { strategy: "output" },
        }),
        'print("Hello")',
        { status: "success", output: "Hello\n", message: "Done" },
      ).correct,
    ).toBe(true);
  });

  it("can preserve meaningful whitespace", () => {
    expect(normalizeOutput("  Hello\n", true)).not.toBe(
      normalizeOutput("Hello\n", true),
    );
  });

  it("does not accept a required word hidden inside another word", () => {
    expect(
      validateChallenge(
        activity({
          validation: { strategy: "structure", requiredTokens: ["print"] },
        }),
        "blueprint = 1",
        { status: "empty", output: "", message: "Done" },
      ).correct,
    ).toBe(false);
  });

  it("requires a bug fix to change the starter code", () => {
    const bug = activity({
      kind: "bug-hunt",
      starterCode: "if True\n    print('Hi')",
      validation: { strategy: "custom" },
    });
    expect(
      validateChallenge(bug, bug.starterCode!, {
        status: "error",
        output: "",
        message: "Syntax problem",
      }).correct,
    ).toBe(false);
  });
});
