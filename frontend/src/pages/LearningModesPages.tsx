import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Bug, Code2, Save, Swords } from "lucide-react";
import { PageTitle, ProgressBar } from "../components/ui";
import { useApp } from "../context/AppContext";
import { lessons } from "../data/content";
import { questionService } from "../data/questionService";
import { levelFor, topicAccuracy } from "../services/xpService";
import { AnswerCards, AnswerFeedback } from "../components/AnswerCards";
import {
  applyEnterEdit,
  applyTabEdit,
  ExecutionConsole,
} from "../components/PythonLessonEditor";
import {
  executionService,
  type ExecutionResult,
} from "../services/executionService";
import { recordMeaningfulActivity } from "../services/streakService";
const paths = [
  {
    name: "Python Beginner",
    icon: "🌱",
    modules: [
      "Python Introduction",
      "Variables",
      "Conditional Statements",
      "For Loops",
      "Strings",
      "Lists",
    ],
  },
  {
    name: "Python Programmer",
    icon: "💻",
    modules: ["Functions", "OOP", "File Handling", "Testing and Debugging"],
  },
  {
    name: "Problem Solving",
    icon: "🧩",
    modules: ["Searching", "Sorting", "Stacks", "Queues", "Trees", "Graphs"],
  },
  {
    name: "Python for AI",
    icon: "🤖",
    modules: ["Lists", "Functions", "Type Hints", "APIs"],
  },
  {
    name: "Python Web Development",
    icon: "🌐",
    modules: ["APIs", "SQLite", "Flask Basics", "FastAPI Basics"],
  },
  {
    name: "Python for Data",
    icon: "📊",
    modules: ["Lists", "Dictionaries", "JSON", "File Handling"],
  },
  {
    name: "Python Interview Preparation",
    icon: "🎯",
    modules: ["Mutable vs Immutable", "OOP", "Algorithms", "Time Complexity"],
  },
];
export function Missions() {
  const { state, update } = useApp();
  return (
    <div className="page">
      <PageTitle
        title="Mission Paths"
        subtitle="Choose a goal. Lessons are reused in focused roadmaps—your progress remains shared."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {paths.map((p) => (
          <section
            className={`card ${state.selectedPath === p.name ? "border-indigo-500" : ""}`}
            key={p.name}
          >
            <div className="text-3xl">{p.icon}</div>
            <h2 className="mt-2 text-xl font-bold">{p.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {p.modules.join(" → ")}
            </p>
            <button
              className="btn-primary mt-4"
              onClick={() => update((s) => ({ ...s, selectedPath: p.name }))}
            >
              {state.selectedPath === p.name ? "Selected ✓" : "Choose path"}
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.modules.map((name) => {
                const l = lessons.find((x) => x.module === name);
                return l ? (
                  <Link
                    className="badge"
                    key={name}
                    to={`/learn/${l.slug}/${l.id}`}
                  >
                    {name}
                  </Link>
                ) : null;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
const battles = [
  {
    id: "basics-boss",
    title: "Python Basics Boss Battle",
    topics: [
      "Python Basics",
      "Variables",
      "Data Types",
      "Operators",
      "Conditions",
    ],
  },
  {
    id: "structures-boss",
    title: "Data Structures Boss Battle",
    topics: ["Strings", "Lists", "Tuples", "Sets", "Dictionaries"],
  },
  {
    id: "oop-boss",
    title: "OOP Boss Battle",
    topics: ["OOP", "Classes", "Inheritance", "Polymorphism"],
  },
];
export function BossBattles() {
  const { state, update } = useApp(),
    [selected, setSelected] = useState(battles[0]),
    qs = useMemo(() => questionService.random(10), [selected.id]),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [result, setResult] = useState<number | null>(null);
  const submit = () => {
    const score =
      qs.filter((q) => answers[q.id] === q.correctAnswer).length * 10;
    setResult(score);
    if (score >= 70 && !state.bossBattlesPassed.includes(selected.id))
      update((s) =>
        recordMeaningfulActivity(
          {
            ...s,
            xp: s.xp + 100,
            bossBattlesPassed: [...s.bossBattlesPassed, selected.id],
            claimedXpActivities: [
              ...s.claimedXpActivities,
              `boss-${selected.id}`,
            ],
          },
          `boss:${selected.id}`,
        ),
      );
  };
  return (
    <div className="page">
      <PageTitle
        title="Boss Battles"
        subtitle="Mixed concept, output, debugging, and code-reading checks. Pass at 70%."
      />
      <div className="flex flex-wrap gap-2">
        {battles.map((b) => (
          <button
            className={selected.id === b.id ? "btn-primary" : "btn-secondary"}
            onClick={() => {
              setSelected(b);
              setAnswers({});
              setResult(null);
            }}
            key={b.id}
          >
            {state.bossBattlesPassed.includes(b.id) ? "✓ " : ""}
            {b.title}
          </button>
        ))}
      </div>
      <section className="card">
        <div className="flex items-center gap-3">
          <Swords className="text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold">{selected.title}</h2>
            <p className="text-sm text-slate-500">
              10 challenges · +100 XP · unlock badge
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-6">
          {qs.map((q, i) => (
            <div key={q.id}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                  {q.topic}
                </span>
                <span className="badge">{q.difficulty}</span>
              </div>
              <p className="mb-2 text-sm text-slate-500">
                Question {i + 1} of {qs.length} · {q.type}
              </p>
              <p className="font-semibold">{q.question}</p>
              {q.code && (
                <pre className="mt-4">
                  <code>{q.code}</code>
                </pre>
              )}
              <AnswerCards
                options={q.options}
                value={answers[q.id] || ""}
                onChange={(option) =>
                  setAnswers((current) => ({
                    ...current,
                    [q.id]: option,
                  }))
                }
                submitted={result !== null}
                correctAnswer={q.correctAnswer}
                enableShortcuts={false}
                ariaLabel={`Boss battle answers for question ${i + 1}`}
              />
              {result !== null && (
                <AnswerFeedback
                  correct={answers[q.id] === q.correctAnswer}
                  selectedAnswer={answers[q.id] || "Skipped"}
                  correctAnswer={q.correctAnswer}
                  explanation={q.explanation}
                  concept={q.subtopic || q.topic}
                />
              )}
            </div>
          ))}
        </div>
        {result === null ? (
          <button
            className="btn-primary mt-6"
            disabled={Object.keys(answers).length === 0}
            onClick={submit}
          >
            Submit battle
          </button>
        ) : (
          <div
            className={`mt-6 rounded-xl p-5 ${result >= 70 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}
          >
            <h3 className="text-xl font-bold">
              {result >= 70 ? "Boss defeated! 🎉" : "Train and retry"}
            </h3>
            <p>
              {result}% ·{" "}
              {result >= 70
                ? "+100 XP and Boss Slayer progress"
                : "70% is required to pass."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
export function Revision() {
  const { state } = useApp(),
    mastery = topicAccuracy(state),
    weak = mastery.filter((x) => x.accuracy < 70),
    later = mastery.filter((x) => x.accuracy >= 70 && x.accuracy < 90),
    muchLater = mastery.filter((x) => x.accuracy >= 90),
    incorrect = state.attempts
      .filter((x) => !x.correct)
      .slice(-10)
      .reverse();
  return (
    <div className="page">
      <PageTitle
        title="Revision Mode"
        subtitle="Rule-based review prioritizes incorrect and weak material without repeating mastered easy work."
      />
      <section className="card">
        <h2 className="font-bold">Needs review soon</h2>
        {weak.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {weak.map((x) => (
              <Link
                className="btn-secondary"
                to={`/practice/${encodeURIComponent(x.topic)}`}
                key={x.topic}
              >
                {x.topic} · {x.accuracy}%
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-slate-500">
            Complete some activities to generate a personalized revision queue.
          </p>
        )}
      </section>
      <section className="card">
        <h2 className="font-bold">Spaced review schedule</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Review later
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {later.map((x) => x.topic).join(", ") || "No topics scheduled"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Review much later
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {muchLater.map((x) => x.topic).join(", ") ||
                "No mastered topics yet"}
            </p>
          </div>
        </div>
      </section>
      <section className="card">
        <h2 className="font-bold">Incorrect questions</h2>
        {incorrect.length ? (
          <div className="mt-3 space-y-2">
            {incorrect.map((x) => (
              <Link
                className="block rounded-lg border p-3"
                key={x.questionId}
                to="/practice/random"
              >
                Review {x.questionId} · review soon
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-slate-500">
            No incorrect practice answers are waiting.
          </p>
        )}
      </section>
    </div>
  );
}
export function InterviewMode() {
  const { state, update } = useApp(),
    [mode, setMode] = useState("Rapid Fire"),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [result, setResult] = useState<{ score: number; seconds: number } | null>(
      null,
    ),
    started = useMemo(() => Date.now(), [mode]);
  const type =
      mode === "Output Prediction"
        ? "Output Prediction"
        : mode === "Debugging"
          ? "Debugging"
          : mode === "Conceptual"
            ? "Best Practices / Interview"
            : "Concept MCQ",
    qs = useMemo(() => questionService.filter({ type }).slice(0, 10), [type]);
  const submit = () => {
    const correct = qs.filter((q) => answers[q.id] === q.correctAnswer).length,
      seconds = Math.round((Date.now() - started) / 1000),
      key = `interview-${mode}`,
      earns = !state.claimedXpActivities.includes(key);
    setResult({ score: correct, seconds });
    update((s) =>
      recordMeaningfulActivity(
        {
          ...s,
          xp: s.xp + (earns ? 40 : 0),
          claimedXpActivities: earns
            ? [...s.claimedXpActivities, key]
            : s.claimedXpActivities,
          attempts: [
            ...s.attempts,
            ...qs.map((q) => ({
              questionId: q.id,
              answer: answers[q.id] || "",
              correct: answers[q.id] === q.correctAnswer,
              at: new Date().toISOString(),
            })),
          ],
        },
        `interview:${mode}`,
      ),
    );
  };
  return (
    <div className="page">
      <PageTitle
        title="Python Interview Mode"
        subtitle="Timed practice with accuracy and weak-area tracking."
      />
      <div className="flex flex-wrap gap-2">
        {[
          "Rapid Fire",
          "Output Prediction",
          "Debugging",
          "Conceptual",
          "Coding",
        ].map((x) => (
          <button
            className={mode === x ? "btn-primary" : "btn-secondary"}
            key={x}
            onClick={() => {
              setMode(x);
              setAnswers({});
              setResult(null);
            }}
          >
            {x}
          </button>
        ))}
      </div>
      {mode === "Coding" ? (
        <section className="card">
          <h2 className="font-bold">Coding interview practice</h2>
          <p className="mt-2 text-slate-500">
            Solve timed problems and submit against the safe mock judge.
          </p>
          <Link className="btn-primary mt-4" to="/coding">
            Open coding challenges
          </Link>
        </section>
      ) : (
        <section className="card space-y-5">
          {qs.map((q, i) => (
            <div key={q.id}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                  {q.topic}
                </span>
                <span className="badge">{q.difficulty}</span>
              </div>
              <p className="mb-2 text-sm text-slate-500">
                Question {i + 1} of {qs.length} · {q.type}
              </p>
              <p className="font-semibold">{q.question}</p>
              {q.code && (
                <pre className="mt-4">
                  <code>{q.code}</code>
                </pre>
              )}
              <AnswerCards
                options={q.options}
                value={answers[q.id] || ""}
                onChange={(option) =>
                  setAnswers((current) => ({
                    ...current,
                    [q.id]: option,
                  }))
                }
                submitted={result !== null}
                correctAnswer={q.correctAnswer}
                enableShortcuts={false}
                ariaLabel={`Interview answers for question ${i + 1}`}
              />
              {result !== null && (
                <AnswerFeedback
                  correct={answers[q.id] === q.correctAnswer}
                  selectedAnswer={answers[q.id] || "Skipped"}
                  correctAnswer={q.correctAnswer}
                  explanation={q.explanation}
                  concept={q.subtopic || q.topic}
                />
              )}
            </div>
          ))}
          {result ? (
            <div className="rounded-xl bg-indigo-50 p-4 text-indigo-900">
              <b>
                {result.score}/10 correct · {result.seconds}s
              </b>
              <p>Weak answers have been added to Revision Mode.</p>
            </div>
          ) : (
            <button
              className="btn-primary"
              disabled={Object.keys(answers).length === 0}
              onClick={submit}
            >
              Finish interview round
            </button>
          )}
        </section>
      )}
    </div>
  );
}
const starters = {
  "Hello Python": 'name = "Yash"\nprint(f"Hello {name}")',
  "List practice": "numbers = [10, 20, 30]\nprint(numbers[-1])",
  "Loop practice": "for number in range(1, 6):\n    print(number)",
};
export function Playground() {
  const { state, update } = useApp(),
    [searchParams] = useSearchParams(),
    incomingCode = searchParams.get("code") || "",
    [selected, setSelected] = useState<keyof typeof starters>("Hello Python"),
    [code, setCode] = useState(incomingCode || starters[selected]),
    [execution, setExecution] = useState<ExecutionResult | null>(null),
    [running, setRunning] = useState(false),
    editorRef = useRef<HTMLTextAreaElement>(null),
    busyRef = useRef(false);
  const run = async () => {
    if (busyRef.current || !code.trim()) return;
    busyRef.current = true;
    setRunning(true);
    setExecution(null);
    try {
      setExecution(await executionService.run({ code }));
    } finally {
      busyRef.current = false;
      setRunning(false);
    }
  };
  const save = () =>
    update((s) => ({
      ...s,
      savedSnippets: [
        ...s.savedSnippets,
        {
          id: crypto.randomUUID(),
          title: `Snippet ${s.savedSnippets.length + 1}`,
          code,
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  return (
    <div className="page">
      <PageTitle
        title="Python Playground"
        subtitle="Experiment safely. This educational demo previews common output and never executes arbitrary code on the server."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="card">
          <h2 className="font-bold">Starter examples</h2>
          <select
            className="field mt-3"
            value={selected}
            onChange={(e) => {
              const x = e.target.value as keyof typeof starters;
              setSelected(x);
              setCode(starters[x]);
              setExecution(null);
            }}
          >
            {Object.keys(starters).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <h2 className="mt-6 font-bold">Saved snippets</h2>
          <div className="mt-2 space-y-2">
            {state.savedSnippets.map((x) => (
              <button
                className="w-full rounded-lg border p-2 text-left text-sm"
                key={x.id}
                onClick={() => setCode(x.code)}
              >
                {x.title}
              </button>
            ))}
          </div>
        </aside>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <h2 className="font-bold">Python Editor</h2>
              <p className="text-xs text-slate-500">Safe learning mode</p>
            </div>
            <span className="badge">Python 3</span>
          </header>
          <textarea
            ref={editorRef}
            aria-label="Python playground editor"
            spellCheck={false}
            className="block min-h-96 w-full resize-y overflow-auto whitespace-pre border-0 bg-slate-950 p-4 font-mono leading-6 text-slate-100 caret-white outline-none selection:bg-indigo-500/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setExecution(null);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Tab" && event.key !== "Enter") return;
              event.preventDefault();
              const edit =
                event.key === "Tab"
                  ? applyTabEdit(
                      code,
                      event.currentTarget.selectionStart,
                      event.currentTarget.selectionEnd,
                      event.shiftKey,
                    )
                  : applyEnterEdit(
                      code,
                      event.currentTarget.selectionStart,
                      event.currentTarget.selectionEnd,
                    );
              setCode(edit.value);
              setExecution(null);
              window.requestAnimationFrame(() => {
                editorRef.current?.focus();
                editorRef.current?.setSelectionRange(edit.start, edit.end);
              });
            }}
          />
          <div className="flex flex-wrap gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
            <button
              className="btn-primary"
              disabled={running || !code.trim()}
              onClick={run}
            >
              <Code2 size={16} />
              {running ? "Running…" : "Run"}
            </button>
            <button
              className="btn-secondary"
              disabled={running}
              onClick={() => {
                setCode(starters[selected]);
                setExecution(null);
                editorRef.current?.focus();
              }}
            >
              Reset
            </button>
            <button
              className="btn-secondary"
              disabled={running}
              onClick={() => {
                setCode("");
                setExecution(null);
                editorRef.current?.focus();
              }}
            >
              Clear
            </button>
            <button
              className="btn-secondary"
              disabled={running || !code.trim()}
              onClick={save}
            >
              <Save size={16} />
              Save snippet
            </button>
          </div>
          <ExecutionConsole execution={execution} running={running} />
        </section>
      </div>
    </div>
  );
}
export function Onboarding() {
  const { update } = useApp(),
    navigate = useNavigate(),
    [experience, setExperience] = useState("Complete Beginner"),
    [goal, setGoal] = useState("College");
  const choose = () => {
    const path =
      goal === "Web Development"
        ? "Python Web Development"
        : goal === "AI/ML"
          ? "Python for AI"
          : goal === "Interview Preparation"
            ? "Python Interview Preparation"
            : "Python Beginner";
    update((s) => ({ ...s, selectedPath: path }));
    navigate("/dashboard");
  };
  return (
    <div className="grid min-h-[75vh] place-items-center">
      <section className="card w-full max-w-2xl">
        <span className="badge">60-second setup</span>
        <PageTitle
          title="Build your learning path"
          subtitle="Two answers help PythonPro recommend a mission. You can change it later."
        />
        <div className="mt-6 grid gap-5">
          <label>
            How much Python do you know?
            <select
              className="field mt-2"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {["Complete Beginner", "Beginner", "Intermediate"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            What is your goal?
            <select
              className="field mt-2"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              {[
                "College",
                "Programming",
                "Projects",
                "Web Development",
                "AI/ML",
                "Interview Preparation",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">
            Recommended start:{" "}
            {experience === "Intermediate"
              ? "Take a boss battle to place yourself."
              : "Begin with short interactive missions."}
          </p>
          <div className="flex justify-between">
            <button
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Skip
            </button>
            <button className="btn-primary" onClick={choose}>
              Use this path
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
