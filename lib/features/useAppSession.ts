"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ChallengeMode,
  Difficulty,
  HistoryEntry,
  ProgressState,
  Question,
} from "@/types/subnet";
import { generateQuestion, normalizeAnswer } from "@/lib/questions/generator";
import { initialProgress, loadProgress, saveProgress } from "@/lib/storage/progress";
import {
  buildHistoryFilter,
  getAccuracy,
  getDailyCount,
  getLevelProgress,
  today,
} from "@/lib/features/progress";
import type { View } from "@/components/Sidebar";

export function useAppSession() {
  const [view, setView] = useState<View>("dashboard");
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [question, setQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [activeChallenge, setActiveChallenge] = useState<ChallengeMode | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | HistoryEntry["result"]>("All");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setQuestion(generateQuestion());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveProgress(progress);
    }
  }, [progress, hydrated]);

  const solved = progress.history.length;
  const accuracy = getAccuracy(solved, progress.correct);
  const { level, levelStart, nextXp, levelPercent } = getLevelProgress(progress);
  const todayCount = getDailyCount(progress.history, hydrated);
  const history = useMemo(
    () => buildHistoryFilter(progress.history, filter, search),
    [filter, progress.history, search],
  );

  const moveTo = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const regularPractice = useCallback(() => {
    setActiveChallenge(null);
    moveTo("practice");
  }, [moveTo]);

  const recordAnswer = (
    answer: string,
    seconds: number,
    bonusXp = 0,
    target: Question | null = question,
  ) => {
    if (!target) {
      return { correct: false, explanation: "Loading the next question.", answer: "" };
    }

    const correct = normalizeAnswer(answer) === normalizeAnswer(target.answer);
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      date: today(),
      prompt: target.prompt,
      answer,
      correctAnswer: target.answer,
      result: correct ? "Correct" : "Wrong",
      seconds,
      difficulty: target.difficulty,
      type: target.type,
      favorite: false,
    };

    setProgress((current) => {
      const previous = new Date();
      previous.setDate(previous.getDate() - 1);
      const yesterday = previous.toLocaleDateString("en-CA");
      const streak = correct
        ? current.lastSolvedDate === today()
          ? current.streak
          : current.lastSolvedDate === yesterday
            ? current.streak + 1
            : 1
        : current.streak;
      const base =
        target.difficulty === "Hard" || target.difficulty === "Expert"
          ? 20
          : target.difficulty === "Medium"
            ? 15
            : 10;
      const earned = correct ? base + (seconds <= 20 ? 5 : 0) + bonusXp : 0;

      return {
        ...current,
        xp: current.xp + earned,
        correct: current.correct + Number(correct),
        wrong: current.wrong + Number(!correct),
        totalSeconds: current.totalSeconds + seconds,
        fastestSeconds: correct
          ? current.fastestSeconds === null
            ? seconds
            : Math.min(current.fastestSeconds, seconds)
          : current.fastestSeconds,
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
        lastSolvedDate: correct ? today() : current.lastSolvedDate,
        history: [...current.history, entry],
      };
    });

    return { correct, explanation: target.explanation, answer: target.answer };
  };

  const toggleFavorite = useCallback(
    (id: string) =>
      setProgress((current) => ({
        ...current,
        history: current.history.map((entry) =>
          entry.id === id ? { ...entry, favorite: !entry.favorite } : entry,
        ),
      })),
    [],
  );

  const exportProgress = useCallback(() => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "subnetstreak-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  const importProgress = useCallback((file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as ProgressState;
        setProgress({
          ...initialProgress(),
          ...imported,
          settings: { ...initialProgress().settings, ...imported.settings },
        });
      } catch {
        window.alert("Choose a valid SubnetStreak export file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const revealAnswer = useCallback((target: Question | null) => {
    if (!target) return { answer: "", explanation: "" };
    const entry = {
      id: crypto.randomUUID(),
      date: today(),
      prompt: target.prompt,
      answer: target.answer,
      correctAnswer: target.answer,
      result: "Skipped" as const,
      seconds: 0,
      difficulty: target.difficulty,
      type: target.type,
      favorite: false,
    };
    setProgress((current) => ({
      ...current,
      history: [...current.history, entry],
    }));
    return { answer: target.answer, explanation: target.explanation };
  }, []);

  return {
    view,
    setView,
    progress,
    setProgress,
    question,
    setQuestion,
    difficulty,
    setDifficulty,
    activeChallenge,
    setActiveChallenge,
    hydrated,
    search,
    setSearch,
    filter,
    setFilter,
    fileInput,
    solved,
    accuracy,
    level,
    levelStart,
    nextXp,
    levelPercent,
    todayCount,
    history,
    moveTo,
    regularPractice,
    recordAnswer,
    toggleFavorite,
    exportProgress,
    importProgress,
    revealAnswer,
  };
}
