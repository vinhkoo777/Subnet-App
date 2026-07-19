import React from "react";
import type { HistoryEntry } from "@/types/subnet";

type HistoryControlsProps = {
  search: string;
  filter: "All" | HistoryEntry["result"];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: "All" | HistoryEntry["result"]) => void;
};

function HistoryControlsComponent({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: HistoryControlsProps) {
  return (
    <div className="history-controls">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search answers"
      />
      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value as "All" | HistoryEntry["result"])}
      >
        <option>All</option>
        <option>Correct</option>
        <option>Wrong</option>
      </select>
    </div>
  );
}

export const HistoryControls = React.memo(HistoryControlsComponent);
