"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

const MAX_SLOTS = 5;

type AvailableModel = {
  id: string;
  name: string;
  slug: string;
  initial: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
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

type ModelResult =
  | { status: "ok"; text: string; model: string; latencyMs: number }
  | { status: "error"; error: string }
  | { status: "no_key" }
  | { status: "loading" };

const EXAMPLE_PROMPTS = [
  "Explain quantum computing to a 10-year-old",
  "Write a haiku about burnout at work",
  "What's the best AI model for coding in 2025?",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
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
          <button
            onClick={() => onRemove(slot.slotId)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            title="Remove slot"
          >
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

function ResultCard({
  slot,
  provider,
  model,
  result,
}: {
  slot: Slot;
  provider: AvailableProvider | undefined;
  model: AvailableModel | undefined;
  result?: ModelResult;
}) {
  if (!model || !provider) return null;
  return (
    <div className={`rounded-xl border ${model.borderClass} bg-gradient-to-b ${model.gradientClass} p-5 flex flex-col gap-3 min-h-[200px]`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${model.colorClass}`}>
            {model.initial}
          </span>
          <div>
            <p className="font-semibold text-foreground text-sm">{model.name}</p>
            <p className="text-xs text-muted-foreground">{provider.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result?.status === "ok" && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${model.colorClass}`}>
              {(result.latencyMs / 1000).toFixed(1)}s
            </span>
          )}
          {result?.status === "no_key" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">No API key</span>
          )}
          {result?.status === "error" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400">Error</span>
          )}
          {result?.status === "loading" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground animate-pulse">Waiting…</span>
          )}
          {result?.status === "ok" && <CopyButton text={result.text} />}
        </div>
      </div>

      <div className="flex-1">
        {!result && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">No result yet</div>
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
            API key not configured for {provider.name}.
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
          <div className="max-h-72 overflow-y-auto">
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
  const uid = useId();
  const [providers, setProviders] = useState<AvailableProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ModelResult>>({});

  useEffect(() => {
    fetch("/api/ai-providers/available")
      .then((r) => r.json())
      .then((data: AvailableProvider[]) => {
        setProviders(data);
        // Pre-fill up to 3 slots with first available provider+model
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

  async function handleRunBattle() {
    if (!prompt.trim() || loading || validSlots.length === 0) return;
    setLoading(true);

    // Show loading state per slot
    const loadingState: Record<string, ModelResult> = {};
    validSlots.forEach((s) => { loadingState[s.slotId] = { status: "loading" }; });
    setResults(loadingState);

    try {
      const res = await fetch("/api/prompt-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          slots: validSlots.map((s) => ({ slotId: s.slotId, modelSlug: s.modelSlug })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results as Record<string, ModelResult>);
      } else {
        const err: ModelResult = { status: "error", error: data.error ?? "Unexpected error" };
        const errorState: Record<string, ModelResult> = {};
        validSlots.forEach((s) => { errorState[s.slotId] = err; });
        setResults(errorState);
      }
    } catch {
      const err: ModelResult = { status: "error", error: "Network error — please check your connection." };
      const errorState: Record<string, ModelResult> = {};
      validSlots.forEach((s) => { errorState[s.slotId] = err; });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

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
              <h1 className="text-2xl font-bold text-foreground">AI Prompt Battle</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Choose up to 5 models — same prompt, live race. See who responds fastest.
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
          </div>

          {/* Right — prompt + results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Prompt input */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              {/* Example prompts */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example)}
                      disabled={loading}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="battle-prompt" className="block text-sm font-medium text-foreground mb-2">
                  Your prompt
                </label>
                <textarea
                  id="battle-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask something interesting…"
                  rows={4}
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-60"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-xs">Ctrl+Enter</kbd> to run
                </p>
                <button
                  onClick={handleRunBattle}
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
                      Run Battle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {hasResults && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    Battle Results
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className={`grid gap-4 ${validSlots.length === 1 ? "grid-cols-1" : validSlots.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                  {validSlots.map((slot) => {
                    const provider = providers.find((p) => p.id === slot.providerId);
                    const model = provider?.models.find((m) => m.slug === slot.modelSlug);
                    return (
                      <ResultCard
                        key={slot.slotId}
                        slot={slot}
                        provider={provider}
                        model={model}
                        result={results[slot.slotId]}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumGate>
  );
}
