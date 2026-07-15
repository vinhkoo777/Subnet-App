"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Moon, Sun, Upload } from "lucide-react";
import { ChallengeSession } from "@/components/ChallengeSession";
import { PracticePanel } from "@/components/PracticePanel";
import { Sidebar, type View } from "@/components/Sidebar";
import { generateQuestion, normalizeAnswer, questionTypeLabel } from "@/lib/questions/generator";
import { initialProgress, loadProgress, saveProgress } from "@/lib/storage/progress";
import type { ChallengeMode, Difficulty, HistoryEntry, ProgressState, Question } from "@/types/subnet";

const today = () => new Date().toLocaleDateString("en-CA");
const levelForXp = (xp: number) => Math.floor((Math.sqrt(1 + (8 * xp) / 75) - 1) / 2) + 1;
const xpForLevel = (level: number) => (75 * level * (level + 1)) / 2;
const formatSeconds = (seconds: number | null) => seconds === null ? "—" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const modes: { id: ChallengeMode; name: string; description: string; questions: string }[] = [
  { id: "daily", name: "Daily Challenge", description: "A shared seeded set with bonus XP.", questions: "10 questions" },
  { id: "speed", name: "Speed Run", description: "Complete twenty questions as quickly as possible.", questions: "20 questions" },
  { id: "survival", name: "Survival", description: "One mistake ends your run.", questions: "One life" },
  { id: "hardcore", name: "Hardcore", description: "No answer reveal during the session.", questions: "Exam rules" },
  { id: "timeAttack", name: "Time Attack", description: "Solve as much as you can in five minutes.", questions: "5 minutes" },
  { id: "endless", name: "Endless", description: "Infinite mixed subnetting practice.", questions: "No limit" },
  { id: "exam", name: "CCNA Exam", description: "A scored, timed subnetting exam.", questions: "50 questions" },
  { id: "boss", name: "VLSM Boss", description: "Expert enterprise addressing drills.", questions: "8 questions" },
];

