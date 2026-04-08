"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ToolScore } from "@/lib/scores";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

// ── Grouped bar chart: compare up to ~8 tools across all 4 dimensions ──
interface ScoreBarChartProps {
  tools: ToolScore[];
  highlightId?: string;
  height?: number;
}

const DIM_COLORS: Record<string, string> = {
  performance: "#3b82f6", // blue-500
  value:       "#10b981", // emerald-500
  reliability: "#8b5cf6", // violet-500
  easeOfUse:   "#f59e0b", // amber-500
};

const DIM_LABELS: Record<string, string> = {
  performance: "Performance",
  value:       "Value",
  reliability: "Reliability",
  easeOfUse:   "Ease of Use",
};

export function ScoreBarChart({ tools, highlightId, height = 260 }: ScoreBarChartProps) {
  const data = tools.map((t) => ({
    name:        t.name.length > 14 ? t.name.slice(0, 14) + "…" : t.name,
    fullName:    t.name,
    overall:     t.overall,
    performance: t.performance,
    value:       t.value,
    reliability: t.reliability,
    easeOfUse:   t.easeOfUse,
    id:          t.id,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fontSize: 10, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 10,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
          formatter={((value: number, name: string) => [
            typeof value === "number" ? value.toFixed(1) : value,
            DIM_LABELS[name] ?? name,
          ]) as AnyFn}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          formatter={(value) => DIM_LABELS[value] ?? value}
        />
        {(["performance", "value", "reliability", "easeOfUse"] as const).map((dim) => (
          <Bar key={dim} dataKey={dim} fill={DIM_COLORS[dim]} radius={[3, 3, 0, 0]} maxBarSize={18}>
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fillOpacity={highlightId && entry.id !== highlightId ? 0.35 : 1}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Overall score only — horizontal bars for quick ranking view ──
interface OverallBarChartProps {
  tools: ToolScore[];
  height?: number;
}

function scoreColor(score: number): string {
  if (score >= 9.0) return "#10b981";
  if (score >= 8.0) return "#3b82f6";
  if (score >= 7.0) return "#f59e0b";
  return "#ef4444";
}

export function OverallBarChart({ tools, height }: OverallBarChartProps) {
  const data = tools
    .slice(0, 8)
    .sort((a, b) => b.overall - a.overall)
    .map((t) => ({
      name:    t.name.length > 16 ? t.name.slice(0, 16) + "…" : t.name,
      overall: t.overall,
      color:   scoreColor(t.overall),
    }));

  const barHeight = 32;
  const chartHeight = height ?? Math.max(160, data.length * barHeight + 40);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 40, left: 4, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fontSize: 10, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 10,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
          formatter={((v: number) => [v.toFixed(1), "Overall Score"]) as AnyFn}
        />
        <Bar dataKey="overall" radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: "right", fontSize: 11, formatter: ((v: number) => v.toFixed(1)) as AnyFn }}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Mini comparison: just overall score bars for 2–5 tools (used in best-for / alternatives) ──
interface MiniScoreChartProps {
  tools: { name: string; overall: number; performance?: number; value?: number; reliability?: number; easeOfUse?: number }[];
}

export function MiniScoreChart({ tools }: MiniScoreChartProps) {
  const dims = ["overall", "performance", "value", "reliability", "easeOfUse"] as const;
  const available = dims.filter((d) => tools.every((t) => t[d] !== undefined));

  const data = tools.map((t) => ({
    name:        t.name.length > 12 ? t.name.slice(0, 12) + "…" : t.name,
    overall:     t.overall,
    performance: t.performance,
    value:       t.value,
    reliability: t.reliability,
    easeOfUse:   t.easeOfUse,
  }));

  const bars = available.length > 1
    ? available.filter((d) => d !== "overall")
    : ["overall"];

  const colors: Record<string, string> = {
    overall:     "#6366f1",
    performance: "#3b82f6",
    value:       "#10b981",
    reliability: "#8b5cf6",
    easeOfUse:   "#f59e0b",
  };

  const labels: Record<string, string> = {
    overall:     "Overall",
    performance: "Performance",
    value:       "Value",
    reliability: "Reliability",
    easeOfUse:   "Ease of Use",
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 10, fill: "currentColor" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 10,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
          formatter={((v: number, name: string) => [typeof v === "number" ? v.toFixed(1) : "—", labels[name] ?? name]) as AnyFn}
        />
        {bars.length > 1 && (
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 6 }} formatter={(v) => labels[v] ?? v} />
        )}
        {bars.map((dim) => (
          <Bar key={dim} dataKey={dim} fill={colors[dim]} radius={[3, 3, 0, 0]} maxBarSize={22} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
