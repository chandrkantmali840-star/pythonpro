import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useApp } from "../context/AppContext";
import { BrandLogo } from "../components/BrandLogo";
export function Home() {
  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-5">
        <Link to="/" aria-label="PythonPro home">
          <BrandLogo eager />
        </Link>
        <div className="flex gap-2">
          <Link className="btn-secondary" to="/login">
            Log in
          </Link>
          <Link className="btn-primary" to="/register">
            Start learning
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid min-h-[75vh] max-w-7xl items-center gap-10 p-6 lg:grid-cols-2">
        <div>
          <span className="badge">Interactive Python learning</span>
          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Learn Python.
            <br />
            <span className="text-indigo-600">Practice. Master.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            A complete path from your first variable to APIs, algorithms,
            projects, and interview preparation.
          </p>
          <div className="mt-8 flex gap-3">
            <Link className="btn-primary" to="/register">
              Create free account
            </Link>
            <Link className="btn-secondary" to="/about">
              Explore platform
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card mx-auto max-w-md bg-white p-4">
            <BrandLogo variant="full" eager />
          </div>
          <div className="card bg-slate-950 text-white">
            <pre className="text-base">
              <code>{`def learn(topic):\n    practice(topic)\n    build(topic)\n    return "mastery"\n\nprint(learn("Python"))`}</code>
            </pre>
            <div className="mt-4 rounded-xl bg-emerald-500/15 p-4 text-emerald-300">
              ✓ mastery
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
export const About = () => (
  <main className="page p-6">
    <Link to="/" className="block w-44 rounded-2xl bg-white p-3">
      <BrandLogo variant="full" />
    </Link>
    <h1 className="text-4xl font-black">Learning by doing</h1>
    <p className="max-w-3xl text-lg text-slate-600">
      PythonPro connects concise lessons with deliberate practice, timed
      quizzes, coding challenges, and portfolio projects. Progress is
      transparent and stored for your next session.
    </p>
    <Link className="btn-primary" to="/register">
      Get started
    </Link>
  </main>
);
export const Faq = () => (
  <main className="page p-6">
    <h1 className="text-4xl font-black">Frequently asked questions</h1>
    {[
      [
        "Is PythonPro beginner-friendly?",
        "Yes. The roadmap starts at zero and progresses to APIs, testing, and algorithms.",
      ],
      [
        "Does the skill score predict a job?",
        "No. It summarizes learning activity only and is not an employment prediction.",
      ],
      [
        "Is my progress saved?",
        "Yes. Demo mode stores it locally; the API supports server persistence.",
      ],
    ].map((x) => (
      <details className="card" key={x[0]}>
        <summary className="cursor-pointer font-bold">{x[0]}</summary>
        <p className="mt-3 text-slate-600">{x[1]}</p>
      </details>
    ))}
  </main>
);
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main className="page max-w-xl p-6">
      <h1 className="text-4xl font-black">Contact us</h1>
      {sent ? (
        <div className="card">
          Thanks — your message was saved for the support team.
        </div>
      ) : (
        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Name
            <input required className="field mt-1" />
          </label>
          <label>
            Email
            <input required type="email" className="field mt-1" />
          </label>
          <label>
            Message
            <textarea required className="field mt-1" rows={5} />
          </label>
          <button className="btn-primary">Send message</button>
        </form>
      )}
    </main>
  );
}
const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export function Login() {
  const { login } = useApp(),
    nav = useNavigate(),
    [error, setError] = useState("");
  return (
    <AuthShell title="Welcome back">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget),
            x = authSchema.safeParse(Object.fromEntries(f));
          if (!x.success)
            return setError(
              "Enter a valid email and at least 8 password characters.",
            );
          if (login(x.data.email, x.data.password)) nav("/dashboard");
          else setError("Email or password is incorrect.");
        }}
      >
        <input
          name="email"
          aria-label="Email"
          className="field"
          type="email"
          placeholder="Email"
        />
        <input
          name="password"
          aria-label="Password"
          className="field"
          type="password"
          placeholder="Password"
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button className="btn-primary w-full">Log in</button>
        <p className="text-center text-sm">
          New here?{" "}
          <Link className="text-indigo-600" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
export function Register() {
  const { register } = useApp(),
    nav = useNavigate(),
    [error, setError] = useState("");
  return (
    <AuthShell title="Create your account">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          if (String(f.password).length < 8 || f.password !== f.confirm)
            return setError(
              "Passwords must match and contain at least 8 characters.",
            );
          register(
            {
              id: crypto.randomUUID(),
              fullName: String(f.fullName),
              email: String(f.email),
              studentId: String(f.studentId),
              course: String(f.course),
              year: String(f.year),
            },
            String(f.password),
          );
          nav("/onboarding");
        }}
      >
        {[
          ["fullName", "Full name"],
          ["email", "Email"],
          ["studentId", "Student ID"],
          ["course", "Course"],
          ["year", "Year"],
          ["password", "Password"],
          ["confirm", "Confirm password"],
        ].map(([n, p]) => (
          <input
            required
            key={n}
            name={n}
            type={
              n.includes("password") || n === "confirm"
                ? "password"
                : n === "email"
                  ? "email"
                  : "text"
            }
            className="field"
            placeholder={p}
          />
        ))}
        {error && <p className="text-red-600 sm:col-span-2">{error}</p>}
        <button className="btn-primary sm:col-span-2">Create account</button>
      </form>
    </AuthShell>
  );
}
function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="card w-full max-w-xl">
        <Link
          to="/"
          className="mx-auto block w-44 rounded-2xl bg-white p-2"
          aria-label="PythonPro home"
        >
          <BrandLogo variant="full" eager />
        </Link>
        <h1 className="my-6 text-3xl font-black">{title}</h1>
        {children}
      </section>
    </main>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <BrandLogo />
          <p className="mt-2 text-sm text-slate-500">
            Learn • Practice • Master
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </div>
    </footer>
  );
}
