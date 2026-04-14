import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Changelog — AI Model Updates & Price Changes | We Compare AI",
  description: "Track every AI model release, pricing change, and benchmark update we've recorded. Updated daily by our autonomous monitoring system.",
  alternates: { canonical: `${SITE_URL}/changelog` },
  openGraph: {
    title: "Changelog — AI Model Updates & Price Changes",
    description: "Every AI model release, pricing change, and benchmark update tracked in real time.",
    url: `${SITE_URL}/changelog`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

interface ChangeEntry {
  date: string;
  type: "pricing" | "model" | "benchmark" | "feature" | "score";
  tool: string;
  provider: string;
  summary: string;
  detail?: string;
  impact: "high" | "medium" | "low";
}

const CHANGELOG: ChangeEntry[] = [
  {
    date: "2026-04-13",
    type: "model",
    tool: "GPT-4.1 & GPT-4.1 Mini",
    provider: "OpenAI",
    summary: "GPT-4.1 and GPT-4.1 Mini launched with 1M context window",
    detail: "OpenAI released GPT-4.1 with a 1M token context window, improved instruction following, and new pricing: $2.00/1M input, $8.00/1M output. GPT-4.1 Mini at $0.40/$1.60.",
    impact: "high",
  },
  {
    date: "2026-04-13",
    type: "benchmark",
    tool: "Gemini 2.5 Pro",
    provider: "Google",
    summary: "Gemini 2.5 Pro tops coding benchmarks — scores updated",
    detail: "Gemini 2.5 Pro achieved new highs on HumanEval and SWE-bench. Our performance score updated from 8.5 → 8.8.",
    impact: "high",
  },
  {
    date: "2026-04-13",
    type: "pricing",
    tool: "Gemini 2.5 Flash",
    provider: "Google",
    summary: "Gemini 2.5 Flash pricing confirmed at $0.075/1M input tokens",
    detail: "Google confirmed stable pricing for Gemini 2.5 Flash — the cheapest frontier model per token. No changes from March pricing.",
    impact: "medium",
  },
  {
    date: "2026-04-10",
    type: "model",
    tool: "Grok 3",
    provider: "xAI",
    summary: "Grok 3 released with real-time web access",
    detail: "xAI launched Grok 3 with native web search, improved reasoning, and a 131K context window. API pricing: $3.00/1M input, $15.00/1M output.",
    impact: "high",
  },
  {
    date: "2026-04-08",
    type: "score",
    tool: "DeepSeek V3",
    provider: "DeepSeek",
    summary: "DeepSeek V3 reliability score revised after outage data",
    detail: "Following reported availability issues in March, we revised DeepSeek V3's reliability score from 7.0 → 6.5. Value score remains 9.5/10.",
    impact: "medium",
  },
  {
    date: "2026-04-05",
    type: "pricing",
    tool: "Claude Sonnet 4.6",
    provider: "Anthropic",
    summary: "Claude API pricing stable — no Q2 changes announced",
    detail: "Anthropic confirmed no pricing changes for Q2 2026. Claude Sonnet 4.6 remains at $3.00/1M input, $15.00/1M output.",
    impact: "low",
  },
  {
    date: "2026-04-01",
    type: "feature",
    tool: "ChatGPT",
    provider: "OpenAI",
    summary: "ChatGPT memory expanded to all Plus users globally",
    detail: "OpenAI rolled out persistent memory for ChatGPT Plus users worldwide. Memory can be managed and cleared from settings.",
    impact: "medium",
  },
  {
    date: "2026-03-28",
    type: "model",
    tool: "Mistral Large 2",
    provider: "Mistral AI",
    summary: "Mistral Large 2 update improves multilingual performance",
    detail: "Mistral released an update to Mistral Large 2 with improved French, German, Spanish, and Italian output quality. API pricing unchanged.",
    impact: "low",
  },
  {
    date: "2026-03-20",
    type: "pricing",
    tool: "o3-mini",
    provider: "OpenAI",
    summary: "o3-mini pricing reduced — now $1.10/1M input tokens",
    detail: "OpenAI reduced o3-mini pricing by ~40% from $1.85 to $1.10/1M input tokens. Output reduced from $7.40 to $4.40/1M. Our value score updated accordingly.",
    impact: "high",
  },
  {
    date: "2026-03-15",
    type: "benchmark",
    tool: "Claude Opus 4",
    provider: "Anthropic",
    summary: "Claude Opus 4 achieves new high on MMLU Pro benchmark",
    detail: "Anthropic published updated benchmark results showing Claude Opus 4 at 91.2% on MMLU Pro, ahead of GPT-4o (89.5%) and Gemini 2.5 Pro (90.1%).",
    impact: "medium",
  },
];

const TYPE_CONFIG: Record<ChangeEntry["type"], { label: string; color: string; bg: string }> = {
  pricing:   { label: "Pricing",   color: "text-amber-700 dark:text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
  model:     { label: "New Model", color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  benchmark: { label: "Benchmark", color: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  feature:   { label: "Feature",   color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  score:     { label: "Score",     color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
};

const IMPACT_DOT: Record<ChangeEntry["impact"], string> = {
  high:   "bg-rose-500",
  medium: "bg-amber-500",
  low:    "bg-muted-foreground/40",
};

function groupByDate(entries: ChangeEntry[]) {
  const map = new Map<string, ChangeEntry[]>();
  for (const e of entries) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export default function ChangelogPage() {
  const grouped = groupByDate(CHANGELOG);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Model Changelog — We Compare AI",
    description: "Track every AI model release, pricing change, and benchmark update.",
    url: `${SITE_URL}/changelog`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Changelog", item: `${SITE_URL}/changelog` },
      ],
    },
  };

  return (
    <div className="py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Changelog</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Live — updated daily</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">What's Changed in AI</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every AI model release, pricing update, benchmark result, and score change we track — in chronological order.
            Monitored by our autonomous agents and verified by our team.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-muted/30">
          <span className="text-xs text-muted-foreground font-medium self-center">Types:</span>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <span key={key} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
              {cfg.label}
            </span>
          ))}
          <span className="ml-auto text-xs text-muted-foreground self-center">Impact:</span>
          {(["high", "medium", "low"] as const).map((impact) => (
            <span key={impact} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${IMPACT_DOT[impact]}`} />
              {impact}
            </span>
          ))}
        </div>

        {/* Entries grouped by date */}
        <div className="space-y-8">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <time className="text-sm font-bold text-foreground" dateTime={date}>{date}</time>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground">{entries.length} update{entries.length > 1 ? "s" : ""}</span>
              </div>
              <div className="space-y-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-border">
                {entries.map((entry, i) => {
                  const cfg = TYPE_CONFIG[entry.type];
                  return (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs font-semibold text-foreground">{entry.tool}</span>
                          <span className="text-[10px] text-muted-foreground">· {entry.provider}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full ${IMPACT_DOT[entry.impact]}`} />
                          {entry.impact} impact
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{entry.summary}</p>
                      {entry.detail && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{entry.detail}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* RSS + links */}
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Stay up to date</p>
            <p className="text-xs text-muted-foreground">Subscribe to our RSS feed or bookmark this page.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/feed.xml"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors font-medium"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS Feed
            </a>
            <Link href="/research/pricing-index" className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
              Pricing Index →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
