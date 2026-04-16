"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  { id: "united-states",       label: "United States",  flag: "🇺🇸" },
  { id: "china",               label: "China",          flag: "🇨🇳" },
  { id: "united-kingdom",      label: "United Kingdom", flag: "🇬🇧" },
  { id: "france",              label: "France",         flag: "🇫🇷" },
  { id: "canada",              label: "Canada",         flag: "🇨🇦" },
  { id: "india",               label: "India",          flag: "🇮🇳" },
  { id: "germany",             label: "Germany",        flag: "🇩🇪" },
  { id: "israel",              label: "Israel",         flag: "🇮🇱" },
  { id: "united-arab-emirates",label: "UAE",            flag: "🇦🇪" },
  { id: "south-korea",         label: "South Korea",    flag: "🇰🇷" },
  { id: "japan",               label: "Japan",          flag: "🇯🇵" },
];

const chevron = (
  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function CountryPicker() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const country = COUNTRIES.find((c) => c.id === selected);

  return (
    <div className="grid grid-cols-[72px_1fr_auto] sm:grid-cols-[110px_1fr_auto] items-center gap-2 py-2.5 border-b border-border">
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">AI by country</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors cursor-pointer pr-7"
        >
          <option value="" disabled>Select a country…</option>
          {COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>{c.flag} {c.label}</option>
          ))}
        </select>
        {chevron}
      </div>
      <button
        onClick={() => selected && router.push(`/countries#${selected}`)}
        disabled={!selected}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
      >
        {country ? `${country.flag} Go` : "Go →"}
      </button>
    </div>
  );
}
