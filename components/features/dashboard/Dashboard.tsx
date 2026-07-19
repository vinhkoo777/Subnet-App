import type { ProgressState } from "@/types/subnet";
import { XPCard } from "./XPCard";
import { MetricsRow } from "./MetricsRow";
import { DailyGoalCard } from "./DailyGoalCard";
import { RecentActivityCard } from "./RecentActivityCard";

type DashboardProps = {
  level: number;
  levelPercent: number;
  progress: ProgressState;
  solved: number;
  accuracy: number;
  todayCount: number;
  levelStart: number;
  nextXp: number;
  onContinue: () => void;
};

export function Dashboard({
  level,
  levelPercent,
  progress,
  solved,
  accuracy,
  todayCount,
  levelStart,
  nextXp,
  onContinue,
}: DashboardProps) {
  return (
    <section>
      <header className="page-heading">
        <div>
          <p>CCNA IPV4 TRAINER</p>
          <h1>
            Build subnetting <em>instincts.</em>
          </h1>
          <span>Daily, deliberate practice with instant explanations.</span>
        </div>
        <button className="primary-button" onClick={onContinue}>
          Continue practice →
        </button>
      </header>
      <XPCard
        level={level}
        levelPercent={levelPercent}
        progress={progress}
        nextXp={nextXp}
        levelStart={levelStart}
      />
      <MetricsRow
        todayCount={todayCount}
        dailyGoal={progress.dailyGoal}
        accuracy={accuracy}
        solved={solved}
        totalSeconds={progress.totalSeconds}
      />
      <div className="two-column">
        <DailyGoalCard
          todayCount={todayCount}
          dailyGoal={progress.dailyGoal}
          onContinue={onContinue}
        />
        <RecentActivityCard history={progress.history} />
      </div>
    </section>
  );
}
