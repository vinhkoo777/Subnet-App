"use client";

import type { Question } from "@/types/subnet";
import { questionTypeLabel } from "@/lib/questions/generator";
import { usePracticeAnswer, useAppSession } from "@/lib/features";
import { useState } from "react";

export function PracticePanel({
  question,
  onAnswer,
  onNext,
}: {
  question: Question;
  onAnswer: (
    answer: string,
    seconds: number,
  ) => { correct: boolean; explanation: string; answer: string };
  onNext: () => void;
}) {
  const { answer, setAnswer, result, submit, formatTime, revealAnswer } = usePracticeAnswer(
    question,
    onAnswer,
  );
  const app = useAppSession();
  const [hint, setHint] = useState<string | null>(null);

  const makeHint = (answerStr: string) => {
    if (!answerStr) return "";
    if (answerStr.includes(".")) {
      const parts = answerStr.split(".");
      if (parts.length >= 4) return `${parts.slice(0, 2).join(".")}.x.x`;
      if (parts.length === 3) return `${parts[0]}.${parts[1]}.x`;
      return `${parts[0]}.x`;
    }
    if (answerStr.startsWith("/")) return `prefix ${answerStr.replace(/\d/g, "x")}`;
    if (/^\d+$/.test(answerStr)) return `${answerStr.slice(0, 1)}...`;
    return `${answerStr.slice(0, 3)}...`;
  };

  return (
    <article className="question-card">
      <div className="question-meta">
        <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
        <span>{questionTypeLabel(question.type)}</span>
        <time>{formatTime}</time>
      </div>
      <h2>{question.prompt}</h2>
      <p className="question-context">{question.body}</p>
      <label htmlFor="answer">Your answer</label>
      <div className="answer-line">
        <input
          id="answer"
          value={answer}
          disabled={Boolean(result)}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          placeholder="Type your answer"
          autoComplete="off"
        />
        <button className="primary-button" onClick={submit} disabled={Boolean(result)}>
          Check answer →
        </button>
      </div>
      {!result && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
          <button
            className="secondary-button"
            onClick={() => {
              const h = makeHint(question.answer);
              setHint(h);
              app.setProgress((current) => ({ ...current, xp: Math.max(0, current.xp - 5) }));
            }}
            disabled={Boolean(hint)}
          >
            Show hint (−5 XP)
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              app.revealAnswer(question);
              revealAnswer();
            }}
          >
            Show answer (no XP)
          </button>
        </div>
      )}

      {hint && !result && (
        <div className="answer-feedback wrong" style={{ marginTop: 12 }}>
          <strong>Hint:</strong> {hint}
        </div>
      )}
      {result && (
        <>
          <div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}>
            <strong>{result.correct ? "Correct!" : "Not quite."}</strong> The answer is{" "}
            {result.answer}.
          </div>
          <div className="explanation">
            <strong>Step-by-step explanation</strong>
            <p>{result.explanation}</p>
          </div>
          <button className="secondary-button next-question" onClick={onNext}>
            Next question →
          </button>
        </>
      )}
    </article>
  );
}
