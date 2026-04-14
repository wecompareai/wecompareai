"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_SCORES, CATEGORIES, type ToolScore } from "@/lib/scores";

const CATEGORY_LABELS: Record<string, string> = {
  LLM:        "AI Models",
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

// Pairs defined by exact ALL_SCORES IDs — guaranteed to resolve without hitting premium gate
const EXAMPLE_PAIR_IDS: [string, string][] = [
  ["gpt-4o",        "claude-opus-4"],
  ["midjourney",    "dall-e-3"],
  ["cursor",        "github-copilot"],
  ["suno",          "udio"],
  ["lovable",       "bolt-new"],
  ["sora",          "runway-gen3"],
  ["elevenlabs",    "openai-tts"],
  ["perplexity",    "chatgpt-search"],
  ["heygen",        "synthesia"],
  ["canva-ai",      "figma-ai"],
  ["aws-bedrock",   "azure-openai"],
  ["gpt-4-1",       "gemini-2-5-pro"],
];

function scoreColor(n: number) {
  if (n >= 9.0) return "text-emerald-500";
  if (n >= 8.0) return "text-blue-500";
  if (n >= 7.0) return "text-amber-500";
  return "text-rose-500";
}

// ─── Mini combobox ────────────────────────────────────────────────────────────
interface MiniComboboxProps {
  placeholder: string;
  value: string;
  resolved: ToolScore | null;
  matches: ToolScore[];
  onChange: (v: string) => void;
  onSelect: (s: ToolScore) => void;
  onClear: () => void;
  onPremiumTrigger: (name: string) => void;
}

function MiniCombobox({
  placeholder, value, resolved, matches,
  onChange, onSelect, onClear, onPremiumTrigger,
}: MiniComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && matches[activeIdx]) {
        onSelect(matches[activeIdx]);
        setOpen(false);
        setActiveIdx(-1);
      } else if (value.length >= 2 && matches.length === 0) {
        onPremiumTrigger(value);
      }
    }
    else if (e.key === "Escape") setOpen(false);
  }

  const showList = open && value.length >= 1;

  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0">
      <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5 transition-colors ${
        resolved ? "border-primary/50" : open ? "border-primary/40" : "border-border"
      }`}>
        {resolved && (
          <span className={`text-xs font-bold tabular-nums shrink-0 ${scoreColor(resolved.overall)}`}>
            {resolved.overall}
          </span>
        )}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          className="flex-1 min-w-0 text-sm bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            onClick={() => { onClear(); setOpen(false); }}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            aria-label="Clear"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showList && matches.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 left-0 right-0 rounded-xl border border-border bg-card shadow-xl overflow-hidden text-left">
          {matches.map((s, i) => (
            <li
              key={s.id}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => { e.preventDefault(); onSelect(s); setOpen(false); setActiveIdx(-1); }}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                i === activeIdx ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{s.provider}</span>
              </div>
              <span className={`text-xs font-bold tabular-nums shrink-0 ${scoreColor(s.overall)}`}>
                {s.overall}
              </span>
            </li>
          ))}
          <li className="px-3 py-1.5 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
            {ALL_SCORES.length} tools · Can&apos;t find yours?{" "}
            <span className="text-primary font-medium cursor-pointer">Unlock Premium</span>
          </li>
        </ul>
      )}

      {/* No results */}
      {showList && value.length >= 2 && matches.length === 0 && (
        <div
          className="absolute z-50 top-full mt-1 left-0 right-0 rounded-xl border border-border bg-card shadow-xl px-3 py-3 text-left cursor-pointer"
          onMouseDown={(e) => { e.preventDefault(); onPremiumTrigger(value); }}
        >
          <p className="text-xs font-medium text-foreground">&ldquo;{value}&rdquo; not found</p>
          <p className="text-[10px] text-primary mt-0.5">Not in our free database — click to unlock →</p>
        </div>
      )}
    </div>
  );
}

// ─── Premium gate ─────────────────────────────────────────────────────────────
function PremiumGate({ toolName, onClose }: { toolName: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-primary to-blue-500" />
        <div className="p-5 space-y-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              &ldquo;{toolName}&rdquo; requires Premium
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Our free database covers {ALL_SCORES.length}+ AI tools. Comparing tools outside it requires
              a live data lookup — available on Premium.
            </p>
          </div>

          <ul className="space-y-1.5">
            {[
              "Compare any AI tool, including new releases",
              "Live benchmark data updated daily",
              "API access for custom integrations",
            ].map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {p}
              </li>
            ))}
          </ul>

          <div className="space-y-2 pt-1">
            <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Unlock Premium →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
            >
              Browse {ALL_SCORES.length}+ free tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
interface ToolInput {
  query: string;
  resolved: ToolScore | null;
}

function blank(): ToolInput { return { query: "", resolved: null }; }

const MAX_TOOLS = 5;
const MIN_TOOLS = 2;
const PLACEHOLDERS = ["Gemini 2.5 Pro", "DeepSeek V3", "Mistral Large", "LLaMA 3.1 405B", "GPT-4.1"];

export default function HomepageToolSearch() {
  const router = useRouter();

  const [category, setCategory] = useState("All");
  // Array of 2–5 tool inputs
  const [tools, setTools] = useState<ToolInput[]>([blank(), blank()]);
  const [premium, setPremium] = useState<{ show: boolean; name: string }>({ show: false, name: "" });
  const [error, setError] = useState<string | null>(null);
  const [exampleIdx, setExampleIdx] = useState(0);

  // Pre-resolve example pairs from IDs — guaranteed free, no premium gate
  const EXAMPLES = EXAMPLE_PAIR_IDS
    .map(([idA, idB]) => {
      const a = ALL_SCORES.find((s) => s.id === idA);
      const b = ALL_SCORES.find((s) => s.id === idB);
      return a && b ? { a, b } : null;
    })
    .filter(Boolean) as { a: ToolScore; b: ToolScore }[];

  useEffect(() => {
    const t = setInterval(() => setExampleIdx((i) => (i + 1) % EXAMPLES.length), 3000);
    return () => clearInterval(t);
  }, [EXAMPLES.length]);

  const filtered = ALL_SCORES.filter((s) => category === "All" || s.category === category);

  function getMatches(q: string) {
    if (!q) return [];
    const lq = q.toLowerCase();
    return filtered
      .filter((s) => s.name.toLowerCase().includes(lq) || s.provider.toLowerCase().includes(lq) || s.id.includes(lq))
      .slice(0, 7);
  }

  function updateTool(idx: number, update: Partial<ToolInput>) {
    setTools((prev) => prev.map((t, i) => i === idx ? { ...t, ...update } : t));
    setError(null);
  }

  function handleChange(idx: number, v: string) {
    const resolved = ALL_SCORES.find((s) => s.name.toLowerCase() === v.toLowerCase()) ?? null;
    updateTool(idx, { query: v, resolved });
  }

  function addTool() {
    if (tools.length < MAX_TOOLS) {
      setTools((prev) => [...prev, blank()]);
      setError(null);
    }
  }

  function removeTool(idx: number) {
    if (tools.length > MIN_TOOLS) {
      setTools((prev) => prev.filter((_, i) => i !== idx));
      setError(null);
    }
  }

  function handleCompare() {
    setError(null);

    const empty = tools.find((t) => !t.query.trim());
    if (empty) { setError("Enter a tool name in each field."); return; }

    const unresolved = tools.find((t) => !t.resolved);
    if (unresolved) { setPremium({ show: true, name: unresolved.query }); return; }

    if (tools.length === 2) {
      const [a, b] = [...tools.map((t) => t.resolved!)].sort((x, y) => x.id.localeCompare(y.id));
      router.push(`/vs/${a.id}-vs-${b.id}`);
    } else {
      const ids = tools.map((t) => t.resolved!.id).join(",");
      router.push(`/search?compare=${ids}`);
    }
  }

  function fillExample(ex: { a: ToolScore; b: ToolScore }) {
    setTools([
      { query: ex.a.name, resolved: ex.a },
      { query: ex.b.name, resolved: ex.b },
    ]);
    setError(null);
  }

  const currentExample = EXAMPLES[exampleIdx] ?? EXAMPLES[0];
  const allReady = tools.every((t) => t.resolved);

  return (
    <>
      <div className="space-y-2.5 w-full">
        {/* Category selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground shrink-0 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setTools([blank(), blank()]); setError(null); }}
            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
          >
            <option value="All">All ({ALL_SCORES.length} tools)</option>
            {CATEGORIES.map((cat) => {
              const n = ALL_SCORES.filter((s) => s.category === cat).length;
              return <option key={cat} value={cat}>{CATEGORY_LABELS[cat] ?? cat} ({n})</option>;
            })}
          </select>
        </div>

        {/* Tool inputs — first row is always Tool 1 vs Tool 2 inline */}
        <div className="flex flex-col gap-2">
          {/* Row 1: always side-by-side */}
          <div className="flex items-center gap-2">
            {[0, 1].map((idx) => (
              <MiniCombobox
                key={idx}
                placeholder={idx === 0 ? `Tool 1 — e.g. "${currentExample.a.name}"` : `Tool 2 — e.g. "${currentExample.b.name}"`}
                value={tools[idx]?.query ?? ""}
                resolved={tools[idx]?.resolved ?? null}
                matches={getMatches(tools[idx]?.query ?? "")}
                onChange={(v) => handleChange(idx, v)}
                onSelect={(s) => updateTool(idx, { query: s.name, resolved: s })}
                onClear={() => updateTool(idx, blank())}
                onPremiumTrigger={(n) => setPremium({ show: true, name: n })}
              />
            ))}
          </div>

          {/* Extra tools 3, 4, 5 — each on own row with remove button */}
          {tools.slice(2).map((t, i) => {
            const idx = i + 2;
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground shrink-0 w-10 text-right font-medium">
                  Tool {idx + 1}
                </span>
                <MiniCombobox
                  placeholder={`e.g. "${PLACEHOLDERS[idx] ?? "Gemini"}"`}
                  value={t.query}
                  resolved={t.resolved}
                  matches={getMatches(t.query)}
                  onChange={(v) => handleChange(idx, v)}
                  onSelect={(s) => updateTool(idx, { query: s.name, resolved: s })}
                  onClear={() => updateTool(idx, blank())}
                  onPremiumTrigger={(n) => setPremium({ show: true, name: n })}
                />
                <button
                  onClick={() => removeTool(idx)}
                  className="shrink-0 w-6 h-6 rounded-full border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-400 transition-colors flex items-center justify-center"
                  aria-label="Remove tool"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && <p className="text-xs text-rose-500">{error}</p>}

        {/* Actions row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompare}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare {tools.length} Tool{tools.length > 1 ? "s" : ""}
          </button>

          {tools.length < MAX_TOOLS && (
            <button
              onClick={addTool}
              className="px-3 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shrink-0 font-medium"
              title="Add another tool"
            >
              + Add tool
            </button>
          )}
        </div>

        {/* Quick example chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground shrink-0">Try:</span>
          {EXAMPLES.slice(0, 4).map((ex) => (
            <button
              key={`${ex.a.id}-${ex.b.id}`}
              onClick={() => fillExample(ex)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/50 hover:border-primary/50 hover:text-primary text-muted-foreground transition-all font-medium"
            >
              {ex.a.name} vs {ex.b.name}
            </button>
          ))}
        </div>
      </div>

      {premium.show && (
        <PremiumGate toolName={premium.name} onClose={() => setPremium({ show: false, name: "" })} />
      )}
    </>
  );
}
