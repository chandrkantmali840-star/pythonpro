import type { AppState } from "../types";
import { streakSummary } from "./streakService";
export function metrics(s: AppState) {
  const correct = s.attempts.filter((a) => a.correct).length,
    attempted = s.attempts.length,
    accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  const knowledge = Math.min(100, s.completedLessons.length * 2),
    practice = Math.min(100, attempted / 5),
    coding = Math.min(100, s.solvedChallenges.length * 2),
    quizzes = s.quizAttempts.length
      ? Math.round(
          s.quizAttempts.reduce((n, q) => n + (q.score / q.total) * 100, 0) /
            s.quizAttempts.length,
        )
      : 0,
    projects = Math.min(100, s.completedProjects.length * 10),
    streak = streakSummary(s.streak).currentStreak,
    consistency = Math.min(100, streak * 10);
  return {
    correct,
    attempted,
    accuracy,
    skill: Math.round(
      knowledge * 0.2 +
        practice * 0.2 +
        coding * 0.3 +
        quizzes * 0.15 +
        projects * 0.1 +
        consistency * 0.05,
    ),
    lessons: s.completedLessons.length,
    coding: s.solvedChallenges.length,
    projects: s.completedProjects.length,
    streak,
    quizzes,
  };
}
