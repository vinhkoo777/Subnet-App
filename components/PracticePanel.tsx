"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/types/subnet";
import { questionTypeLabel } from "@/lib/questions/generator";

export function PracticePanel({ question, onAnswer, onNext }: { question: Question; onAnswer: (answer: string, seconds: number) => { correct: boolean; explanation: string; answer: string }; onNext: () => void }) {
  const [answer, setAnswer] = useState(""); const [seconds, setSeconds] = useState(0); const [result, setResult] = useState<{ correct: boolean; explanation: string; answer: string } | null>(null);
  useEffect(() => { setAnswer(""); setSeconds(0); setResult(null); const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer); }, [question]);
  function submit(): void { if (!answer.trim() || result) return; setResult(onAnswer(answer, seconds)); }
  return <article className="question-card"><div className="question-meta"><span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span><span>{questionTypeLabel(question.type)}</span><time>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</time></div><h2>{question.prompt}</h2><p className="question-context">{question.body}</p><label htmlFor="answer">Your answer</label><div className="answer-line"><input id="answer" value={answer} disabled={Boolean(result)} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Type your answer" autoComplete="off" /><button className="primary-button" onClick={submit} disabled={Boolean(result)}>Check answer →</button></div>{result && <><div className={result.correct ? "answer-feedback correct" : "answer-feedback wrong"}><strong>{result.correct ? "Correct!" : "Not quite."}</strong> The answer is {result.answer}.</div><div className="explanation"><strong>Step-by-step explanation</strong><p>{result.explanation}</p></div><button className="secondary-button next-question" onClick={onNext}>Next question →</button></>}</article>;
}
