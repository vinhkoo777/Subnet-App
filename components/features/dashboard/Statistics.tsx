import type { Difficulty, ProgressState } from "@/types/subnet";
import { formatSeconds } from "@/lib/features";

type StatisticsProps = {
  progress: ProgressState;
  solved: number;
};

export function Statistics({ progress, solved }: StatisticsProps) {
  return (
    <section>
      <header className="page-heading">
        <div>
          <p>YOUR STATISTICS</p>
          <h1>
            Progress, <em>measured.</em>
          </h1>
        </div>
      </header>
      <div className="metrics">
        <Metric label="CORRECT" value={String(progress.correct)} />
        <Metric label="INCORRECT" value={String(progress.wrong)} />
        <Metric label="SKIPPED" value={String(progress.skipped)} />
        <Metric label="BEST STREAK" value={`${progress.bestStreak} days`} />
      </div>
      <article className="panel">
        <p>DIFFICULTY BREAKDOWN</p>
        {(["Easy", "Medium", "Hard", "Expert"] as Difficulty[]).map((item) => {
          const count = progress.history.filter((entry) => entry.difficulty === item).length;
          return (
            <div className="stat-bar" key={item}>
              <span>{item}</span>
              <i>
                <b style={{ width: `${solved ? (count / solved) * 100 : 0}%` }} />
              </i>
              <small>{count}</small>
            </div>
          );
        })}
      </article>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
