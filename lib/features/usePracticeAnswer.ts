import { useEffect, useState } from "react";
import type { Question } from "@/types/subnet";

type AnswerResult = { correct: boolean; explanation: string; answer: string };

export function usePracticeAnswer(
  question: Question,
  onAnswer: (answer: string, seconds: number) => AnswerResult,
) {
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<AnswerResult | null>(null);

  useEffect(() => {
    setAnswer("");
    setSeconds(0);
    setResult(null);
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [question]);

  const submit = (): void => {
    if (!answer.trim() || result) return;
    setResult(onAnswer(answer, seconds));
  };

  const revealAnswer = (): void => {
    if (result) return;
    setResult({ correct: false, explanation: question.explanation, answer: question.answer });
  };

  const formatTime = (secs: number): string => {
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  return {
    answer,
    setAnswer,
    seconds,
    result,
    submit,
    revealAnswer,
    formatTime: formatTime(seconds),
  };
}
