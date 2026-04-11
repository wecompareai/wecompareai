"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

const MAX_SLOTS = 5;
const AVG_INPUT_TOKENS = 500;   // estimate for prompt alone
const AVG_OUTPUT_TOKENS = 2000; // estimate per response
// Phase 2 adds all phase-1 responses as context (~N * 2000 extra input tokens)

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

type AIResult = {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  error?: string;
};

type SlotResult = {
  slotId: string;
  providerName: string;
  modelName: string;
  modelSlug: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  initial: string;
  response: AIResult;
  comparison: AIResult;
};

function formatCost(usd: number): string {
  if (usd === 0) return "Free";
  if (usd < 0.0001) return "<$0.0001";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(4)}`;
}

function estimateRunCost(slots: Slot[], providers: AvailableProvider[], promptLen: number, includeComparison: boolean): number {
  const promptTokens = Math.max(Math.ceil(promptLen / 4), AVG_INPUT_TOKENS);
  const n = slots.length;
  let total = 0;
  for (const slot of slots) {
    const provider = providers.find((p) => p.id === slot.providerId);
    const model = provider?.models.find((m) => m.slug === slot.modelSlug);
    if (!model) continue;
    // Phase 1: promptTokens input + AVG_OUTPUT_TOKENS output
    const p1Input = promptTokens;
    const p1Output = AVG_OUTPUT_TOKENS;
    total += (p1Input / 1_000_000) * model.inputPricePer1M + (p1Output / 1_000_000) * model.outputPricePer1M;
    if (includeComparison) {
      // Phase 2: promptTokens + (n * AVG_OUTPUT_TOKENS) input + AVG_OUTPUT_TOKENS output
      const p2Input = promptTokens + n * AVG_OUTPUT_TOKENS;
      const p2Output = AVG_OUTPUT_TOKENS;
      total += (p2Input / 1_000_000) * model.inputPricePer1M + (p2Output / 1_000_000) * model.outputPricePer1M;
    }
  }
  return total;
}

function SlotCard({
  slot,
  index,
  providers,
  onProviderChange,
  onModelChange,
  onRemove,
  canRemove,
}: {
  slot: Slot;
  index: number;
  providers: AvailableProvider[];
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
            <option key={p.id} value={p.id}>
              T{p.tier} · {p.name}
            </option>
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
            <option key={m.slug} value={m.slug}>
              {m.name} · in ${m.inputPricePer1M}/out ${m.outputPricePer1M} per 1M tkn
            </option>
          ))}
        </select>
      </div>

      {model && (
        <div className={`text-xs px-2 py-1 rounded-md ${model.colorClass} flex items-center justify-between`}>
          <span className="font-mono">{model.slug}</span>
          <span>in ${model.inputPricePer1M} / out ${model.outputPricePer1M} per 1M</span>
        </div>
      )}
    </div>
  );
}

function ResultCard({ slot }: { slot: SlotResult }) {
  const [tab, setTab] = useState<"response" | "comparison">("response");
  const result = tab === "response" ? slot.response : slot.comparison;
  const bothCost = (slot.response.costUsd ?? 0) + (slot.comparison.costUsd ?? 0);

  return (
    <div className={`rounded-xl border ${slot.borderClass} bg-gradient-to-b ${slot.gradientClass} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${slot.colorClass}`}>
            {slot.initial}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{slot.modelName}</p>
            <p className="text-xs text-muted-foreground">{slot.providerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {bothCost > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${slot.colorClass}`}>
              {formatCost(bothCost)}
            </span>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-border/50">
        {(["response", "comparison"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-xs py-2 font-medium transition-colors ${
              tab === t ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "response" ? "Phase 1 — Response" : "Phase 2 — Analysis"}
          </button>
        ))}
      </div>

      {/* Token usage */}
      {result && !result.error && (result.inputTokens ?? 0) > 0 && (
        <div className="flex items-center gap-3 px-5 pt-3 text-xs text-muted-foreground">
          <span>{result.inputTokens?.toLocaleString()} in</span>
          <span>·</span>
          <span>{result.outputTokens?.toLocaleString()} out</span>
          {result.costUsd !== undefined && (
            <>
              <span>·</span>
              <span className="font-mono">{formatCost(result.costUsd)}</span>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-5 py-4 min-h-[200px] max-h-[450px] overflow-y-auto">
        {result?.error ? (
          <div className="flex items-start gap-2 text-sm text-red-500">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {result.error}
          </div>
        ) : result?.content ? (
          <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">
            {result.content}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
            No content returned.
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompareAILivePage() {
  const uid = useId();
  const [providers, setProviders] = useState<AvailableProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [prompt, setPrompt] = useState("");
  const [includeComparison, setIncludeComparison] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SlotResult[] | null>(null);
  const [actualCost, setActualCost] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/ai-providers/available")
      .then((r) => r.json())
      .then((data: AvailableProvider[]) => {
        setProviders(data);
        // Pre-fill first 3 slots with defaults if available
        const defaults: Slot[] = [];
        const used = data.slice(0, 3);
        for (const p of used) {
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
  const estimatedCost = estimateRunCost(validSlots, providers, prompt.length, includeComparison);

  async function handleRun() {
    if (!prompt.trim() || loading || validSlots.length === 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setActualCost(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          selections: validSlots.map((s) => ({ slotId: s.slotId, modelSlug: s.modelSlug })),
          includeComparison,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
      } else {
        setResults(data.slots);
        setActualCost(data.totalCostUsd ?? null);
      }
    } catch {
      setError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleRun();
  }

  return (
    <PremiumGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
            <span>/</span>
            <span className="text-foreground">Compare AI Models Live</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Compare AI Models Live</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Choose up to 5 provider/model combinations — run your prompt across all, then each AI analyzes the others.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — config panel */}
          <div className="lg:col-span-1 space-y-5">

            {/* Model Slots */}
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
                    <SlotCard
                      key={slot.slotId}
                      slot={slot}
                      index={i}
                      providers={providers}
                      onProviderChange={handleProviderChange}
                      onModelChange={handleModelChange}
                      onRemove={removeSlot}
                      canRemove={slots.length > 1}
                    />
                  ))}

                  {slots.length < MAX_SLOTS && (
                    <button
                      onClick={addSlot}
                      className="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Slot ({slots.length}/{MAX_SLOTS})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cost Estimator */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Cost Estimator</h2>
              <p className="text-xs text-muted-foreground">
                Estimate based on ~{AVG_INPUT_TOKENS} input + ~{AVG_OUTPUT_TOKENS} output tokens per phase per model.
                Actual tokens vary with your prompt and responses.
              </p>

              <div className="space-y-1.5">
                {validSlots.map((slot) => {
                  const provider = providers.find((p) => p.id === slot.providerId);
                  const model = provider?.models.find((m) => m.slug === slot.modelSlug);
                  if (!model) return null;
                  const n = validSlots.length;
                  const promptTokens = Math.max(Math.ceil(prompt.length / 4), AVG_INPUT_TOKENS);
                  const p1Cost = (promptTokens / 1_000_000) * model.inputPricePer1M + (AVG_OUTPUT_TOKENS / 1_000_000) * model.outputPricePer1M;
                  const p2Cost = includeComparison
                    ? ((promptTokens + n * AVG_OUTPUT_TOKENS) / 1_000_000) * model.inputPricePer1M + (AVG_OUTPUT_TOKENS / 1_000_000) * model.outputPricePer1M
                    : 0;
                  const slotCost = p1Cost + p2Cost;
                  return (
                    <div key={slot.slotId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${model.colorClass}`}>
                          {model.initial}
                        </span>
                        <span className="text-muted-foreground">{model.name}</span>
                      </div>
                      <span className="font-mono text-foreground">{formatCost(slotCost)}</span>
                    </div>
                  );
                })}
              </div>

              {validSlots.length > 0 && (
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Est. total ({includeComparison ? "2 phases" : "Phase 1 only"})</span>
                  <span className="text-sm font-bold text-foreground font-mono">{formatCost(estimatedCost)}</span>
                </div>
              )}

              {actualCost !== null && (
                <div className="pt-2 border-t border-border flex items-center justify-between bg-emerald-500/5 rounded-lg px-2 py-1.5">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Actual cost (last run)</span>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">{formatCost(actualCost)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — prompt + results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Prompt input */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <label htmlFor="research-prompt" className="block text-sm font-medium text-foreground">
                Your prompt
              </label>
              <textarea
                id="research-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything — e.g. 'Explain transformer architecture' or 'Write a Python function to sort a list'…"
                rows={5}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-60"
              />
              {/* Phase 2 checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeComparison}
                  onChange={(e) => setIncludeComparison(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Run Phase 2 — Cross-model analysis</p>
                  <p className="text-xs text-muted-foreground">
                    Each model will analyze and compare all Phase 1 responses (slower &amp; costs more)
                  </p>
                </div>
              </label>

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd> to run
                  </p>
                  {prompt.length > 0 && (
                    <p>~{Math.ceil(prompt.length / 4)} tokens · est. {formatCost(estimatedCost)} ({includeComparison ? "2 phases" : "Phase 1 only"})</p>
                  )}
                </div>
                <button
                  onClick={handleRun}
                  disabled={loading || !prompt.trim() || validSlots.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Running…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run Comparison
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

            {/* Loading */}
            {loading && (
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="animate-spin w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Phase 1 — Querying {validSlots.length} model{validSlots.length > 1 ? "s" : ""} simultaneously…</span>
                </div>
                <p className="pl-6 text-xs text-muted-foreground">
                  {includeComparison
                    ? `After responses are collected, each model will analyze all ${validSlots.length} responses (Phase 2). This may take up to 90 seconds.`
                    : "Collecting responses from all selected models. No cross-model analysis will be run."}
                </p>
              </div>
            )}

            {/* Results */}
            {results && results.length > 0 && (
              <div className="space-y-6">
                {/* Summary bar */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{results.length} models compared</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{includeComparison ? "2 phases" : "Phase 1 only"}</span>
                  </div>
                  {actualCost !== null && (
                    <span className="text-sm font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      Total cost: {formatCost(actualCost)}
                    </span>
                  )}
                </div>

                {/* Phase 1 */}
                <section className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Phase 1 — Original Responses
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className={`grid gap-4 ${results.length === 1 ? "grid-cols-1" : results.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    {results.map((slot) => (
                      <div key={slot.slotId} className={`rounded-xl border ${slot.borderClass} bg-gradient-to-b ${slot.gradientClass} flex flex-col`}>
                        <div className="flex items-center justify-between px-5 pt-4 pb-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${slot.colorClass}`}>
                              {slot.initial}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{slot.modelName}</p>
                              <p className="text-xs text-muted-foreground">{slot.providerName}</p>
                            </div>
                          </div>
                          {slot.response.costUsd !== undefined && slot.response.costUsd > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${slot.colorClass}`}>
                              {formatCost(slot.response.costUsd)}
                            </span>
                          )}
                        </div>
                        {slot.response.inputTokens ? (
                          <p className="px-5 pb-1 text-xs text-muted-foreground">
                            {slot.response.inputTokens.toLocaleString()} in · {slot.response.outputTokens?.toLocaleString()} out
                          </p>
                        ) : null}
                        <div className="px-5 pb-5 flex-1 max-h-[350px] overflow-y-auto">
                          {slot.response.error ? (
                            <p className="text-sm text-red-500">{slot.response.error}</p>
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">
                              {slot.response.content || <span className="text-muted-foreground italic">No content.</span>}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Phase 2 — only shown if comparison was requested */}
                {results.some((s) => s.comparison.content || s.comparison.error) && (
                <section className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Phase 2 — Each Model Analyzes All Responses
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Each model received all {results.length} original responses and was asked to compare them for accuracy, clarity, depth, unique insights, and overall quality.
                  </p>
                  <div className={`grid gap-4 ${results.length === 1 ? "grid-cols-1" : results.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    {results.map((slot) => (
                      <div key={slot.slotId} className={`rounded-xl border ${slot.borderClass} bg-gradient-to-b ${slot.gradientClass} flex flex-col`}>
                        <div className="flex items-center justify-between px-5 pt-4 pb-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${slot.colorClass}`}>
                              {slot.initial}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{slot.modelName}</p>
                              <p className="text-xs text-muted-foreground">{slot.providerName}</p>
                            </div>
                          </div>
                          {slot.comparison.costUsd !== undefined && slot.comparison.costUsd > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${slot.colorClass}`}>
                              {formatCost(slot.comparison.costUsd)}
                            </span>
                          )}
                        </div>
                        {slot.comparison.inputTokens ? (
                          <p className="px-5 pb-1 text-xs text-muted-foreground">
                            {slot.comparison.inputTokens.toLocaleString()} in · {slot.comparison.outputTokens?.toLocaleString()} out
                          </p>
                        ) : null}
                        <div className="px-5 pb-5 flex-1 max-h-[400px] overflow-y-auto">
                          {slot.comparison.error ? (
                            <p className="text-sm text-red-500">{slot.comparison.error}</p>
                          ) : (
                            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">
                              {slot.comparison.content || <span className="text-muted-foreground italic">No content.</span>}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumGate>
  );
}
