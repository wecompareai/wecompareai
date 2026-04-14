"use client";

import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { ScoreBarChart } from "@/components/charts/ScoreBarChart";
import type { ToolScore } from "@/lib/scores";

// ── helpers ──────────────────────────────────────────────────────────────────

function overallColor(score: number) {
  if (score >= 9.0) return "#10b981"; // emerald
  if (score >= 8.5) return "#3b82f6"; // blue
  if (score >= 8.0) return "#6366f1"; // indigo
  if (score >= 7.0) return "#f59e0b"; // amber
  return "#ef4444";                   // red
}

const DIM_COLORS: Record<string, string> = {
  Performance: "#3b82f6",
  Value:       "#10b981",
  Reliability: "#8b5cf6",
  Ease:        "#f59e0b",
};

// ── mini single-tool radar ───────────────────────────────────────────────────

function MiniRadar({ tool }: { tool: ToolScore }) {
  const data = [
    { dim: "Performance", v: tool.performance },
    { dim: "Value",       v: tool.value       },
    { dim: "Ease",        v: tool.easeOfUse   },
    { dim: "Reliability", v: tool.reliability  },
  ];
  const color = overallColor(tool.overall);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="rgba(128,128,128,0.18)" />
        <PolarAngleAxis
          dataKey="dim"
          tick={({ x, y, payload }: any) => (
            <text
              x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize={9} fill="currentColor" opacity={0.6}
            >
              {payload.value}
            </text>
          )}
        />
        <Radar dataKey="v" stroke={color} fill={color} fillOpacity={0.22} strokeWidth={1.5} dot={false} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── score card ───────────────────────────────────────────────────────────────

function ScoreCard({ tool }: { tool: ToolScore }) {
  const color = overallColor(tool.overall);

  return (
    <div className="flex-shrink-0 w-[220px] rounded-xl border border-border bg-card p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-bold text-foreground truncate">{tool.name}</div>
          <div className="text-[10px] text-muted-foreground">{tool.provider} · {tool.category}</div>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-extrabold tabular-nums leading-none" style={{ color }}>{tool.overall.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground">/10</span>
        </div>
      </div>

      {/* Mini radar */}
      <MiniRadar tool={tool} />

      {/* Score rows */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
        {[
          { label: "Performance", value: tool.performance, color: DIM_COLORS.Performance },
          { label: "Value",       value: tool.value,       color: DIM_COLORS.Value       },
          { label: "Reliability", value: tool.reliability, color: DIM_COLORS.Reliability },
          { label: "Ease of Use", value: tool.easeOfUse,  color: DIM_COLORS.Ease        },
        ].map((d) => (
          <div key={d.label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="ml-auto font-bold tabular-nums" style={{ color: d.color }}>{d.value.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-border pt-2">{tool.verdict}</p>

      {/* Footer */}
      <div className="text-[9px] text-muted-foreground/60 flex items-center justify-between pt-1">
        <span>Updated {tool.lastUpdated}</span>
        <Link href="/research/methodology" className="text-primary hover:underline">Methodology →</Link>
      </div>
    </div>
  );
}

// ── main export ──────────────────────────────────────────────────────────────

interface Props {
  tools: ToolScore[];
}

export function ScoresAtAGlance({ tools }: Props) {
  const llmCards = tools
    .filter((t) => t.category === "LLM")
    .sort((a, b) => b.overall - a.overall);

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Scores at a Glance</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin scrollbar-thumb-border">
        {llmCards.map((tool) => (
          <ScoreCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export function ScoreBreakdownChart({ tools }: Props) {
  const topLLMs = tools
    .filter((t) => t.category === "LLM")
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 7);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Score Breakdown</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Weighted: Performance 35% · Value 30% · Reliability 20% · Ease of Use 15%
          </p>
        </div>
        <Link
          href="/rankings"
          className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
        >
          Full rankings →
        </Link>
      </div>
      <div className="px-3 pb-4">
        <ScoreBarChart tools={topLLMs} height={240} />
      </div>
    </div>
  );
}
