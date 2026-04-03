"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_SCORES, CATEGORIES, SCORE_DIMENSIONS, type ToolScore } from "@/lib/scores";
import { ScoreCard } from "@/components/ScoreCard";
import { RatingsSummary } from "@/components/StarRating";

const SORT_OPTIONS = [
  { value: "overall",     label: "Overall Score" },
  { value: "performance", label: "Performance" },
  { value: "value",       label: "Best Value" },
  { value: "reliability", label: "Reliability" },
  { value: "easeOfUse",   label: "Ease of Use" },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["value"];

function medalFor(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

function scoreColor(score: number) {
  if (score >= 9.0) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 8.0) return "text-blue-600 dark:text-blue-400";
  if (score >= 7.0) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function scoreBg(score: number) {
  if (score >= 9.0) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 8.0) return "bg-blue-500/10 border-blue-500/30";
  if (score >= 7.0) return "bg-amber-500/10 border-amber-500/30";
  return "bg-rose-500/10 border-rose-500/30";
}

export default function RankingsPage() {
  const [category, setCategory] = useState<string>("All");
  const [sortBy, setSortBy]     = useState<SortKey>("overall");
  const [selected, setSelected] = useState<ToolScore | null>(null);

  const filtered = ALL_SCORES
    .filter((s) => category === "All" || s.category === category)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI Rankings</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">AI Tool Rankings</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Every major AI tool scored across 4 dimensions: Performance, Value, Reliability, and Ease of Use. Updated in real-time.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {ALL_SCORES.length} tools scored
          </span>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
            How we score →
          </Link>
        </div>
      </div>

      {/* Score Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dimensions:</span>
        {SCORE_DIMENSIONS.map((d) => (
          <div key={d.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${d.color}`} />
            <span className="font-medium text-foreground">{d.label}</span>
            <span>— {d.desc}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category */}
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>Sort by: {opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rankings List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((tool, idx) => {
            const medal = medalFor(idx + 1);
            const isSelected = selected?.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelected(isSelected ? null : tool)}
                className={`w-full text-left rounded-xl border transition-all p-4 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-9 shrink-0 text-center">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">#{idx + 1}</span>
                    )}
                  </div>

                  {/* Score badge */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${scoreBg(tool[sortBy])}`}>
                    <span className={`text-base font-bold tabular-nums ${scoreColor(tool[sortBy])}`}>
                      {tool[sortBy]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{tool.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{tool.category}</span>
                      <span className="text-[10px] text-muted-foreground">{tool.provider}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {SCORE_DIMENSIONS.map((dim) => (
                        <div key={dim.key} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full ${dim.color} shrink-0`} />
                          <span className="hidden sm:inline text-muted-foreground/60">{dim.label.split(" ")[0]}</span>
                          <span className={`font-medium ${isSelected && sortBy === dim.key ? "text-primary" : ""}`}>
                            {tool[dim.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall */}
                  <div className="text-right shrink-0">
                    <div className={`text-xl font-bold tabular-nums ${scoreColor(tool.overall)}`}>{tool.overall}</div>
                    <div className="text-[10px] text-muted-foreground">overall</div>
                  </div>
                </div>

                {/* Verdict */}
                <p className="mt-2.5 text-xs text-muted-foreground text-left pl-12">{tool.verdict}</p>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selected ? (
              <div className="space-y-4">
                <ScoreCard score={selected} />
                <RatingsSummary toolId={selected.id} toolName={selected.name} />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-2">
                <div className="text-3xl">☝️</div>
                <p className="text-sm text-muted-foreground">Click any tool to see its full score breakdown</p>
              </div>
            )}

            {/* Scoring methodology note */}
            <div className="mt-4 rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="text-xs font-semibold text-foreground">Score Methodology</div>
              <div className="space-y-1.5">
                {SCORE_DIMENSIONS.map((d) => (
                  <div key={d.key} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${d.color} mt-1 shrink-0`} />
                    <span><strong className="text-foreground">{d.label}</strong> — {d.desc}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground pt-1 border-t border-border">
                Overall = Perf 35% + Value 30% + Reliability 20% + Ease 15%
              </div>
              <Link href="/methodology" className="text-xs text-primary hover:underline underline-offset-2">
                Full methodology →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Want a personalized recommendation?</h3>
          <p className="text-sm text-muted-foreground mt-1">Answer 6 questions and get your perfect AI stack based on your budget, use case, and skill level.</p>
        </div>
        <Link href="/research/finder" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Try AI Tool Finder →
        </Link>
      </div>
    </div>
  );
}
