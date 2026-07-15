export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";
export type QuestionType =
  | "network"
  | "broadcast"
  | "firstHost"
  | "lastHost"
  | "usableHosts"
  | "totalAddresses"
  | "mask"
  | "wildcard"
  | "cidr"
  | "blockSize"
  | "hostBits"
  | "sameSubnet"
  | "nextSubnet"
  | "previousSubnet"
  | "privatePublic"
  | "classful"
  | "binary"
  | "requiredPrefix"
  | "hostId"
  | "differentSubnet"
  | "vlsm"
  | "longestPrefix";

export interface SubnetDetails {
  readonly ip: string;
  readonly prefix: number;
  readonly mask: string;
  readonly wildcard: string;
  readonly network: string;
  readonly broadcast: string;
  readonly firstHost: string;
  readonly lastHost: string;
  readonly usableHosts: number;
  readonly totalAddresses: number;
  readonly blockSize: number;
}

export interface Question {
  readonly id: string;
  readonly type: QuestionType;
  readonly difficulty: Difficulty;
  readonly prompt: string;
  readonly body: string;
  readonly answer: string;
  readonly explanation: string;
}

export type AnswerResult = "Correct" | "Wrong" | "Skipped";

export interface HistoryEntry {
  readonly id: string;
  readonly date: string;
  readonly prompt: string;
  readonly answer: string;
  readonly correctAnswer: string;
  readonly result: AnswerResult;
  readonly seconds: number;
  readonly difficulty: Difficulty;
  readonly type: QuestionType;
  readonly favorite: boolean;
}

export interface ProgressState {
  xp: number;
  streak: number;
  bestStreak: number;
  lastSolvedDate: string | null;
  correct: number;
  wrong: number;
  skipped: number;
  totalSeconds: number;
  fastestSeconds: number | null;
  dailyGoal: number;
  history: HistoryEntry[];
  favorites: string[];
  unlockedAchievements: string[];
  bestChallengeScores: Partial<Record<ChallengeMode, number>>;
  settings: Settings;
}

export type ChallengeMode = "daily" | "speed" | "survival" | "hardcore" | "timeAttack" | "endless" | "exam" | "boss";

export interface Settings {
  darkMode: boolean;
  sound: boolean;
  keyboardShortcuts: boolean;
  animations: boolean;
}
