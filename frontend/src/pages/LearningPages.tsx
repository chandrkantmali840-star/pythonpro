import { Link, useParams } from "react-router-dom";
import { Bookmark, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { lessons, projects } from "../data/content";
import { PageTitle, ProgressBar } from "../components/ui";
import { InteractiveLessonEngine } from "../components/InteractiveLessonEngine";
import {
  KnowledgeArticlePage,
  KnowledgeHubPage,
} from "../components/knowledge/KnowledgeHub";
export function Learn() {
  const { state } = useApp();
  const firstOpen = lessons.findIndex(
    (l) => !state.completedLessons.includes(l.id),
  );
  return (
    <div className="page">
      <PageTitle
        title="Interactive Course Map"
        subtitle="Short missions, rapid feedback, coding, and boss battles from fundamentals to APIs."
      />
      <ProgressBar
        value={(state.completedLessons.length / lessons.length) * 100}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          className="card border-amber-300 text-center font-bold hover:border-amber-500"
          to="/boss-battles"
        >
          ⚔️ Basics Boss Battle
        </Link>
        <Link
          className="card border-amber-300 text-center font-bold hover:border-amber-500"
          to="/boss-battles"
        >
          ⚔️ Structures Boss Battle
        </Link>
        <Link
          className="card border-amber-300 text-center font-bold hover:border-amber-500"
          to="/boss-battles"
        >
          ⚔️ OOP Boss Battle
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {lessons.map((l, i) => (
          <Link
            className="card flex items-center gap-4 hover:border-indigo-400"
            to={`/learn/${l.slug}/${l.id}`}
            key={l.id}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Mission {i + 1}
              </p>
              <h2 className="font-bold">{l.module}</h2>
              <p className="text-sm text-slate-500">
                {l.difficulty} · {l.minutes} min ·{" "}
                {state.completedLessons.includes(l.id)
                  ? "Completed"
                  : i === firstOpen
                    ? "In progress"
                    : i < firstOpen
                      ? "Available"
                      : "Available next"}
              </p>
            </div>
            {state.completedLessons.includes(l.id) && (
              <CheckCircle2 className="text-emerald-500" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
export function Module() {
  const { module } = useParams();
  const lesson = lessons.find((l) => l.slug === module);
  return lesson ? (
    <div className="page">
      <PageTitle title={lesson.module} subtitle={lesson.overview} />
      <Link
        className="card block hover:border-indigo-400"
        to={`/learn/${lesson.slug}/${lesson.id}`}
      >
        <span className="badge">{lesson.difficulty}</span>
        <h2 className="mt-3 text-xl font-bold">{lesson.title}</h2>
        <p className="mt-2 text-slate-500">
          Start the guided lesson · {lesson.minutes} minutes
        </p>
      </Link>
    </div>
  ) : (
    <p>Module not found.</p>
  );
}
export function Lesson() {
  const { id } = useParams(),
    { state, update, bookmark } = useApp();
  const l = lessons.find((x) => x.id === id);
  if (!l) return <p>Lesson not found.</p>;
  const complete = state.completedLessons.includes(l.id);
  const miniProject =
    projects[(Number(l.id.split("-")[1]) - 1) % projects.length];
  return (
    <article className="page max-w-4xl">
      <PageTitle
        title={l.title}
        subtitle={`${l.difficulty} · ${l.minutes} minutes`}
      />
      <div className="flex gap-2">
        <button
          className="btn-secondary"
          onClick={() =>
            bookmark({
              kind: "Lesson",
              id: l.id,
              title: l.title,
              path: `/learn/${l.slug}/${l.id}`,
            })
          }
        >
          <Bookmark size={16} />
          Bookmark
        </button>
        <span className="badge">
          <Clock size={14} />
          {l.minutes} min
        </span>
      </div>
      <InteractiveLessonEngine key={l.id} lessonId={l.id} />
      <section className="card border-emerald-200 dark:border-emerald-900">
        <span className="badge bg-emerald-50 text-emerald-800">
          Mini project mission
        </span>
        <h2 className="mt-3 text-xl font-bold">{miniProject.title}</h2>
        <p className="mt-2 text-slate-500">
          Apply {l.module} inside a real project instead of waiting until the
          end of the course.
        </p>
        <Link className="btn-primary mt-4" to={`/projects/${miniProject.id}`}>
          Open project mission
        </Link>
      </section>
      <details className="card">
        <summary className="cursor-pointer font-bold">
          Optional reference notes
        </summary>
        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>{l.overview}</p>
          <p>{l.why}</p>
          <pre>
            <code>{l.syntax}</code>
          </pre>
          <p>
            <b>Common mistakes:</b> {l.mistakes.join(" ")}
          </p>
          <p>
            <b>Best practices:</b> {l.bestPractices.join(" ")}
          </p>
        </div>
      </details>
      <div className="flex flex-wrap gap-3">
        <Link className="btn-secondary" to={`/practice/${l.module}`}>
          Practice
        </Link>
        <Link className="btn-secondary" to="/quizzes/mixed">
          Take quiz
        </Link>
        {complete && (
          <span className="badge">
            <CheckCircle2 size={15} />
            Mission completed
          </span>
        )}
      </div>
    </article>
  );
}
export const Knowledge = KnowledgeHubPage;
export const KnowledgeDetail = KnowledgeArticlePage;
