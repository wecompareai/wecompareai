"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const WEIGHTS = [
  { name: "Performance", value: 35, color: "#3b82f6" },
  { name: "Value",       value: 30, color: "#10b981" },
  { name: "Reliability", value: 20, color: "#8b5cf6" },
  { name: "Ease of Use", value: 15, color: "#f59e0b" },
];

export function ScoreWeightDonut() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={WEIGHTS}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={105}
          paddingAngle={3}
          dataKey="value"
          label={({ value }) => `${value}%`}
          labelLine={false}
        >
          {WEIGHTS.map((w, i) => (
            <Cell key={i} fill={w.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 10,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
          formatter={((v: number, name: string) => [`${v}%`, name]) as AnyFn}
        />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
