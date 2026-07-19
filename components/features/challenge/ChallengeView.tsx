import type { ChallengeMode } from "@/types/subnet";

type ChallengeModeConfig = {
  id: ChallengeMode;
  name: string;
  description: string;
  questions: string;
};

type ChallengeViewProps = {
  modes: ChallengeModeConfig[];
  onStartMode: (mode: ChallengeMode) => void;
};

export function ChallengeView({ modes, onStartMode }: ChallengeViewProps) {
  return (
    <section>
      <header className="page-heading">
        <div>
          <p>CHALLENGE MODES</p>
          <h1>
            Test your <em>edge.</em>
          </h1>
          <span>Choose a focused format and build a personal best.</span>
        </div>
      </header>
      <div className="mode-grid">
        {modes.map((mode) => (
          <article className="mode-card" key={mode.id}>
            <p>{mode.questions}</p>
            <h2>{mode.name}</h2>
            <span>{mode.description}</span>
            <button className="secondary-button" onClick={() => onStartMode(mode.id)}>
              Start mode →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
