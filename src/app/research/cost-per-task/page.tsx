import Link from "next/link";

// ── Data ────────────────────────────────────────────────────────────────────

type TextRow = { task: string; gpt4o: number; claude37: number; gemini20: number; mistralLarge: number };
type ImageRow = { task: string; dalle3: number; midjourney: number; stableDiffusion: number; firefly: number };

const writingTasks: TextRow[] = [
  { task: "500-word blog post",               gpt4o: 0.008, claude37: 0.009, gemini20: 0.005, mistralLarge: 0.004 },
  { task: "1,500-word article",               gpt4o: 0.024, claude37: 0.027, gemini20: 0.015, mistralLarge: 0.012 },
  { task: "10 social media posts",            gpt4o: 0.003, claude37: 0.003, gemini20: 0.002, mistralLarge: 0.001 },
  { task: "Product description (200 words)",  gpt4o: 0.003, claude37: 0.003, gemini20: 0.002, mistralLarge: 0.001 },
  { task: "Email sequence (5 emails)",        gpt4o: 0.010, claude37: 0.011, gemini20: 0.007, mistralLarge: 0.005 },
];

const researchTasks: TextRow[] = [
  { task: "Summarise a 10-page PDF",             gpt4o: 0.012, claude37: 0.014, gemini20: 0.008, mistralLarge: 0.006 },
  { task: "Competitive analysis (3 companies)",  gpt4o: 0.035, claude37: 0.040, gemini20: 0.022, mistralLarge: 0.018 },
  { task: "Extract key data from 50-row CSV",    gpt4o: 0.008, claude37: 0.009, gemini20: 0.005, mistralLarge: 0.004 },
  { task: "Literature review summary",           gpt4o: 0.020, claude37: 0.023, gemini20: 0.013, mistralLarge: 0.010 },
];

const codingTasks: TextRow[] = [
  { task: "Write a REST API endpoint",                 gpt4o: 0.015, claude37: 0.017, gemini20: 0.010, mistralLarge: 0.008 },
  { task: "Debug a 100-line function",                 gpt4o: 0.010, claude37: 0.012, gemini20: 0.007, mistralLarge: 0.005 },
  { task: "Write 10 unit tests",                       gpt4o: 0.012, claude37: 0.014, gemini20: 0.008, mistralLarge: 0.006 },
  { task: "Refactor a component (200 lines)",          gpt4o: 0.018, claude37: 0.021, gemini20: 0.012, mistralLarge: 0.009 },
  { task: "Generate SQL query from plain English",     gpt4o: 0.005, claude37: 0.006, gemini20: 0.003, mistralLarge: 0.002 },
];

