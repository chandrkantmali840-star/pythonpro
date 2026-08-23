import { useEffect, useRef, useState } from "react";
import { Check, Flame, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { activityCalendar, streakSummary } from "../services/streakService";

export function StreakIndicator() {
  const { state } = useApp(),
    summary = streakSummary(state.streak),
    [open, setOpen] = useState(false),
    [animate, setAnimate] = useState(false),
    previous = useRef(summary.currentStreak);

  useEffect(() => {
    if (summary.currentStreak > previous.current) {
      setAnimate(true);
      const timer = window.setTimeout(() => setAnimate(false), 900);
      previous.current = summary.currentStreak;
      return () => window.clearTimeout(timer);
    }
    previous.current = summary.currentStreak;
  }, [summary.currentStreak]);

  return (
    <>
      <button
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 font-bold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300 ${animate ? "motion-safe:animate-pulse" : ""}`}
        aria-label={`${summary.currentStreak} Day Learning Streak. Open streak details.`}
        title={`${summary.currentStreak} Day Learning Streak`}
        onClick={() => setOpen(true)}
      >
        <Flame size={18} fill="currentColor" aria-hidden="true" />
        <span>{summary.currentStreak}</span>
      </button>
      {open && <StreakDetailsDialog onClose={() => setOpen(false)} />}
    </>
  );
}

export function DashboardStreakCard() {
  const { state } = useApp(),
    summary = streakSummary(state.streak),
    activeToday = summary.week.some((day) => day.current && day.active),
    hasStreak = summary.currentStreak > 0;
  return (
    <section className="card border-amber-200 dark:border-amber-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xl font-black">
            <Flame
              className="text-amber-500"
              fill="currentColor"
              aria-hidden="true"
            />
            {hasStreak
              ? `${summary.currentStreak} Day Streak`
              : "Start your streak"}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {hasStreak
              ? activeToday
                ? "You're on fire! Keep learning to grow your streak."
                : "Complete one activity today to continue your streak."
              : "Complete one learning activity today to begin."}
          </p>
        </div>
        {summary.nextMilestone && (
          <span className="badge shrink-0 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Next: {summary.nextMilestone}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1" aria-label="This week">
        {summary.week.map((day) => (
          <div className="text-center" key={day.date}>
            <span className="text-[11px] text-slate-500">{day.label}</span>
            <div
              className={`mx-auto mt-1 grid h-8 w-8 place-items-center rounded-lg border text-xs font-bold ${day.current ? "border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900" : "border-slate-200 dark:border-slate-700"} ${day.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-50 text-slate-400 dark:bg-slate-800"}`}
              title={`${day.label}: ${day.active ? "Active" : "Not active"}${day.current ? " · Today" : ""}`}
            >
              {day.current && day.active ? (
                <Flame size={15} fill="currentColor" />
              ) : day.active ? (
                <Check size={15} />
              ) : (
                "—"
              )}
            </div>
          </div>
        ))}
      </div>

      <Link className="btn-primary mt-5" to="/learn">
        {hasStreak ? "Continue Learning" : "Start Learning"}
      </Link>
    </section>
  );
}

function StreakDetailsDialog({ onClose }: { onClose: () => void }) {
  const { state } = useApp(),
    summary = streakSummary(state.streak),
    days = activityCalendar(state.streak),
    closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="streak-dialog-title"
      >
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">
              Learning streak
            </p>
            <h2 id="streak-dialog-title" className="mt-1 text-xl font-black">
              Your study activity
            </h2>
          </div>
          <button
            ref={closeRef}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close streak details"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat
            label="Current Streak"
            value={dayCount(summary.currentStreak)}
          />
          <Stat
            label="Longest Streak"
            value={dayCount(summary.longestStreak)}
          />
          <Stat label="This Week" value={`${summary.thisWeek} / 7`} />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-bold">Last 28 days</h3>
            {summary.nextMilestone ? (
              <span className="text-xs text-slate-500">
                Next milestone: {summary.nextMilestone} days
              </span>
            ) : (
              <span className="text-xs text-amber-600">100-day milestone</span>
            )}
          </div>
          <div
            className="grid grid-cols-7 gap-2"
            aria-label="Activity calendar"
          >
            {days.map((day) => (
              <span
                key={day.date}
                className={`grid aspect-square place-items-center rounded-md text-[11px] font-bold ${day.current ? "ring-2 ring-amber-500" : ""} ${day.active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
                title={`${day.label}: ${day.active ? "Active" : "Not active"}`}
              >
                {day.day}
              </span>
            ))}
          </div>
        </div>

        <Link className="btn-primary mt-5 w-full" to="/learn" onClick={onClose}>
          {summary.currentStreak ? "Continue Learning" : "Start Learning"}
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

const dayCount = (value: number) => `${value} ${value === 1 ? "day" : "days"}`;
