// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import type { MicroActivity } from "../types";
import { executionService } from "../services/executionService";
import {
  applyEnterEdit,
  applyTabEdit,
  PythonLessonEditor,
} from "./PythonLessonEditor";

describe("Python editor keyboard behavior", () => {
  it("inserts four spaces for Tab", () => {
    expect(applyTabEdit("print('Hi')", 0, 0, false)).toMatchObject({
      value: "    print('Hi')",
      start: 4,
      end: 4,
    });
  });

  it("outdents selected lines with Shift+Tab", () => {
    expect(applyTabEdit("    x = 1\n    print(x)", 0, 24, true).value).toBe(
      "x = 1\nprint(x)",
    );
  });

  it("keeps indentation after Enter", () => {
    expect(applyEnterEdit("    print(i)", 12, 12).value).toBe(
      "    print(i)\n    ",
    );
  });

  it("adds one indent after a colon", () => {
    expect(applyEnterEdit("if True:", 8, 8).value).toBe("if True:\n    ");
  });

  it("blocks duplicate Run clicks while execution is active", async () => {
    let finish!: (value: {
      status: "success";
      output: string;
      message: string;
    }) => void;
    const run = vi.spyOn(executionService, "run").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    render(
      <PythonLessonEditor
        activity={testActivity}
        claimed={false}
        fontSize={15}
        onCheck={() => undefined}
        onReset={() => undefined}
      />,
    );
    const runButton = screen.getByRole("button", { name: "Run" });
    fireEvent.click(runButton);
    fireEvent.click(runButton);
    expect(run).toHaveBeenCalledTimes(1);
    await act(async () =>
      finish({ status: "success", output: "Hello", message: "Done" }),
    );
    expect(screen.getByText("Hello")).toBeTruthy();
    run.mockRestore();
  });
});

const testActivity: MicroActivity = {
  id: "lesson-test-try",
  lessonId: "lesson-test",
  topic: "Python Basics",
  kind: "try-code",
  title: "Try it",
  instruction: "Run this code.",
  explanation: "print() displays text.",
  starterCode: 'print("Hello")',
  expectedOutput: "Hello",
  validation: { strategy: "output" },
  xp: 15,
};
