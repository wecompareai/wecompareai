"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

type DBModel = {
  id: string;
  name: string;
  slug: string;
  modelId: string;
  initial: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  provider: { name: string; tier: number };
};

const EXAMPLE_PROMPTS = [
  "Explain quantum computing to a 10-year-old",
  "Write a haiku about burnout at work",
  "What's the best AI model for coding in 2025?",
];

type ModelResult =
  | { status: "ok"; text: string; model: string; latencyMs: number }
  | { status: "error"; error: string }
  | { status: "no_key" }
  | { status: "loading" };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title="Copy response"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

function ResultCard({ model, result }: { model: DBModel; result?: ModelResult }) {
  return (
    <div className={`rounded-xl border ${model.borderClass} bg-gradient-to-b ${model.gradientClass} p-5 flex flex-col gap-3 min-h-[200px]`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${model.colorClass}`}>
            {model.initial}
          </span>
          <div>
            <span className="font-semibold text-foreground text-sm">{model.name}</span>
            <span className="ml-1.5 text-xs text-muted-foreground">{model.provider.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result?.status === "ok" && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${model.colorClass}`}>
              {(result.latencyMs / 1000).toFixed(1)}s
            </span>
          )}
          {result?.status === "no_key" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
              No API key
            </span>
          )}
          {result?.status === "error" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400">
              Error
            </span>
          )}
          {result?.status === "loading" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground animate-pulse">
              Waiting...
            </span>
          )}
          {result?.status === "ok" && <CopyButton text={result.text} />}
        </div>
      </div>

      <div className="flex-1">
        {!result && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
            No result yet
          </div>
        )}
        {result?.status === "loading" && (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating response…
            </div>
          </div>
        )}
        {result?.status === "no_key" && (
          <div className="text-sm text-amber-600 dark:text-amber-400">
            API key not configured for this provider. Add {model.provider.name}&apos;s API key to your environment variables.
          </div>
        )}
        {result?.status === "error" && (
          <div className="flex items-start gap-2 text-sm text-red-500">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{result.error}</span>
          </div>
        )}
        {result?.status === "ok" && (
          <div className="max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">
              {result.text || <span className="text-muted-foreground italic">No content returned.</span>}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PromptBattlePage() {
  const [models, setModels] = useState<DBModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ModelResult>>({});

  // Group models by provider tier for the selector UI
  const tierGroups: Record<number, DBModel[]> = {};
  for (const m of models) {
    (tierGroups[m.provider.tier] ??= []).push(m);
  }

  useEffect(() => {
    fetch("/api/ai-providers?withModels=true&activeOnly=true")
      .then((r) => r.json())
      .then((providers: { models: DBModel[]; name: string; tier: number }[]) => {
        const allModels: DBModel[] = providers.flatMap((p) =>
          p.models.map((m) => ({ ...m, provider: { name: p.name, tier: p.tier } }))
        );
        setModels(allModels);
        setSelectedModels(allModels.map((m) => m.slug));
      })
      .finally(() => setModelsLoading(false));
  }, []);

  function toggleModel(slug: string) {
    setSelectedModels((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleRunBattle() {
    if (!prompt.trim() || loading || selectedModels.length === 0) return;
    setLoading(true);

    const loadingState: Record<string, ModelResult> = {};
    selectedModels.forEach((slug) => { loadingState[slug] = { status: "loading" }; });
    setResults(loadingState);

    try {
      const res = await fetch("/api/prompt-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), models: selectedModels }),
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results as Record<string, ModelResult>);
      } else {
        const errResult: ModelResult = { status: "error", error: data.error ?? "Unexpected error" };
        const errorState: Record<string, ModelResult> = {};
        selectedModels.forEach((slug) => { errorState[slug] = errResult; });
        setResults(errorState);
      }
    } catch {
      const errResult: ModelResult = { status: "error", error: "Network error — please check your connection." };
      const errorState: Record<string, ModelResult> = {};
      selectedModels.forEach((slug) => { errorState[slug] = errResult; });
      setResults(errorState);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleRunBattle();
  }

  const hasResults = Object.keys(results).length > 0;

  return (
    <PremiumGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
            <span>/</span>
            <span className="text-foreground">AI Prompt Battle</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">&#9876;&#65039; AI Prompt Battle</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Type a prompt. Watch all the models fight for your approval.
              </p>
            </div>
          </div>
        </div>

        {/* Input panel */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          {/* Example prompts */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt textarea */}
          <div className="space-y-2">
            <label htmlFor="battle-prompt" className="block text-sm font-medium text-foreground">
              Your prompt
            </label>
            <textarea
              id="battle-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something interesting… e.g. 'Explain quantum computing to a 10-year-old'"
              rows={3}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-60"
            />
          </div>

          {/* Model selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Select models</p>
              {!modelsLoading && models.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModels(models.map((m) => m.slug))}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Select all
                  </button>
                  <span className="text-muted-foreground text-xs">·</span>
                  <button
                    onClick={() => setSelectedModels([])}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {modelsLoading ? (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : models.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No models configured.{" "}
                <Link href="/admin/ai-providers" className="text-primary hover:underline">
                  Add models in the admin panel.
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(tierGroups)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([tier, tierModels]) => (
                    <div key={tier}>
                      <p className="text-xs text-muted-foreground mb-1.5">Tier {tier}</p>
                      <div className="flex flex-wrap gap-2">
                        {tierModels.map((model) => {
                          const isSelected = selectedModels.includes(model.slug);
                          return (
                            <button
                              key={model.slug}
                              onClick={() => toggleModel(model.slug)}
                              disabled={loading}
                              title={model.provider.name}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                isSelected
                                  ? `${model.colorClass} ${model.borderClass} border`
                                  : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                              }`}
                            >
                              <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${isSelected ? model.colorClass : "bg-muted text-muted-foreground"}`}>
                                {model.initial}
                              </span>
                              {model.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Run button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Tip: Press{" "}
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd>{" "}
              to run
            </p>
            <button
              onClick={handleRunBattle}
              disabled={loading || !prompt.trim() || selectedModels.length === 0}
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
                  Run Battle
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results grid */}
        {hasResults && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Battle Results
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {models
                .filter((m) => results[m.slug] !== undefined)
                .map((model) => (
                  <ResultCard key={model.slug} model={model} result={results[model.slug]} />
                ))}
            </div>
          </div>
        )}
      </div>
    </PremiumGate>
  );
}
