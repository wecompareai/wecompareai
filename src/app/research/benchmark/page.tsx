"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";
import type { BenchmarkResult } from "@/app/api/benchmark/route";

// Keys match what the API returns; display names are mapped below
const PROVIDER_STYLES: Record<string, { border: string; bg: string; bar: string; dot: string; badge: string; displayName: string }> = {
  ChatGPT: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    displayName: "GPT-4o",
  },
  Claude: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    bar: "bg-orange-500",
    dot: "bg-orange-500",
    badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    displayName: "Claude 3.7 Sonnet",
  },
  Gemini: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    displayName: "Gemini 2.0 Flash",
  },
};

function BarChart({
  label,
  data,
  format,
  lowerIsBetter,
}: {
  label: string;
  data: { provider: string; value: number }[];
  format: (v: number) => string;
  lowerIsBetter?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const best = lowerIsBetter
    ? data.reduce((a, b) => (a.value < b.value ? a : b)).provider
    : data.reduce((a, b) => (a.value > b.value ? a : b)).provider;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      {data.map(({ provider, value }) => {
        const style = PROVIDER_STYLES[provider];
        const pct = max > 0 ? Math.round((value / max) * 100) : 0;
        const isBest = provider === best && value > 0;
        return (
          <div key={provider} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${style?.dot}`} />
                <span className="text-foreground">{provider}</span>
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
                className={`h-full rounded-full transition-all duration-700 ${style?.bar}`}
                style={{ width: `${pct}%` }}
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
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${(hovered || value) >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground fill-none"}`}
            stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      ))}
      {value > 0 && <span className="ml-1 text-xs text-muted-foreground">{value}/5</span>}
    </div>
  );
}

function MetricCard({ result, rating, onRating }: { result: BenchmarkResult; rating: number; onRating: (v: number) => void }) {
  const style = PROVIDER_STYLES[result.provider] ?? PROVIDER_STYLES.ChatGPT;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-5 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
          <span className="font-semibold text-foreground">{result.provider}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${style.badge}`}>
          {result.model}
        </span>
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
          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-background/60 border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Response Time</div>
              <div className="text-lg font-bold text-foreground mt-0.5">
                {result.responseTimeMs > 0 ? `${(result.responseTimeMs / 1000).toFixed(2)}s` : "—"}
              </div>
            </div>
            <div className="rounded-lg bg-background/60 border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Cost per Run</div>
              <div className="text-lg font-bold text-foreground mt-0.5">
                {result.costUsd > 0 ? `$${result.costUsd.toFixed(5)}` : "—"}
              </div>
            </div>
            <div className="rounded-lg bg-background/60 border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Input Tokens</div>
              <div className="text-lg font-bold text-foreground mt-0.5">
                {result.inputTokens > 0 ? result.inputTokens.toLocaleString() : "—"}
              </div>
            </div>
            <div className="rounded-lg bg-background/60 border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">Output Tokens</div>
              <div className="text-lg font-bold text-foreground mt-0.5">
                {result.outputTokens > 0 ? result.outputTokens.toLocaleString() : "—"}
              </div>
            </div>
          </div>

          {/* Safety flag */}
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${result.safetyFlag ? "border-red-300 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" : "border-green-300 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"}`}>
            {result.safetyFlag ? (
              <>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Safety flag detected{result.safetyNote ? `: ${result.safetyNote}` : ""}
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

          {/* User quality rating */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Your Quality Rating</div>
            <StarRating value={rating} onChange={onRating} />
          </div>

          {/* Response preview */}
          {result.content && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
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
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  async function handleBenchmark() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setRatings({});

    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb + Header */}
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
              Measure execution speed, token usage, cost, safety flags, and output quality across ChatGPT, Claude, and Gemini.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt input */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <label htmlFor="benchmark-prompt" className="block text-sm font-medium text-foreground">
          Enter your benchmark prompt
        </label>
        <textarea
          id="benchmark-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleBenchmark(); }}
          placeholder="Enter a prompt to benchmark — e.g. 'Summarize the key differences between React and Vue' or 'Write a sorting algorithm in Python'…"
          rows={4}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-60"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd> to run
          </p>
          <button
            onClick={handleBenchmark}
            disabled={loading || !prompt.trim()}
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
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <svg className="animate-spin w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Running all 3 models in parallel — measuring speed, tokens, and cost…
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-8">
          {/* Metric cards */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Per-Model Metrics
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((r) => (
                <MetricCard
                  key={r.provider}
                  result={r}
                  rating={ratings[r.provider] ?? 0}
                  onRating={(v) => setRatings((prev) => ({ ...prev, [r.provider]: v }))}
                />
              ))}
            </div>
          </div>

          {/* Performance charts */}
          {validResults.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Side-by-Side Performance Charts
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-xl border border-border bg-card p-6">
                <BarChart
                  label="Response Speed (lower = faster)"
                  lowerIsBetter
                  data={validResults.map((r) => ({ provider: r.provider, value: r.responseTimeMs }))}
                  format={(v) => `${(v / 1000).toFixed(2)}s`}
                />
                <BarChart
                  label="Cost per Run (lower = cheaper)"
                  lowerIsBetter
                  data={validResults.map((r) => ({ provider: r.provider, value: r.costUsd }))}
                  format={(v) => `$${v.toFixed(5)}`}
                />
                <BarChart
                  label="Total Token Usage"
                  data={validResults.map((r) => ({ provider: r.provider, value: r.totalTokens }))}
                  format={(v) => v.toLocaleString()}
                />
                <BarChart
                  label="Output Quality (user-rated)"
                  data={validResults.map((r) => ({ provider: r.provider, value: ratings[r.provider] ?? 0 }))}
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
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Summary
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Model</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Speed</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Input Tokens</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Output Tokens</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Cost</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">Safety</th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.provider} className={i < results.length - 1 ? "border-b border-border" : ""}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${PROVIDER_STYLES[r.provider]?.dot}`} />
                            <span className="font-medium text-foreground">{r.provider}</span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{r.model}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {r.error ? "—" : `${(r.responseTimeMs / 1000).toFixed(2)}s`}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {r.error ? "—" : r.inputTokens.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {r.error ? "—" : r.outputTokens.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {r.error ? "—" : `$${r.costUsd.toFixed(5)}`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {r.error ? (
                            <span className="text-muted-foreground">—</span>
                          ) : r.safetyFlag ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              </svg>
                              Flagged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Clean
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-yellow-500">
                          {ratings[r.provider] ? `${"★".repeat(ratings[r.provider])}${"☆".repeat(5 - ratings[r.provider])}` : <span className="text-muted-foreground text-xs">not rated</span>}
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
