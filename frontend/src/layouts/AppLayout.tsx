import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  ChartNoAxesCombined,
  Code2,
  FolderKanban,
  GraduationCap,
  Home,
  Library,
  Menu,
  Settings,
  Trophy,
  User,
  Brain,
  LogOut,
  Search,
  X,
  Map,
  Swords,
  RefreshCcw,
  SquareTerminal,
  BriefcaseBusiness,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { StreakIndicator } from "../components/StudyStreak";
import { BrandLogo } from "../components/BrandLogo";
const items = [
  ["Dashboard", "/dashboard", Home],
  ["Learn Python", "/learn", BookOpen],
  ["Mission Paths", "/missions", Map],
  ["Boss Battles", "/boss-battles", Swords],
  ["Revision", "/revision", RefreshCcw],
  ["Playground", "/playground", SquareTerminal],
  ["Interview Mode", "/interview", BriefcaseBusiness],
  ["Practice", "/practice", Brain],
  ["Coding", "/coding", Code2],
  ["Quizzes", "/quizzes", GraduationCap],
  ["Projects", "/projects", FolderKanban],
  ["Knowledge Hub", "/knowledge", Library],
  ["Progress", "/progress", ChartNoAxesCombined],
  ["Achievements", "/achievements", Trophy],
  ["Bookmarks", "/bookmarks", Bookmark],
  ["Profile", "/profile", User],
  ["Settings", "/settings", Settings],
] as const;
export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { state, logout } = useApp(),
    nav = useNavigate();
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <NavLink to="/dashboard" aria-label="PythonPro dashboard">
            <BrandLogo eager />
          </NavLink>
          <button
            aria-label="Close menu"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Student navigation" className="space-y-1">
          {items.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn-secondary mt-5 w-full"
          onClick={() => {
            logout();
            nav("/");
          }}
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <button
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <button
            className="field mx-auto flex min-w-0 max-w-xl items-center gap-2 overflow-hidden text-left text-slate-500"
            onClick={() => nav("/search")}
          >
            <Search size={17} />
            Search lessons, questions, projects…
          </button>
          <StreakIndicator />
          <NavLink
            to="/profile"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            aria-label="Open profile"
            title="Profile"
          >
            {(state.user?.fullName || "Student").charAt(0).toUpperCase()}
          </NavLink>
        </header>
        <main id="main" className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
