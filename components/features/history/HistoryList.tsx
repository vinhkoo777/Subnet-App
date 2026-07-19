import type { HistoryEntry } from "@/types/subnet";
import { HistoryRow } from "./HistoryRow";

type HistoryListProps = {
  history: HistoryEntry[];
  onToggleFavorite: (id: string) => void;
};

export function HistoryList({ history, onToggleFavorite }: HistoryListProps) {
  return (
    <article className="panel history-list">
      {history.map((entry) => (
        <HistoryRow key={entry.id} entry={entry} onToggleFavorite={onToggleFavorite} />
      ))}
      {!history.length && <small className="muted">No matching answers yet.</small>}
    </article>
  );
}
