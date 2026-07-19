import type { Difficulty, ProgressState, Question } from "@/types/subnet";
import { PracticePanel } from "@/components/PracticePanel";
import { generateQuestion } from "@/lib/questions/generator";

const difficultyOptions: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"];

type PracticeViewProps = {
  question: Question | null;
  difficulty: Difficulty;
  onDifficulty: (value: Difficulty) => void;
  onAnswer: (
    answer: string,
    seconds: number,
  ) => { correct: boolean; explanation: string; answer: string };
  onNext: () => void;
};

export function PracticeView({
  question,
  difficulty,
  onDifficulty,
  onAnswer,
  onNext,
}: PracticeViewProps) {
  return (
    <section>
      <header className="page-heading">
        <div>
          <p>UNLIMITED PRACTICE</p>
          <h1>
            Learn it. <em>Then own it.</em>
          </h1>
          <span>Every answer includes the why behind the calculation.</span>
        </div>
        <select
          value={difficulty}
          onChange={(event) => onDifficulty(event.target.value as Difficulty)}
          aria-label="Select difficulty"
        >
          {difficultyOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </header>
      {question ? (
        <PracticePanel question={question} onAnswer={onAnswer} onNext={onNext} />
      ) : (
        <article className="question-card">Preparing an accurate question…</article>
      )}
    </section>
  );
}
