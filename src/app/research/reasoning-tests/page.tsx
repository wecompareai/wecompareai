import Link from "next/link";

interface BenchmarkEntry {
  model: string;
  score: number;
}

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const barColor =
    score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : score >= 70 ? "bg-amber-500" : "bg-red-400";
  const textColor =
    score >= 90
      ? "text-emerald-700 dark:text-emerald-400"
      : score >= 80
      ? "text-blue-700 dark:text-blue-400"
      : score >= 70
      ? "text-amber-700 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-mono font-semibold w-10 text-right ${textColor}`}>{score}%</span>
    </div>
  );
}

function BenchmarkTable({ data }: { data: BenchmarkEntry[] }) {
  const sorted = [...data].sort((a, b) => b.score - a.score);
  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
      {sorted.map((entry, i) => (
        <div key={entry.model} className="px-5 py-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {i === 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Top
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">{entry.model}</span>
            </div>
          </div>
          <ScoreBar score={entry.score} />
        </div>
      ))}
    </div>
  );
}

const multiStepReasoning: BenchmarkEntry[] = [
  { model: "GPT-o1",              score: 94.2 },
  { model: "Claude 3.7 Sonnet",   score: 88.6 },
  { model: "Gemini 2.0 Flash",    score: 85.1 },
  { model: "GPT-4o",              score: 83.4 },
  { model: "Gemini 1.5 Pro",      score: 81.7 },
  { model: "Llama 3.3 70B",       score: 78.9 },
  { model: "Mistral Large",       score: 76.2 },
  { model: "Claude 3.5 Haiku",    score: 74.3 },
];

const codeCorrectness: BenchmarkEntry[] = [
  { model: "GPT-o1",            score: 94.4 },
  { model: "GPT-4o",            score: 90.2 },
  { model: "Claude 3.7 Sonnet", score: 88.7 },
  { model: "Gemini 2.0 Flash",  score: 83.5 },
  { model: "Llama 3.3 70B",     score: 79.1 },
  { model: "Mistral Large",     score: 72.8 },
];

const longContextRetention: BenchmarkEntry[] = [
  { model: "Gemini 1.5 Pro",    score: 94.1 },
  { model: "Claude 3.7 Sonnet", score: 91.2 },
  { model: "Gemini 2.0 Flash",  score: 88.3 },
  { model: "Claude 3.5 Haiku",  score: 86.7 },
  { model: "GPT-4o",            score: 85.4 },
];

const toolUseAccuracy: BenchmarkEntry[] = [
  { model: "Claude 3.7 Sonnet", score: 90.1 },
  { model: "GPT-4o",            score: 88.5 },
  { model: "GPT-o1",            score: 85.3 },
  { model: "Gemini 2.0 Flash",  score: 84.2 },
  { model: "Llama 3.3 70B",     score: 76.4 },
];

const benchmarkSources = [
  {
    name: "MATH + MMLU-Pro (Combined)",
    description:
      "A composite score averaging performance on the MATH dataset (competition-level mathematics problems) and MMLU-Pro (Massive Multitask Language Understanding — Professional, 12K harder variants). Tests multi-step logical deduction, algebraic reasoning, and expert-domain knowledge across 57 subject areas.",
  },
  {
    name: "HumanEval pass@1",
    description:
      "OpenAI's benchmark of 164 handwritten Python programming problems. Models are asked to complete a function from its docstring. pass@1 measures the fraction of problems solved correctly on the first attempt, without sampling multiple completions. A strict, real-world measure of code generation quality.",
  },
  {
    name: "RULER 128K",
    description:
      "Realistic Universal Long-context Evaluation benchmark at the 128K token level. Tests long-range information retrieval, multi-hop reasoning over long documents, and avoidance of distraction injection. Only models with a native context window of 128K+ are included.",
  },
  {
    name: "Berkeley Function-Calling Leaderboard",
    description:
      "Evaluates a model's ability to correctly invoke external APIs and tools from natural-language instructions. Covers simple, nested, parallel, and irrelevant tool-call scenarios. Tests both the accuracy of tool selection and correctness of argument extraction — critical for agentic workloads.",
  },
];

export default function ReasoningTestsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">Reasoning Stress Tests</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reasoning Stress Tests</h1>
          <p className="mt-1 text-muted-foreground">
            Standardised benchmarks for multi-step reasoning, code correctness, long-context retention, and tool-use accuracy across frontier models.
          </p>
        </div>
      </div>

      {/* 4-column benchmark grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Multi-step Reasoning */}
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold text-foreground">Multi-Step Reasoning</h2>
            <p className="text-xs text-muted-foreground mt-0.5">MATH + MMLU-Pro combined score (%)</p>
          </div>
          <BenchmarkTable data={multiStepReasoning} />
        </section>

        {/* Code Correctness */}
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold text-foreground">Code Correctness</h2>
            <p className="text-xs text-muted-foreground mt-0.5">HumanEval pass@1 (%)</p>
          </div>
          <BenchmarkTable data={codeCorrectness} />
        </section>

        {/* Long-Context Retention */}
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold text-foreground">Long-Context Retention</h2>
            <p className="text-xs text-muted-foreground mt-0.5">RULER 128K score (%) — models with 128K+ context only</p>
          </div>
          <BenchmarkTable data={longContextRetention} />
        </section>

        {/* Tool-Use Accuracy */}
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold text-foreground">Tool-Use Accuracy</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Berkeley Function-Calling Leaderboard (%)</p>
          </div>
          <BenchmarkTable data={toolUseAccuracy} />
        </section>
      </div>

      {/* Score legend */}
      <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">Score key:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400">≥ 90% — Frontier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-blue-700 dark:text-blue-400">80–89% — Strong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-amber-700 dark:text-amber-400">70–79% — Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-red-600 dark:text-red-400">&lt; 70% — Below average</span>
        </div>
      </div>

      {/* Benchmark Sources */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Benchmark Sources
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benchmarkSources.map((src) => (
            <div key={src.name} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">{src.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{src.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        Scores from published papers and public leaderboards. Last updated Q1 2026. Some results may vary across test conditions, prompt formats, and API versions. Models are ranked within each benchmark independently.
      </p>
    </div>
  );
}
