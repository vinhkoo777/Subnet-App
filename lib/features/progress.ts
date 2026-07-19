import type { Difficulty, HistoryEntry, ProgressState, Question } from "@/types/subnet";

export const today = () => new Date().toLocaleDateString("en-CA");

export const levelForXp = (xp: number) => Math.floor((Math.sqrt(1 + (8 * xp) / 75) - 1) / 2) + 1;

export const xpForLevel = (level: number) => (75 * level * (level + 1)) / 2;

export const formatSeconds = (seconds: number | null) =>
  seconds === null ? "—" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function buildHistoryFilter(
  history: HistoryEntry[],
  filter: "All" | HistoryEntry["result"],
  search: string,
) {
  const query = search.toLowerCase();
  return history
    .slice()
    .reverse()
    .filter(
      (entry) =>
        (filter === "All" || entry.result === filter) &&
        `${entry.prompt} ${entry.answer} ${entry.correctAnswer}`.toLowerCase().includes(query),
    );
}

export function getAccuracy(solved: number, correct: number) {
  return solved ? Math.round((correct / solved) * 100) : 0;
}

export function getLevelProgress(progress: ProgressState) {
  const level = levelForXp(progress.xp);
  const levelStart = xpForLevel(level - 1);
  const nextXp = xpForLevel(level);
  const levelPercent = Math.min(100, ((progress.xp - levelStart) / (nextXp - levelStart)) * 100);
  return { level, levelStart, nextXp, levelPercent };
}

export function getDailyCount(history: HistoryEntry[], hydrated: boolean) {
  if (!hydrated) return 0;
  return history.filter((entry) => entry.date === today()).length;
}

export function buildQuestionResult(
  answer: string,
  seconds: number,
  target: Question,
  bonusXp = 0,
) {
  const correct =
    answer.trim().toLowerCase().replace(/\s+/g, "") ===
    target.answer.trim().toLowerCase().replace(/\s+/g, "");
  const base =
    target.difficulty === "Hard" || target.difficulty === "Expert"
      ? 20
      : target.difficulty === "Medium"
        ? 15
        : 10;
  const earned = correct ? base + (seconds <= 20 ? 5 : 0) + bonusXp : 0;
  return { correct, earned, explanation: target.explanation, answer: target.answer };
}

export function getDifficultyLabel(difficulty: Difficulty) {
  return difficulty;
}
