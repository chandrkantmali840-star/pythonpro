import { describe, expect, it } from "vitest";
import { executionService, toExecutionResult } from "./executionService";

describe("Pyodide Python execution service", () => {
  it("uses the browser worker runtime", () => {
    expect(executionService.mode).toBe("pyodide-worker");
  });

  it("rejects oversized code before starting Python", async () => {
    await expect(
      executionService.run({ code: "x".repeat(20_001) }),
    ).resolves.toMatchObject({ status: "rejected" });
  });

  it("returns a clear empty-program result before starting Python", async () => {
    await expect(executionService.run({ code: "   " })).resolves.toMatchObject({
      status: "empty",
      message: "Program finished with no output.",
    });
  });

  it("maps real stdout to a successful result", () => {
    expect(
      toExecutionResult({ type: "result", id: 1, output: "Hello Python" }),
    ).toMatchObject({ status: "success", output: "Hello Python" });
  });

  it("preserves real Python errors and source lines", () => {
    const error = [
      "Traceback (most recent call last):",
      '  File "<exec>", line 2, in <module>',
      "NameError: name 'missing' is not defined",
    ].join("\n");
    expect(
      toExecutionResult({ type: "result", id: 1, output: "", error }),
    ).toMatchObject({
      status: "error",
      error: { type: "NameError", line: 2 },
    });
  });
});
