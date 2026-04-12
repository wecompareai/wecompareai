"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";
import type { BenchmarkResult } from "@/app/api/benchmark/route";

const MAX_SLOTS = 5;

type AvailableModel = {
  id: string;
  name: string;
  slug: string;
  initial: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
};

type AvailableProvider = {
  id: string;
  name: string;
  slug: string;
  tier: number;
  models: AvailableModel[];
};

type Slot = {
  slotId: string;
  providerId: string;
  modelSlug: string;
};

function SlotCard({
  slot, index, providers, onProviderChange, onModelChange, onRemove, canRemove,
}: {
  slot: Slot; index: number; providers: AvailableProvider[];
  onProviderChange: (slotId: string, providerId: string) => void;
  onModelChange: (slotId: string, modelSlug: string) => void;
  onRemove: (slotId: string) => void;
  canRemove: boolean;
}) {
  const provider = providers.find((p) => p.id === slot.providerId);
  const model = provider?.models.find((m) => m.slug === slot.modelSlug);

  return (
    <div className={`rounded-xl border ${model?.borderClass ?? "border-border"} bg-card p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {model && (
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${model.colorClass}`}>
              {model.initial}
            </span>
          )}
          <span className="text-sm font-medium text-foreground">Slot {index + 1}</span>
        </div>
        {canRemove && (
          <button onClick={() => onRemove(slot.slotId)} className="text-muted-foreground hover:text-red-500 transition-colors" title="Remove slot">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-2">
        <select
          value={slot.providerId}
          onChange={(e) => onProviderChange(slot.slotId, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">— Select Provider —</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>T{p.tier} · {p.name}</option>
          ))}
        </select>
        <select
          value={slot.modelSlug}
          onChange={(e) => onModelChange(slot.slotId, e.target.value)}
          disabled={!slot.providerId}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        >
          <option value="">— Select Model —</option>
          {(provider?.models ?? []).map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
      </div>
      {model && (
        <div className={`text-xs px-2 py-1 rounded-md ${model.colorClass} font-mono`}>
          {model.slug}
        </div>
      )}
    </div>
  );
}

