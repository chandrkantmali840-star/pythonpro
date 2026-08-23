import type { AppState, LearningActivityResult } from "../types";
import { recordMeaningfulActivity } from "./streakService";
export const levels = [
  { name: "Python Rookie", xp: 0 },
  { name: "Python Explorer", xp: 100 },
  { name: "Python Learner", xp: 250 },
  { name: "Python Coder", xp: 500 },
  { name: "Python Builder", xp: 850 },
  { name: "Python Developer", xp: 1300 },
  { name: "Python Specialist", xp: 1900 },
  { name: "Python Master", xp: 2700 },
];
export function levelFor(xp: number) {
  let index = 0;
  levels.forEach((level, i) => {
    if (xp >= level.xp) index = i;
  });
  const current = levels[index],
    next = levels[index + 1];
  return {
    number: index + 1,
    name: current.name,
    currentXp: xp,
    nextXp: next?.xp ?? xp,
    progress: next
      ? Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100)
      : 100,
  };
}
export function awardActivity(
  state: AppState,
  result: LearningActivityResult,
  reward: number,
) {
  if (state.claimedXpActivities.includes(result.activityId))
    return {
      ...state,
      learningActivityResults: [
        ...state.learningActivityResults.filter(
          (x) => x.activityId !== result.activityId,
        ),
        result,
      ],
    };
  return recordMeaningfulActivity(
    {
      ...state,
      xp: state.xp + reward,
      claimedXpActivities: [...state.claimedXpActivities, result.activityId],
      learningActivityResults: [
        ...state.learningActivityResults.filter(
          (x) => x.activityId !== result.activityId,
        ),
        result,
      ],
      bugsFixed: state.bugsFixed + (result.kind === "bug-hunt" ? 1 : 0),
    },
    `learning:${result.activityId}`,
  );
}
export function topicAccuracy(state: AppState) {
  const grouped = new Map<string, { correct: number; total: number }>();
  for (const r of [
    ...state.learningActivityResults,
    ...state.attempts.map((a) => ({ topic: "Practice", correct: a.correct })),
  ]) {
    const x = grouped.get(r.topic) || { correct: 0, total: 0 };
    x.total++;
    if (r.correct) x.correct++;
    grouped.set(r.topic, x);
  }
  return [...grouped]
    .map(([topic, x]) => ({
      topic,
      accuracy: Math.round((x.correct / x.total) * 100),
      attempts: x.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
