"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DOMAINS = [
  { slug: "healthcare",     label: "Healthcare",           emoji: "🏥" },
  { slug: "legal",          label: "Legal",                emoji: "⚖️" },
  { slug: "finance",        label: "Finance",              emoji: "💰" },
  { slug: "education",      label: "Education",            emoji: "📚" },
  { slug: "pharmaceutical", label: "Pharmaceutical",       emoji: "💊" },
  { slug: "defence",        label: "Defence & Security",   emoji: "🛡️" },
  { slug: "it-development", label: "IT Development",       emoji: "💻" },
  { slug: "it-management",  label: "IT Management",        emoji: "🖥️" },
  { slug: "marketing",      label: "Marketing",            emoji: "📣" },
  { slug: "retail",         label: "Retail & E-commerce",  emoji: "🛒" },
  { slug: "manufacturing",  label: "Manufacturing",        emoji: "🏭" },
  { slug: "media",          label: "Media & Entertainment",emoji: "🎬" },
];

const chevron = (
  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function DomainPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const domain = DOMAINS.find((d) => d.slug === selected);

  return (
    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2 py-2.5">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">AI by domain</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-7"
        >
          <option value="" disabled>Select a domain…</option>
          {DOMAINS.map((d) => (
            <option key={d.slug} value={d.slug}>{d.emoji} {d.label}</option>
          ))}
        </select>
        {chevron}
      </div>
      <button
        onClick={() => selected && router.push(`/domains/${selected}`)}
        disabled={!selected}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        {domain ? `${domain.emoji} Go` : "Go →"}
      </button>
    </div>
  );
}
