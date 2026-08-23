import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check, Play, RotateCcw, Trash2 } from "lucide-react";
import type { MicroActivity } from "../types";
import {
  executionService,
  type ExecutionResult,
} from "../services/executionService";
import { draftService } from "../services/draftService";
import { validateChallenge } from "../services/challengeValidationService";

type Props = {
  activity: MicroActivity;
  claimed: boolean;
  fontSize: number;
  onCheck: (correct: boolean, message: string) => void;
  onReset: () => void;
};

export function PythonLessonEditor({
  activity,
  claimed,
  fontSize,
  onCheck,
  onReset,
}: Props) {
  const starter = activity.starterCode || "",
    [code, setCode] = useState(() => draftService.load(activity.id) ?? starter),
    [stdin, setStdin] = useState(""),
    [execution, setExecution] = useState<ExecutionResult | null>(null),
    [running, setRunning] = useState(false),
    [checking, setChecking] = useState(false),
    [saveState, setSaveState] = useState<"saved" | "saving" | "starter">(
      draftService.load(activity.id) ? "saved" : "starter",
    ),
    textareaRef = useRef<HTMLTextAreaElement>(null),
    gutterRef = useRef<HTMLPreElement>(null),
    busyRef = useRef(false),
    lineNumbers = useMemo(
      () =>
        Array.from(
          { length: Math.max(1, code.split("\n").length) },
          (_, index) => index + 1,
        ).join("\n"),
      [code],
    ),
    needsInput = code.includes("input("),
    runtimeStatus = useSyncExternalStore(
      executionService.subscribe,
      executionService.getStatus,
      executionService.getStatus,
    );

  useEffect(() => {
    void executionService.prepare().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (code === starter) {
      draftService.remove(activity.id);
      setSaveState("starter");
      return;
    }
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      draftService.save(activity.id, code);
      setSaveState("saved");
    }, 600);
    return () => window.clearTimeout(timer);
  }, [activity.id, code, starter]);

  const execute = async () => {
    if (busyRef.current || !code.trim()) return null;
    busyRef.current = true;
    setRunning(true);
    setExecution(null);
    try {
      const next = await executionService.run({ code, stdin });
      setExecution(next);
      return next;
    } finally {
      busyRef.current = false;
      setRunning(false);
    }
  };

  const check = async () => {
    if (busyRef.current || claimed || !code.trim()) return;
    setChecking(true);
    const next = await execute();
    setChecking(false);
    if (!next) return;
    const validation = validateChallenge(activity, code, next);
    onCheck(validation.correct, validation.message);
  };

  const reset = () => {
    draftService.remove(activity.id);
    setCode(starter);
    setStdin("");
    setExecution(null);
    setSaveState("starter");
    onReset();
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const changeCode = (value: string) => {
    setCode(value);
    setExecution(null);
    onReset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    if (event.key === "Tab") {
      event.preventDefault();
      const edit = applyTabEdit(
        code,
        target.selectionStart,
        target.selectionEnd,
        event.shiftKey,
      );
      changeCode(edit.value);
      restoreSelection(edit.start, edit.end);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const edit = applyEnterEdit(
        code,
        target.selectionStart,
        target.selectionEnd,
      );
      changeCode(edit.value);
      restoreSelection(edit.start, edit.end);
    }
  };
  const restoreSelection = (start: number, end: number) =>
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <div>
          <p className="font-bold">Python Editor</p>
          <p className="text-xs text-slate-500">Browser-isolated Python</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="badge">
            {runtimeStatus === "ready"
              ? "Python 3 • Ready"
              : runtimeStatus === "failed"
                ? "Python unavailable"
                : "Preparing Python..."}
          </span>
          <span aria-live="polite">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved ✓"
                : "Starter code"}
          </span>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] bg-slate-950 text-slate-100">
        <pre
          ref={gutterRef}
          aria-hidden="true"
          className="m-0 h-72 overflow-hidden rounded-none border-0 bg-slate-900 px-3 py-4 text-right font-mono leading-6 text-slate-500"
          style={{ fontSize }}
        >
          {lineNumbers}
        </pre>
        <textarea
          ref={textareaRef}
          aria-label={`${activity.title} Python editor`}
          spellCheck={false}
          readOnly={running}
          aria-busy={running}
          className="h-72 min-w-0 resize-y overflow-auto whitespace-pre border-0 bg-slate-950 p-4 font-mono leading-6 text-slate-100 caret-white outline-none selection:bg-indigo-500/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
          style={{ fontSize, tabSize: 4 }}
          value={code}
          onChange={(event) => changeCode(event.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={(event) => {
            if (gutterRef.current)
              gutterRef.current.scrollTop = event.currentTarget.scrollTop;
          }}
        />
      </div>

      {needsInput && (
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <label className="text-sm font-bold" htmlFor={`${activity.id}-stdin`}>
            Input
          </label>
          <textarea
            id={`${activity.id}-stdin`}
            className="field mt-2 min-h-20 font-mono"
            value={stdin}
            onChange={(event) => setStdin(event.target.value)}
            placeholder="Enter one input value per line"
          />
          <p className="mt-2 text-xs text-slate-500">
            Each line is provided to input() in order.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
        <button
          className="btn-primary"
          disabled={runtimeStatus !== "ready" || running || !code.trim()}
          onClick={execute}
        >
          <Play size={16} />
          {running && !checking ? "Running…" : "Run"}
        </button>
        <button
          className="btn-secondary"
          disabled={
            runtimeStatus !== "ready" ||
            running ||
            checking ||
            claimed ||
            !code.trim()
          }
          onClick={check}
        >
          <Check size={16} />
          {checking ? "Checking…" : claimed ? "Completed ✓" : "Check Answer"}
        </button>
        <button className="btn-secondary" disabled={running} onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          className="btn-secondary sm:ml-auto"
          disabled={!execution || running}
          onClick={() => setExecution(null)}
        >
          <Trash2 size={16} />
          Clear Output
        </button>
      </div>

      <ExecutionConsole
        execution={execution}
        running={running}
        runtimeStatus={runtimeStatus}
      />
    </section>
  );
}

export function ExecutionConsole({
  execution,
  running,
  runtimeStatus,
}: {
  execution: ExecutionResult | null;
  running: boolean;
  runtimeStatus: "idle" | "loading" | "ready" | "failed";
}) {
  const state = running
    ? "RUNNING"
    : execution?.status === "error" || execution?.status === "rejected"
      ? "ERROR"
      : execution?.status === "success"
        ? "SUCCESS"
        : execution?.status === "empty"
          ? "NO OUTPUT"
          : runtimeStatus === "loading" || runtimeStatus === "idle"
            ? "LOADING"
            : "READY";
  return (
    <div
      className="min-h-32 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black tracking-wider text-slate-500">
          OUTPUT
        </p>
        <span
          className={`text-xs font-bold ${state === "SUCCESS" ? "text-emerald-600" : state === "ERROR" ? "text-red-600" : "text-slate-500"}`}
        >
          {state}
        </span>
      </div>
      {running ? (
        <p className="text-sm text-slate-500">Running…</p>
      ) : execution?.status === "success" ? (
        <pre className="m-0 max-h-64 overflow-auto whitespace-pre-wrap break-words border-0 bg-transparent p-0 text-sm text-slate-900 dark:text-slate-100">
          <code>{execution.output}</code>
        </pre>
      ) : execution?.status === "empty" ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Program finished with no output.
        </p>
      ) : execution ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          <p className="font-bold">
            {execution.error?.type || "Could not run"}
            {execution.error?.line ? ` · line ${execution.error.line}` : ""}
          </p>
          <p className="mt-1">{execution.error?.detail || execution.message}</p>
          {execution.error?.tip && (
            <p className="mt-2 text-xs">
              <b>Try this:</b> {execution.error.tip}
            </p>
          )}
        </div>
      ) : runtimeStatus === "loading" || runtimeStatus === "idle" ? (
        <p className="text-sm text-slate-500">Preparing Python...</p>
      ) : (
        <p className="text-sm text-slate-500">
          Run your code to see the output.
        </p>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Python runs in an isolated browser worker, not on the Flask server.
      </p>
    </div>
  );
}

export function applyTabEdit(
  value: string,
  start: number,
  end: number,
  outdent: boolean,
) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  if (start === end && !outdent) {
    return {
      value: value.slice(0, start) + "    " + value.slice(end),
      start: start + 4,
      end: start + 4,
    };
  }
  const blockEnd = end > start && value[end - 1] === "\n" ? end - 1 : end,
    lineEnd = value.indexOf("\n", blockEnd),
    selectionEnd = lineEnd === -1 ? value.length : lineEnd,
    block = value.slice(lineStart, selectionEnd),
    lines = block.split("\n");
  if (outdent) {
    const removed = lines.map((line) =>
        Math.min(4, line.match(/^ */)?.[0].length || 0),
      ),
      next = lines.map((line, index) => line.slice(removed[index])).join("\n");
    return {
      value: value.slice(0, lineStart) + next + value.slice(selectionEnd),
      start: Math.max(lineStart, start - removed[0]),
      end: Math.max(
        lineStart,
        end - removed.reduce((sum, count) => sum + count, 0),
      ),
    };
  }
  const next = lines.map((line) => `    ${line}`).join("\n");
  return {
    value: value.slice(0, lineStart) + next + value.slice(selectionEnd),
    start: start + 4,
    end: end + 4 * lines.length,
  };
}

export function applyEnterEdit(value: string, start: number, end: number) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1,
    before = value.slice(lineStart, start),
    baseIndent = before.match(/^\s*/)?.[0] || "",
    indent = baseIndent + (before.trimEnd().endsWith(":") ? "    " : ""),
    inserted = `\n${indent}`,
    position = start + inserted.length;
  return {
    value: value.slice(0, start) + inserted + value.slice(end),
    start: position,
    end: position,
  };
}
