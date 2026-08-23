import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { activitiesForLesson } from "../data/learning/interactiveLessons";
import { awardActivity, levelFor } from "../services/xpService";
import type { MicroActivity } from "../types";
import { ProgressBar } from "./ui";
import { soundService } from "../services/soundService";
import { AnswerCards, AnswerFeedback } from "./AnswerCards";
import { PythonLessonEditor } from "./PythonLessonEditor";

export function InteractiveLessonEngine({ lessonId }: { lessonId: string }) {
  const { state, update } = useApp(),
    activities = useMemo(() => activitiesForLesson(lessonId), [lessonId]);
  const firstOpen = activities.findIndex(
    (a) => !state.claimedXpActivities.includes(a.id),
  );
  const [index, setIndex] = useState(
      firstOpen < 0 ? activities.length - 1 : firstOpen,
    ),
    activity = activities[index],
    complete = activity && state.claimedXpActivities.includes(activity.id),
    level = levelFor(state.xp);
  if (!activity) return null;
  const finishLesson = () =>
    update((s) => ({
      ...s,
      completedLessons: Array.from(new Set([...s.completedLessons, lessonId])),
    }));
  return (
    <section className="card border-indigo-200 bg-gradient-to-b from-white to-indigo-50/40 dark:border-indigo-900 dark:from-slate-900 dark:to-indigo-950/20">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="badge">Interactive mission</span>
            <h2 className="mt-2 text-2xl font-black">
              {activity.topic} — Level {index + 1}
            </h2>
          </div>
          <div className="min-w-48">
            <div className="mb-1 flex justify-between text-xs">
              <span>
                Level {level.number}: {level.name}
              </span>
              <b>{state.xp} XP</b>
            </div>
            <ProgressBar value={level.progress} />
          </div>
        </div>
        <div
          className="mt-5 flex gap-1"
          aria-label={`Activity ${index + 1} of ${activities.length}`}
        >
          {activities.map((a, i) => (
            <button
              key={a.id}
              aria-label={`Go to step ${i + 1}: ${a.title}`}
              onClick={() => setIndex(i)}
              className={`h-2 flex-1 rounded-full ${state.claimedXpActivities.includes(a.id) ? "bg-emerald-500" : i === index ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Step {index + 1} of {activities.length} · {activity.title} · +
          {activity.xp} XP
        </p>
      </header>
      <Activity key={activity.id} activity={activity} />
      {complete && (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <b>✓ Activity complete · +{activity.xp} XP</b>
          <p className="mt-1 text-sm">{activity.explanation}</p>
        </div>
      )}
      <footer className="mt-6 flex justify-between gap-3">
        <button
          className="btn-secondary"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Previous
        </button>
        {index < activities.length - 1 ? (
          <button
            className="btn-primary"
            disabled={!complete}
            onClick={() => setIndex(index + 1)}
          >
            Next interaction
          </button>
        ) : (
          <button
            className="btn-primary"
            disabled={!complete}
            onClick={finishLesson}
          >
            <Trophy size={17} />
            Complete mission
          </button>
        )}
      </footer>
      {index === activities.length - 1 && complete && (
        <div className="mt-5 text-center">
          <p className="text-2xl">🎉</p>
          <h3 className="font-bold">Mission complete</h3>
          <p className="text-sm text-slate-500">
            You learned, predicted, coded, debugged, and practiced.
          </p>
        </div>
      )}
    </section>
  );
}

function Activity({ activity }: { activity: MicroActivity }) {
  const { state, update } = useApp(),
    [answer, setAnswer] = useState(""),
    [blanks, setBlanks] = useState<string[]>(
      activity.blankAnswers?.map(() => "") || [],
    ),
    [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null),
    [feedbackMessage, setFeedbackMessage] = useState(""),
    [xpGained, setXpGained] = useState(0),
    [hint, setHint] = useState(0),
    [lines, setLines] = useState(activity.lines || []);
  useEffect(() => {
    setAnswer("");
    setBlanks(activity.blankAnswers?.map(() => "") || []);
    setFeedback(null);
    setFeedbackMessage("");
    setXpGained(0);
    setHint(0);
    setLines(activity.lines || []);
  }, [activity.id]);
  const claimed = state.claimedXpActivities.includes(activity.id);
  const record = (correct: boolean) => {
    if (correct) soundService.correct(state.settings.sound);
    setXpGained(correct && !claimed ? activity.xp : 0);
    const result = {
      activityId: activity.id,
      topic: activity.topic,
      kind: activity.kind,
      correct,
      at: new Date().toISOString(),
    };
    update((s) =>
      correct
        ? awardActivity(s, result, activity.xp)
        : {
            ...s,
            learningActivityResults: [
              ...s.learningActivityResults.filter(
                (x) => x.activityId !== activity.id,
              ),
              result,
            ],
          },
    );
    setFeedback(correct ? "correct" : "incorrect");
  };
  const check = () => {
    if (activity.options) record(answer === activity.correctAnswer);
    else if (activity.blankAnswers)
      record(
        activity.blankAnswers.every(
          (expected, i) =>
            blanks[i]?.trim().toLowerCase() === expected.toLowerCase(),
        ),
      );
    else if (activity.correctOrder)
      record(lines.join("\n") === activity.correctOrder.join("\n"));
    else record(false);
  };
  const isCodeActivity =
    activity.kind === "try-code" ||
    activity.kind === "bug-hunt" ||
    activity.kind === "mini-challenge";
  if (activity.kind === "concept")
    return (
      <div>
        <h3 className="text-xl font-bold">{activity.title}</h3>
        <p className="mt-3 max-w-3xl leading-7">{activity.instruction}</p>
        {activity.code && (
          <pre className="mt-4">
            <code>{activity.code}</code>
          </pre>
        )}
        <ConceptVisualizer topic={activity.topic} />
        <button
          className="btn-primary mt-5"
          disabled={claimed}
          onClick={() => record(true)}
        >
          {claimed ? (
            <>
              <CheckCircle2 size={17} />
              Understood
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    );
  return (
    <div>
      <h3 className="text-xl font-bold">{activity.title}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {activity.instruction}
      </p>
      {activity.code && (
        <pre className="mt-4">
          <code>{activity.code}</code>
        </pre>
      )}
      {activity.options && (
        <AnswerCards
          options={activity.options}
          value={answer}
          onChange={setAnswer}
          submitted={claimed || feedback !== null}
          correctAnswer={activity.correctAnswer || ""}
          onSubmit={check}
          ariaLabel={`Answers for ${activity.title}`}
        />
      )}
      {activity.template && (
        <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-slate-100">
          {activity.template.split("___").map((part, i) => (
            <span key={`${part}-${i}`}>
              {part}
              {i < (activity.blankAnswers?.length || 0) && (
                <input
                  aria-label={`Missing code ${i + 1}`}
                  className="mx-2 w-24 rounded bg-slate-800 px-2 py-1"
                  value={blanks[i] || ""}
                  onChange={(e) =>
                    setBlanks(
                      blanks.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                />
              )}
            </span>
          ))}
        </div>
      )}
      {isCodeActivity && (
        <div className="mt-4">
          <PythonLessonEditor
            activity={activity}
            claimed={claimed}
            fontSize={state.settings.fontSize}
            onCheck={(correct, message) => {
              setFeedbackMessage(message);
              record(correct);
            }}
            onReset={() => {
              setFeedback(null);
              setFeedbackMessage("");
              setXpGained(0);
            }}
          />
        </div>
      )}
      {activity.correctOrder && (
        <div className="mt-4 space-y-2">
          {lines.map((line, i) => (
            <div
              key={`${line}-${i}`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            >
              <code className="flex-1 whitespace-pre">{line}</code>
              <button
                aria-label={`Move line ${i + 1} up`}
                disabled={i === 0 || claimed}
                onClick={() => setLines(move(lines, i, i - 1))}
              >
                <ArrowUp size={18} />
              </button>
              <button
                aria-label={`Move line ${i + 1} down`}
                disabled={i === lines.length - 1 || claimed}
                onClick={() => setLines(move(lines, i, i + 1))}
              >
                <ArrowDown size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      {activity.hints && (
        <div className="mt-4">
          <button
            className="btn-secondary"
            disabled={hint >= activity.hints.length + 2}
            onClick={() => setHint(hint + 1)}
          >
            <Lightbulb size={16} />
            {hint === 0
              ? "Hint 1"
              : hint < activity.hints.length
                ? `Hint ${hint + 1}`
                : hint === activity.hints.length
                  ? "Show Concept"
                  : "Show Solution"}
          </button>
          {hint > 0 && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              {hint <= activity.hints.length ? (
                activity.hints[hint - 1]
              ) : hint === activity.hints.length + 1 ? (
                <>
                  <b>Concept:</b> {activity.explanation}
                </>
              ) : (
                <>
                  <b>Solution:</b>
                  <pre className="mt-2">
                    {activity.solution || activity.correctAnswer}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {!activity.options && !isCodeActivity && (
        <button
          className="btn-primary mt-5"
          disabled={
            claimed ||
            (!answer && !activity.correctOrder && !blanks.some(Boolean))
          }
          onClick={check}
        >
          Check answer
        </button>
      )}
      {activity.options && !claimed && !feedback && (
        <button className="btn-primary mt-5" disabled={!answer} onClick={check}>
          Submit Answer
        </button>
      )}
      {activity.options && feedback && (
        <AnswerFeedback
          correct={feedback === "correct"}
          selectedAnswer={answer}
          correctAnswer={activity.correctAnswer || ""}
          explanation={activity.explanation}
          concept={activity.topic}
          xpGained={xpGained}
          onNext={
            feedback === "incorrect"
              ? () => {
                  setAnswer("");
                  setFeedback(null);
                  setXpGained(0);
                }
              : undefined
          }
          nextLabel="Try again"
        />
      )}
      {!activity.options && feedback && (
        <div
          role="status"
          className={`mt-4 rounded-xl p-4 ${feedback === "correct" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
        >
          <b>{feedback === "correct" ? "Correct ✓" : "Not yet ✕"}</b>
          <p className="mt-1 text-sm">
            {feedback === "correct"
              ? feedbackMessage || activity.explanation
              : feedbackMessage ||
                "Check the code and use a hint. Your progress is safe."}
          </p>
        </div>
      )}
    </div>
  );
}
function move<T>(items: T[], from: number, to: number) {
  const next = [...items],
    [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
function ConceptVisualizer({ topic }: { topic: string }) {
  if (topic === "Variables")
    return (
      <div className="mt-4 rounded-xl border border-indigo-200 p-4">
        <b>Memory</b>
        <div className="mt-2 flex items-center gap-3">
          <code>x</code>
          <span>→</span>
          <span className="rounded bg-indigo-100 px-3 py-1 text-indigo-800">
            5
          </span>
          <span>then</span>
          <code>x = x + 2</code>
          <span>→ 7</span>
        </div>
      </div>
    );
  if (topic === "Lists")
    return (
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {["0 → Apple", "1 → Mango", "2 → Banana"].map((x) => (
          <div
            className="rounded-lg bg-indigo-50 p-2 text-sm text-indigo-800"
            key={x}
          >
            {x}
          </div>
        ))}
      </div>
    );
  if (topic.includes("Loop"))
    return (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["i = 0", "i = 1", "i = 2"].map((x) => (
          <div
            className="rounded-lg bg-indigo-50 p-2 text-center text-indigo-800"
            key={x}
          >
            {x}
          </div>
        ))}
      </div>
    );
  return null;
}
