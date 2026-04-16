"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TOOLS = [
  { slug: "chatgpt-alternatives",          label: "ChatGPT",          emoji: "🤖" },
  { slug: "claude-alternatives",           label: "Claude",           emoji: "🧠" },
  { slug: "gemini-alternatives",           label: "Gemini",           emoji: "✨" },
  { slug: "github-copilot-alternatives",   label: "GitHub Copilot",   emoji: "💻" },
  { slug: "cursor-alternatives",           label: "Cursor",           emoji: "⌨️" },
  { slug: "midjourney-alternatives",       label: "Midjourney",       emoji: "🎨" },
  { slug: "stable-diffusion-alternatives", label: "Stable Diffusion", emoji: "🖼️" },
  { slug: "elevenlabs-alternatives",       label: "ElevenLabs",       emoji: "🎙️" },
  { slug: "perplexity-alternatives",       label: "Perplexity",       emoji: "🔍" },
  { slug: "lovable-alternatives",          label: "Lovable",          emoji: "❤️" },
  { slug: "heygen-alternatives",           label: "HeyGen",           emoji: "🎬" },
  { slug: "grammarly-alternatives",        label: "Grammarly",        emoji: "✍️" },
];

const chevron = (
  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function AlternativesPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const tool = TOOLS.find((t) => t.slug === selected);

  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-2 py-2.5 border-b border-border">
      <span className="text-xs text-muted-foreground font-medium truncate">Alternatives to</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-7"
        >
          <option value="" disabled>Select a tool…</option>
          {TOOLS.map((t) => (
            <option key={t.slug} value={t.slug}>{t.emoji} {t.label}</option>
          ))}
        </select>
        {chevron}
      </div>
      <button
        onClick={() => selected && router.push(`/alternatives/${selected}`)}
        disabled={!selected}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        {tool ? `${tool.emoji} Go` : "Go →"}
      </button>
    </div>
  );
}
