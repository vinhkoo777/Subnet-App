"use client";

import { BarChart3, BookOpen, Flame, Settings, ShieldCheck, Trophy } from "lucide-react";

export type View = "dashboard" | "practice" | "challenge" | "history" | "statistics" | "settings";

const links: { view: View; label: string; icon: typeof BarChart3 }[] = [
  { view: "dashboard", label: "Dashboard", icon: BarChart3 },
  { view: "practice", label: "Practice", icon: BookOpen },
  { view: "challenge", label: "Challenge", icon: Trophy },
  { view: "history", label: "History", icon: ShieldCheck },
  { view: "statistics", label: "Statistics", icon: Flame },
  { view: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeView, onChange }: { activeView: View; onChange: (view: View) => void }) {
  return <aside className="sidebar"><button className="brand" onClick={() => onChange("dashboard")}><b>S</b>Subnet<span>Streak</span></button><p className="nav-kicker">LEARNING</p><nav>{links.map(({ view, label, icon: Icon }) => <button key={view} className={activeView === view ? "nav-item active" : "nav-item"} onClick={() => onChange(view)}><Icon size={16} />{label}</button>)}</nav></aside>;
}
