"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

const RADAR_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#f97316"];

interface ToolRadarData {
  name: string;
  performance: number;
  value: number;
  reliability: number;
  easeOfUse: number;
}

export function LeaderboardRadar({ tools }: { tools: ToolRadarData[] }) {
  const dims = [
    { key: "performance", label: "Performance" },
    { key: "value",       label: "Value" },
    { key: "reliability", label: "Reliability" },
    { key: "easeOfUse",   label: "Ease of Use" },
  ];

  // Reshape for recharts RadarChart: one row per dimension
  const data = dims.map((d) => {
    const row: Record<string, string | number> = { subject: d.label };
    tools.forEach((t) => { row[t.name] = t[d.key as keyof ToolRadarData] as number; });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(128,128,128,0.2)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "currentColor" }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tickCount={4} tick={{ fontSize: 9, fill: "currentColor" }} />
        {tools.map((t, i) => (
          <Radar
            key={t.name}
            name={t.name}
            dataKey={t.name}
            stroke={RADAR_COLORS[i % RADAR_COLORS.length]}
            fill={RADAR_COLORS[i % RADAR_COLORS.length]}
            fillOpacity={0.12}
            strokeWidth={2}
          />
        ))}
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={((v: number, name: string) => [v.toFixed(1), name]) as AnyFn}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
