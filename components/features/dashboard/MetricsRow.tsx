import React from "react";
import { formatSeconds } from "@/lib/features";

type MetricsRowProps = {
  todayCount: number;
  dailyGoal: number;
  accuracy: number;
  solved: number;
  totalSeconds: number;
};

function MetricsRowComponent({
  todayCount,
  dailyGoal,
  accuracy,
  solved,
  totalSeconds,
}: MetricsRowProps) {
  return (
    <div className="metrics">
      <Metric label="TODAY" value={`${todayCount}/${dailyGoal}`} />
      <Metric label="ACCURACY" value={`${accuracy}%`} />
      <Metric label="SOLVED" value={String(solved)} />
      <Metric
        label="AVG. TIME"
        value={solved ? formatSeconds(Math.round(totalSeconds / solved)) : "—"}
      />
    </div>
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

export const MetricsRow = React.memo(MetricsRowComponent);
