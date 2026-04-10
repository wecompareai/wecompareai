"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type AnyFn = (...args: any[]) => any;

interface VsRadarProps {
  nameA: string;
  nameB: string;
  performance: [number, number];
  value: [number, number];
  reliability: [number, number];
  easeOfUse: [number, number];
  colorA?: string;
  colorB?: string;
}

const DEFAULT_A = "#6366f1"; // indigo
const DEFAULT_B = "#f59e0b"; // amber

export function VsRadarChart({
  nameA,
  nameB,
  performance,
  value,
  reliability,
  easeOfUse,
  colorA = DEFAULT_A,
  colorB = DEFAULT_B,
}: VsRadarProps) {
  const data = [
    { dim: "Performance", A: performance[0], B: performance[1] },
    { dim: "Value",       A: value[0],       B: value[1] },
    { dim: "Reliability", A: reliability[0], B: reliability[1] },
    { dim: "Ease of Use", A: easeOfUse[0],   B: easeOfUse[1] },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="dim"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          formatter={((value: number, name: string) => [
            value.toFixed(1),
            name === "A" ? nameA : nameB,
          ]) as AnyFn}
          contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Radar
          name="A"
          dataKey="A"
          stroke={colorA}
          fill={colorA}
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Radar
          name="B"
          dataKey="B"
          stroke={colorB}
          fill={colorB}
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Legend
          formatter={((value: string) => (value === "A" ? nameA : nameB)) as AnyFn}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
