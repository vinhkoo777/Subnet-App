import type { ChallengeMode } from "@/types/subnet";

export const challengeModes: Array<{
  id: ChallengeMode;
  name: string;
  description: string;
  questions: string;
}> = [
  {
    id: "daily",
    name: "Daily Challenge",
    description: "A shared seeded set with bonus XP.",
    questions: "10 questions",
  },
  {
    id: "speed",
    name: "Speed Run",
    description: "Complete twenty questions as quickly as possible.",
    questions: "20 questions",
  },
  {
    id: "survival",
    name: "Survival",
    description: "One mistake ends your run.",
    questions: "One life",
  },
  {
    id: "hardcore",
    name: "Hardcore",
    description: "No answer reveal during the session.",
    questions: "Exam rules",
  },
  {
    id: "timeAttack",
    name: "Time Attack",
    description: "Solve as much as you can in five minutes.",
    questions: "5 minutes",
  },
  {
    id: "endless",
    name: "Endless",
    description: "Infinite mixed subnetting practice.",
    questions: "No limit",
  },
  {
    id: "exam",
    name: "CCNA Exam",
    description: "A scored, timed subnetting exam.",
    questions: "50 questions",
  },
  {
    id: "boss",
    name: "VLSM Boss",
    description: "Expert enterprise addressing drills.",
    questions: "8 questions",
  },
];
