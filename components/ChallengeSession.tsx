"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, RotateCcw, Trophy } from "lucide-react";
import { generateQuestion, questionTypeLabel } from "@/lib/questions/generator";
import type { ChallengeMode, Difficulty, Question } from "@/types/subnet";

type AnswerResult = { correct: boolean; explanation: string; answer: string };

const configuration: Record<ChallengeMode, { target?: number; seconds?: number; difficulty: Difficulty; title: string; hiddenReview?: boolean }> = {
  daily: { target: 10, difficulty: "Medium", title: "Daily Challenge" },
  speed: { target: 20, difficulty: "Medium", title: "Speed Run" },
  survival: { difficulty: "Medium", title: "Survival Mode" },
  hardcore: { target: 20, difficulty: "Hard", title: "Hardcore Mode", hiddenReview: true },
  timeAttack: { seconds: 300, difficulty: "Medium", title: "Time Attack" },
  endless: { difficulty: "Medium", title: "Endless Mode" },
  exam: { target: 50, seconds: 3600, difficulty: "Hard", title: "CCNA Exam", hiddenReview: true },
  boss: { target: 8, difficulty: "Expert", title: "Enterprise VLSM Boss" },
};

function dailySeed(index: number): number {
  const date = new Date().toLocaleDateString("en-CA").replaceAll("-", "");
  return Number(date) + index * 7919;
}

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ChallengeSession({ mode, onAnswer, onExit }: { mode: ChallengeMode; onAnswer: (question: Question, answer: string, seconds: number, bonusXp: number) => AnswerResult; onExit: () => void }) {
  const config = configuration[mode];
  const makeQuestion = (index: number): Question => generateQuestion(config.difficulty, mode === "daily" ? dailySeed(index) : undefined);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(() => makeQuestion(0));
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(config.seconds ?? null);
  const [completed, setCompleted] = useState(false);
  const questionNumber = index + 1;
  const progressText = config.target ? `${Math.min(questionNumber, config.target)} / ${config.target}` : `${questionNumber} solved`;
  const canContinue = !config.target || questionNumber < config.target;
  const title = useMemo(() => config.title, [config.title]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [question.id]);

  useEffect(() => {
    if (remaining === null || completed) return;
    if (remaining === 0) { setCompleted(true); return; }
    const timer = window.setInterval(() => setRemaining((value) => value === null ? null : Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [completed, remaining]);

  function submit(): void {
    if (!answer.trim() || result || completed) return;
    const nextResult = onAnswer(question, answer, seconds, mode === "daily" ? 5 : mode === "boss" ? 10 : 0);
    setResult(nextResult);
    if (nextResult.correct) setCorrect((value) => value + 1);
    if (mode === "survival" && !nextResult.correct) setCompleted(true);
  }

  function next(): void {
    if (completed) return;
    if (!canContinue) { setCompleted(true); return; }
    const nextIndex = index + 1;
    setIndex(nextIndex); setQuestion(makeQuestion(nextIndex)); setAnswer(""); setResult(null); setSeconds(0);
  }

  function restart(): void {
    setIndex(0); setQuestion(makeQuestion(0)); setAnswer(""); setResult(null); setCorrect(0); setSeconds(0); setRemaining(config.seconds ?? null); setCompleted(false);
  }

  if (completed) return <article className="question-card challenge-result"><Trophy size={28} /><p className="eyebrow">{title.toUpperCase()} COMPLETE</p><h2>{correct} correct out of {index + (result ? 1 : 0)}</h2><p className="question-context">{mode === "survival" ? `Your survival run ended after ${correct} correct answers.` : `Keep your streak going—every reviewed answer is saved to History.`}</p><div className="result-actions"><button className="primary-button" onClick={restart}><RotateCcw size={15} />Try again</button><button className="secondary-button" onClick={onExit}>Back to challenges</button></div></article>;

  return <article className="question-card"><div className="question-meta"><span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span><span>{questionTypeLabel(question.type)}</span><span className="challenge-count">{progressText}</span>{remaining !== null ? <time><Clock3 size={14} />{formatTime(remaining)}</time> : <time>{formatTime(seconds)}</time>}</div><p className="eyebrow">{title}</p><h2>{question.prompt}</h2><p className="question-context">{question.body}</p><label htmlFor="challenge-answer">Your answer</label><div className="answer-line"><input id="challenge-answer" value={answer} disabled={Boolean(result)} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Type your answer" autoComplete="off" autoFocus /><button className="primary-button" onClick={submit} disabled={Boolean(result)}>Check answer →</button></div>{result && !config.hiddenReview && <><div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}><strong>{result.correct ? "Correct!" : "Not quite."}</strong> The answer is {result.answer}.</div><div className="explanation"><strong>Step-by-step explanation</strong><p>{result.explanation}</p></div></>}{result && config.hiddenReview && <div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}><strong>{result.correct ? "Recorded." : "Recorded."}</strong> Answers and explanations unlock when the session ends.</div>}{result && <button className="secondary-button next-question" onClick={next}>{canContinue ? "Next question →" : "Finish challenge →"}</button>}</article>;
}