function BarChart({ label, data, format, lowerIsBetter }: {
  label: string;
  data: { label: string; value: number; colorClass: string }[];
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const bestVal = lowerIsBetter ? Math.min(...data.filter(d => d.value > 0).map(d => d.value)) : Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      {data.map(({ label: l, value, colorClass }) => {
        const pct = max > 0 ? Math.round((value / max) * 100) : 0;
        const isBest = value > 0 && value === bestVal;
        const barColor = colorClass.match(/text-(\w+-\d+)/)?.[1] ?? "primary";
        return (
          <div key={l} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full bg-current ${colorClass}`} />
                <span className="text-foreground truncate max-w-[120px]">{l}</span>
                {isBest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {lowerIsBetter ? "fastest" : "best"}
                  </span>
                )}
              </div>
              <span className="font-mono text-foreground">{value > 0 ? format(value) : "—"}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colorClass.includes("emerald") ? "bg-emerald-500" : colorClass.includes("orange") ? "bg-orange-500" : colorClass.includes("blue") ? "bg-blue-500" : colorClass.includes("violet") ? "bg-violet-500" : colorClass.includes("rose") ? "bg-rose-500" : colorClass.includes("cyan") ? "bg-cyan-500" : colorClass.includes("amber") ? "bg-amber-500" : "bg-zinc-500"}`}
                style={{ width: `${lowerIsBetter && value > 0 ? Math.round((bestVal / value) * 100) : pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110" aria-label={`Rate ${star} stars`}
        >
          <svg className={`w-5 h-5 transition-colors ${(hovered || value) >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground fill-none"}`}
            stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      ))}
      {value > 0 && <span className="ml-1 text-xs text-muted-foreground">{value}/5</span>}
    </div>
  );
}

function MetricCard({ result, rating, onRating }: { result: BenchmarkResult; rating: number; onRating: (v: number) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border ${result.borderClass} bg-gradient-to-b ${result.gradientClass} p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${result.colorClass}`}>
            {result.initial}
          </span>
          <div>
            <p className="font-semibold text-foreground text-sm">{result.modelName}</p>
            <p className="text-xs text-muted-foreground">{result.providerName}</p>
          </div>
        </div>
        {result.responseTimeMs > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${result.colorClass}`}>
            {(result.responseTimeMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      {result.error ? (
        <div className="text-sm text-red-500 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {result.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Response Time", value: result.responseTimeMs > 0 ? `${(result.responseTimeMs / 1000).toFixed(2)}s` : "—" },
              { label: "Cost per Run",  value: result.costUsd > 0 ? `$${result.costUsd.toFixed(5)}` : "—" },
              { label: "Input Tokens",  value: result.inputTokens > 0 ? result.inputTokens.toLocaleString() : "—" },
              { label: "Output Tokens", value: result.outputTokens > 0 ? result.outputTokens.toLocaleString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-background/60 border border-border px-3 py-2">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-lg font-bold text-foreground mt-0.5">{value}</div>
              </div>
            ))}
          </div>

          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${result.safetyFlag ? "border-red-300 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" : "border-green-300 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"}`}>
            {result.safetyFlag ? (
              <>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Safety flag{result.safetyNote ? `: ${result.safetyNote}` : ""}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No safety violations
              </>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Your Quality Rating</div>
            <StarRating value={rating} onChange={onRating} />
          </div>

          {result.content && (
            <div className="space-y-1">
              <button type="button" onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {expanded ? "Hide response" : "Show response"}
              </button>
              {expanded && (
                <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap bg-background/60 border border-border rounded-lg p-3 max-h-64 overflow-y-auto">
                  {result.content}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BenchmarkPage() {
  const uid = useId();
  const [providers, setProviders] = useState<AvailableProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/ai-providers/available")
      .then((r) => r.json())
      .then((data: AvailableProvider[]) => {
        setProviders(data);
        const defaults: Slot[] = [];
        for (const p of data.slice(0, 3)) {
          if (p.models.length > 0) {
            defaults.push({ slotId: `${uid}-${defaults.length}`, providerId: p.id, modelSlug: p.models[0].slug });
          }
        }
        setSlots(defaults.length > 0 ? defaults : [{ slotId: `${uid}-0`, providerId: "", modelSlug: "" }]);
      })
      .finally(() => setProvidersLoading(false));
  }, [uid]);

  function addSlot() {
    if (slots.length >= MAX_SLOTS) return;
    setSlots((prev) => [...prev, { slotId: `${uid}-${Date.now()}`, providerId: "", modelSlug: "" }]);
  }

  function removeSlot(slotId: string) {
    setSlots((prev) => prev.filter((s) => s.slotId !== slotId));
  }

  function handleProviderChange(slotId: string, providerId: string) {
    const provider = providers.find((p) => p.id === providerId);
    const modelSlug = provider?.models[0]?.slug ?? "";
    setSlots((prev) => prev.map((s) => s.slotId === slotId ? { ...s, providerId, modelSlug } : s));
  }

  function handleModelChange(slotId: string, modelSlug: string) {
    setSlots((prev) => prev.map((s) => s.slotId === slotId ? { ...s, modelSlug } : s));
  }

  const validSlots = slots.filter((s) => s.providerId && s.modelSlug);

  async function handleBenchmark() {
    if (!prompt.trim() || loading || validSlots.length === 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setRatings({});

    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          slots: validSlots.map((s) => ({ slotId: s.slotId, modelSlug: s.modelSlug })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
      } else {
        setResults(data.results);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const validResults = results?.filter((r) => !r.error) ?? [];

  return (
    <PremiumGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
            <span>/</span>
            <span className="text-foreground">Real-Time Model Benchmarking</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Real-Time Model Benchmarking</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Measure speed, tokens, cost, and safety across up to 5 models simultaneously.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — slot config */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Model Selection</h2>
                <span className="text-xs text-muted-foreground">{validSlots.length}/{MAX_SLOTS} slots</span>
              </div>

              {providersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}
                </div>
              ) : providers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No providers with API keys found.{" "}
                  <Link href="/admin/ai-providers" className="text-primary hover:underline">Configure in admin panel.</Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot, i) => (
                    <SlotCard key={slot.slotId} slot={slot} index={i} providers={providers}
                      onProviderChange={handleProviderChange} onModelChange={handleModelChange}
                      onRemove={removeSlot} canRemove={slots.length > 1}
                    />
                  ))}
                  {slots.length < MAX_SLOTS && (
                    <button onClick={addSlot}
                      className="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Slot ({slots.length}/{MAX_SLOTS})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right — prompt + results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <label htmlFor="benchmark-prompt" className="block text-sm font-medium text-foreground">
                Enter your benchmark prompt
              </label>
              <textarea
                id="benchmark-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleBenchmark(); }}
                placeholder="e.g. 'Summarize the key differences between React and Vue' or 'Write a sorting algorithm in Python'…"
                rows={4}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-60"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd> to run
                </p>
                <button
                  onClick={handleBenchmark}
                  disabled={loading || !prompt.trim() || validSlots.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Benchmarking…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run Benchmark
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            {loading && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground rounded-xl border border-border bg-card p-4">
                <svg className="animate-spin w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Running {validSlots.length} model{validSlots.length > 1 ? "s" : ""} in parallel — measuring speed, tokens, and cost…
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Per-model metric cards */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Per-Model Metrics</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className={`grid gap-4 ${results.length === 1 ? "grid-cols-1" : results.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {results.map((r) => (
                  <MetricCard key={r.slotId} result={r}
                    rating={ratings[r.slotId] ?? 0}
                    onRating={(v) => setRatings((prev) => ({ ...prev, [r.slotId]: v }))}
                  />
                ))}
              </div>
            </div>

            {/* Performance charts */}
            {validResults.length > 1 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Side-by-Side Performance</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-xl border border-border bg-card p-6">
                  <BarChart label="Response Speed (lower = faster)" lowerIsBetter
                    data={validResults.map((r) => ({ label: r.modelName, value: r.responseTimeMs, colorClass: r.colorClass }))}
                    format={(v) => `${(v / 1000).toFixed(2)}s`}
                  />
                  <BarChart label="Cost per Run (lower = cheaper)" lowerIsBetter
                    data={validResults.map((r) => ({ label: r.modelName, value: r.costUsd, colorClass: r.colorClass }))}
                    format={(v) => `$${v.toFixed(5)}`}
                  />
                  <BarChart label="Total Token Usage"
                    data={validResults.map((r) => ({ label: r.modelName, value: r.totalTokens, colorClass: r.colorClass }))}
                    format={(v) => v.toLocaleString()}
                  />
                  <BarChart label="Output Quality (user-rated)"
                    data={results.map((r) => ({ label: r.modelName, value: ratings[r.slotId] ?? 0, colorClass: r.colorClass }))}
                    format={(v) => `${v}/5 ★`}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Rate each model&apos;s output above — the quality chart updates in real time.
                </p>
              </div>
            )}

            {/* Summary table */}
            {validResults.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Summary</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Model</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Speed</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">In Tokens</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Out Tokens</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Cost</th>
                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Safety</th>
                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r.slotId} className={i < results.length - 1 ? "border-b border-border" : ""}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${r.colorClass}`}>{r.initial}</span>
                              <div>
                                <p className="font-medium text-foreground text-sm">{r.modelName}</p>
                                <p className="text-xs text-muted-foreground">{r.providerName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm">{r.error ? "—" : `${(r.responseTimeMs / 1000).toFixed(2)}s`}</td>
                          <td className="px-4 py-3 text-right font-mono text-sm">{r.error ? "—" : r.inputTokens.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-sm">{r.error ? "—" : r.outputTokens.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-sm">{r.error ? "—" : r.costUsd > 0 ? `$${r.costUsd.toFixed(5)}` : "Free"}</td>
                          <td className="px-4 py-3 text-center">
                            {r.error ? <span className="text-muted-foreground">—</span>
                              : r.safetyFlag ? (
                                <span className="inline-flex items-center gap-1 text-xs text-red-500">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                                  Flagged
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  Clean
                                </span>
                              )}
                          </td>
                          <td className="px-4 py-3 text-center text-yellow-500 text-sm">
                            {ratings[r.slotId] ? `${"★".repeat(ratings[r.slotId])}${"☆".repeat(5 - ratings[r.slotId])}` : <span className="text-muted-foreground text-xs">not rated</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PremiumGate>
  );
}