const imageTasks: ImageRow[] = [
  { task: "1 hero image (1024×1024)",          dalle3: 0.040, midjourney: 0.033, stableDiffusion: 0.002, firefly: 0.029 },
  { task: "10 product images",                 dalle3: 0.400, midjourney: 0.330, stableDiffusion: 0.020, firefly: 0.290 },
  { task: "Social media graphic set (4 images)", dalle3: 0.160, midjourney: 0.132, stableDiffusion: 0.008, firefly: 0.116 },
  { task: "Logo concept (5 variations)",       dalle3: 0.200, midjourney: 0.165, stableDiffusion: 0.010, firefly: 0.145 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  if (n < 0.01) return `$${n.toFixed(3)}`;
  if (n < 1)    return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

const MODEL_DOT_COLORS: Record<string, string> = {
  "GPT-4o":            "bg-emerald-500",
  "Claude 3.7":        "bg-orange-500",
  "Gemini 2.0":        "bg-blue-500",
  "Mistral Large":     "bg-violet-500",
  "DALL-E 3":          "bg-rose-500",
  "Midjourney v6":     "bg-pink-500",
  "Stable Diffusion":  "bg-amber-500",
  "Firefly":           "bg-sky-500",
};

// ── Text model table ─────────────────────────────────────────────────────────

function TextModelTable({
  rows,
  models,
  getValues,
}: {
  rows: TextRow[];
  models: string[];
  getValues: (row: TextRow) => number[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="sticky left-0 z-10 bg-muted/50 text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[220px]">
              Task
            </th>
            {models.map((m) => (
              <th key={m} className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${MODEL_DOT_COLORS[m] ?? "bg-border"}`} />
                  {m}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const vals = getValues(row);
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            return (
              <tr key={row.task} className="hover:bg-muted/30 transition-colors">
                <td className="sticky left-0 z-10 bg-card px-4 py-3 font-medium text-foreground">
                  {row.task}
                </td>
                {vals.map((v, i) => {
                  const isCheapest = v === min;
                  const isPriciest = v === max && max !== min;
                  return (
                    <td
                      key={i}
                      className={`px-4 py-3 text-center tabular-nums font-medium rounded-sm ${
                        isCheapest
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : isPriciest
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {fmtPrice(v)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Image model table ────────────────────────────────────────────────────────

function ImageModelTable({
  rows,
  models,
  getValues,
}: {
  rows: ImageRow[];
  models: string[];
  getValues: (row: ImageRow) => number[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="sticky left-0 z-10 bg-muted/50 text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[240px]">
              Task
            </th>
            {models.map((m) => (
              <th key={m} className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${MODEL_DOT_COLORS[m] ?? "bg-border"}`} />
                  {m}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const vals = getValues(row);
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            return (
              <tr key={row.task} className="hover:bg-muted/30 transition-colors">
                <td className="sticky left-0 z-10 bg-card px-4 py-3 font-medium text-foreground">
                  {row.task}
                </td>
                {vals.map((v, i) => {
                  const isCheapest = v === min;
                  const isPriciest = v === max && max !== min;
                  return (
                    <td
                      key={i}
                      className={`px-4 py-3 text-center tabular-nums font-medium ${
                        isCheapest
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : isPriciest
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {fmtPrice(v)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">{emoji}</span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CostPerTaskPage() {
  const textModels = ["GPT-4o", "Claude 3.7", "Gemini 2.0", "Mistral Large"];
  const imageModels = ["DALL-E 3", "Midjourney v6", "Stable Diffusion", "Firefly"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          💸 Cost-Per-Task Benchmarks
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Forget cost per token. Here&apos;s what it actually costs to do real work.
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Per-token pricing makes it nearly impossible to compare AI models at a glance — you&apos;d need
          to estimate prompt length, output size, and context overhead just to get a rough number. So
          we&apos;ve done that work for you. Below you&apos;ll find pre-calculated cost estimates for the most
          common real-world tasks across the leading text and image models.{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Green = cheapest</span>,{" "}
          <span className="text-rose-600 dark:text-rose-400 font-medium">red = most expensive</span> in each row.
        </p>
      </div>

      {/* 1. Writing Tasks */}
      <Section emoji="✍️" title="Writing Tasks">
        <TextModelTable
          rows={writingTasks}
          models={textModels}
          getValues={(r) => [r.gpt4o, r.claude37, r.gemini20, r.mistralLarge]}
        />
      </Section>

      {/* 2. Research & Analysis */}
      <Section emoji="🔬" title="Research & Analysis Tasks">
        <TextModelTable
          rows={researchTasks}
          models={textModels}
          getValues={(r) => [r.gpt4o, r.claude37, r.gemini20, r.mistralLarge]}
        />
      </Section>

      {/* 3. Coding Tasks */}
      <Section emoji="💻" title="Coding Tasks">
        <TextModelTable
          rows={codingTasks}
          models={textModels}
          getValues={(r) => [r.gpt4o, r.claude37, r.gemini20, r.mistralLarge]}
        />
      </Section>

      {/* 4. Image Generation */}
      <Section emoji="🎨" title="Image Generation Tasks">
        <ImageModelTable
          rows={imageTasks}
          models={imageModels}
          getValues={(r) => [r.dalle3, r.midjourney, r.stableDiffusion, r.firefly]}
        />
      </Section>

      {/* How we calculated this */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 select-none hover:bg-muted/40 transition-colors">
            <span className="font-semibold text-foreground text-sm">
              How we calculated this
            </span>
            <svg
              className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="border-t border-border px-6 py-5 text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              Each cost is calculated as{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                (input_tokens × input_price) + (output_tokens × output_price)
              </code>
              , using published API pricing as of Q1 2026.
            </p>
            <p>
              <strong className="text-foreground">Token assumptions:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>500-word blog post: ~400 input tokens, ~700 output tokens</li>
              <li>1,500-word article: ~600 input tokens, ~2,100 output tokens</li>
              <li>10 social media posts: ~200 input tokens, ~400 output tokens</li>
              <li>10-page PDF summary: ~7,000 input tokens, ~600 output tokens</li>
              <li>Competitive analysis: ~500 input, ~4,500 output tokens</li>
              <li>REST API endpoint: ~300 input, ~800 output tokens</li>
              <li>Component refactor (200 lines): ~1,200 input, ~1,200 output tokens</li>
            </ul>
            <p>
              <strong className="text-foreground">Image prices</strong> reflect per-image API costs:
              DALL-E 3 standard ($0.040/image), Midjourney v6 via fast GPU subscription (~$0.033/image),
              Stable Diffusion XL on cloud inference (~$0.002/image), and Adobe Firefly API (~$0.029/image).
            </p>
            <p>
              All figures are estimates. Prices change frequently — always check the provider&apos;s current
              pricing page before making purchasing decisions.
            </p>
          </div>
        </details>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 px-6 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Want to benchmark these models live with your own prompts?
          </p>
          <p className="text-sm text-muted-foreground">
            Run real tasks, measure latency, and compare actual output quality — not just cost estimates.
          </p>
        </div>
        <Link
          href="/research/benchmark"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
        >
          Open live benchmark
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  );
}
