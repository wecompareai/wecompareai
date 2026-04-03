"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

interface AIResult {
  content: string;
  model: string;
  error?: string;
}

interface ResearchResponse {
  prompt: string;
  responses: {
    chatgpt: AIResult;
    anthropic: AIResult;
    gemini: AIResult;
  };
  comparisons: {
    chatgpt: AIResult;
    anthropic: AIResult;
    gemini: AIResult;
  };
}

const PROVIDERS = [
  {
    key: "chatgpt" as const,
    name: "GPT-4o",
    logo: "/logos/openai.svg",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  {
    key: "anthropic" as const,
    name: "Claude 3.7",
    logo: "/logos/anthropic.svg",
    color: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  {
    key: "gemini" as const,
    name: "Gemini 2.0",
    logo: "/logos/gemini.svg",
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
];

function ResponseCard({
  provider,
  result,
  loading,
}: {
  provider: (typeof PROVIDERS)[number];
  result?: AIResult;
  loading: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${provider.border} bg-gradient-to-b ${provider.color} p-5 flex flex-col gap-3 min-h-[200px]`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${provider.dot}`} />
          <span className="font-semibold text-foreground">{provider.name}</span>
        </div>
        {result?.model && !result.error && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${provider.badge}`}>
            {result.model}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Waiting for response…
          </div>
        </div>
      )}

      {!loading && result?.error && (
        <div className="flex-1 flex items-start gap-2 text-sm text-red-500">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {result.error}
        </div>
      )}

      {!loading && result && !result.error && (
        <div className="flex-1 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[400px]">
          {result.content || <span className="text-muted-foreground italic">No content returned.</span>}
        </div>
      )}

      {!loading && !result && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic">
          No result yet
        </div>
      )}
    </div>
  );
}

export default function CompareAILivePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResponse | null>(null);

  async function handleResearch() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
      } else {
        setResult(data as ResearchResponse);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleResearch();
    }
  }

  return (
    <PremiumGate>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb + Header */}
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
              Run a prompt across ChatGPT, Claude, and Gemini simultaneously — then see each AI critique the others.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt input */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <label htmlFor="research-prompt" className="block text-sm font-medium text-foreground">
          Enter your prompt
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
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd> to submit
          </p>
          <button
            onClick={handleResearch}
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Loading state */}
      {loading && (
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Phase 1 of 2 — Querying ChatGPT, Claude, and Gemini simultaneously…</span>
          </div>
          <p className="pl-6 text-xs">After responses are collected, each AI will compare all three answers (Phase 2). This may take up to 60 seconds.</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Phase 1 — Original Responses
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROVIDERS.map((p) => (
                <ResponseCard key={p.key} provider={p} result={result.responses[p.key]} loading={false} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Phase 2 — Each AI Compares All Three Responses
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs text-muted-foreground">
              Each AI received all three original responses and was asked to compare them for accuracy, clarity, depth, unique insights, and overall quality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROVIDERS.map((p) => (
                <ResponseCard key={p.key} provider={p} result={result.comparisons[p.key]} loading={false} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
