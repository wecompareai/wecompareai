"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ALL_SCORES, CATEGORIES, SCORE_DIMENSIONS, type ToolScore } from "@/lib/scores";
import { ScoreCard } from "@/components/ScoreCard";
import { RatingsSummary } from "@/components/StarRating";
import { ScoreBarChart, OverallBarChart } from "@/components/charts/ScoreBarChart";

const SORT_OPTIONS = [
  { value: "overall",     label: "Overall" },
  { value: "performance", label: "Performance" },
  { value: "value",       label: "Value" },
  { value: "reliability", label: "Reliability" },
  { value: "easeOfUse",   label: "Ease of Use" },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["value"];
type ChartView = "overall" | "breakdown";

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
  const searchParams = useSearchParams();
  const [category, setCategory]   = useState<string>(searchParams.get("category") ?? "All");
  const [sortBy, setSortBy]       = useState<SortKey>("overall");
  const [selected, setSelected]   = useState<ToolScore | null>(null);
  const [chartView, setChartView] = useState<ChartView>("overall");

  const filtered = ALL_SCORES
    .filter((s) => category === "All" || s.category === category)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  // Top 8 for chart (keep chart readable)
  const chartTools = filtered.slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Rankings</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">AI Tool Rankings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {ALL_SCORES.length} tools · 4 dimensions · weighted scoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
            ))}
          </select>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2">
            Methodology →
          </Link>
        </div>
      </div>

      {/* Category filter */}
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

      {/* ── Chart Panel ── */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {category === "All" ? "Top 8 Overall" : `${category} — Top 8`}
          </p>
          <div className="flex gap-1">
            {(["overall", "breakdown"] as ChartView[]).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  chartView === v
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "overall" ? "Overall Score" : "4 Dimensions"}
              </button>
            ))}
          </div>
        </div>

        {chartView === "overall" ? (
          <OverallBarChart tools={chartTools} />
        ) : (
          <ScoreBarChart tools={chartTools} highlightId={selected?.id} height={280} />
        )}

        {/* Dimension legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-border">
          {SCORE_DIMENSIONS.map((d) => (
            <span key={d.key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${d.color}`} />
              <strong className="text-foreground">{d.label}</strong>
              <span className="hidden sm:inline">({d.key === "performance" ? "35%" : d.key === "value" ? "30%" : d.key === "reliability" ? "20%" : "15%"})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main grid: list + detail panel ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Rankings list */}
        <div className="lg:col-span-2 space-y-1.5">
          {filtered.map((tool, idx) => {
            const medal = medalFor(idx + 1);
            const isSelected = selected?.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelected(isSelected ? null : tool)}
                className={`w-full text-left rounded-xl border transition-all p-3 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center">
                    {medal ? (
                      <span className="text-lg">{medal}</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                    )}
                  </div>

                  {/* Score badge */}
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${scoreBg(tool[sortBy])}`}>
                    <span className={`text-sm font-bold tabular-nums ${scoreColor(tool[sortBy])}`}>
                      {tool[sortBy]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{tool.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{tool.category}</span>
                    </div>
                    {/* Mini score bars inline */}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {SCORE_DIMENSIONS.map((dim) => (
                        <div key={dim.key} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full ${dim.color} shrink-0`} />
                          <span className={`font-medium tabular-nums ${isSelected && sortBy === dim.key ? "text-primary" : ""}`}>
                            {tool[dim.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall score */}
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-bold tabular-nums ${scoreColor(tool.overall)}`}>{tool.overall}</div>
                    <div className="text-[10px] text-muted-foreground">/ 10</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {selected ? (
              <>
                <ScoreCard score={selected} />
                <RatingsSummary toolId={selected.id} toolName={selected.name} />
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-2">
                <div className="text-2xl">☝️</div>
                <p className="text-xs text-muted-foreground">Click any tool for full breakdown</p>
              </div>
            )}

            {/* Weight note */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-2">
              <div className="text-xs font-semibold text-foreground">Score Weights</div>
              <div className="grid grid-cols-2 gap-1.5">
                {SCORE_DIMENSIONS.map((d) => (
                  <div key={d.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${d.color} shrink-0`} />
                    <span className="text-foreground font-medium">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground pt-1 border-t border-border">
                Perf 35% · Value 30% · Reliability 20% · Ease 15%
              </div>
              <Link href="/methodology" className="text-xs text-primary hover:underline underline-offset-2 block">
                Full methodology →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground">Get a personalized recommendation</h3>
          <p className="text-xs text-muted-foreground mt-0.5">6 questions → your perfect AI stack.</p>
        </div>
        <Link href="/research/finder" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
          Try AI Finder →
        </Link>
      </div>
    </div>
  );
}
