import React from "react";
import type { ProgressState } from "@/types/subnet";

type DailyGoalSelectorProps = {
  dailyGoal: number;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
};

function DailyGoalSelectorComponent({ dailyGoal, setProgress }: DailyGoalSelectorProps) {
  return (
    <label>
      Daily goal
      <select
        value={dailyGoal}
        onChange={(event) =>
          setProgress((current) => ({ ...current, dailyGoal: Number(event.target.value) }))
        }
      >
        <option>5</option>
        <option>10</option>
        <option>20</option>
        <option>50</option>
      </select>
    </label>
  );
}

export const DailyGoalSelector = React.memo(DailyGoalSelectorComponent);
