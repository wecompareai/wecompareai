"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROFESSIONS = [
  { slug: "lawyers",         label: "Lawyer",                 emoji: "⚖️" },
  { slug: "doctors",         label: "Doctor",                 emoji: "🩺" },
  { slug: "dentists",        label: "Dentist",                emoji: "🦷" },
  { slug: "teachers",        label: "Teacher / Educator",     emoji: "📚" },
  { slug: "marketers",       label: "Marketer",               emoji: "📣" },
  { slug: "developers",      label: "Developer",              emoji: "💻" },
  { slug: "designers",       label: "Designer",               emoji: "🎨" },
  { slug: "writers",         label: "Writer / Journalist",    emoji: "✍️" },
  { slug: "hr-teams",        label: "HR Professional",        emoji: "🤝" },
  { slug: "real-estate",     label: "Real Estate Agent",      emoji: "🏠" },
  { slug: "accountants",     label: "Accountant / Finance",   emoji: "📊" },
  { slug: "sales-teams",     label: "Sales Professional",     emoji: "🎯" },
  { slug: "students",        label: "Student",                emoji: "🎓" },
  { slug: "content-creators",label: "Content Creator",        emoji: "🎬" },
  { slug: "small-business",  label: "Small Business Owner",   emoji: "🏪" },
  { slug: "nurses",          label: "Nurse / Healthcare Staff",emoji: "💊" },
  { slug: "recruiters",      label: "Recruiter",              emoji: "🔍" },
];

export default function ProfessionPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  function handleGo() {
    if (selected) router.push(`/for/${selected}`);
  }

  const profession = PROFESSIONS.find((p) => p.slug === selected);

  return (
    <div className="flex items-center gap-2 flex-wrap py-2.5 border-b border-border last:border-0">
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">I am a</span>
        <div className="relative flex-1 min-w-[160px]">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-8"
          >
            <option value="" disabled>select profession…</option>
            {PROFESSIONS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.emoji} {p.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">— guide me</span>
        <button
          onClick={handleGo}
          disabled={!selected}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
        >
          {profession ? `Best tools for ${profession.emoji}` : "Best tools →"}
        </button>
    </div>
  );
}
