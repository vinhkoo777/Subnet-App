"use client";

import { Moon, Sun } from "lucide-react";
import { ChallengeSession } from "@/components/ChallengeSession";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/features/dashboard/Dashboard";
import { Statistics } from "@/components/features/dashboard/Statistics";
import { ChallengeView } from "@/components/features/challenge/ChallengeView";
import { HistoryView } from "@/components/features/history/HistoryView";
import { PracticeView } from "@/components/features/practice/PracticeView";
import { SettingsView } from "@/components/features/settings/SettingsView";
import { challengeModes, useAppSession } from "@/lib/features";
import { generateQuestion } from "@/lib/questions/generator";

export default function HomePage() {
  const {
    view,
    progress,
    setProgress,
    question,
    setQuestion,
    difficulty,
    setDifficulty,
    activeChallenge,
    setActiveChallenge,
    search,
    setSearch,
    filter,
    setFilter,
    fileInput,
    solved,
    accuracy,
    level,
    levelStart,
    nextXp,
    levelPercent,
    todayCount,
    history,
    moveTo,
    regularPractice,
    recordAnswer,
    toggleFavorite,
    exportProgress,
    importProgress,
  } = useAppSession();

  return (
      <div className="app-layout">
      <Sidebar activeView={view} onChange={moveTo} />
      <main className="content">
        <header className="mobile-bar">
          <strong>
            Subnet<span>Streak</span>
          </strong>
          
        </header>

        {view === "dashboard" && (
          <Dashboard
            level={level}
            levelPercent={levelPercent}
            progress={progress}
            solved={solved}
            accuracy={accuracy}
            todayCount={todayCount}
            levelStart={levelStart}
            nextXp={nextXp}
            onContinue={regularPractice}
          />
        )}
        {view === "practice" &&
          (activeChallenge ? (
            <section>
              <header className="page-heading">
                <div>
                  <p>CHALLENGE SESSION</p>
                  <h1>
                    Bring your <em>best.</em>
                  </h1>
                  <span>Results count toward your XP, streak, and history.</span>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setActiveChallenge(null);
                    moveTo("challenge");
                  }}
                >
                  Exit session
                </button>
              </header>
              <ChallengeSession
                mode={activeChallenge}
                onAnswer={(target, answer, seconds, bonus) =>
                  recordAnswer(answer, seconds, bonus, target)
                }
                onExit={() => {
                  setActiveChallenge(null);
                  moveTo("challenge");
                }}
              />
            </section>
          ) : (
            <PracticeView
              question={question}
              difficulty={difficulty}
              onDifficulty={(next) => {
                setDifficulty(next);
                setQuestion(generateQuestion(next));
              }}
              onAnswer={recordAnswer}
              onNext={() => setQuestion(generateQuestion(difficulty))}
            />
          ))}
        {view === "challenge" && (
          <ChallengeView
            modes={challengeModes}
            onStartMode={(mode) => {
              setActiveChallenge(mode);
              moveTo("practice");
            }}
          />
        )}
        {view === "history" && (
          <HistoryView
            history={progress.history}
            search={search}
            filter={filter}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {view === "statistics" && <Statistics progress={progress} solved={solved} />}
        {view === "settings" && (
          <SettingsView
            progress={progress}
            setProgress={setProgress}
            onExport={exportProgress}
            onImport={importProgress}
            fileInput={fileInput}
          />
        )}
      </main>
    </div>
  );
}
