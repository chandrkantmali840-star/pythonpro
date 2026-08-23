import type { AppState } from "../types";
import { metrics } from "./analyticsService";
import { topicAccuracy } from "./xpService";
export function recommendations(s: AppState) {
  const m = metrics(s),
    r = [] as { title: string; detail: string; path: string }[];
  const weak = topicAccuracy(s).find((topic) => topic.accuracy < 60);
  if (weak)
    r.push({
      title: `Review ${weak.topic}`,
      detail: `Current mastery is ${weak.accuracy}%. Complete a focused interactive session.`,
      path: "/revision",
    });
  if (m.lessons < 3)
    r.push({
      title: "Continue the foundations",
      detail: "Complete the next core Python lesson.",
      path: "/learn",
    });
  if (!m.attempted || m.accuracy < 60)
    r.push({
      title: "Strengthen with practice",
      detail: "A focused session will reveal weak topics.",
      path: "/practice",
    });
  if (!m.coding)
    r.push({
      title: "Solve an Easy challenge",
      detail: "Translate knowledge into working code.",
      path: "/coding",
    });
  if (r.length < 2)
    r.push({
      title: "Raise the difficulty",
      detail: "Your performance supports a harder challenge.",
      path: "/coding",
    });
  return r;
}
