import React from "react";
import type { HistoryEntry } from "@/types/subnet";
import { questionTypeLabel } from "@/lib/questions/generator";

type HistoryRowProps = {
  entry: HistoryEntry;
  onToggleFavorite: (id: string) => void;
};

function HistoryRowComponent({ entry, onToggleFavorite }: HistoryRowProps) {
  return (
    <div className="history-row">
      <div className="history-status">
        <b className={entry.result === "Correct" ? "good" : "bad"}>
          {entry.result === "Correct" ? "✓" : "×"}
        </b>
        <span>{entry.result}</span>
      </div>

      <div className="history-content">
        <strong>{entry.prompt}</strong>
        <small>
          Your answer: {entry.answer} · Correct: {entry.correctAnswer} · {questionTypeLabel(entry.type)}
        </small>
      </div>

      <button
        aria-label="Favorite question"
        className="star-button"
        onClick={() => onToggleFavorite(entry.id)}
      >
        {entry.favorite ? "★" : "☆"}
      </button>
    </div>
  );
}

export const HistoryRow = React.memo(HistoryRowComponent);
