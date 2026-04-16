"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    label: "Primary use",
    options: [
      { value: "coding",        label: "💻 Coding" },
      { value: "writing",       label: "✍️ Writing" },
      { value: "images",        label: "🎨 Images" },
      { value: "video",         label: "🎬 Video" },
      { value: "research",      label: "🔬 Research" },
      { value: "business",      label: "🏢 Business" },
      { value: "marketing",     label: "📣 Marketing" },
      { value: "design",        label: "🖌️ Design" },
      { value: "audio",         label: "🎙️ Audio / Voice" },
      { value: "productivity",  label: "⚡ Productivity" },
      { value: "data",          label: "📊 Data Analysis" },
      { value: "education",     label: "🎓 Education" },
    ],
  },
  {
    label: "Monthly budget",
    options: [
      { value: "free",          label: "🆓 Free only" },
      { value: "low",           label: "💵 Under $20" },
      { value: "mid",           label: "💰 $20–$100" },
      { value: "high",          label: "💎 $100+" },
      { value: "enterprise",    label: "🏦 Enterprise" },
    ],
  },
  {
    label: "Team size",
    options: [
      { value: "solo",          label: "🙋 Just me" },
      { value: "small",         label: "👥 2–10" },
      { value: "medium",        label: "🏢 11–50" },
      { value: "large",         label: "🏭 50–200" },
      { value: "enterprise",    label: "🌐 200+" },
    ],
  },
];

export default function AiFinderWidget({ className = "" }: { className?: string }) {
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const router = useRouter();

  const allAnswered = answers.every((a) => a !== null);
  const currentStep = answers.findIndex((a) => a === null);

  function pick(stepIdx: number, value: string) {
    setAnswers((prev) => prev.map((a, i) => (i === stepIdx ? value : a)));
  }

  function reset() {
    setAnswers([null, null, null]);
  }

  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Find my AI in 3 questions
        </p>
        {answers.some((a) => a !== null) && (
          <button onClick={reset} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {STEPS.map((step, stepIdx) => {
          const answered = answers[stepIdx] !== null;
          const locked = stepIdx > currentStep && !answered;

          return (
            <div key={step.label} className={`transition-opacity ${locked ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${answered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}`}>
                  {answered ? "✓" : stepIdx + 1}
                </span>
                {step.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {step.options.map((opt) => {
                  const selected = answers[stepIdx] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => pick(stepIdx, opt.value)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => router.push("/research/finder")}
        disabled={!allAnswered}
        className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
      >
        {allAnswered ? "🎯 Get my AI recommendation →" : "Answer all 3 questions to continue"}
      </button>
    </div>
  );
}
