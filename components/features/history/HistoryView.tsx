import type { HistoryEntry } from "@/types/subnet";
import { buildHistoryFilter } from "@/lib/features";
import { HistoryControls } from "./HistoryControls";
import { HistoryList } from "./HistoryList";

type HistoryViewProps = {
  history: HistoryEntry[];
  search: string;
  filter: "All" | HistoryEntry["result"];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: "All" | HistoryEntry["result"]) => void;
  onToggleFavorite: (id: string) => void;
};

export function HistoryView({
  history,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onToggleFavorite,
}: HistoryViewProps) {
  const filteredHistory = buildHistoryFilter(history, filter, search);

  return (
    <section>
      <header className="page-heading">
        <div>
          <p>ANSWER HISTORY</p>
          <h1>
            Review the <em>work.</em>
          </h1>
        </div>
      </header>
      <HistoryControls
        search={search}
        filter={filter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />
      <HistoryList history={filteredHistory} onToggleFavorite={onToggleFavorite} />
    </section>
  );
}
