"use client";

import { Clock3, RotateCcw, Trophy } from "lucide-react";
import { questionTypeLabel } from "@/lib/questions/generator";
import { useAppSession } from "@/lib/features";
import type { ChallengeMode, Question } from "@/types/subnet";
import { useChallengeSession } from "@/lib/features";

type AnswerResult = { correct: boolean; explanation: string; answer: string };

export function ChallengeSession({
  mode,
  onAnswer,
  onExit,
}: {
  mode: ChallengeMode;
  onAnswer: (question: Question, answer: string, seconds: number, bonusXp: number) => AnswerResult;
  onExit: () => void;
}) {
  const app = useAppSession();

  const {
    config,
    question,
    answer,
    setAnswer,
    result,
    hint,
    revealHint,
    revealAnswer,
    correct,
    seconds,
    remaining,
    completed,
    questionNumber,
    progressText,
    canContinue,
    formatTime,
    submit,
    next,
    restart,
  } = useChallengeSession(mode, {
    onHintUsed: (cost) =>
      app.setProgress((current) => ({ ...current, xp: Math.max(0, current.xp - cost) })),
    onRevealAnswer: (q) => app.revealAnswer(q),
  });
  

  const handleSubmit = () => submit(onAnswer);

  if (completed)
    return (
      <article className="question-card challenge-result">
        <Trophy size={28} />
        <p className="eyebrow">{config.title.toUpperCase()} COMPLETE</p>
        <h2>
          {correct} correct out of {questionNumber + (result ? 0 : -1)}
        </h2>
        <p className="question-context">
          {mode === "survival"
            ? `Your survival run ended after ${correct} correct answers.`
            : `Keep your streak going—every reviewed answer is saved to History.`}
        </p>
        <div className="result-actions">
          <button className="primary-button" onClick={restart}>
            <RotateCcw size={15} />
            Try again
          </button>
          <button className="secondary-button" onClick={onExit}>
            Back to challenges
          </button>
        </div>
      </article>
    );

  return (
    <article className="question-card">
      <div className="question-meta">
        <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
        <span>{questionTypeLabel(question.type)}</span>
        <span className="challenge-count">{progressText}</span>
        {remaining !== null ? (
          <time>
            <Clock3 size={14} />
            {formatTime(remaining)}
          </time>
        ) : (
          <time>{formatTime(seconds)}</time>
        )}
      </div>
      {!result && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
          <button
            className="secondary-button"
            onClick={() => revealHint(5)}
            disabled={Boolean(hint)}
          >
            Show hint (−5 XP)
          </button>
          <button
            className="secondary-button"
            onClick={() => revealAnswer()}
            disabled={Boolean(result)}
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
      <p className="eyebrow">{config.title}</p>
      <h2>{question.prompt}</h2>
      <p className="question-context">{question.body}</p>
      <label htmlFor="challenge-answer">Your answer</label>
      <div className="answer-line">
        <input
          id="challenge-answer"
          value={answer}
          disabled={Boolean(result)}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
          placeholder="Type your answer"
          autoComplete="off"
          autoFocus
        />
        <button className="primary-button" onClick={handleSubmit} disabled={Boolean(result)}>
          Check answer →
        </button>
      </div>
      {result && !config.hiddenReview && (
        <>
          <div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}>
            <strong>{result.correct ? "Correct!" : "Not quite."}</strong> The answer is{" "}
            {result.answer}.
          </div>
          <div className="explanation">
            <strong>Step-by-step explanation</strong>
            <p>{result.explanation}</p>
          </div>
        </>
      )}
      {result && config.hiddenReview && (
        <div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}>
          <strong>{result.correct ? "Recorded." : "Recorded."}</strong> Answers and explanations
          unlock when the session ends.
        </div>
      )}
      {result && (
        <button className="secondary-button next-question" onClick={next}>
          {canContinue ? "Next question →" : "Finish challenge →"}
        </button>
      )}
    </article>
  );
}
