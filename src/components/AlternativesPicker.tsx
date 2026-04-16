"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TOOLS = [
  { slug: "chatgpt-alternatives",           label: "ChatGPT",           emoji: "🤖" },
  { slug: "claude-alternatives",            label: "Claude",            emoji: "🧠" },
  { slug: "gemini-alternatives",            label: "Gemini",            emoji: "✨" },
  { slug: "github-copilot-alternatives",    label: "GitHub Copilot",    emoji: "💻" },
  { slug: "cursor-alternatives",            label: "Cursor",            emoji: "⌨️" },
  { slug: "midjourney-alternatives",        label: "Midjourney",        emoji: "🎨" },
  { slug: "stable-diffusion-alternatives",  label: "Stable Diffusion",  emoji: "🖼️" },
  { slug: "elevenlabs-alternatives",        label: "ElevenLabs",        emoji: "🎙️" },
  { slug: "perplexity-alternatives",        label: "Perplexity",        emoji: "🔍" },
  { slug: "lovable-alternatives",           label: "Lovable",           emoji: "❤️" },
  { slug: "heygen-alternatives",            label: "HeyGen",            emoji: "🎬" },
  { slug: "grammarly-alternatives",         label: "Grammarly",         emoji: "✍️" },
];

export default function AlternativesPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const tool = TOOLS.find((t) => t.slug === selected);

  function handleGo() {
    if (selected) router.push(`/alternatives/${selected}`);
  }

  return (
    <div className="mt-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Find tool alternatives
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">Alternatives to</span>
        <div className="relative flex-1 min-w-[160px]">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-8"
          >
            <option value="" disabled>select a tool…</option>
            {TOOLS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button
          onClick={handleGo}
          disabled={!selected}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
        >
          {tool ? `See ${tool.emoji} alternatives` : "See alternatives →"}
        </button>
      </div>
    </div>
  );
}
