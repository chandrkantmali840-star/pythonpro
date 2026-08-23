import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Flame } from "lucide-react";
import { useApp } from "../context/AppContext";
import { questions } from "../data/questionService";
import { AnswerCards, AnswerFeedback } from "./AnswerCards";
import {
  localDateKey,
  recordMeaningfulActivity,
} from "../services/streakService";
export function DailyChallenge() {
  const { state, update } = useApp(),
    today = localDateKey(),
    q = useMemo(() => questions[hash(today) % questions.length], [today]),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null),
    [xpGained, setXpGained] = useState(0),
    done = state.dailyChallengesCompleted.includes(today);
  const submit = () => {
    if (!answer || feedback) return;
    const correct = answer === q.correctAnswer;
    setFeedback(correct ? "correct" : "incorrect");
    setXpGained(correct && !done ? 25 : 0);
    if (correct && !done)
      update((s) =>
        recordMeaningfulActivity(
          {
            ...s,
            xp: s.xp + 25,
            dailyChallengesCompleted: [...s.dailyChallengesCompleted, today],
            attempts: [
              ...s.attempts.filter((a) => a.questionId !== q.id),
              {
                questionId: q.id,
                answer,
                correct: true,
                at: new Date().toISOString(),
              },
            ],
          },
          `daily:${today}`,
        ),
      );
  };
  return (
    <section className="card border-amber-200 dark:border-amber-900">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge bg-amber-50 text-amber-800">
            <Flame size={14} />
            Today&apos;s challenge
          </span>
          <h2 className="mt-3 text-lg font-bold">{q.topic}: rapid check</h2>
        </div>
        {done && (
          <span className="text-sm font-bold text-emerald-600">✓ +25 XP</span>
        )}
      </div>
      <p className="mt-3">{q.question}</p>
      {q.code && (
        <pre className="mt-3">
          <code>{q.code}</code>
        </pre>
      )}
      <AnswerCards
        options={q.options}
        value={answer}
        onChange={setAnswer}
        submitted={done || feedback !== null}
        correctAnswer={q.correctAnswer}
        onSubmit={submit}
        ariaLabel="Daily challenge answers"
      />
      {!done && !feedback && (
        <button
          className="btn-primary mt-3"
          disabled={!answer}
          onClick={submit}
        >
          <CalendarCheck size={16} />
          Submit Answer
        </button>
      )}
      {feedback && (
        <AnswerFeedback
          correct={feedback === "correct"}
          selectedAnswer={answer}
          correctAnswer={q.correctAnswer}
          explanation={q.explanation}
          concept={q.subtopic || q.topic}
          reviewPath={`/learn`}
          xpGained={xpGained}
          onNext={
            feedback === "incorrect"
              ? () => {
                  setAnswer("");
                  setFeedback(null);
                  setXpGained(0);
                }
              : undefined
          }
          nextLabel="Try again"
        />
      )}
      <Link
        className="mt-3 inline-block text-sm font-semibold text-indigo-600"
        to={`/practice/${encodeURIComponent(q.topic)}`}
      >
        Practice more {q.topic} →
      </Link>
    </section>
  );
}
function hash(value: string) {
  return [...value].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
}
