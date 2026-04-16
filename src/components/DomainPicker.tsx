"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DOMAINS = [
  { slug: "healthcare",    label: "Healthcare",          emoji: "🏥" },
  { slug: "legal",         label: "Legal",               emoji: "⚖️" },
  { slug: "finance",       label: "Finance",             emoji: "💰" },
  { slug: "education",     label: "Education",           emoji: "📚" },
  { slug: "pharmaceutical",label: "Pharmaceutical",      emoji: "💊" },
  { slug: "defence",       label: "Defence & Security",  emoji: "🛡️" },
  { slug: "it-development",label: "IT Development",      emoji: "💻" },
  { slug: "it-management", label: "IT Management",       emoji: "🖥️" },
  { slug: "marketing",     label: "Marketing",           emoji: "📣" },
  { slug: "retail",        label: "Retail & E-commerce", emoji: "🛒" },
  { slug: "manufacturing", label: "Manufacturing",       emoji: "🏭" },
  { slug: "media",         label: "Media & Entertainment",emoji: "🎬" },
];

export default function DomainPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const domain = DOMAINS.find((d) => d.slug === selected);

  function handleGo() {
    if (selected) router.push(`/domains/${selected}`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap py-2.5 last:pb-0">
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">AI tools for</span>
        <div className="relative flex-1 min-w-[160px]">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-8"
          >
            <option value="" disabled>select a domain…</option>
            {DOMAINS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.emoji} {d.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">industry</span>
        <button
          onClick={handleGo}
          disabled={!selected}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
        >
          {domain ? `${domain.emoji} Explore` : "Explore →"}
        </button>
    </div>
  );
}
