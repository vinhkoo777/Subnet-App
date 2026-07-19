import React from "react";

type DailyGoalCardProps = {
  todayCount: number;
  dailyGoal: number;
  onContinue: () => void;
};

function DailyGoalCardComponent({ todayCount, dailyGoal, onContinue }: DailyGoalCardProps) {
  return (
    <article className="panel">
      <p>DAILY GOAL</p>
      <h2>Make today count.</h2>
      <div className="goal-number">
        {Math.min(100, Math.round((todayCount / dailyGoal) * 100))}%
      </div>
      <strong>
        {todayCount} of {dailyGoal} questions
      </strong>
      <button className="secondary-button" onClick={onContinue}>
        Solve a question →
      </button>
    </article>
  );
}

export const DailyGoalCard = React.memo(DailyGoalCardComponent);
