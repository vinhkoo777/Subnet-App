import { initialProgress } from "@/lib/storage/progress";
import React from "react";
import type { ProgressState } from "@/types/subnet";
import { Download, Upload, Trash2 } from "lucide-react";

type DataActionsProps = {
  onExport: () => void;
  onImport: (file: File | undefined) => void;
  onReset: () => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
};

function DataActionsComponent({ onExport, onImport, onReset, fileInput }: DataActionsProps) {
  const handleReset = () => {
    if (window.confirm("Reset all SubnetStreak progress?")) {
      onReset();
    }
  };

  return (
    <div className="data-actions">
      <button className="secondary-button" onClick={onExport} type="button">
        <Download size={15} />
        Export data
      </button>
      <button className="secondary-button" onClick={() => fileInput.current?.click()} type="button">
        <Upload size={15} />
        Import data
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        onChange={(event) => onImport(event.target.files?.[0])}
        hidden
      />
      <button className="danger-button" onClick={handleReset} type="button">
        <Trash2 size={15} />
        Reset progress
      </button>
    </div>
  );
}

export const DataActions = React.memo(DataActionsComponent);
