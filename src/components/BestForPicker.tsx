"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USE_CASES = [
  { slug: "coding",            label: "Coding",              emoji: "💻" },
  { slug: "writing",           label: "Writing",             emoji: "✍️" },
  { slug: "marketing",         label: "Marketing",           emoji: "📣" },
  { slug: "image-generation",  label: "Image Generation",    emoji: "🎨" },
  { slug: "video-generation",  label: "Video Generation",    emoji: "🎬" },
  { slug: "voice-cloning",     label: "Voice Cloning",       emoji: "🎙️" },
  { slug: "music-generation",  label: "Music Generation",    emoji: "🎵" },
  { slug: "students",          label: "Students",            emoji: "🎓" },
  { slug: "startups",          label: "Startups",            emoji: "🚀" },
  { slug: "business",          label: "Business",            emoji: "🏢" },
  { slug: "productivity",      label: "Productivity",        emoji: "⚡" },
  { slug: "research",          label: "Research",            emoji: "🔬" },
  { slug: "social-media",      label: "Social Media",        emoji: "📱" },
  { slug: "data-analysis",     label: "Data Analysis",       emoji: "📊" },
  { slug: "customer-support",  label: "Customer Support",    emoji: "💬" },
  { slug: "healthcare",        label: "Healthcare",          emoji: "🏥" },
  { slug: "legal",             label: "Legal",               emoji: "⚖️" },
  { slug: "finance",           label: "Finance",             emoji: "💰" },
  { slug: "design",            label: "Design",              emoji: "🖌️" },
  { slug: "ai-agents",         label: "AI Agents",           emoji: "🤖" },
  { slug: "app-builders",      label: "App Builders",        emoji: "📱" },
];

const chevron = (
  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function BestForPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const item = USE_CASES.find((u) => u.slug === selected);

  return (
    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2 py-2.5 border-b border-border">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Best AI for</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-7"
        >
          <option value="" disabled>Select a use case…</option>
          {USE_CASES.map((u) => (
            <option key={u.slug} value={u.slug}>{u.emoji} {u.label}</option>
          ))}
        </select>
        {chevron}
      </div>
      <button
        onClick={() => selected && router.push(`/best/${selected}`)}
        disabled={!selected}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        {item ? `${item.emoji} Go` : "Go →"}
      </button>
    </div>
  );
}
