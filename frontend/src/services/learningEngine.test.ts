import { describe, expect, it } from "vitest";
import { initialState } from "./persistenceService";
import { activitiesForLesson } from "../data/learning/interactiveLessons";
import { awardActivity, levelFor } from "./xpService";
describe("interactive curriculum", () => {
  it("provides a varied eight-step activity loop for every lesson", () => {
    for (let i = 1; i <= 50; i++) {
      const activities = activitiesForLesson(`lesson-${i}`);
      expect(activities).toHaveLength(8);
      expect(new Set(activities.map((x) => x.kind)).size).toBe(8);
    }
  });
  it("supports multiple fill-code blanks", () => {
    const strings = activitiesForLesson("lesson-9").find(
      (x) => x.kind === "fill-code",
    );
    expect(strings?.blankAnswers).toHaveLength(2);
  });
  it("keeps explanations short and interactions dominant", () => {
    const activities = activitiesForLesson("lesson-10");
    expect(activities.filter((x) => x.kind === "concept")).toHaveLength(1);
    expect(activities.filter((x) => x.kind !== "concept")).toHaveLength(7);
  });
});
describe("XP and levels", () => {
  it("awards an activity once and prevents farming", () => {
    const result = {
      activityId: "lesson-1-predict",
      topic: "Python Introduction",
      kind: "predict" as const,
      correct: true,
      at: "2026-08-23",
    };
    const once = awardActivity(initialState, result, 10),
      twice = awardActivity(once, result, 10);
    expect(once.xp).toBe(10);
    expect(twice.xp).toBe(10);
    expect(twice.claimedXpActivities).toHaveLength(1);
  });
  it("advances named levels transparently", () => {
    expect(levelFor(0).name).toBe("Python Rookie");
    expect(levelFor(500).name).toBe("Python Coder");
    expect(levelFor(2700).name).toBe("Python Master");
  });
});
