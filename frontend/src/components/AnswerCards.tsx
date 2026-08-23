import { useEffect } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
const letters = ["A", "B", "C", "D"];
export function isCodeOption(value: string) {
  return (
    value.includes("\n") ||
    /\b(print|def|return|class|for|while|if|elif|import)\s*[(: ]/.test(value) ||
    /^\s*[\w.[\]'"-]+\s*=/.test(value)
  );
}
export function useSingleColumn(options: string[]) {
  return options.some((option) => option.length > 76 || isCodeOption(option));
}
export function shortcutIndex(key: string) {
  const normalized = key.toUpperCase();
  if (["1", "2", "3", "4"].includes(normalized)) return Number(normalized) - 1;
  return letters.indexOf(normalized);
}
type AnswerCardsProps = {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  submitted?: boolean;
  correctAnswer?: string;
  onSubmit?: () => void;
  enableShortcuts?: boolean;
  ariaLabel?: string;
};
export function AnswerCards({
  options,
  value,
  onChange,
  submitted = false,
  correctAnswer,
  onSubmit,
  enableShortcuts = true,
  ariaLabel = "Answer options",
}: AnswerCardsProps) {
  const single = useSingleColumn(options);
  useEffect(() => {
    if (!enableShortcuts) return;
    const handle = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.matches("input, textarea, select, [contenteditable='true']")
      )
        return;
      const index = shortcutIndex(event.key);
      if (index >= 0 && index < options.length && !submitted) {
        event.preventDefault();
        onChange(options[index]);
        return;
      }
      if (event.key === "Enter" && value && !submitted && onSubmit) {
        event.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [enableShortcuts, onChange, onSubmit, options, submitted, value]);
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`mt-5 grid gap-3 ${single ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
    >
      {options.map((option, index) => {
        const selected = value === option,
          correct = submitted && option === correctAnswer,
          wrong = submitted && selected && option !== correctAnswer;
        const state = correct
          ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-100"
          : wrong
            ? "border-red-500 bg-red-50 text-red-950 dark:border-red-600 dark:bg-red-950/40 dark:text-red-100"
            : selected
              ? "border-indigo-500 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-500 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-100"
              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20";
        return (
          <button
            key={`${option}-${index}`}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={submitted}
            onClick={() => onChange(option)}
            className={`group relative min-h-24 rounded-2xl border p-4 text-left transition duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 ${state}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl border text-sm font-black ${correct ? "border-emerald-500 bg-emerald-600 text-white" : wrong ? "border-red-500 bg-red-600 text-white" : selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-slate-50 text-slate-700 group-hover:border-indigo-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                {letters[index]}
              </span>
              <div className="min-w-0 flex-1">
                {isCodeOption(option) ? (
                  <pre className="m-0 whitespace-pre-wrap bg-transparent p-0 text-sm text-inherit">
                    <code>{option}</code>
                  </pre>
                ) : (
                  <span className="block leading-6">{option}</span>
                )}
                {submitted && (correct || wrong) && (
                  <span
                    className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${correct ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}
                  >
                    {correct ? (
                      <>
                        <Check size={15} />
                        Correct answer
                      </>
                    ) : (
                      <>
                        <X size={15} />
                        Your answer
                      </>
                    )}
                  </span>
                )}
              </div>
              {selected && !submitted && (
                <Check
                  aria-hidden="true"
                  className="shrink-0 text-indigo-600"
                  size={19}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
type FeedbackProps = {
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  concept?: string;
  reviewPath?: string;
  xpGained?: number;
  onNext?: () => void;
  nextLabel?: string;
};
export function AnswerFeedback({
  correct,
  selectedAnswer,
  correctAnswer,
  explanation,
  concept,
  reviewPath,
  xpGained = 0,
  onNext,
  nextLabel,
}: FeedbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-5 rounded-2xl border p-5 ${correct ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" : "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black">
            {correct ? (
              <>
                <Check className="text-emerald-600" />
                Correct!
              </>
            ) : (
              <>
                <X className="text-amber-600" />
                Almost!
              </>
            )}
          </h3>
          {!correct && (
            <p className="mt-2 text-sm">
              Your answer: <b>{selectedAnswer}</b>
              <br />
              Correct answer: <b>{correctAnswer}</b>
            </p>
          )}
        </div>
        {xpGained > 0 && (
          <span className="badge whitespace-nowrap">+{xpGained} XP</span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">
          Explanation
        </p>
        <p className="mt-1 leading-6">{explanation}</p>
        {concept && (
          <p className="mt-3 text-sm">
            <b>Concept:</b> {concept}
          </p>
        )}
      </div>
      {(reviewPath || onNext) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {reviewPath && (
            <Link className="btn-secondary" to={reviewPath}>
              Review concept
            </Link>
          )}
          {onNext && (
            <button className="btn-primary" onClick={onNext}>
              {nextLabel ||
                (correct ? "Next question" : "Try similar question")}
              <ChevronRight size={17} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
