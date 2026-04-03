"use client";

import { useMemo, useState } from "react";
import PremiumGate from "@/components/PremiumGate";

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-border cursor-pointer accent-[var(--color-primary)]"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  min = 0,
  prefix = "",
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground block">{label}</label>
      <div className="flex items-center gap-1.5">
        {prefix && (
          <span className="text-sm font-medium text-muted-foreground">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "green" | "default" | "blue" | "amber";
}) {
  const valueClass =
    color === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : color === "blue"
      ? "text-blue-600 dark:text-blue-400"
      : color === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : "text-primary";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function ROICalculatorPage() {
  // Team inputs
  const [teamSize, setTeamSize] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);

  // Task hours
  const [writingHours, setWritingHours] = useState(5);
  const [researchHours, setResearchHours] = useState(4);
  const [dataHours, setDataHours] = useState(3);
  const [codeHours, setCodeHours] = useState(2);

  // AI adoption
  const [efficiencyGain, setEfficiencyGain] = useState(40);
  const [aiCostPerUser, setAiCostPerUser] = useState(30);

  // Copy state
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const totalTaskHoursPerPersonPerWeek =
      writingHours + researchHours + dataHours + codeHours;
    const efficiency = efficiencyGain / 100;

    // Time saved
    const timeSavedHoursPerYear =
      totalTaskHoursPerPersonPerWeek * teamSize * efficiency * 52;
    const timeSavedHrsPersonWeek =
      totalTaskHoursPerPersonPerWeek * efficiency;

    // Cost saved
    const costSavedPerYear = timeSavedHoursPerYear * hourlyRate;

    // Productivity boost — extra capacity as % of total available hours
    const productivityBoost =
      hoursPerWeek > 0 && teamSize > 0
        ? (totalTaskHoursPerPersonPerWeek * efficiency) / hoursPerWeek * 100
        : 0;

    // Payback period in months
    const totalAICostPerYear = aiCostPerUser * teamSize * 12;
    const paybackMonths =
      costSavedPerYear > 0
        ? (totalAICostPerYear / costSavedPerYear) * 12
        : 0;

    // Breakdown
    const weeklyHoursSaved = totalTaskHoursPerPersonPerWeek * teamSize * efficiency;
    const monthlyHoursSaved = weeklyHoursSaved * (52 / 12);
    const annualHoursSaved = timeSavedHoursPerYear;

    const weeklyDollarSaved = weeklyHoursSaved * hourlyRate;
    const monthlyDollarSaved = monthlyHoursSaved * hourlyRate;
    const annualDollarSaved = costSavedPerYear;

    const netAnnualSaving = annualDollarSaved - totalAICostPerYear;
    const roiMultiple =
      totalAICostPerYear > 0 ? annualDollarSaved / totalAICostPerYear : 0;

    const shareText = `Our team of ${teamSize} saves ${fmt(annualHoursSaved)} hours and ${fmtCurrency(annualDollarSaved)}/year using AI. Payback period: ${paybackMonths < 1 ? "< 1 month" : paybackMonths.toFixed(1) + " months"}. Calculated at wecompareai.com/research/roi-calculator`;

    return {
      timeSavedHoursPerYear,
      timeSavedHrsPersonWeek,
      costSavedPerYear,
      productivityBoost,
      paybackMonths,
      weeklyHoursSaved,
      monthlyHoursSaved,
      annualHoursSaved,
      weeklyDollarSaved,
      monthlyDollarSaved,
      annualDollarSaved,
      totalAICostPerYear,
      netAnnualSaving,
      roiMultiple,
      shareText,
    };
  }, [
    teamSize,
    hourlyRate,
    hoursPerWeek,
    writingHours,
    researchHours,
    dataHours,
    codeHours,
    efficiencyGain,
    aiCostPerUser,
  ]);

  function handleCopy() {
    navigator.clipboard.writeText(calc.shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const paybackLabel =
    calc.paybackMonths < 1
      ? "< 1 month"
      : `${calc.paybackMonths.toFixed(1)} months`;

  return (
    <PremiumGate>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          💰 AI ROI Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Find out exactly how much time and money AI can save your team — before
          you spend a dollar.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── Left: Inputs ── */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-8">

          {/* Team section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Team
            </h2>
            <NumberInput
              label="Team size"
              value={teamSize}
              min={1}
              onChange={setTeamSize}
            />
            <NumberInput
              label="Average hourly rate"
              value={hourlyRate}
              min={1}
              prefix="$"
              onChange={setHourlyRate}
            />
            <NumberInput
              label="Working hours per week per person"
              value={hoursPerWeek}
              min={1}
              onChange={setHoursPerWeek}
            />
          </div>

          <div className="border-t border-border" />

          {/* Current AI Usage */}
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Current AI Usage
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hours per week per person spent on each task type
              </p>
            </div>
            <SliderInput
              label="Writing / drafting"
              value={writingHours}
              min={0}
              max={20}
              unit=" hrs"
              onChange={setWritingHours}
            />
            <SliderInput
              label="Research / summarising"
              value={researchHours}
              min={0}
              max={20}
              unit=" hrs"
              onChange={setResearchHours}
            />
            <SliderInput
              label="Repetitive data tasks"
              value={dataHours}
              min={0}
              max={20}
              unit=" hrs"
              onChange={setDataHours}
            />
            <SliderInput
              label="Code / debugging"
              value={codeHours}
              min={0}
              max={20}
              unit=" hrs"
              onChange={setCodeHours}
            />
          </div>

          <div className="border-t border-border" />

          {/* AI Adoption */}
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              AI Adoption
            </h2>
            <SliderInput
              label="How much faster does AI make your team?"
              value={efficiencyGain}
              min={20}
              max={80}
              unit="%"
              onChange={setEfficiencyGain}
            />
            <NumberInput
              label="Monthly AI subscription cost per person"
              value={aiCostPerUser}
              min={0}
              prefix="$"
              onChange={setAiCostPerUser}
            />
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="space-y-6">

          {/* 4 metric cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Time Saved"
              value={`${fmt(calc.timeSavedHoursPerYear)} hrs/year`}
              sub={`${calc.timeSavedHrsPersonWeek.toFixed(1)} hrs/person/week`}
              color="blue"
            />
            <MetricCard
              label="Cost Saved"
              value={fmtCurrency(calc.costSavedPerYear) + "/year"}
              sub="based on your hourly rate"
              color="green"
            />
            <MetricCard
              label="Productivity Boost"
              value={`+${calc.productivityBoost.toFixed(1)}% capacity`}
              sub="extra output per person"
              color="amber"
            />
            <MetricCard
              label="Payback Period"
              value={paybackLabel}
              sub="until AI pays for itself"
              color="default"
            />
          </div>

          {/* Breakdown table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/50">
              <h3 className="text-sm font-semibold text-foreground">
                Full Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Weekly
                    </th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Monthly
                    </th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Annual
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Hours saved</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {fmt(calc.weeklyHoursSaved)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {fmt(calc.monthlyHoursSaved)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {fmt(calc.annualHoursSaved)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-muted-foreground">Cost saved</td>
                    <td className="px-5 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {fmtCurrency(calc.weeklyDollarSaved)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {fmtCurrency(calc.monthlyDollarSaved)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {fmtCurrency(calc.annualDollarSaved)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-border divide-y divide-border">
              {[
                {
                  label: "Total AI investment/year",
                  value: fmtCurrency(calc.totalAICostPerYear),
                  valueClass: "text-rose-600 dark:text-rose-400",
                },
                {
                  label: "Net annual saving",
                  value: fmtCurrency(calc.netAnnualSaving),
                  valueClass:
                    calc.netAnnualSaving >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                },
                {
                  label: "ROI multiple",
                  value: `${calc.roiMultiple.toFixed(1)}×`,
                  valueClass: "text-primary font-bold",
                },
              ].map(({ label, value, valueClass }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${valueClass}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Share results */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Share Your Results
            </h3>
            <textarea
              readOnly
              value={calc.shareText}
              rows={3}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground resize-none focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy to clipboard
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center px-2">
            Estimates are based on industry averages. Actual results vary by
            team, tools, and workflow.
          </p>
        </div>
      </div>
    </div>
    </PremiumGate>
  );
}
