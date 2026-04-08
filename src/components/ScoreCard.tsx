"use client";

import { ToolScore, SCORE_DIMENSIONS } from "@/lib/scores";
import Link from "next/link";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

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

function radarFill(score: number) {
  if (score >= 9.0) return "#10b981";
  if (score >= 8.0) return "#3b82f6";
  if (score >= 7.0) return "#f59e0b";
  return "#ef4444";
}

export function ScoreCard({ score, compact = false }: { score: ToolScore; compact?: boolean }) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold ${scoreBg(score.overall)} ${scoreColor(score.overall)}`}>
        <span>★</span>
        <span>{score.overall}/10</span>
      </div>
    );
  }

  const radarData = SCORE_DIMENSIONS.map((dim) => ({
    subject: dim.label.split(" ")[0], // shorter label for radar
    value:   score[dim.key],
    fullMark: 10,
  }));

  const fill = radarFill(score.overall);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm text-foreground">{score.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{score.provider} · {score.category}</div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${scoreColor(score.overall)}`}>
          {score.overall}
          <span className="text-xs font-normal text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Radar chart */}
      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={radarData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <PolarGrid stroke="rgba(128,128,128,0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: "currentColor" }}
          />
          <Radar
            name={score.name}
            dataKey="value"
            stroke={fill}
            fill={fill}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 11,
              color: "hsl(var(--foreground))",
            }}
            formatter={((v: number) => [v.toFixed(1), "Score"]) as AnyFn}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Dimension scores — compact grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {SCORE_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${dim.color} shrink-0`} />
              {dim.label}
            </div>
            <span className="font-semibold tabular-nums text-foreground">{score[dim.key]}</span>
          </div>
        ))}
      </div>

      {/* Verdict — keep it short */}
      <p className="text-xs text-muted-foreground border-t border-border pt-2 leading-snug line-clamp-2">
        {score.verdict}
      </p>

      <div className="text-[10px] text-muted-foreground/60">
        Updated {score.lastUpdated} ·{" "}
        <Link href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">
          Methodology →
        </Link>
      </div>
    </div>
  );
}

export function ScoreRow({ score }: { score: ToolScore }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${scoreBg(score.overall)}`}>
        <span className={`text-sm font-bold tabular-nums ${scoreColor(score.overall)}`}>{score.overall}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-foreground">{score.name}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted border border-border">{score.category}</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {SCORE_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${dim.color} shrink-0`} />
              <span className="tabular-nums font-medium">{score[dim.key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
