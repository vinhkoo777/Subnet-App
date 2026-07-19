import { initialProgress } from "@/lib/storage/progress";
import type { ProgressState } from "@/types/subnet";
import { SettingsToggle } from "./SettingsToggle";
import { DailyGoalSelector } from "./DailyGoalSelector";
import { DataActions } from "./DataActions";

type SettingsViewProps = {
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onExport: () => void;
  onImport: (file: File | undefined) => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
};

export function SettingsView({
  progress,
  setProgress,
  onExport,
  onImport,
  fileInput,
}: SettingsViewProps) {
  return (
    <section>
      <header className="page-heading">
        <div>
          <p>SETTINGS</p>
          <h1>
            Make it <em>yours.</em>
          </h1>
        </div>
      </header>
      <article className="panel settings">
        <SettingsToggle progress={progress} setProgress={setProgress} />
        <DailyGoalSelector dailyGoal={progress.dailyGoal} setProgress={setProgress} />
        <DataActions
          onExport={onExport}
          onImport={onImport}
          onReset={() => setProgress(initialProgress())}
          fileInput={fileInput}
        />
      </article>
    </section>
  );
}
