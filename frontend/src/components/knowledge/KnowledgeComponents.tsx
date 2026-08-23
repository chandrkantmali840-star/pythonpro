import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Check, Clipboard, Play, X } from "lucide-react";
import type {
  KnowledgeArticle,
  MethodReference,
  ReferenceRow,
} from "../../data/knowledge/types";
import { clipboardService } from "../../services/clipboardService";
import { AnswerCards, AnswerFeedback } from "../AnswerCards";

export function CodeExample({
  code,
  title = "Python",
  tryIt = true,
}: {
  code: string;
  title?: string;
  tryIt?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await clipboardService.copy(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 1800);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <span>{title}</span>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-700"
            onClick={copy}
            aria-label={`Copy ${title} code`}
          >
            {status === "copied" ? (
              <Check size={14} />
            ) : (
              <Clipboard size={14} />
            )}
            {status === "copied"
              ? "Copied"
              : status === "failed"
                ? "Copy failed"
                : "Copy"}
          </button>
          {tryIt && (
            <Link
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-700"
              to={`/playground?code=${encodeURIComponent(code)}`}
            >
              <Play size={14} /> Try It
            </Link>
          )}
        </div>
      </div>
      <pre className="m-0 rounded-none border-0 p-4">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ReferenceTable({ rows }: { rows: ReferenceRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="p-3">Item</th>
            <th className="p-3">Meaning</th>
            <th className="p-3">Example</th>
            <th className="p-3">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-t border-slate-200 align-top dark:border-slate-700"
              key={`${row.label}-${row.example}`}
            >
              <th className="p-3 font-mono text-indigo-700 dark:text-indigo-300">
                {row.label}
              </th>
              <td className="p-3">{row.meaning}</td>
              <td className="p-3 font-mono text-xs">{row.example || "—"}</td>
              <td className="p-3 font-mono text-xs">{row.result || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MethodCards({ methods }: { methods: MethodReference[] }) {
  if (!methods.length) return null;
  return (
    <div className="grid gap-3">
      {methods.map((method, index) => (
        <details
          className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
          open={index === 0}
          key={method.name}
        >
          <summary className="cursor-pointer font-bold text-indigo-700 dark:text-indigo-300">
            {method.name}{" "}
            <span className="ml-2 font-normal text-slate-500">
              {method.purpose}
            </span>
          </summary>
          <div className="mt-4 grid gap-3">
            <p>
              <b>Syntax:</b> <code>{method.syntax}</code>
            </p>
            <CodeExample
              code={method.example}
              title={`${method.name} example`}
            />
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
              <b>Expected result:</b> <code>{method.result}</code>
              {method.note && <p className="mt-1">{method.note}</p>}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

export function KnowledgePractice({ article }: { article: KnowledgeArticle }) {
  const [answer, setAnswer] = useState(""),
    [submitted, setSubmitted] = useState(false),
    [prediction, setPrediction] = useState(""),
    [predictionResult, setPredictionResult] = useState<boolean | null>(null);
  const checkPrediction = () =>
    setPredictionResult(
      normalize(prediction) === normalize(article.practice.prediction.answer),
    );
  return (
    <section
      id="practice"
      className="card border-indigo-200 dark:border-indigo-900"
    >
      <span className="badge">Quick practice</span>
      <h2 className="mt-3 text-xl font-black">
        Check your reference knowledge
      </h2>
      <div className="mt-5">
        <h3 className="font-bold">1. Quick MCQ</h3>
        <p className="mt-2">{article.practice.mcq.question}</p>
        <AnswerCards
          options={article.practice.mcq.options}
          value={answer}
          onChange={setAnswer}
          submitted={submitted}
          correctAnswer={article.practice.mcq.correctAnswer}
          onSubmit={() => answer && setSubmitted(true)}
          ariaLabel={`${article.title} quick check answers`}
        />
        {!submitted && (
          <button
            className="btn-primary mt-4"
            disabled={!answer}
            onClick={() => setSubmitted(true)}
          >
            Check answer
          </button>
        )}
        {submitted && (
          <AnswerFeedback
            correct={answer === article.practice.mcq.correctAnswer}
            selectedAnswer={answer}
            correctAnswer={article.practice.mcq.correctAnswer}
            explanation={article.practice.mcq.explanation}
            concept={article.title}
            onNext={() => {
              setAnswer("");
              setSubmitted(false);
            }}
            nextLabel="Try again"
          />
        )}
      </div>
      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="font-bold">2. Predict the output</h3>
        <p className="mt-2">{article.practice.prediction.question}</p>
        <div className="mt-3">
          <CodeExample
            code={article.practice.prediction.code}
            title="Prediction code"
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="field flex-1"
            aria-label="Predicted output"
            placeholder="Type the exact output"
            value={prediction}
            onChange={(event) => {
              setPrediction(event.target.value);
              setPredictionResult(null);
            }}
          />
          <button
            className="btn-secondary"
            disabled={!prediction.trim()}
            onClick={checkPrediction}
          >
            Check output
          </button>
        </div>
        {predictionResult !== null && (
          <div
            role="status"
            className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-sm ${predictionResult ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"}`}
          >
            {predictionResult ? <Check size={18} /> : <X size={18} />}
            <span>
              <b>{predictionResult ? "Correct" : "Not quite"}.</b>{" "}
              {article.practice.prediction.explanation} Expected:{" "}
              <code>{article.practice.prediction.answer}</code>
            </span>
          </div>
        )}
      </div>
      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h3 className="font-bold">3. Tiny coding challenge</h3>
        <p className="mt-2">{article.practice.challenge.prompt}</p>
        <p className="mt-2 text-sm text-slate-500">
          <b>Hint:</b> {article.practice.challenge.hint}
        </p>
        <Link
          className="btn-primary mt-4"
          to={`/playground?code=${encodeURIComponent(article.practice.challenge.starterCode)}`}
        >
          <Play size={16} />
          Open challenge in Playground
        </Link>
      </div>
    </section>
  );
}

export function BookmarkButton({
  article,
  active,
  onToggle,
}: {
  article: KnowledgeArticle;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={active ? "btn-primary" : "btn-secondary"}
      onClick={onToggle}
    >
      <Bookmark size={16} />
      {active ? "Bookmarked" : "Bookmark"}
    </button>
  );
}

const normalize = (value: string) =>
  value.trim().replace(/\r/g, "").replace(/\s+/g, " ").toLowerCase();
