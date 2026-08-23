import type { AppState } from "../types";
import { emptyStreak, normalizeStreak } from "./streakService";
const KEY = "pythonpro.state.v1";
export const initialState: AppState = {
  user: null,
  completedLessons: [],
  attempts: [],
  quizAttempts: [],
  solvedChallenges: [],
  completedProjects: [],
  xp: 0,
  claimedXpActivities: [],
  learningActivityResults: [],
  bugsFixed: 0,
  bossBattlesPassed: [],
  dailyChallengesCompleted: [],
  savedSnippets: [],
  knowledgeHistory: [],
  selectedPath: "Python Beginner",
  bookmarks: [],
  streak: emptyStreak,
  settings: {
    theme: "system",
    fontSize: 15,
    notifications: true,
    sound: false,
  },
};
export const persistenceService = {
  hydrate(saved: Partial<AppState> | null | undefined): AppState {
    const value = { ...(saved || {}) } as Partial<AppState> & {
      videoProgress?: unknown;
      streakDates?: string[];
    };
    delete value.videoProgress;
    const streak = normalizeStreak(value.streak, value.streakDates || []);
    delete value.streakDates;
    return {
      ...initialState,
      ...value,
      streak,
      settings: { ...initialState.settings, ...value.settings },
    };
  },
  load(): AppState {
    try {
      return this.hydrate(JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch {
      return initialState;
    }
  },
  save(s: AppState) {
    localStorage.setItem(KEY, JSON.stringify(s));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
