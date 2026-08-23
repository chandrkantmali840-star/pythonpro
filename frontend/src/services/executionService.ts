export type ExecutionStatus = "success" | "empty" | "error" | "rejected";

export type ExecutionResult = {
  status: ExecutionStatus;
  output: string;
  message: string;
  error?: { type: string; line?: number; detail: string; tip?: string };
};

export type PythonRuntimeStatus = "idle" | "loading" | "ready" | "failed";

type WorkerResult = {
  type: "result";
  id: number;
  output: string;
  error?: string;
};

const EXECUTION_TIMEOUT_MS = 5_000;
let worker: Worker | null = null;
let runtimeStatus: PythonRuntimeStatus = "idle";
let readyPromise: Promise<void> | null = null;
let nextId = 0;
const listeners = new Set<() => void>();
const pending = new Map<
  number,
  {
    resolve: (result: ExecutionResult) => void;
    timer: ReturnType<typeof setTimeout>;
  }
>();

function setStatus(status: PythonRuntimeStatus) {
  runtimeStatus = status;
  listeners.forEach((listener) => listener());
}

function createWorker() {
  const nextWorker = new Worker(
    new URL("../workers/pythonWorker.ts", import.meta.url),
    { type: "module", name: "pythonpro-python" },
  );
  nextWorker.addEventListener("message", handleMessage);
  nextWorker.addEventListener("error", handleWorkerError);
  return nextWorker;
}

function handleMessage(
  event: MessageEvent<
    WorkerResult | { type: "ready" } | { type: "load-error"; error: string }
  >,
) {
  const message = event.data;
  if (message.type === "ready") {
    setStatus("ready");
    return;
  }
  if (message.type === "load-error") {
    setStatus("failed");
    return;
  }
  const request = pending.get(message.id);
  if (!request) return;
  clearTimeout(request.timer);
  pending.delete(message.id);
  request.resolve(toExecutionResult(message));
}

function handleWorkerError() {
  resetWorker("failed");
}

function resetWorker(status: PythonRuntimeStatus = "idle") {
  worker?.terminate();
  worker = null;
  readyPromise = null;
  setStatus(status);
}

function prepare() {
  if (runtimeStatus === "ready" && worker) return Promise.resolve();
  if (readyPromise) return readyPromise;
  setStatus("loading");
  readyPromise = new Promise<void>((resolve, reject) => {
    try {
      worker = createWorker();
    } catch (error) {
      setStatus("failed");
      readyPromise = null;
      reject(error);
      return;
    }
    const onMessage = (
      event: MessageEvent<{ type: string; error?: string }>,
    ) => {
      if (event.data.type === "ready") {
        worker?.removeEventListener("message", onMessage);
        resolve();
      } else if (event.data.type === "load-error") {
        worker?.removeEventListener("message", onMessage);
        readyPromise = null;
        reject(new Error(event.data.error || "Python could not be prepared."));
      }
    };
    worker.addEventListener("message", onMessage);
  });
  return readyPromise;
}

async function run({ code, stdin = "" }: { code: string; stdin?: string }) {
  if (code.length > 20_000) return rejected("Code must be under 20 KB.");
  if (!code.trim())
    return {
      status: "empty",
      output: "",
      message: "Program finished with no output.",
    } satisfies ExecutionResult;
  try {
    await prepare();
  } catch {
    return {
      status: "error",
      output: "",
      message: "Python could not be prepared.",
      error: {
        type: "Runtime unavailable",
        detail: "Check your internet connection, then try again.",
      },
    } satisfies ExecutionResult;
  }
  const id = ++nextId;
  return new Promise<ExecutionResult>((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      resetWorker();
      void prepare();
      resolve({
        status: "rejected",
        output: "",
        message: "Your program took too long to finish.",
        error: {
          type: "Execution stopped",
          detail:
            "Your program took too long to finish. Check for an infinite loop.",
          tip: "Check loop conditions and make sure they can become false.",
        },
      });
    }, EXECUTION_TIMEOUT_MS);
    pending.set(id, { resolve, timer });
    worker!.postMessage({ type: "run", id, code, stdin });
  });
}

export function toExecutionResult(message: WorkerResult): ExecutionResult {
  if (message.error) {
    const detail = cleanPythonError(message.error),
      type = detail.match(/(?:^|\n)([A-Za-z]+Error):/)?.[1] || "PythonError",
      line =
        Number(
          detail.match(/File "<(?:student-code|exec)>", line (\d+)/)?.[1],
        ) || undefined;
    return {
      status: "error",
      output: message.output,
      message: `${type}${line ? ` near line ${line}` : ""}.`,
      error: {
        type,
        line,
        detail,
        tip: beginnerTip(type),
      },
    };
  }
  return message.output
    ? {
        status: "success",
        output: message.output,
        message: "Program finished successfully.",
      }
    : {
        status: "empty",
        output: "",
        message: "Program finished with no output.",
      };
}

function cleanPythonError(error: string) {
  const lines = error.replace(/^PythonError:\s*/, "").split("\n"),
    studentFrame = lines.findIndex((line) => line.includes('File "<exec>"'));
  return (studentFrame >= 0 ? lines.slice(studentFrame) : lines)
    .join("\n")
    .trim();
}

function beginnerTip(type: string) {
  if (type === "SyntaxError")
    return "Check for a missing colon, bracket, quote, or indentation.";
  if (type === "NameError")
    return "Check the variable name and make sure it is assigned before use.";
  if (type === "TypeError")
    return "Check the types of the values used in this operation.";
  if (type === "IndexError")
    return "Check the list length and remember that indexes start at 0.";
  return undefined;
}

function rejected(detail: string): ExecutionResult {
  return {
    status: "rejected",
    output: "",
    message: detail,
    error: { type: "Execution stopped", detail },
  };
}

export const executionService = {
  mode: "pyodide-worker" as const,
  run,
  prepare,
  getStatus: () => runtimeStatus,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