export default function HomePage() {
  const [view, setView] = useState<View>("dashboard");
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [question, setQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [activeChallenge, setActiveChallenge] = useState<ChallengeMode | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | HistoryEntry["result"]>("All");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => { setProgress(loadProgress()); setQuestion(generateQuestion()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveProgress(progress); }, [progress, hydrated]);

  const solved = progress.history.length;
  const accuracy = solved ? Math.round((progress.correct / solved) * 100) : 0;
  const level = levelForXp(progress.xp);
  const levelStart = xpForLevel(level - 1);
  const nextXp = xpForLevel(level);
  const levelPercent = Math.min(100, ((progress.xp - levelStart) / (nextXp - levelStart)) * 100);
  const todayCount = hydrated ? progress.history.filter((entry) => entry.date === today()).length : 0;
  const history = useMemo(() => progress.history.slice().reverse().filter((entry) => (filter === "All" || entry.result === filter) && `${entry.prompt} ${entry.answer} ${entry.correctAnswer}`.toLowerCase().includes(search.toLowerCase())), [filter, progress.history, search]);
  const moveTo = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const regularPractice = () => { setActiveChallenge(null); moveTo("practice"); };

  function recordAnswer(answer: string, seconds: number, bonusXp = 0, target: Question | null = question) {
    if (!target) return { correct: false, explanation: "Loading the next question.", answer: "" };
    const correct = normalizeAnswer(answer) === normalizeAnswer(target.answer);
    const entry: HistoryEntry = { id: crypto.randomUUID(), date: today(), prompt: target.prompt, answer, correctAnswer: target.answer, result: correct ? "Correct" : "Wrong", seconds, difficulty: target.difficulty, type: target.type, favorite: false };
    setProgress((current) => {
      const previous = new Date(); previous.setDate(previous.getDate() - 1);
      const yesterday = previous.toLocaleDateString("en-CA");
      const streak = correct ? current.lastSolvedDate === today() ? current.streak : current.lastSolvedDate === yesterday ? current.streak + 1 : 1 : current.streak;
      const base = target.difficulty === "Hard" || target.difficulty === "Expert" ? 20 : target.difficulty === "Medium" ? 15 : 10;
      const earned = correct ? base + (seconds <= 20 ? 5 : 0) + bonusXp : 0;
      return { ...current, xp: current.xp + earned, correct: current.correct + Number(correct), wrong: current.wrong + Number(!correct), totalSeconds: current.totalSeconds + seconds, fastestSeconds: correct ? current.fastestSeconds === null ? seconds : Math.min(current.fastestSeconds, seconds) : current.fastestSeconds, streak, bestStreak: Math.max(current.bestStreak, streak), lastSolvedDate: correct ? today() : current.lastSolvedDate, history: [...current.history, entry] };
    });
    return { correct, explanation: target.explanation, answer: target.answer };
  }

  const toggleFavorite = (id: string) => setProgress((current) => ({ ...current, history: current.history.map((entry) => entry.id === id ? { ...entry, favorite: !entry.favorite } : entry) }));
  const exportProgress = () => { const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "subnetstreak-progress.json"; anchor.click(); URL.revokeObjectURL(url); };
  const importProgress = (file: File | undefined) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const imported = JSON.parse(String(reader.result)) as ProgressState; setProgress({ ...initialProgress(), ...imported, settings: { ...initialProgress().settings, ...imported.settings } }); } catch { window.alert("Choose a valid SubnetStreak export file."); } }; reader.readAsText(file); };

  return <div className="app-layout"><Sidebar activeView={view} onChange={moveTo} /><main className="content"><header className="mobile-bar"><strong>Subnet<span>Streak</span></strong><button className="icon-toggle" aria-label="Toggle theme" onClick={() => setProgress((current) => ({ ...current, settings: { ...current.settings, darkMode: !current.settings.darkMode } }))}>{progress.settings.darkMode ? <Sun size={17} /> : <Moon size={17} />}</button></header>
    {view === "dashboard" && <Dashboard level={level} levelPercent={levelPercent} progress={progress} solved={solved} accuracy={accuracy} todayCount={todayCount} levelStart={levelStart} nextXp={nextXp} onContinue={regularPractice} />}
    {view === "practice" && (activeChallenge ? <section><header className="page-heading"><div><p>CHALLENGE SESSION</p><h1>Bring your <em>best.</em></h1><span>Results count toward your XP, streak, and history.</span></div><button className="secondary-button" onClick={() => { setActiveChallenge(null); moveTo("challenge"); }}>Exit session</button></header><ChallengeSession mode={activeChallenge} onAnswer={(target, answer, seconds, bonus) => recordAnswer(answer, seconds, bonus, target)} onExit={() => { setActiveChallenge(null); moveTo("challenge"); }} /></section> : <Practice question={question} difficulty={difficulty} onDifficulty={(next) => { setDifficulty(next); setQuestion(generateQuestion(next)); }} onAnswer={recordAnswer} onNext={() => setQuestion(generateQuestion(difficulty))} />)}
    {view === "challenge" && <section><header className="page-heading"><div><p>CHALLENGE MODES</p><h1>Test your <em>edge.</em></h1><span>Choose a focused format and build a personal best.</span></div></header><div className="mode-grid">{modes.map((mode) => <article className="mode-card" key={mode.id}><p>{mode.questions}</p><h2>{mode.name}</h2><span>{mode.description}</span><button className="secondary-button" onClick={() => { setActiveChallenge(mode.id); moveTo("practice"); }}>Start mode →</button></article>)}</div></section>}
    {view === "history" && <section><header className="page-heading"><div><p>ANSWER HISTORY</p><h1>Review the <em>work.</em></h1></div></header><div className="history-controls"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search answers" /><select value={filter} onChange={(event) => setFilter(event.target.value as "All" | HistoryEntry["result"])}><option>All</option><option>Correct</option><option>Wrong</option></select></div><article className="panel history-list">{history.map((entry) => <div className="history-row" key={entry.id}><b className={entry.result === "Correct" ? "good" : "bad"}>{entry.result}</b><span><strong>{entry.prompt}</strong><small>Your answer: {entry.answer} · Correct: {entry.correctAnswer} · {questionTypeLabel(entry.type)}</small></span><button aria-label="Favorite question" className="star-button" onClick={() => toggleFavorite(entry.id)}>{entry.favorite ? "★" : "☆"}</button></div>)}{!history.length && <small className="muted">No matching answers yet.</small>}</article></section>}
    {view === "statistics" && <Statistics progress={progress} solved={solved} />}
    {view === "settings" && <Settings progress={progress} setProgress={setProgress} onExport={exportProgress} onImport={importProgress} fileInput={fileInput} />}
  </main></div>;
}

