"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { key: "",          label: "All AI tools",        emoji: "🏆" },
  { key: "LLM",       label: "AI Models (LLMs)",    emoji: "🤖" },
  { key: "Coding",    label: "Coding Tools",         emoji: "💻" },
  { key: "Image",     label: "Image Generators",     emoji: "🎨" },
  { key: "Video",     label: "Video Generators",     emoji: "🎬" },
  { key: "Audio",     label: "Voice & Audio",        emoji: "🎙️" },
  { key: "Music",     label: "Music Generation",     emoji: "🎵" },
  { key: "Writing",   label: "Writing Tools",        emoji: "✍️" },
  { key: "Design",    label: "Design Tools",         emoji: "🖌️" },
  { key: "Search",    label: "AI Search",            emoji: "🔍" },
  { key: "Agents",    label: "AI Agents",            emoji: "🤖" },
  { key: "AppBuilder",label: "App Builders",         emoji: "📱" },
  { key: "Cloud",     label: "Cloud AI Platforms",   emoji: "☁️" },
];

const chevron = (
  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function RankingsPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const item = CATEGORIES.find((c) => c.key === selected);

  function handleGo() {
    if (selected === undefined) return;
    router.push(selected ? `/rankings?category=${selected}` : "/rankings");
  }

  return (
    <div className="grid grid-cols-[72px_1fr_auto] sm:grid-cols-[110px_1fr_auto] items-center gap-2 py-2.5 border-b border-border">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Rankings for</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-7"
        >
          <option value="" disabled>Select a category…</option>
          {CATEGORIES.map((c) => (
            <option key={c.key || "all"} value={c.key}>{c.emoji} {c.label}</option>
          ))}
        </select>
        {chevron}
      </div>
      <button
        onClick={handleGo}
        disabled={selected === undefined || selected === null || (selected === "" && item === undefined)}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        {item ? `${item.emoji} Go` : "Go →"}
      </button>
    </div>
  );
}
