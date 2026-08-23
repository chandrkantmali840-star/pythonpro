/// <reference lib="webworker" />

const PYODIDE_VERSION = "314.0.5";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type Pyodide = {
  runPythonAsync(code: string): Promise<unknown>;
  setStdin(options: { stdin: () => string | null; isatty?: boolean }): void;
  setStdout(options: { batched: (text: string) => void }): void;
  setStderr(options: { batched: (text: string) => void }): void;
};

type PyodideModule = {
  loadPyodide(options: { indexURL: string }): Promise<Pyodide>;
};

const workerScope = self as DedicatedWorkerGlobalScope;
const pyodidePromise = loadRuntime();

async function loadRuntime() {
  try {
    const module = (await import(
      /* @vite-ignore */ `${PYODIDE_BASE_URL}pyodide.mjs`
    )) as PyodideModule;
    const pyodide = await module.loadPyodide({ indexURL: PYODIDE_BASE_URL });
    workerScope.postMessage({ type: "ready" });
    return pyodide;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    workerScope.postMessage({ type: "load-error", error: detail });
    throw error;
  }
}

workerScope.onmessage = async (
  event: MessageEvent<{
    type: "run";
    id: number;
    code: string;
    stdin: string;
  }>,
) => {
  if (event.data.type !== "run") return;
  const { id, code, stdin } = event.data;
  const output: string[] = [];
  const errors: string[] = [];
  try {
    const pyodide = await pyodidePromise;
    const inputLines = stdin.replace(/\r\n?/g, "\n").split("\n");
    let inputIndex = 0;
    pyodide.setStdin({
      stdin: () =>
        inputIndex < inputLines.length ? inputLines[inputIndex++] : null,
      isatty: false,
    });
    pyodide.setStdout({ batched: (text) => output.push(text) });
    pyodide.setStderr({ batched: (text) => errors.push(text) });
    await pyodide.runPythonAsync(code);
    workerScope.postMessage({
      type: "result",
      id,
      output: output.join("\n"),
      error: errors.length ? errors.join("\n") : undefined,
    });
  } catch (error) {
    workerScope.postMessage({
      type: "result",
      id,
      output: output.join("\n"),
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export {};
