"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ALL_SCORES,
  CATEGORIES,
  SCORE_DIMENSIONS,
  type ToolScore,
} from "@/lib/scores";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  LLM:        "AI Models (LLMs)",
  Coding:     "Coding Tools",
  AppBuilder: "App Builders",
  Agents:     "AI Agents",
  Writing:    "Writing Tools",
  Design:     "Design Tools",
  Image:      "Image Generators",
  Video:      "Video Generators",
  Audio:      "Voice & Audio",
  Music:      "Music Generation",
  Cloud:      "Cloud AI Platforms",
  Search:     "AI Search",
};

const POPULAR: { label: string; href: string }[] = [
  { label: "ChatGPT vs Claude",     href: "/vs/chatgpt-vs-claude" },
  { label: "Midjourney vs DALL-E",  href: "/vs/midjourney-vs-dalle" },
  { label: "Cursor vs Copilot",     href: "/vs/copilot-vs-cursor" },
  { label: "Suno vs Udio",          href: "/vs/suno-vs-udio" },
  { label: "Sora vs Runway",        href: "/vs/sora-vs-runway" },
  { label: "Lovable vs Bolt",       href: "/vs/lovable-vs-bolt" },
  { label: "HeyGen vs Synthesia",   href: "/vs/heygen-vs-synthesia" },
  { label: "Perplexity vs ChatGPT", href: "/vs/perplexity-vs-chatgpt" },
  { label: "Grok 4 vs ChatGPT",     href: "/vs/grok-4-vs-chatgpt" },
  { label: "Devin vs Cursor",       href: "/vs/devin-vs-cursor" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scoreColor(n: number) {
  if (n >= 9.0) return "text-emerald-600 dark:text-emerald-400";
  if (n >= 8.0) return "text-blue-600 dark:text-blue-400";
  if (n >= 7.0) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

// ─── ToolCombobox ─────────────────────────────────────────────────────────────
interface ComboboxProps {
  index: number;
  value: string;
  resolved: ToolScore | null;
  matches: ToolScore[];
  onChange: (v: string) => void;
  onSelect: (s: ToolScore) => void;
  onClear: () => void;
}

function ToolCombobox({ index, value, resolved, matches, onChange, onSelect, onClear }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const LABELS = ["Tool 1", "Tool 2", "Tool 3"];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      onSelect(matches[activeIdx]);
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && value.length >= 1;

  return (
    <div ref={wrapRef} className="relative">
      {/* Input row */}
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
          resolved
            ? "border-primary/50 bg-primary/5"
            : open
            ? "border-primary/40 bg-background"
            : "border-border bg-background"
        }`}
      >
        {/* Index badge */}
        <span className="w-6 h-6 rounded-full bg-muted border border-border text-[10px] font-bold text-muted-foreground flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        <input
          ref={inputRef}
          type="text"
          placeholder={`${LABELS[index]} — type to search...`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Resolved score badge or clear button */}
        {resolved ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold tabular-nums">
              {resolved.overall}/10
            </span>
            <button onClick={() => { onClear(); setOpen(false); }} aria-label="Clear" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : value ? (
          <button onClick={() => { onClear(); setOpen(false); }} aria-label="Clear" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && matches.length > 0 && (
        <ul className="absolute z-50 top-full mt-1.5 left-0 right-0 rounded-xl border border-border bg-card shadow-xl overflow-hidden" role="listbox">
          {matches.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(s);
                setOpen(false);
                setActiveIdx(-1);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                i === activeIdx ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{s.provider}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground hidden sm:inline-block">
                  {CATEGORY_LABELS[s.category] ?? s.category}
                </span>
                <span className={`text-xs font-bold tabular-nums ${scoreColor(s.overall)}`}>
                  {s.overall}
                </span>
              </div>
            </li>
          ))}
          <li className="px-4 py-2 border-t border-border bg-muted/20">
            <p className="text-[10px] text-muted-foreground">
              {ALL_SCORES.length} tools available free · Not seeing your tool?{" "}
              <span className="text-primary font-medium">Unlock Premium →</span>
            </p>
          </li>
        </ul>
      )}

      {/* No results */}
      {showDropdown && value.length >= 2 && matches.length === 0 && (
        <div className="absolute z-50 top-full mt-1.5 left-0 right-0 rounded-xl border border-border bg-card shadow-xl px-4 py-5 text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            No matches for &ldquo;{value}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            This tool isn&apos;t in our free database.{" "}
            <span className="text-primary underline underline-offset-2 cursor-pointer">Unlock Premium</span>
            {" "}to compare any AI tool.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── ThreeWayComparison ───────────────────────────────────────────────────────
function ThreeWayComparison({ tools }: { tools: ToolScore[] }) {
  const winner = [...tools].sort((a, b) => b.overall - a.overall)[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-foreground">3-Way Comparison Results</h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
          {tools.length} tools
        </span>
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-r border-border bg-muted/30 w-36">
                Dimension
              </th>
              {tools.map((t) => (
                <th
                  key={t.id}
                  className={`px-4 py-4 border-b border-r last:border-r-0 border-border text-center ${
                    t.id === winner.id ? "bg-primary/5" : "bg-muted/10"
                  }`}
                >
                  {t.id === winner.id && (
                    <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">
                      Top Pick
                    </div>
                  )}
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{t.provider}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCORE_DIMENSIONS.map((dim, rowIdx) => {
              const maxVal = Math.max(...tools.map((t) => t[dim.key]));
              const tiedCount = tools.filter((t) => t[dim.key] === maxVal).length;
              return (
                <tr key={dim.key} className={rowIdx % 2 === 0 ? "bg-muted/10" : ""}>
                  <td className="px-5 py-3.5 border-b border-r border-border">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dim.color} shrink-0`} />
                      <span className="text-xs font-medium text-foreground">{dim.label}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 ml-4">{dim.desc}</div>
                  </td>
                  {tools.map((t) => {
                    const val = t[dim.key];
                    const isTop = val === maxVal;
                    return (
                      <td
                        key={t.id}
                        className={`px-4 py-3.5 border-b border-r last:border-r-0 border-border text-center ${
                          isTop ? "bg-primary/5" : ""
                        }`}
                      >
                        <span className={`text-base font-bold tabular-nums ${scoreColor(val)}`}>
                          {val}
                        </span>
                        {isTop && tiedCount === 1 && (
                          <span className="text-[10px] text-primary font-bold ml-1">▲</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Overall row */}
            <tr className="bg-muted/30 font-semibold">
              <td className="px-5 py-4 border-r border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Overall Score</span>
              </td>
              {tools.map((t) => (
                <td
                  key={t.id}
                  className={`px-4 py-4 border-r last:border-r-0 border-border text-center ${
                    t.id === winner.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className={`text-2xl font-black tabular-nums ${scoreColor(t.overall)}`}>
                    {t.overall}
                  </div>
                  <div className="text-[10px] text-muted-foreground">/ 10</div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verdict cards */}
      <div className={`grid gap-3 ${tools.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
        {tools.map((t) => {
          const isWinner = t.id === winner.id;
          return (
            <div
              key={t.id}
              className={`rounded-xl border p-4 space-y-2 ${
                isWinner
                  ? "border-primary/40 bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground truncate">{t.name}</span>
                <span className={`text-sm font-bold tabular-nums shrink-0 ${scoreColor(t.overall)}`}>
                  {t.overall}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {t.verdict}
              </p>
              <div className="flex gap-2 flex-wrap pt-1">
                <Link
                  href={`/vs/${[tools[0].id, tools[1].id].sort().join("-vs-")}`}
                  className="text-xs text-primary hover:underline underline-offset-2"
                >
                  {tools[0].name} vs {tools[1].name} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner highlight */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 flex items-start gap-4">
        <div className="text-2xl shrink-0">🏆</div>
        <div>
          <p className="text-sm font-bold text-foreground">{winner.name} scores highest overall</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{winner.verdict}</p>
          <Link
            href={`/rankings?category=${winner.category}`}
            className="text-xs text-primary hover:underline underline-offset-2 mt-1.5 block"
          >
            See all {CATEGORY_LABELS[winner.category] ?? winner.category} rankings →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── PremiumModal ─────────────────────────────────────────────────────────────
function PremiumModal({ toolName, onClose }: { toolName: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const PERKS = [
    "Compare any AI tool — including new & niche releases",
    "Live benchmark data, updated daily via our AI agent",
    "API access for custom integrations and dashboards",
    "Early access to new comparison categories",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-primary to-blue-500" />

        <div className="p-6 space-y-5">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Lock icon */}
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-lg font-bold text-foreground">
              &ldquo;{toolName}&rdquo; isn&apos;t in our free database
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              We freely index <strong className="text-foreground">{ALL_SCORES.length}+ AI tools</strong> with
              scored breakdowns across 4 dimensions. Comparing tools outside this set requires a live data
              lookup — available with Premium.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-2.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {perk}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="space-y-2.5 pt-1">
            <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Unlock Premium →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
            >
              Browse our {ALL_SCORES.length}+ free tools instead
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            No credit card required to use the free database.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
interface ToolInput {
  query: string;
  resolved: ToolScore | null;
}

function makeInput(): ToolInput {
  return { query: "", resolved: null };
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState("All");
  const [toolInputs, setToolInputs] = useState<ToolInput[]>([makeInput(), makeInput()]);
  const [showThird, setShowThird] = useState(false);
  const [compareResult, setCompareResult] = useState<ToolScore[] | null>(null);
  const [premiumModal, setPremiumModal] = useState<{ show: boolean; toolName: string }>({
    show: false,
    toolName: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Handle ?compare=id1,id2,id3 from homepage widget (3-way only)
  useEffect(() => {
    const param = searchParams.get("compare");
    if (!param) return;
    const ids = param.split(",").map((s) => s.trim()).filter(Boolean);
    const tools = ids.map((id) => ALL_SCORES.find((s) => s.id === id)).filter(Boolean) as ToolScore[];
    if (tools.length >= 3) {
      setShowThird(true);
      setToolInputs([
        { query: tools[0].name, resolved: tools[0] },
        { query: tools[1].name, resolved: tools[1] },
        { query: tools[2].name, resolved: tools[2] },
      ]);
      setCompareResult(tools.slice(0, 3));
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = showThird ? 3 : 2;

  const filteredScores = ALL_SCORES.filter(
    (s) => category === "All" || s.category === category
  );

  function getMatches(query: string): ToolScore[] {
    if (query.length < 1) return [];
    const q = query.toLowerCase();
    return filteredScores
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.id.includes(q)
      )
      .slice(0, 8);
  }

  function updateInput(idx: number, patch: Partial<ToolInput>) {
    setToolInputs((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
    setCompareResult(null);
    setError(null);
  }

  function resetCategory(cat: string) {
    setCategory(cat);
    setToolInputs([makeInput(), makeInput()]);
    setShowThird(false);
    setCompareResult(null);
    setError(null);
  }

  function handleCompare() {
    setError(null);
    const active = toolInputs.slice(0, activeCount);

    const empty = active.find((t) => !t.query.trim());
    if (empty) {
      setError("Please enter a tool name in each field before comparing.");
      return;
    }

    const unresolved = active.find((t) => !t.resolved);
    if (unresolved) {
      setPremiumModal({ show: true, toolName: unresolved.query });
      return;
    }

    const resolved = active.map((t) => t.resolved!);

    if (resolved.length === 2) {
      const [a, b] = [...resolved].sort((x, y) => x.id.localeCompare(y.id));
      router.push(`/vs/${a.id}-vs-${b.id}`);
    } else {
      setCompareResult(resolved);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Compare AI Tools</span>
        </nav>
        <h1 className="text-3xl font-bold text-foreground">Compare AI Tools</h1>
        <p className="text-muted-foreground mt-1.5 max-w-2xl">
          Select a category, enter 2–3 tool names, and get a scored side-by-side breakdown
          across Performance, Value, Reliability, and Ease of Use.
        </p>
      </div>

      {/* ── Search Form ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8 space-y-7">

        {/* Step 1 — Category */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Tool Category
            </span>
          </div>
          <select
            value={category}
            onChange={(e) => resetCategory(e.target.value)}
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="All">All Categories ({ALL_SCORES.length} tools)</option>
            {CATEGORIES.map((cat) => {
              const n = ALL_SCORES.filter((s) => s.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] ?? cat} ({n} tools)
                </option>
              );
            })}
          </select>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Step 2 — Tool inputs */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Enter Tools to Compare
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {filteredScores.length} tools available
            </span>
          </div>

          <div className="space-y-3">
            {toolInputs.slice(0, activeCount).map((t, idx) => (
              <ToolCombobox
                key={idx}
                index={idx}
                value={t.query}
                resolved={t.resolved}
                matches={getMatches(t.query)}
                onChange={(v) => {
                  const resolved =
                    ALL_SCORES.find((s) => s.name.toLowerCase() === v.toLowerCase()) ?? null;
                  updateInput(idx, { query: v, resolved });
                }}
                onSelect={(s) => updateInput(idx, { query: s.name, resolved: s })}
                onClear={() => updateInput(idx, makeInput())}
              />
            ))}
          </div>

          {/* Add / remove third */}
          <div className="mt-4">
            {!showThird ? (
              <button
                onClick={() => {
                  setShowThird(true);
                  setToolInputs((prev) => [...prev.slice(0, 2), makeInput()]);
                }}
                className="flex items-center gap-2 text-xs text-primary hover:opacity-70 transition-opacity font-medium"
              >
                <span className="w-5 h-5 rounded-full border border-primary/60 flex items-center justify-center font-bold leading-none">
                  +
                </span>
                Add a third tool
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowThird(false);
                  setToolInputs((prev) => prev.slice(0, 2));
                  setCompareResult(null);
                }}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </span>
                Remove third tool
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Compare button */}
        <button
          onClick={handleCompare}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare {activeCount} Tools
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          {ALL_SCORES.length}+ tools in our free database.{" "}
          <button
            onClick={() => setPremiumModal({ show: true, toolName: "a tool not in our list" })}
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Need a tool not listed? Unlock Premium.
          </button>
        </p>
      </div>

      {/* ── Popular comparisons ──────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Popular Comparisons
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary text-muted-foreground transition-all font-medium"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Browse by Category ───────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Browse by Category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const count = ALL_SCORES.filter((s) => s.category === cat).length;
            const topTool = [...ALL_SCORES.filter((s) => s.category === cat)].sort(
              (a, b) => b.overall - a.overall
            )[0];
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => resetCategory(cat)}
                className={`text-left rounded-xl border p-3.5 transition-all group hover:border-primary/50 hover:shadow-sm ${
                  isActive ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className={`text-xs font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                }`}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{count} tools</div>
                {topTool && (
                  <div className="text-[10px] text-muted-foreground mt-1 truncate">
                    Top: {topTool.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3-way results ────────────────────────────────────────────────────── */}
      {compareResult && compareResult.length === 3 && (
        <div ref={resultsRef} className="pt-2">
          <ThreeWayComparison tools={compareResult} />
        </div>
      )}

      {/* ── Premium modal ─────────────────────────────────────────────────────── */}
      {premiumModal.show && (
        <PremiumModal
          toolName={premiumModal.toolName}
          onClose={() => setPremiumModal({ show: false, toolName: "" })}
        />
      )}
    </div>
  );
}
