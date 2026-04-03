"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "release" | "pricing" | "deprecation" | "api";
type Impact = "high" | "medium" | "low";

type TimelineEvent = {
  date: string;
  type: EventType;
  model: string;
  vendor: string;
  title: string;
  description: string;
  impact: Impact;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENTS: TimelineEvent[] = [
  {
    date: "March 2026",
    type: "release",
    model: "Claude 3.7 Sonnet",
    vendor: "Anthropic",
    title: "Claude 3.7 Sonnet Released",
    description: "Introduces extended thinking mode with visible chain-of-thought reasoning. 200k token context window. Outperforms GPT-4o on SWE-bench coding tasks and complex multi-step reasoning.",
    impact: "high",
  },
  {
    date: "March 2026",
    type: "release",
    model: "GPT-4.1",
    vendor: "OpenAI",
    title: "GPT-4.1 Released",
    description: "Dramatically improved coding performance, reaching 54.6% on SWE-bench Verified. 1M token context window. Replaces GPT-4o as OpenAI's flagship model.",
    impact: "high",
  },
  {
    date: "February 2026",
    type: "pricing",
    model: "Gemini 2.0 Flash",
    vendor: "Google",
    title: "Gemini 2.0 Flash Pricing Cut 50%",
    description: "Google slashes Gemini 2.0 Flash pricing by 50%, now at $0.075/M input and $0.30/M output tokens. Remains one of the fastest and most cost-effective models available.",
    impact: "medium",
  },
  {
    date: "February 2026",
    type: "release",
    model: "Llama 3.3 70B",
    vendor: "Meta",
    title: "Llama 3.3 70B Released — Open Source",
    description: "Meta releases Llama 3.3 70B, an open-source model that matches GPT-4o performance on key benchmarks at a fraction of the cost. Supports 128k context and multilingual tasks.",
    impact: "high",
  },
  {
    date: "January 2026",
    type: "release",
    model: "OpenAI o3-mini",
    vendor: "OpenAI",
    title: "o3-mini Released — Affordable Reasoning",
    description: "OpenAI launches o3-mini, a cost-efficient reasoning model. Three effort levels (low/medium/high). Outperforms o1 on math and science benchmarks at significantly lower cost.",
    impact: "high",
  },
  {
    date: "January 2026",
    type: "pricing",
    model: "DeepSeek V3",
    vendor: "DeepSeek",
    title: "DeepSeek V3 Launches at $0.27/M Input Tokens",
    description: "DeepSeek V3 debuts with aggressive pricing at $0.27/M input and $1.10/M output tokens. Delivers GPT-4o-class performance, triggering a global AI pricing response.",
    impact: "high",
  },
  {
    date: "December 2025",
    type: "release",
    model: "Gemini 2.0 Pro",
    vendor: "Google",
    title: "Gemini 2.0 Pro Released",
    description: "Google's most capable Gemini model yet. Native multimodal reasoning, 2M token context, improved agentic capabilities, and tighter Workspace integration.",
    impact: "high",
  },
  {
    date: "December 2025",
    type: "api",
    model: "GPT-4o",
    vendor: "OpenAI",
    title: "GPT-4o Context Window Increased to 128k",
    description: "OpenAI doubles the GPT-4o context window from 64k to 128k tokens across all API tiers, with no pricing change. Enables longer document processing without chunking.",
    impact: "medium",
  },
  {
    date: "November 2025",
    type: "release",
    model: "Claude 3.5 Haiku",
    vendor: "Anthropic",
    title: "Claude 3.5 Haiku Released — Fast & Affordable",
    description: "Anthropic's fastest and most affordable Claude model. Processes 200k token context at sub-second latency. Matches Claude 3 Opus performance at 10x lower cost.",
    impact: "medium",
  },
  {
    date: "November 2025",
    type: "pricing",
    model: "Mistral Large 2",
    vendor: "Mistral AI",
    title: "Mistral Large 2 Pricing Reduced 30%",
    description: "Mistral AI reduces Mistral Large 2 pricing by 30%, now at $2/M input and $6/M output tokens. Aims to compete directly with GPT-4o on cost-performance ratio.",
    impact: "medium",
  },
  {
    date: "October 2025",
    type: "deprecation",
    model: "GPT-4",
    vendor: "OpenAI",
    title: "GPT-4 Deprecated — Migration Required",
    description: "OpenAI officially deprecates GPT-4 (gpt-4-0314, gpt-4-0613). All API calls must migrate to GPT-4o or GPT-4 Turbo. Legacy endpoints return errors after this date.",
    impact: "high",
  },
  {
    date: "October 2025",
    type: "release",
    model: "Llama 3.2",
    vendor: "Meta",
    title: "Llama 3.2 Multimodal Models Released",
    description: "Meta releases Llama 3.2 with 11B and 90B vision variants. First open-source Llama models with native image understanding. 128k context. Released under Meta Llama 3.2 license.",
    impact: "high",
  },
  {
    date: "September 2025",
    type: "release",
    model: "OpenAI o1",
    vendor: "OpenAI",
    title: "OpenAI o1 Released — Reasoning-First Model",
    description: "OpenAI launches o1, a model trained to reason before responding. Thinks through problems for up to 30 seconds. Tops AIME, GPQA, and Codeforces rankings. Available in ChatGPT Plus.",
    impact: "high",
  },
  {
    date: "August 2025",
    type: "release",
    model: "Claude 3.5 Sonnet",
    vendor: "Anthropic",
    title: "Claude 3.5 Sonnet with Computer Use",
    description: "Anthropic releases the upgraded Claude 3.5 Sonnet with computer use capability in public beta. Can control desktop apps, browse the web, and write/execute code autonomously.",
    impact: "high",
  },
  {
    date: "July 2025",
    type: "api",
    model: "Gemini 1.5 Pro",
    vendor: "Google",
    title: "Gemini 1.5 Pro Reaches 2M Token Context",
    description: "Google expands Gemini 1.5 Pro's context window to 2 million tokens — the largest context window of any production LLM. Enables processing of entire codebases or books in a single call.",
    impact: "high",
  },
  {
    date: "June 2025",
    type: "pricing",
    model: "GPT-4o",
    vendor: "OpenAI",
    title: "GPT-4o Pricing Cut 50%",
    description: "OpenAI halves GPT-4o pricing to $5/M input and $15/M output tokens. Responds to increased competition from Gemini and Claude. Batch API discounts increased to 50% off.",
    impact: "high",
  },
  {
    date: "May 2025",
    type: "release",
    model: "Mistral Large 2",
    vendor: "Mistral AI",
    title: "Mistral Large 2 Released",
    description: "Mistral AI releases Mistral Large 2 with 128k context, improved multilingual support (13 languages), and strong coding capabilities. Benchmarks competitive with Claude 3.5 Sonnet.",
    impact: "medium",
  },
  {
    date: "April 2025",
    type: "release",
    model: "Llama 3.1 405B",
    vendor: "Meta",
    title: "Llama 3.1 405B Released — Largest Open Source LLM",
    description: "Meta releases Llama 3.1 405B, the largest open-source model ever. 128k context, competitive with GPT-4o on MMLU. Available for self-hosting and via major cloud providers.",
    impact: "high",
  },
  {
    date: "March 2025",
    type: "deprecation",
    model: "Claude 3 Haiku",
    vendor: "Anthropic",
    title: "Claude 3 Haiku Deprecated",
    description: "Anthropic deprecates the original Claude 3 Haiku in favour of Claude 3.5 Haiku. Existing API users receive a 30-day migration window. Pricing remains the same for the new version.",
    impact: "low",
  },
  {
    date: "February 2025",
    type: "pricing",
    model: "Gemini 1.5 Flash",
    vendor: "Google",
    title: "Gemini 1.5 Flash at $0.075/M Input Tokens",
    description: "Google prices Gemini 1.5 Flash at $0.075/M input and $0.30/M output tokens for prompts under 128k. Makes production-scale deployments of fast multimodal AI cost-accessible.",
    impact: "medium",
  },
  {
    date: "January 2025",
    type: "api",
    model: "GPT-4o",
    vendor: "OpenAI",
    title: "GPT-4o Structured Outputs Becomes Generally Available",
    description: "OpenAI makes Structured Outputs GA, allowing JSON schema-constrained responses with 100% reliability. Eliminates the need for custom parsing layers in production applications.",
    impact: "medium",
  },
  {
    date: "December 2024",
    type: "release",
    model: "Gemini 2.0 Flash Experimental",
    vendor: "Google",
    title: "Gemini 2.0 Flash Experimental Released",
    description: "Google releases Gemini 2.0 Flash in experimental access, introducing native audio output, real-time streaming, and agentic tool-use. Marks start of the Gemini 2.0 era.",
    impact: "high",
  },
  {
    date: "November 2024",
    type: "release",
    model: "Claude 3.5 Sonnet (v1)",
    vendor: "Anthropic",
    title: "Claude 3.5 Sonnet — Initial Release",
    description: "Anthropic's first 3.5-series model. Topped the LMSYS chatbot arena for multiple months. Best-in-class coding at the time, surpassing GPT-4o on HumanEval and SWE-bench.",
    impact: "high",
  },
  {
    date: "October 2024",
    type: "api",
    model: "Multiple",
    vendor: "OpenAI",
    title: "OpenAI Realtime API Released",
    description: "OpenAI launches the Realtime API for low-latency speech-to-speech conversations. Enables building voice agents without a separate STT+TTS pipeline. Priced at $0.06/min input audio.",
    impact: "medium",
  },
  {
    date: "September 2024",
    type: "pricing",
    model: "Claude 3 Haiku",
    vendor: "Anthropic",
    title: "Claude 3 Haiku Price Reduction — 80% Cut",
    description: "Anthropic reduces Claude 3 Haiku pricing by 80%, to $0.25/M input and $1.25/M output. One of the most aggressive price cuts in LLM history, establishing Haiku as the budget leader.",
    impact: "high",
  },
];

// ─── Styling maps ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<EventType, { label: string; dot: string; badge: string; badgeText: string; border: string }> = {
  release:     { label: "Release",     dot: "bg-emerald-500", badge: "bg-emerald-500/10", badgeText: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
  pricing:     { label: "Pricing",     dot: "bg-blue-500",    badge: "bg-blue-500/10",    badgeText: "text-blue-600 dark:text-blue-400",       border: "border-l-blue-500"    },
  deprecation: { label: "Deprecated",  dot: "bg-rose-500",    badge: "bg-rose-500/10",    badgeText: "text-rose-600 dark:text-rose-400",       border: "border-l-rose-500"    },
  api:         { label: "API Change",  dot: "bg-violet-500",  badge: "bg-violet-500/10",  badgeText: "text-violet-600 dark:text-violet-400",   border: "border-l-violet-500"  },
};

const IMPACT_CONFIG: Record<Impact, { label: string; badge: string; text: string }> = {
  high:   { label: "High impact",   badge: "bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400"  },
  medium: { label: "Medium impact", badge: "bg-slate-500/10",  text: "text-slate-600 dark:text-slate-400"  },
  low:    { label: "Low impact",    badge: "bg-zinc-500/10",   text: "text-zinc-600 dark:text-zinc-400"    },
};

const FILTER_TABS: { label: string; value: EventType | "all" }[] = [
  { label: "All",          value: "all"        },
  { label: "Releases",     value: "release"    },
  { label: "Pricing",      value: "pricing"    },
  { label: "Deprecations", value: "deprecation"},
  { label: "API Changes",  value: "api"        },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total events tracked", value: EVENTS.length.toString() },
  { label: "Price changes",        value: EVENTS.filter((e) => e.type === "pricing").length.toString() },
  { label: "Deprecations",         value: EVENTS.filter((e) => e.type === "deprecation").length.toString() },
  { label: "Last updated",         value: "March 30, 2026" },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function ModelTrackerPage() {
  const [activeFilter, setActiveFilter] = useState<EventType | "all">("all");

  const filtered = activeFilter === "all"
    ? EVENTS
    : EVENTS.filter((e) => e.type === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* ── Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            📡 Model Update Tracker
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          The AI changelog you wish existed. Every release, price change, and deprecation — in one place.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 space-y-1">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter events by type">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          const count = tab.value === "all"
            ? EVENTS.length
            : EVENTS.filter((e) => e.type === tab.value).length;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${isActive ? "opacity-70" : "opacity-50"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Timeline ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No events match this filter.</div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" aria-hidden="true" />

          <div className="space-y-6 pl-12">
            {filtered.map((event, index) => {
              const tc = TYPE_CONFIG[event.type];
              const ic = IMPACT_CONFIG[event.impact];
              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[2.35rem] top-4 w-3 h-3 rounded-full ring-2 ring-background ${tc.dot}`}
                    aria-hidden="true"
                  />

                  {/* Event card */}
                  <div className={`rounded-xl border border-border bg-card border-l-4 ${tc.border} p-5 space-y-3 hover:shadow-sm transition-shadow`}>

                    {/* Top row: date + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {event.date}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.badge} ${tc.badgeText}`}>
                        {tc.label}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ic.badge} ${ic.text}`}>
                        {ic.label}
                      </span>
                    </div>

                    {/* Title + vendor/model */}
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-foreground leading-snug">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {event.vendor} &mdash; {event.model}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {EVENTS.length} events. Data last updated March 30, 2026.
        </p>
      </div>
    </div>
  );
}
