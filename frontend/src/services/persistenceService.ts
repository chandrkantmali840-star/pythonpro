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
  load(): AppState {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      delete saved.videoProgress;
      const streak = normalizeStreak(saved.streak, saved.streakDates || []);
      delete saved.streakDates;
      return {
        ...initialState,
        ...saved,
        streak,
        settings: { ...initialState.settings, ...saved.settings },
      };
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
