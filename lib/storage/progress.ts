import type { ProgressState } from "@/types/subnet";

const KEY = "subnetstreak/progress/v3";
export const initialProgress = (): ProgressState => ({ xp: 0, streak: 0, bestStreak: 0, lastSolvedDate: null, correct: 0, wrong: 0, skipped: 0, totalSeconds: 0, fastestSeconds: null, dailyGoal: 10, history: [], favorites: [], unlockedAchievements: [], bestChallengeScores: {}, settings: { darkMode: true, sound: true, keyboardShortcuts: true, animations: true } });
export function loadProgress(): ProgressState { if (typeof window === "undefined") return initialProgress(); try { const saved: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "null"); return saved && typeof saved === "object" ? { ...initialProgress(), ...(saved as Partial<ProgressState>), settings: { ...initialProgress().settings, ...((saved as Partial<ProgressState>).settings ?? {}) } } : initialProgress(); } catch { return initialProgress(); } }
export function saveProgress(progress: ProgressState): void { window.localStorage.setItem(KEY, JSON.stringify(progress)); }
