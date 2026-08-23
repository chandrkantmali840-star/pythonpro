import type { AppState, StudyStreak } from "../types";

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100] as const;

export const emptyStreak: StudyStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  activeDates: [],
  recordedActivityIds: [],
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear(),
    month = String(date.getMonth() + 1).padStart(2, "0"),
    day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeStreak(
  value?: Partial<StudyStreak> | null,
  legacyDates: string[] = [],
  now = new Date(),
): StudyStreak {
  const activeDates = validDates([
    ...legacyDates,
    ...(value?.activeDates || []),
  ]);
  const calculated = calculateCurrent(activeDates, localDateKey(now));
  return {
    currentStreak: calculated,
    longestStreak: Math.max(value?.longestStreak || 0, longestRun(activeDates)),
    lastActiveDate: activeDates.at(-1) || null,
    activeDates,
    recordedActivityIds: Array.from(
      new Set((value?.recordedActivityIds || []).filter(Boolean)),
    ),
  };
}

export function recordMeaningfulActivity(
  state: AppState,
  activityId: string,
  when = new Date(),
) {
  const current = normalizeStreak(state.streak, [], when);
  if (!activityId || current.recordedActivityIds.includes(activityId))
    return state;
  const date = localDateKey(when),
    activeDates = validDates([...current.activeDates, date]),
    currentStreak = calculateCurrent(activeDates, date),
    longestStreak = Math.max(current.longestStreak, longestRun(activeDates));
  return {
    ...state,
    streak: {
      currentStreak,
      longestStreak,
      lastActiveDate: activeDates.at(-1) || date,
      activeDates,
      recordedActivityIds: [...current.recordedActivityIds, activityId],
    },
  };
}

export function streakSummary(streak: StudyStreak, now = new Date()) {
  const normalized = normalizeStreak(streak, [], now),
    today = localDateKey(now),
    week = weekDates(now),
    active = new Set(normalized.activeDates),
    thisWeek = week.filter((date) => active.has(date)).length,
    nextMilestone = STREAK_MILESTONES.find(
      (milestone) => milestone > normalized.longestStreak,
    );
  return {
    ...normalized,
    currentStreak: calculateCurrent(normalized.activeDates, today),
    thisWeek,
    week: week.map((date) => ({
      date,
      label: weekdayLabel(date),
      active: active.has(date),
      current: date === today,
    })),
    nextMilestone: nextMilestone || null,
    unlockedMilestones: STREAK_MILESTONES.filter(
      (milestone) => milestone <= normalized.longestStreak,
    ),
  };
}

export function activityCalendar(
  streak: StudyStreak,
  count = 28,
  now = new Date(),
) {
  const active = new Set(streak.activeDates),
    today = localDateKey(now);
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(today, index - count + 1);
    return {
      date,
      day: Number(date.slice(-2)),
      active: active.has(date),
      current: date === today,
      label: new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(parseDate(date)),
    };
  });
}

function weekDates(now: Date) {
  const today = localDateKey(now),
    weekday = parseDate(today).getDay(),
    mondayOffset = weekday === 0 ? -6 : 1 - weekday,
    monday = addDays(today, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function weekdayLabel(key: string) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
    parseDate(key),
  );
}

function validDates(dates: string[]) {
  return Array.from(
    new Set(dates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))),
  ).sort();
}

function calculateCurrent(dates: string[], today: string) {
  if (!dates.length) return 0;
  const set = new Set(dates),
    last = dates.at(-1)!;
  if (last !== today && last !== addDays(today, -1)) return 0;
  let count = 0,
    cursor = last;
  while (set.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

function longestRun(dates: string[]) {
  let longest = 0,
    run = 0,
    previous: string | null = null;
  for (const date of dates) {
    run = previous && addDays(previous, 1) === date ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  return longest;
}

function addDays(key: string, amount: number) {
  const date = parseDate(key);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

function parseDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}
