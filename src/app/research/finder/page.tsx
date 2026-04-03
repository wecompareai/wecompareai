"use client";

import { useState } from "react";
import PremiumGate from "@/components/PremiumGate";
import Link from "next/link";
import type { FinderAnswers, FinderResult, ToolRecommendation } from "@/app/api/finder/route";

const QUESTIONS = [
  {
    id: "useCase" as keyof FinderAnswers,
    label: "What is your primary use case?",
    options: [
      "Software development & coding",
      "Content writing & copywriting",
      "Research & data analysis",
      "Image or media generation",
      "Workflow automation",
      "Customer support & chatbots",
      "Education & training",
      "General productivity",
    ],
  },
  {
    id: "budget" as keyof FinderAnswers,
    label: "What is your monthly budget for AI tools?",
    options: ["Free only", "Up to $20/month", "Up to $100/month", "Up to $500/month", "Enterprise (no limit)"],
  },
  {
    id: "teamSize" as keyof FinderAnswers,
    label: "What is your team size?",
    options: ["Just me (solo)", "2–10 people", "11–50 people", "51–200 people", "200+ people"],
  },
  {
    id: "technicalSkill" as keyof FinderAnswers,
    label: "What is your technical skill level?",
    options: [
      "Non-technical (no coding)",
      "Basic (some scripts/formulas)",
      "Intermediate (comfortable with APIs)",
      "Advanced (full-stack developer)",
      "Expert (ML/AI engineer)",
    ],
  },
  {
    id: "deployment" as keyof FinderAnswers,
    label: "How do you prefer to use AI tools?",
    options: [
      "SaaS / no-code (browser-based)",
      "API integration into my app",
      "IDE extension (coding assistant)",
      "Self-hosted / open source",
      "No preference",
    ],
  },
  {
    id: "priority" as keyof FinderAnswers,
    label: "What matters most to you?",
    options: [
      "Lowest cost",
      "Fastest response speed",
      "Highest accuracy & quality",
      "Data privacy & security",
      "Ease of use",
      "Multimodal capabilities (text + image + audio)",
    ],
  },
];

function RecommendationCard({
  label,
  color,
  icon,
  rec,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
  rec: ToolRecommendation;
}) {
  return (
    <div className={`rounded-xl border ${color} p-5 space-y-3`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <div className="text-lg font-bold text-foreground">{rec.name}</div>
        <div className="text-xs text-muted-foreground font-mono mt-0.5">{rec.pricing}</div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{rec.reason}</p>
      <a
        href={rec.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        Visit site
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export default function FinderPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = questions, 7 = results
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinderResult | null>(null);

  const currentQ = QUESTIONS[step - 1];
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100);
  const isComplete = step > QUESTIONS.length;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data as FinderResult);
        setStep(QUESTIONS.length + 1);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(value: string) {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Last question answered — submit
      setLoading(true);
      setError(null);
      fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: updated }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setResult(data as FinderResult);
            setStep(QUESTIONS.length + 1);
          }
        })
        .catch(() => setError("Network error — please try again."))
        .finally(() => setLoading(false));
    }
  }

  return (
    <PremiumGate>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
        <span>/</span>
        <span className="text-foreground">AI Tool Finder</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-500/10">
          <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Tool Finder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Answer 6 questions — get your perfect AI stack</p>
        </div>
      </div>

      {/* Intro */}
      {step === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Find your perfect AI stack</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Answer 6 short questions about your use case, budget, and preferences. Claude will analyse your answers and recommend the best AI model, platform, and workflow tools — personalised for you.
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Start →
          </button>
        </div>
      )}

      {/* Quiz */}
      {step >= 1 && step <= QUESTIONS.length && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {step} of {QUESTIONS.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{currentQ.label}</h2>
            <div className="grid gap-2">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(opt)}
                  disabled={loading}
                  className={`text-left px-4 py-3 rounded-lg border text-sm transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50 ${
                    answers[currentQ.id] === opt
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div>
            <div className="font-medium text-foreground">Analysing your answers…</div>
            <div className="text-sm text-muted-foreground mt-1">Claude is building your personalised AI stack recommendation</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
          <button onClick={handleSubmit} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Results */}
      {isComplete && result && !loading && (
        <div className="space-y-6">
          {/* Summary banner */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">Your AI Stack Recommendation</div>
            <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Best model + platform */}
          <div className="grid sm:grid-cols-2 gap-4">
            <RecommendationCard
              label="Best Model"
              color="border-violet-500/30 bg-violet-500/5"
              icon={<svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              rec={result.bestModel}
            />
            <RecommendationCard
              label="Best Platform"
              color="border-emerald-500/30 bg-emerald-500/5"
              icon={<svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>}
              rec={result.bestPlatform}
            />
          </div>

          {/* Workflow tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recommended Workflow Tools</h3>
            <div className="grid gap-3">
              {result.workflowTools.map((tool) => (
                <RecommendationCard
                  key={tool.name}
                  label="Workflow Tool"
                  color="border-blue-500/30 bg-blue-500/5"
                  icon={<svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  rec={tool}
                />
              ))}
            </div>
          </div>

          {/* Restart */}
          <button
            onClick={() => { setStep(0); setAnswers({}); setResult(null); setError(null); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
