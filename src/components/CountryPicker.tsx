"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  { id: "united-states",  label: "United States",        flag: "🇺🇸" },
  { id: "china",          label: "China",                flag: "🇨🇳" },
  { id: "united-kingdom", label: "United Kingdom",       flag: "🇬🇧" },
  { id: "france",         label: "France",               flag: "🇫🇷" },
  { id: "canada",         label: "Canada",               flag: "🇨🇦" },
  { id: "india",          label: "India",                flag: "🇮🇳" },
  { id: "germany",        label: "Germany",              flag: "🇩🇪" },
  { id: "israel",         label: "Israel",               flag: "🇮🇱" },
  { id: "united-arab-emirates", label: "UAE",            flag: "🇦🇪" },
  { id: "south-korea",    label: "South Korea",          flag: "🇰🇷" },
  { id: "japan",          label: "Japan",                flag: "🇯🇵" },
];

export default function CountryPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const country = COUNTRIES.find((c) => c.id === selected);

  function handleGo() {
    if (selected) router.push(`/countries#${selected}`);
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-foreground font-medium whitespace-nowrap shrink-0">AI models from</span>
        <div className="relative flex-1 min-w-[160px]">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-8"
          >
            <option value="" disabled>select a country…</option>
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.label}
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
          {country ? `${country.flag} Explore` : "Explore →"}
        </button>
      </div>
    </div>
  );
}
