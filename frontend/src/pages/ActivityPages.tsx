import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, Check, Play, RotateCcw } from "lucide-react";
import { PageTitle, ProgressBar } from "../components/ui";
import { useApp } from "../context/AppContext";
import { questionService, questions } from "../data/questionService";
import { challenges, projects } from "../data/content";
import { topicAccuracy } from "../services/xpService";
import { AnswerCards, AnswerFeedback } from "../components/AnswerCards";
import { recordMeaningfulActivity } from "../services/streakService";
export function Practice() {
  const [topic, setTopic] = useState(""),
    [difficulty, setDifficulty] = useState("");
  const topics = [...new Set(questions.map((q) => q.topic))];
  return (
    <div className="page">
      <PageTitle
        title="Practice"
        subtitle={`${questions.length.toLocaleString()} validated questions across Python topics.`}
      />
      <div className="card grid gap-3 md:grid-cols-3">
        <select
          className="field"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">All topics</option>
          {topics.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          className="field"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All difficulties</option>
          {["Easy", "Medium", "Hard"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <Link
          className="btn-primary"
          to={`/practice/${encodeURIComponent(topic || "random")}?difficulty=${difficulty}`}
        >
          Start practice
        </Link>
      </div>
      <div className="grid-cards">
        {[
          ["Random practice", "random"],
          ["Weak-topic practice", "weak"],
          ["Unsolved questions", "unsolved"],
          ["Incorrect questions", "incorrect"],
        ].map(([x, path]) => (
          <Link
            to={`/practice/${path}`}
            className="card font-bold hover:border-indigo-400"
            key={x}
          >
            {x}
          </Link>
        ))}
      </div>
    </div>
  );
}
export function PracticeSession() {
  const { topic } = useParams(),
    { state, update, bookmark } = useApp();
  const pool = useMemo(() => {
    const attempted = new Set(state.attempts.map((a) => a.questionId));
    if (topic === "unsolved")
      return questions.filter((q) => !attempted.has(q.id)).slice(0, 10);
    if (topic === "incorrect") {
      const ids = new Set(
        state.attempts.filter((a) => !a.correct).map((a) => a.questionId),
      );
      return questions.filter((q) => ids.has(q.id)).slice(0, 10);
    }
    if (topic === "weak") {
      const weak = topicAccuracy(state)[0]?.topic,
        mapped =
          weak === "For Loops"
            ? "Loops"
            : weak === "Conditional Statements"
              ? "Conditions"
              : weak === "Object-Oriented Programming"
                ? "OOP"
                : weak;
      const found = questionService.filter({ topic: mapped }).slice(0, 10);
      return found.length ? found : questionService.random(10);
    }
    return topic === "random"
      ? questionService.random(10)
      : questionService
          .filter({ topic: decodeURIComponent(topic || "") })
          .slice(0, 10);
  }, [topic]);
  const [i, setI] = useState(0),
    [answer, setAnswer] = useState(""),
    [shown, setShown] = useState(false),
    [xpGained, setXpGained] = useState(0);
  const q = pool[i];
  if (!q)
    return (
      <div className="page">
        <PageTitle title="No matching questions" />
        <Link className="btn-primary" to="/practice">
          Change filters
        </Link>
      </div>
    );
  const prior = state.attempts.find((a) => a.questionId === q.id);
  const submit = () => {
    if (!answer) return;
    setXpGained(
      answer === q.correctAnswer &&
        !state.claimedXpActivities.includes(`question-${q.id}`)
        ? 10
        : 0,
    );
    update((s) => {
      const correct = answer === q.correctAnswer,
        xpKey = `question-${q.id}`,
        earns = correct && !s.claimedXpActivities.includes(xpKey);
      return recordMeaningfulActivity(
        {
          ...s,
          xp: s.xp + (earns ? 10 : 0),
          claimedXpActivities: earns
            ? [...s.claimedXpActivities, xpKey]
            : s.claimedXpActivities,
          attempts: [
            ...s.attempts.filter((a) => a.questionId !== q.id),
            {
              questionId: q.id,
              answer,
              correct,
              at: new Date().toISOString(),
            },
          ],
        },
        `practice:${q.id}`,
      );
    });
    setShown(true);
  };
  const goTo = (next: number) => {
    setI(next);
    setAnswer("");
    setShown(false);
    setXpGained(0);
  };
  return (
    <div className="page max-w-4xl">
      <PageTitle
        title={`${q.topic} practice`}
        subtitle={`Question ${i + 1} of ${pool.length}`}
      />
      <ProgressBar value={((i + 1) / pool.length) * 100} />
      <section className="card">
        <div className="flex justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
              {q.topic}
            </p>
            <span className="badge mt-2">{q.difficulty}</span>
          </div>
          <button
            aria-label="Bookmark question"
            onClick={() =>
              bookmark({
                kind: "Question",
                id: q.id,
                title: q.question,
                path: `/practice/${encodeURIComponent(q.topic)}`,
              })
            }
          >
            <Bookmark />
          </button>
        </div>
        <p className="mt-5 text-sm text-slate-500">
          Question {i + 1} of {pool.length} · {q.type}
        </p>
        <h2 className="my-3 text-xl font-bold">{q.question}</h2>
        {q.code && (
          <pre>
            <code>{q.code}</code>
          </pre>
        )}
        <AnswerCards
          options={q.options}
          value={answer}
          onChange={setAnswer}
          submitted={shown}
          correctAnswer={q.correctAnswer}
          onSubmit={submit}
          ariaLabel={`Answers for question ${i + 1}`}
        />
        {shown && (
          <AnswerFeedback
            correct={answer === q.correctAnswer}
            selectedAnswer={answer}
            correctAnswer={q.correctAnswer}
            explanation={q.explanation}
            concept={q.subtopic || q.topic}
            reviewPath="/learn"
            xpGained={xpGained}
            onNext={i < pool.length - 1 ? () => goTo(i + 1) : undefined}
          />
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {!shown && (
            <button className="btn-secondary" onClick={() => setAnswer("")}>
              Clear
            </button>
          )}
          {!shown && (
            <button className="btn-primary" disabled={!answer} onClick={submit}>
              Submit Answer
            </button>
          )}
          <button
            className="btn-secondary"
            disabled={i === 0}
            onClick={() => {
              goTo(i - 1);
            }}
          >
            Previous
          </button>
          {prior && (
            <span className="self-center text-sm text-slate-500">
              Previously attempted
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
export function Quizzes() {
  return (
    <div className="page">
      <PageTitle
        title="Quizzes"
        subtitle="Timed checks with review, scoring, and performance breakdowns."
      />
      <div className="grid-cards">
        {[
          "Topic Quiz",
          "Module Quiz",
          "Beginner Quiz",
          "Intermediate Quiz",
          "Advanced Quiz",
          "Mixed Python Quiz",
          "Python Interview Quiz",
        ].map((x, i) => (
          <Link
            className="card hover:border-indigo-400"
            to={`/quizzes/quiz-${i + 1}`}
            key={x}
          >
            <h2 className="font-bold">{x}</h2>
            <p className="mt-2 text-sm text-slate-500">
              10 questions · 10 minutes
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function Quiz() {
  const { id = "quiz" } = useParams(),
    { update } = useApp();
  const qs = useMemo(() => questionService.random(10), []),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [done, setDone] = useState(false);
  const score = qs.filter((q) => answers[q.id] === q.correctAnswer).length;
  return (
    <div className="page max-w-4xl">
      <PageTitle
        title="Python Quiz"
        subtitle="Answer every question, then submit for a detailed score."
      />
      {qs.map((q, i) => (
        <section className="card" key={q.id}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
              {q.topic}
            </p>
            <span className="badge">{q.difficulty}</span>
          </div>
          <p className="text-sm text-slate-500">
            Question {i + 1} of {qs.length} · {q.type}
          </p>
          <h2 className="font-bold">{q.question}</h2>
          {q.code && (
            <pre className="mt-4">
              <code>{q.code}</code>
            </pre>
          )}
          <AnswerCards
            options={q.options}
            value={answers[q.id] || ""}
            onChange={(option) =>
              setAnswers((current) => ({ ...current, [q.id]: option }))
            }
            submitted={done}
            correctAnswer={q.correctAnswer}
            enableShortcuts={false}
            ariaLabel={`Answers for question ${i + 1}`}
          />
          {done && (
            <AnswerFeedback
              correct={answers[q.id] === q.correctAnswer}
              selectedAnswer={answers[q.id] || "Skipped"}
              correctAnswer={q.correctAnswer}
              explanation={q.explanation}
              concept={q.subtopic || q.topic}
            />
          )}
        </section>
      ))}
      {done ? (
        <section className="card text-center">
          <h2 className="text-3xl font-black">
            {score} / {qs.length}
          </h2>
          <p>
            {Math.round((score / qs.length) * 100)}% · {qs.length - score} wrong
            or skipped
          </p>
          <button
            className="btn-primary mt-4"
            onClick={() => location.reload()}
          >
            <RotateCcw size={16} />
            Try again
          </button>
        </section>
      ) : (
        <button
          className="btn-primary"
          disabled={Object.keys(answers).length === 0}
          onClick={() => {
            setDone(true);
            update((s) => {
              const xpKey = `quiz-${id}`,
                earns =
                  score / qs.length >= 0.7 &&
                  !s.claimedXpActivities.includes(xpKey);
              return recordMeaningfulActivity(
                {
                  ...s,
                  xp: s.xp + (earns ? 30 : 0),
                  claimedXpActivities: earns
                    ? [...s.claimedXpActivities, xpKey]
                    : s.claimedXpActivities,
                  quizAttempts: [
                    ...s.quizAttempts,
                    {
                      id,
                      score,
                      total: qs.length,
                      at: new Date().toISOString(),
                      seconds: 0,
                    },
                  ],
                },
                `quiz:${id}`,
              );
            });
          }}
        >
          Submit quiz
        </button>
      )}
    </div>
  );
}
export function Coding() {
  return (
    <div className="page">
      <PageTitle
        title="Coding Challenges"
        subtitle="200 problems with runnable mock test cases and completion tracking."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {challenges.map((c) => (
          <Link
            className="card hover:border-indigo-400"
            key={c.id}
            to={`/coding/${c.id}`}
          >
            <span className="badge">{c.difficulty}</span>
            <h2 className="mt-3 font-bold">{c.title}</h2>
            <p className="text-sm text-slate-500">
              {c.topic} · {c.complexity}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function CodingDetail() {
  const { id } = useParams(),
    c = challenges.find((x) => x.id === id),
    { state, update } = useApp();
  const [code, setCode] = useState(c?.starter || ""),
    [out, setOut] = useState("");
  if (!c) return <p>Challenge not found.</p>;
  const run = () =>
    setOut(
      c.tests
        .map(
          (t) =>
            `Input ${t.input} → Expected ${t.expected}\nMock runner: test passed`,
        )
        .join("\n\n"),
    );
  return (
    <div className="page">
      <PageTitle title={c.title} subtitle={`${c.difficulty} · ${c.topic}`} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <p>{c.description}</p>
          <h2 className="mt-5 font-bold">Example</h2>
          <pre>{c.examples.join("\n")}</pre>
          <h2 className="mt-5 font-bold">Constraints</h2>
          <ul className="list-disc pl-5">
            {c.constraints.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <details className="mt-5">
            <summary className="cursor-pointer font-bold">Hints</summary>
            <ul>
              {c.hints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </details>
        </section>
        <section className="card">
          <textarea
            aria-label="Python editor"
            className="min-h-80 w-full rounded-xl bg-slate-950 p-4 font-mono text-slate-100"
            style={{ fontSize: state.settings.fontSize }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button className="btn-secondary" onClick={run}>
              <Play size={16} />
              Run
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                run();
                update((s) => {
                  const xpKey = `coding-${c.id}`,
                    earns = !s.claimedXpActivities.includes(xpKey);
                  return recordMeaningfulActivity(
                    {
                      ...s,
                      xp: s.xp + (earns ? 25 : 0),
                      claimedXpActivities: earns
                        ? [...s.claimedXpActivities, xpKey]
                        : s.claimedXpActivities,
                      solvedChallenges: Array.from(
                        new Set([...s.solvedChallenges, c.id]),
                      ),
                    },
                    `coding:${c.id}`,
                  );
                });
              }}
            >
              <Check size={16} />
              Submit
            </button>
            <button
              className="btn-secondary"
              onClick={() => setCode(c.starter)}
            >
              Reset
            </button>
            <button className="btn-secondary" onClick={() => setCode("")}>
              Clear
            </button>
          </div>
          {out && (
            <pre className="mt-4" aria-live="polite">
              {out}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
export function Projects() {
  return (
    <div className="page">
      <PageTitle
        title="Projects"
        subtitle="30 guided portfolio projects across three difficulty levels."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Link
            className="card hover:border-indigo-400"
            key={p.id}
            to={`/projects/${p.id}`}
          >
            <span className="badge">{p.difficulty}</span>
            <h2 className="mt-3 text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {p.skills.join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function ProjectDetail() {
  const { id } = useParams(),
    p = projects.find((x) => x.id === id),
    { state, update, bookmark } = useApp();
  if (!p) return <p>Project not found.</p>;
  const done = state.completedProjects.includes(p.id);
  return (
    <div className="page max-w-4xl">
      <PageTitle title={p.title} subtitle={`${p.difficulty} · ${p.learn}`} />
      {[
        ["Problem statement", [p.problem]],
        ["Requirements", p.requirements],
        ["Step-by-step tasks", p.tasks],
        ["Hints", p.hints],
        ["Extension ideas", p.extensions],
      ].map(([t, v]) => (
        <section className="card" key={t as string}>
          <h2 className="font-bold">{t}</h2>
          <ul className="mt-3 list-disc pl-5">
            {(v as string[]).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ))}
      <section className="card">
        <h2 className="font-bold">Starter code</h2>
        <pre>{p.starter}</pre>
        <h2 className="mt-5 font-bold">Expected result</h2>
        <p>{p.expected}</p>
      </section>
      <div className="flex gap-2">
        <button
          className="btn-secondary"
          onClick={() =>
            bookmark({
              kind: "Project",
              id: p.id,
              title: p.title,
              path: `/projects/${p.id}`,
            })
          }
        >
          <Bookmark size={16} />
          Bookmark
        </button>
        <button
          className="btn-primary"
          onClick={() =>
            update((s) => {
              const xpKey = `project-${p.id}`,
                earns = !done && !s.claimedXpActivities.includes(xpKey),
                reward = p.difficulty === "Hard" ? 250 : 100;
              const next = {
                ...s,
                xp: s.xp + (earns ? reward : 0),
                claimedXpActivities: earns
                  ? [...s.claimedXpActivities, xpKey]
                  : s.claimedXpActivities,
                completedProjects: done
                  ? s.completedProjects.filter((x) => x !== p.id)
                  : [...s.completedProjects, p.id],
              };
              return earns
                ? recordMeaningfulActivity(next, `project:${p.id}`)
                : next;
            })
          }
        >
          {done ? "Mark incomplete" : "Complete project"}
        </button>
      </div>
    </div>
  );
}
