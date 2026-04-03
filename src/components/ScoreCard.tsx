import { ToolScore, SCORE_DIMENSIONS } from "@/lib/scores";
import Link from "next/link";

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-6 text-right tabular-nums">{value}</span>
    </div>
  );
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

export function ScoreCard({ score, compact = false }: { score: ToolScore; compact?: boolean }) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold ${scoreBg(score.overall)} ${scoreColor(score.overall)}`}>
        <span>★</span>
        <span>{score.overall}/10</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-foreground">{score.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{score.provider} · {score.category}</div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${scoreColor(score.overall)}`}>
          {score.overall}
          <span className="text-sm font-normal text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-2.5">
        {SCORE_DIMENSIONS.map((dim) => (
          <div key={dim.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{dim.label}</span>
            </div>
            <ScoreBar value={score[dim.key]} color={dim.color} />
          </div>
        ))}
      </div>

      {/* Verdict */}
      <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed">
        {score.verdict}
      </p>

      <div className="text-[10px] text-muted-foreground/60">
        Last verified: {score.lastUpdated} ·{" "}
        <Link href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">
          How we score →
        </Link>
      </div>
    </div>
  );
}

export function ScoreRow({ score }: { score: ToolScore }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${scoreBg(score.overall)}`}>
        <span className={`text-lg font-bold tabular-nums ${scoreColor(score.overall)}`}>{score.overall}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-foreground">{score.name}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted border border-border">{score.category}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {SCORE_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${dim.color} shrink-0`} />
              {score[dim.key]}
            </div>
          ))}
        </div>
      </div>
      <p className="hidden lg:block text-xs text-muted-foreground max-w-xs leading-relaxed">{score.verdict}</p>
    </div>
  );
}
