import { describe, expect, it } from "vitest";
import { initialState } from "./persistenceService";
import {
  emptyStreak,
  localDateKey,
  normalizeStreak,
  recordMeaningfulActivity,
  streakSummary,
} from "./streakService";

const day = (date: number) => new Date(2026, 7, date, 12);

describe("study streak service", () => {
  it("starts at zero for a new student", () => {
    expect(streakSummary(emptyStreak, day(10)).currentStreak).toBe(0);
  });

  it("starts after one meaningful activity", () => {
    const state = recordMeaningfulActivity(initialState, "lesson:a", day(10));
    expect(state.streak).toMatchObject({
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: "2026-08-10",
    });
  });

  it("counts seven consecutive local calendar days", () => {
    let state = initialState;
    for (let date = 4; date <= 10; date++)
      state = recordMeaningfulActivity(state, `activity:${date}`, day(date));
    const summary = streakSummary(state.streak, day(10));
    expect(summary.currentStreak).toBe(7);
    expect(summary.longestStreak).toBe(7);
    expect(summary.unlockedMilestones).toEqual([3, 7]);
  });

  it("stops the current streak after a missed day but keeps history", () => {
    const streak = normalizeStreak(
      { activeDates: ["2026-08-06", "2026-08-07"] },
      [],
      day(9),
    );
    const summary = streakSummary(streak, day(9));
    expect(summary.currentStreak).toBe(0);
    expect(summary.longestStreak).toBe(2);
    expect(summary.activeDates).toHaveLength(2);
  });

  it("does not count the same completed activity again", () => {
    const once = recordMeaningfulActivity(initialState, "lesson:a", day(9)),
      repeated = recordMeaningfulActivity(once, "lesson:a", day(10));
    expect(repeated).toBe(once);
    expect(repeated.streak.currentStreak).toBe(1);
    expect(repeated.streak.activeDates).toEqual(["2026-08-09"]);
  });

  it("counts several unique activities on one day only once", () => {
    const first = recordMeaningfulActivity(initialState, "lesson:a", day(10)),
      second = recordMeaningfulActivity(first, "quiz:a", day(10));
    expect(second.streak.activeDates).toEqual(["2026-08-10"]);
    expect(second.streak.currentStreak).toBe(1);
  });

  it("uses the local date rather than a UTC date slice", () => {
    expect(localDateKey(new Date(2026, 7, 10, 0, 5))).toBe("2026-08-10");
  });
});
