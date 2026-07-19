import React from "react";
import type { HistoryEntry } from "@/types/subnet";
import { formatSeconds, getDifficultyLabel } from "@/lib/features";

type RecentActivityCardProps = {
  history: HistoryEntry[];
};

function RecentActivityCardComponent({ history }: RecentActivityCardProps) {
  return (
    <article className="panel">
      <p>RECENT ACTIVITY</p>
      <h2>Your latest reps</h2>
      {history
        .slice(-5)
        .reverse()
        .map((entry) => (
          <div className="activity" key={entry.id}>
            <b className={entry.result === "Correct" ? "good" : "bad"}>
              {entry.result === "Correct" ? "✓" : "×"}
            </b>
            <span>
              {entry.prompt}
              <small>
                {getDifficultyLabel(entry.difficulty)} · {formatSeconds(entry.seconds)}
              </small>
            </span>
          </div>
        ))}
    </article>
  );
}
export const RecentActivityCard = React.memo(RecentActivityCardComponent);
