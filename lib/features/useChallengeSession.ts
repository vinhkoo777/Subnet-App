import { useCallback, useEffect, useState } from "react";
import type { Difficulty, Question } from "@/types/subnet";
import { generateQuestion } from "@/lib/questions/generator";
import type { ChallengeMode } from "@/types/subnet";

type AnswerResult = { correct: boolean; explanation: string; answer: string };

type ChallengeConfig = {
  target?: number;
  seconds?: number;
  difficulty: Difficulty;
  title: string;
  hiddenReview?: boolean;
};

const configuration: Record<ChallengeMode, ChallengeConfig> = {
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

export function useChallengeSession(mode: ChallengeMode, handlers?: { onHintUsed?: (cost: number) => void; onRevealAnswer?: (q: Question) => void }) {
  const config = configuration[mode];

  const makeQuestion = useCallback(
    (index: number): Question =>
      generateQuestion(config.difficulty, mode === "daily" ? dailySeed(index) : undefined),
    [config.difficulty, mode],
  );

  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(() => makeQuestion(0));
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(config.seconds ?? null);
  const [completed, setCompleted] = useState(false);

  const questionNumber = index + 1;
  const progressText = config.target
    ? `${Math.min(questionNumber, config.target)} / ${config.target}`
    : `${questionNumber} solved`;
  const canContinue = !config.target || questionNumber < config.target;

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [question.id]);

  useEffect(() => {
    if (remaining === null || completed) return;
    if (remaining === 0) {
      setCompleted(true);
      return;
    }
    const timer = window.setInterval(
      () => setRemaining((value) => (value === null ? null : Math.max(0, value - 1))),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [completed, remaining]);

  const submit = useCallback(
    (
      onAnswer: (
        question: Question,
        answer: string,
        seconds: number,
        bonusXp: number,
      ) => AnswerResult,
    ): void => {
      if (!answer.trim() || result || completed) return;
      const nextResult = onAnswer(
        question,
        answer,
        seconds,
        mode === "daily" ? 5 : mode === "boss" ? 10 : 0,
      );
      setResult(nextResult);
      if (nextResult.correct) setCorrect((value) => value + 1);
      if (mode === "survival" && !nextResult.correct) setCompleted(true);
    },
    [answer, result, completed, question, seconds, mode],
  );

  const [hint, setHint] = useState<string | null>(null);

  const makeHint = useCallback((answerStr: string) => {
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
  }, []);

  const revealHint = useCallback((cost = 5) => {
    if (hint) return hint;
    const h = makeHint(question.answer);
    setHint(h);
    handlers?.onHintUsed?.(cost);
    return h;
  }, [hint, makeHint, question.answer, handlers]);

  const revealAnswer = useCallback(() => {
    if (result) return result;
    const nextResult: AnswerResult = { correct: false, explanation: question.explanation, answer: question.answer };
    setResult(nextResult);
    handlers?.onRevealAnswer?.(question);
    return nextResult;
  }, [result, question.explanation, question.answer, handlers]);

  const next = useCallback((): void => {
    if (completed) return;
    if (!canContinue) {
      setCompleted(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setQuestion(makeQuestion(nextIndex));
    setAnswer("");
    setResult(null);
    setSeconds(0);
  }, [completed, canContinue, index, makeQuestion]);

  const restart = useCallback((): void => {
    setIndex(0);
    setQuestion(makeQuestion(0));
    setAnswer("");
    setResult(null);
    setCorrect(0);
    setSeconds(0);
    setRemaining(config.seconds ?? null);
    setCompleted(false);
  }, [config.seconds, makeQuestion]);

  return {
    config,
    question,
    answer,
    setAnswer,
    result,
    correct,
    seconds,
    remaining,
    completed,
    questionNumber,
    progressText,
    canContinue,
    formatTime,
    submit,
    hint,
    revealHint,
    revealAnswer,
    next,
    restart,
  };
}
