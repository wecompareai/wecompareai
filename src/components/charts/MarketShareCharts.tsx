"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
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

// ── Consumer Market Donut ──────────────────────────────────────────────────
const CONSUMER_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#94a3b8"];

interface ConsumerSlice { name: string; share: number }

export function ConsumerPieChart({ data }: { data: ConsumerSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={75}
          outerRadius={115}
          paddingAngle={3}
          dataKey="share"
          label={({ value }) => `${value}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CONSUMER_COLORS[i % CONSUMER_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={((v: number, name: string) => [`${v}%`, name]) as AnyFn}
        />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Enterprise API Horizontal Bar Chart ───────────────────────────────────
const ENTERPRISE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f97316", "#94a3b8"];

interface EnterpriseSlice { name: string; share: number }

export function EnterpriseBarChart({ data }: { data: EnterpriseSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
        barCategoryGap="28%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 50]}
          ticks={[0, 10, 20, 30, 40, 50]}
          tick={{ fontSize: 10, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={((v: number) => [`${v}%`, "Market share"]) as AnyFn}
        />
        <Bar dataKey="share" radius={[0, 4, 4, 0]} maxBarSize={22} label={{ position: "right", fontSize: 11, formatter: ((v: number) => `${v}%`) as AnyFn }}>
          {data.map((_, i) => (
            <Cell key={i} fill={ENTERPRISE_COLORS[i % ENTERPRISE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Developer Ecosystem Bar Chart ─────────────────────────────────────────
const DEV_COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#f97316"];

interface DevItem { name: string; pct: number; note: string }

export function DevEcosystemChart({ data }: { data: DevItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
        barCategoryGap="28%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fontSize: 10, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={((v: number, _name: string, props: any) => [
            `${v}% ${props?.payload?.note ?? ""}`,
            "Adoption",
          ]) as AnyFn}
        />
        <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={22} label={{ position: "right", fontSize: 11, formatter: ((v: number) => `${v}%`) as AnyFn }}>
          {data.map((_, i) => (
            <Cell key={i} fill={DEV_COLORS[i % DEV_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Search Trends Radar ───────────────────────────────────────────────────
interface TrendItem { term: string; index: number }

export function SearchTrendsRadar({ data }: { data: TrendItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(128,128,128,0.2)" />
        <PolarAngleAxis dataKey="term" tick={{ fontSize: 11, fill: "currentColor" }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "currentColor" }} tickCount={4} />
        <Radar name="Search Index" dataKey="index" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={((v: number) => [v, "Search Index"]) as AnyFn}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
