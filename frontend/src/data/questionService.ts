import raw from "./questions/questions.json";
import type { Question } from "../types";
export const questions = raw as Question[];
export const questionService = {
  all: () => questions,
  byId: (id: string) => questions.find((q) => q.id === id),
  filter: (x: { topic?: string; difficulty?: string; type?: string }) =>
    questions.filter(
      (q) =>
        (!x.topic || q.topic === x.topic) &&
        (!x.difficulty || q.difficulty === x.difficulty) &&
        (!x.type || q.type === x.type),
    ),
  random: (n = 10) =>
    [...questions].sort(() => Math.random() - 0.5).slice(0, n),
};
