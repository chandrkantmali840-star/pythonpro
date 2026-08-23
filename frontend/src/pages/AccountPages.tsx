import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Empty, PageTitle, ProgressBar } from "../components/ui";
import { useApp } from "../context/AppContext";
import { metrics } from "../services/analyticsService";
import { recommendations } from "../services/recommendationService";
import { challenges, knowledge, lessons, projects } from "../data/content";
import { questions } from "../data/questionService";
import type { AppState } from "../types";
import { DailyChallenge } from "../components/DailyChallenge";
import { DashboardStreakCard } from "../components/StudyStreak";
import { levelFor, topicAccuracy } from "../services/xpService";
export function Dashboard() {
  const { state } = useApp(),
    m = metrics(state);
  const level = levelFor(state.xp);
  const topics = topicAccuracy(state);
  const weak = topics[0];
  const strong = topics[topics.length - 1];
  const nextLesson = lessons.find(
    (lesson) => !state.completedLessons.includes(lesson.id),
  );
  const currentProject = projects.find(
    (project) => !state.completedProjects.includes(project.id),
  );
  const recentAchievement = [...achievementDefs]
    .reverse()
    .find(([, test]) => test(state))?.[0];
  const cards = [
    ["Python Skill Score", `${m.skill}%`],
    ["Lessons", `${m.lessons} / 50`],
    ["Questions", m.attempted],
    ["Accuracy", `${m.accuracy}%`],
    ["Coding Problems", m.coding],
    ["Projects", m.projects],
    ["Current XP", state.xp],
    ["Level", `${level.number} · ${level.name}`],
  ];
  return (
    <div className="page">
      <PageTitle
        title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, ${state.user?.fullName.split(" ")[0] || "Student"} 👋`}
        subtitle="Continue your Python journey."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <span className="badge">Continue learning</span>
          <h2 className="mt-3 text-xl font-bold">
            {nextLesson?.title || "Roadmap complete"}
          </h2>
          <p className="mt-2 text-slate-500">
            Selected path: {state.selectedPath}
          </p>
          {nextLesson && (
            <Link
              className="btn-primary mt-4"
              to={`/learn/${nextLesson.slug}/${nextLesson.id}`}
            >
              Continue mission
            </Link>
          )}
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-sm">
              <span>{level.name}</span>
              <span>
                {state.xp} / {level.nextXp} XP
              </span>
            </div>
            <ProgressBar value={level.progress} />
          </div>
        </section>
        <DashboardStreakCard />
        <div className="lg:col-span-2">
          <DailyChallenge />
        </div>
      </div>
      <div className="grid-cards">
        {cards.map((x) => (
          <div className="card" key={x[0]}>
            <p className="text-sm text-slate-500">{x[0]}</p>
            <p className="mt-2 text-3xl font-black">{x[1]}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="card">
          <p className="text-sm text-slate-500">Needs practice</p>
          <h2 className="mt-2 font-bold">
            {weak
              ? `${weak.topic} — ${weak.accuracy}%`
              : "Complete an activity"}
          </h2>
          {weak && (
            <Link
              className="mt-3 inline-block text-sm font-semibold text-indigo-600"
              to={`/practice/${encodeURIComponent(weak.topic)}`}
            >
              Practice {weak.topic} →
            </Link>
          )}
        </section>
        <section className="card">
          <p className="text-sm text-slate-500">Strong topic</p>
          <h2 className="mt-2 font-bold">
            {strong
              ? `${strong.topic} — ${strong.accuracy}%`
              : "Build your first strength"}
          </h2>
        </section>
        <section className="card">
          <p className="text-sm text-slate-500">Recommended mission</p>
          <h2 className="mt-2 font-bold">
            {weak ? `${weak.topic} Bug Hunter` : state.selectedPath}
          </h2>
          <Link
            className="mt-3 inline-block text-sm font-semibold text-indigo-600"
            to="/missions"
          >
            View mission path →
          </Link>
        </section>
        <section className="card">
          <p className="text-sm text-slate-500">Current project</p>
          <h2 className="mt-2 font-bold">
            {currentProject?.title || "All projects complete"}
          </h2>
          {currentProject && (
            <Link
              className="mt-3 inline-block text-sm font-semibold text-indigo-600"
              to={`/projects/${currentProject.id}`}
            >
              Continue project →
            </Link>
          )}
        </section>
        <section className="card">
          <p className="text-sm text-slate-500">Recent achievement</p>
          <h2 className="mt-2 font-bold">
            {recentAchievement
              ? `🏆 ${recentAchievement}`
              : "Your first badge is close"}
          </h2>
          <Link
            className="mt-3 inline-block text-sm font-semibold text-indigo-600"
            to="/achievements"
          >
            View achievements →
          </Link>
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-xl font-bold">Recommended next</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {recommendations(state).map((r) => (
            <Link
              className="card hover:border-indigo-400"
              to={r.path}
              key={r.title}
            >
              <h3 className="font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{r.detail}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
export function Progress() {
  const { state } = useApp(),
    m = metrics(state);
  const level = levelFor(state.xp);
  const mastery = topicAccuracy(state);
  const data = state.quizAttempts.map((q, i) => ({
    name: `Quiz ${i + 1}`,
    score: Math.round((q.score / q.total) * 100),
  }));
  return (
    <div className="page">
      <PageTitle
        title="Progress"
        subtitle="Activity-backed analytics. The skill score summarizes learning; it does not predict employment."
      />
      <div className="grid-cards">
        {[
          ["Knowledge", Math.min(100, m.lessons * 2)],
          ["Practice", Math.min(100, m.attempted / 5)],
          ["Coding", Math.min(100, m.coding * 2)],
          ["Overall Skill", m.skill],
        ].map(([x, v]) => (
          <div className="card" key={x as string}>
            <div className="mb-3 flex justify-between">
              <b>{x}</b>
              <span>{Math.round(v as number)}%</span>
            </div>
            <ProgressBar value={v as number} />
          </div>
        ))}
      </div>
      <div className="grid-cards">
        {[
          ["XP", state.xp],
          ["Level", `${level.number} · ${level.name}`],
          ["Bug challenges", state.bugsFixed],
          ["Boss battles", state.bossBattlesPassed.length],
          ["Learning activities", state.learningActivityResults.length],
          ["Learning time", `${state.learningActivityResults.length} min`],
        ].map(([label, value]) => (
          <div className="card" key={label as string}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <section className="card h-80">
        <h2 className="font-bold">Topic mastery</h2>
        {mastery.length ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={mastery.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-64 place-items-center text-slate-500">
            Complete interactions to build topic mastery.
          </div>
        )}
      </section>
      <section className="card h-80">
        <h2 className="font-bold">Quiz performance</h2>
        {data.length ? (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line dataKey="score" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-64 place-items-center text-slate-500">
            Take a quiz to build this chart.
          </div>
        )}
      </section>
      <section className="card h-80">
        <h2 className="font-bold">Learning activity</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={[
              { name: "Lessons", value: m.lessons },
              { name: "Questions", value: m.attempted },
              { name: "Coding", value: m.coding },
              { name: "Projects", value: m.projects },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
const achievementDefs: [string, (state: AppState) => boolean][] = [
  [
    "First Program",
    (s) => s.solvedChallenges.length >= 1 || s.savedSnippets.length >= 1,
  ],
  [
    "First Correct Answer",
    (s) => s.learningActivityResults.some((x) => x.correct),
  ],
  ["Bug Hunter", (s) => s.bugsFixed >= 1],
  ["10 Bugs Fixed", (s) => s.bugsFixed >= 10],
  ["Loop Master", (s) => s.completedLessons.includes("lesson-7")],
  ["List Master", (s) => s.completedLessons.includes("lesson-10")],
  ["Function Explorer", (s) => s.completedLessons.includes("lesson-14")],
  ["OOP Explorer", (s) => s.completedLessons.includes("lesson-22")],
  ["Boss Slayer", (s) => s.bossBattlesPassed.length >= 1],
  ["First Lesson", (s) => s.completedLessons.length >= 1],
  ["10 Lessons", (s) => s.completedLessons.length >= 10],
  ["25 Lessons", (s) => s.completedLessons.length >= 25],
  ["50 Lessons", (s) => s.completedLessons.length >= 50],
  ["100 Questions", (s) => s.attempts.length >= 100],
  ["500 Questions", (s) => s.attempts.length >= 500],
  ["1000 Questions", (s) => s.attempts.length >= 1000],
  ["10 Coding Problems", (s) => s.solvedChallenges.length >= 10],
  ["50 Coding Problems", (s) => s.solvedChallenges.length >= 50],
  ["100 Coding Problems", (s) => s.solvedChallenges.length >= 100],
  ["First Project", (s) => s.completedProjects.length >= 1],
  ["5 Projects", (s) => s.completedProjects.length >= 5],
  ["10 Projects", (s) => s.completedProjects.length >= 10],
  ["3-Day Streak", (s) => s.streak.longestStreak >= 3],
  ["7-Day Streak", (s) => s.streak.longestStreak >= 7],
  ["14-Day Streak", (s) => s.streak.longestStreak >= 14],
  ["30-Day Streak", (s) => s.streak.longestStreak >= 30],
  ["50-Day Streak", (s) => s.streak.longestStreak >= 50],
  ["100-Day Streak", (s) => s.streak.longestStreak >= 100],
  ["80% Accuracy", (s) => metrics(s).accuracy >= 80 && s.attempts.length >= 10],
  ["Perfect Quiz", (s) => s.quizAttempts.some((q) => q.score === q.total)],
  ["Python Basics Complete", (s) => s.completedLessons.length >= 14],
  ["OOP Complete", (s) => s.completedLessons.includes("lesson-22")],
  ["Advanced Python Complete", (s) => s.completedLessons.length >= 38],
];
export function Achievements() {
  const { state } = useApp();
  return (
    <div className="page">
      <PageTitle
        title="Achievements"
        subtitle="Milestones unlock automatically from your activity."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {achievementDefs.map(([name, test]) => {
          const yes = test(state);
          return (
            <div
              className={`card ${yes ? "border-amber-400" : "opacity-60"}`}
              key={name}
            >
              <div className="text-3xl">{yes ? "🏆" : "🔒"}</div>
              <h2 className="mt-3 font-bold">{name}</h2>
              <p className="text-sm text-slate-500">
                {yes ? "Unlocked" : "Keep learning to unlock"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export function Bookmarks() {
  const { state, bookmark } = useApp();
  return (
    <div className="page">
      <PageTitle
        title="Bookmarks"
        subtitle="Your saved lessons, questions, challenges, references, and projects."
      />
      {state.bookmarks.length ? (
        <div className="space-y-3">
          {state.bookmarks.map((b) => (
            <div
              className="card flex items-center justify-between"
              key={b.kind + b.id}
            >
              <Link to={b.path}>
                <span className="badge">{b.kind}</span>
                <h2 className="mt-2 font-bold">{b.title}</h2>
              </Link>
              <button className="btn-secondary" onClick={() => bookmark(b)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Empty title="No bookmarks yet">
          Save useful content and it will appear here.
        </Empty>
      )}
    </div>
  );
}
export function Profile() {
  const { state, update } = useApp(),
    [edit, setEdit] = useState(false),
    m = metrics(state),
    u = state.user!;
  if (edit)
    return (
      <div className="page max-w-xl">
        <PageTitle title="Edit profile" />
        <form
          className="card space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget));
            update((s) => ({
              ...s,
              user: {
                ...u,
                fullName: String(f.fullName),
                course: String(f.course),
                year: String(f.year),
              },
            }));
            setEdit(false);
          }}
        >
          <input className="field" name="fullName" defaultValue={u.fullName} />
          <input className="field" name="course" defaultValue={u.course} />
          <input className="field" name="year" defaultValue={u.year} />
          <button className="btn-primary">Save profile</button>
        </form>
      </div>
    );
  return (
    <div className="page">
      <PageTitle title="Profile" subtitle={`${u.email} · ${u.studentId}`} />
      <section className="card">
        <h2 className="text-2xl font-bold">{u.fullName}</h2>
        <p>
          {u.course} · Year {u.year}
        </p>
        <button className="btn-secondary mt-4" onClick={() => setEdit(true)}>
          Edit profile
        </button>
      </section>
      <div className="grid-cards">
        {[
          ["Skill score", `${m.skill}%`],
          ["Questions", m.attempted],
          ["Coding", m.coding],
          ["Projects", m.projects],
          ["Achievements", achievementDefs.filter((x) => x[1](state)).length],
          ["Streak", m.streak],
        ].map((x) => (
          <div className="card" key={x[0] as string}>
            <p>{x[0]}</p>
            <b className="text-2xl">{x[1]}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Settings() {
  const { state, update } = useApp(),
    x = state.settings;
  const set = (p: Partial<typeof x>) =>
    update((s) => ({ ...s, settings: { ...s.settings, ...p } }));
  return (
    <div className="page max-w-3xl">
      <PageTitle
        title="Settings"
        subtitle="Preferences are saved automatically."
      />
      <section className="card space-y-5">
        <label className="block">
          Theme
          <select
            className="field mt-2"
            value={x.theme}
            onChange={(e) => set({ theme: e.target.value as typeof x.theme })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className="block">
          Editor font size: {x.fontSize}px
          <input
            className="mt-2 w-full"
            type="range"
            min="12"
            max="24"
            value={x.fontSize}
            onChange={(e) => set({ fontSize: +e.target.value })}
          />
        </label>
        <label className="flex gap-3">
          <input
            type="checkbox"
            checked={x.notifications}
            onChange={(e) => set({ notifications: e.target.checked })}
          />
          Notifications
        </label>
        <label className="flex gap-3">
          <input
            type="checkbox"
            checked={x.sound}
            onChange={(e) => set({ sound: e.target.checked })}
          />
          Sound effects
        </label>
      </section>
    </div>
  );
}
export function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (q.length < 2) return [];
    const s = q.toLowerCase();
    return [
      ...lessons.map((x) => ({
        kind: "Lesson",
        title: x.title,
        path: `/learn/${x.slug}/${x.id}`,
      })),
      ...questions.slice(0, 200).map((x) => ({
        kind: "Question",
        title: x.question,
        path: `/practice/${encodeURIComponent(x.topic)}`,
      })),
      ...challenges.map((x) => ({
        kind: "Coding",
        title: x.title,
        path: `/coding/${x.id}`,
      })),
      ...projects.map((x) => ({
        kind: "Project",
        title: x.title,
        path: `/projects/${x.id}`,
      })),
      ...knowledge.map((x) => ({
        kind: "Reference",
        title: x.name,
        path: `/knowledge/${x.id}`,
      })),
    ]
      .filter((x) => x.title.toLowerCase().includes(s))
      .slice(0, 50);
  }, [q]);
  return (
    <div className="page">
      <PageTitle title="Global search" />
      <input
        autoFocus
        className="field"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search all PythonPro content…"
      />
      {q.length >= 2 && !results.length ? (
        <Empty title="No results">Try a broader Python term.</Empty>
      ) : (
        results.map((x) => (
          <Link className="card block" key={x.kind + x.path} to={x.path}>
            <span className="badge">{x.kind}</span>
            <h2 className="mt-2 font-bold">{x.title}</h2>
          </Link>
        ))
      )}
    </div>
  );
}
