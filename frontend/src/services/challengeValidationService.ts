import type { MicroActivity } from "../types";
import type { ExecutionResult } from "./executionService";

export function normalizeOutput(value: string, preserveWhitespace = false) {
  const normalized = value.replace(/\r\n?/g, "\n");
  if (preserveWhitespace) return normalized;
  return normalized
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function validateChallenge(
  activity: MicroActivity,
  code: string,
  execution: ExecutionResult,
) {
  const strategy = activity.validation?.strategy || "structure";
  if (execution.status === "error" || execution.status === "rejected")
    return { correct: false, message: execution.message };
  if (strategy === "output") {
    if (!activity.expectedOutput)
      return {
        correct: false,
        message: "This activity has no expected output configured.",
      };
    const correct =
      normalizeOutput(
        execution.output,
        activity.validation?.preserveWhitespace,
      ) ===
      normalizeOutput(
        activity.expectedOutput,
        activity.validation?.preserveWhitespace,
      );
    return {
      correct,
      message: correct
        ? "Your program produced the expected output."
        : "The output is different. Check the values and order, then run it again.",
    };
  }
  if (strategy === "custom" && activity.kind === "bug-hunt") {
    const changed =
        normalizeCode(code) !== normalizeCode(activity.starterCode || ""),
      meaningful = /\b(print|def|class|for|if|return)\b|[A-Za-z_]\w*\s*=/.test(
        code,
      ),
      runnable = execution.status === "success" || execution.status === "empty",
      required = activity.validation?.requiredTokens || [],
      hasRequiredFix = required.every((token) => code.includes(token));
    return {
      correct: changed && meaningful && runnable && hasRequiredFix,
      message:
        changed && meaningful && runnable && hasRequiredFix
          ? "The original problem is fixed or safely handled."
          : "The problem is still present. Run the code and check the error message.",
    };
  }
  const required =
    activity.validation?.requiredTokens ||
    (activity.expectedCode ? [activity.expectedCode] : []);
  const correct = required.every((token) =>
    token.length === 1
      ? code.includes(token)
      : new RegExp(`\\b${escapeRegex(token)}\\b`, "i").test(code),
  );
  return {
    correct,
    message: correct
      ? "Your code uses the required idea."
      : `Your code still needs: ${required.join(", ")}.`,
  };
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeCode = (value: string) => value.replace(/\r\n?/g, "\n").trim();