function Dashboard({ level, levelPercent, progress, solved, accuracy, todayCount, levelStart, nextXp, onContinue }: { level: number; levelPercent: number; progress: ProgressState; solved: number; accuracy: number; todayCount: number; levelStart: number; nextXp: number; onContinue: () => void }) { return <section><header className="page-heading"><div><p>CCNA IPV4 TRAINER</p><h1>Build subnetting <em>instincts.</em></h1><span>Daily, deliberate practice with instant explanations.</span></div><button className="primary-button" onClick={onContinue}>Continue practice →</button></header><article className="xp-card"><div className="level-pill">{level}<small>LVL</small></div><div><strong>Level {level} · Network learner</strong><div className="progress"><i style={{ width: `${levelPercent}%` }} /></div><small>{progress.xp - levelStart} / {nextXp - levelStart} XP to level {level + 1}</small></div><div className="streak">🔥 <b>{progress.streak}</b><small>DAY STREAK</small></div></article><div className="metrics"><Metric label="TODAY" value={`${todayCount}/${progress.dailyGoal}`} /><Metric label="ACCURACY" value={`${accuracy}%`} /><Metric label="SOLVED" value={String(solved)} /><Metric label="AVG. TIME" value={solved ? formatSeconds(Math.round(progress.totalSeconds / solved)) : "—"} /></div><div className="two-column"><article className="panel"><p>DAILY GOAL</p><h2>Make today count.</h2><div className="goal-number">{Math.min(100, Math.round((todayCount / progress.dailyGoal) * 100))}%</div><strong>{todayCount} of {progress.dailyGoal} questions</strong><button className="secondary-button" onClick={onContinue}>Solve a question →</button></article><article className="panel"><p>RECENT ACTIVITY</p><h2>Your latest reps</h2>{progress.history.slice(-5).reverse().map((entry) => <div className="activity" key={entry.id}><b className={entry.result === "Correct" ? "good" : "bad"}>{entry.result === "Correct" ? "✓" : "×"}</b><span>{entry.prompt}<small>{entry.difficulty} · {formatSeconds(entry.seconds)}</small></span></div>)}{!progress.history.length && <small className="muted">Complete your first question to start your trail.</small>}</article></div></section>; }
function Practice({ question, difficulty, onDifficulty, onAnswer, onNext }: { question: Question | null; difficulty: Difficulty; onDifficulty: (value: Difficulty) => void; onAnswer: (answer: string, seconds: number) => { correct: boolean; explanation: string; answer: string }; onNext: () => void }) { return <section><header className="page-heading"><div><p>UNLIMITED PRACTICE</p><h1>Learn it. <em>Then own it.</em></h1><span>Every answer includes the why behind the calculation.</span></div><select value={difficulty} onChange={(event) => onDifficulty(event.target.value as Difficulty)} aria-label="Select difficulty"><option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option></select></header>{question ? <PracticePanel question={question} onAnswer={onAnswer} onNext={onNext} /> : <article className="question-card">Preparing an accurate question…</article>}</section>; }
function Statistics({ progress, solved }: { progress: ProgressState; solved: number }) { return <section><header className="page-heading"><div><p>YOUR STATISTICS</p><h1>Progress, <em>measured.</em></h1></div></header><div className="metrics"><Metric label="CORRECT" value={String(progress.correct)} /><Metric label="INCORRECT" value={String(progress.wrong)} /><Metric label="SKIPPED" value={String(progress.skipped)} /><Metric label="BEST STREAK" value={`${progress.bestStreak} days`} /></div><article className="panel"><p>DIFFICULTY BREAKDOWN</p>{(["Easy", "Medium", "Hard", "Expert"] as Difficulty[]).map((item) => { const count = progress.history.filter((entry) => entry.difficulty === item).length; return <div className="stat-bar" key={item}><span>{item}</span><i><b style={{ width: `${solved ? (count / solved) * 100 : 0}%` }} /></i><small>{count}</small></div>; })}</article></section>; }
function Settings({ progress, setProgress, onExport, onImport, fileInput }: { progress: ProgressState; setProgress: React.Dispatch<React.SetStateAction<ProgressState>>; onExport: () => void; onImport: (file: File | undefined) => void; fileInput: React.RefObject<HTMLInputElement | null> }) { const update = (key: keyof ProgressState["settings"], value: boolean) => setProgress((current) => ({ ...current, settings: { ...current.settings, [key]: value } })); return <section><header className="page-heading"><div><p>SETTINGS</p><h1>Make it <em>yours.</em></h1></div></header><article className="panel settings"><Setting label="Dark mode" checked={progress.settings.darkMode} onChange={(checked) => update("darkMode", checked)} /><Setting label="Sound effects" checked={progress.settings.sound} onChange={(checked) => update("sound", checked)} /><Setting label="Keyboard shortcuts" checked={progress.settings.keyboardShortcuts} onChange={(checked) => update("keyboardShortcuts", checked)} /><label>Daily goal<select value={progress.dailyGoal} onChange={(event) => setProgress((current) => ({ ...current, dailyGoal: Number(event.target.value) }))}><option>5</option><option>10</option><option>20</option><option>50</option></select></label><div className="data-actions"><button className="secondary-button" onClick={onExport}><Download size={15} />Export data</button><button className="secondary-button" onClick={() => fileInput.current?.click()}><Upload size={15} />Import data</button><input ref={fileInput} type="file" accept="application/json" onChange={(event) => onImport(event.target.files?.[0])} hidden /><button className="danger-button" onClick={() => window.confirm("Reset all SubnetStreak progress?") && setProgress(initialProgress())}>Reset progress</button></div></article></section>; }
function Metric({ label, value }: { label: string; value: string }) { return <article className="metric"><p>{label}</p><strong>{value}</strong></article>; }
function Setting({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="setting"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>; }
