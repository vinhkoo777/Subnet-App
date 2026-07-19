import React from "react";
import type { ProgressState } from "@/types/subnet";

type XPCardProps = {
  level: number;
  levelPercent: number;
  progress: ProgressState;
  nextXp: number;
  levelStart: number;
};

function XPCardComponent({ level, levelPercent, progress, nextXp, levelStart }: XPCardProps) {
  return (
    <article className="xp-card">
      <div className="level-pill">
        {level}
        <small>LVL</small>
      </div>
      <div>
        <strong>Level {level} · Network learner</strong>
        <div className="progress">
          <i style={{ width: `${levelPercent}%` }} />
        </div>
        <small>
          {progress.xp - levelStart} / {nextXp - levelStart} XP to level {level + 1}
        </small>
      </div>
      <div className="streak">
        🔥 <b>{progress.streak}</b>
        <small>DAY STREAK</small>
      </div>
    </article>
  );
}

export const XPCard = React.memo(XPCardComponent);
