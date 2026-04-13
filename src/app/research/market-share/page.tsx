import Link from "next/link";
import { ConsumerPieChart, EnterpriseBarChart, DevEcosystemChart, SearchTrendsRadar } from "@/components/charts/MarketShareCharts";

const consumerShares = [
  { name: "ChatGPT / OpenAI",          share: 41, trend: "stable",    trendLabel: "Stable",      trendColor: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-500/10"    },
  { name: "Google Gemini",              share: 22, trend: "up-fast",   trendLabel: "Rising fast", trendColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Claude",                     share: 14, trend: "up",        trendLabel: "Rising",      trendColor: "text-orange-600 dark:text-orange-400",  bg: "bg-orange-500/10"  },
  { name: "Others (Copilot, Meta AI…)", share: 23, trend: "stable",    trendLabel: "Fragmented",  trendColor: "text-muted-foreground",                 bg: "bg-muted"          },
];

const enterpriseShares = [
  { name: "OpenAI API",      share: 38, color: "bg-emerald-500" },
  { name: "Google Vertex AI",share: 26, color: "bg-blue-500"    },
  { name: "Anthropic API",   share: 18, color: "bg-orange-500"  },
  { name: "AWS Bedrock",     share: 11, color: "bg-amber-500"   },
  { name: "Others",          share:  7, color: "bg-gray-400"    },
];

const devEcosystem = [
  { rank: 1, name: "OpenAI SDK",            pct: 68, note: "of AI repos",          color: "bg-emerald-500" },
  { rank: 2, name: "Anthropic SDK",         pct: 19, note: "of AI repos",          color: "bg-orange-500"  },
  { rank: 3, name: "Google Generative AI",  pct: 15, note: "of AI repos",          color: "bg-blue-500"    },
  { rank: 4, name: "Hugging Face",          pct: 42, note: "of open-source repos", color: "bg-violet-500"  },
  { rank: 5, name: "LangChain",             pct: 31, note: "framework adoption",   color: "bg-amber-500"   },
];

const searchTrends = [
  { term: "ChatGPT API",      index: 100 },
  { term: "AI agents",        index:  89 },
  { term: "Claude API",       index:  68 },
  { term: "Gemini API",       index:  55 },
  { term: "LangChain",        index:  52 },
  { term: "Llama fine-tuning",index:  44 },
];

function TrendArrow({ trend }: { trend: string }) {
  if (trend === "up-fast") {
    return (
      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
  }
  if (trend === "up") {
    return (
      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

export default function MarketSharePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Market Share Dashboard</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-violet-500/10 shrink-0">
          <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Market Share Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Estimated usage trends across consumer, enterprise, and developer segments based on API adoption, GitHub activity, and search volume.
          </p>
        </div>
      </div>

      {/* Section 1 — Consumer Market */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Consumer Market — % Share
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Donut chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Market Share — Donut View</p>
            <ConsumerPieChart data={consumerShares} />
          </div>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {consumerShares.map((item) => (
              <div key={item.name} className={`rounded-xl border border-border p-5 space-y-3 ${item.bg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{item.name}</span>
                  <TrendArrow trend={item.trend} />
                </div>
                <div className="text-3xl font-bold text-foreground">{item.share}%</div>
                <div className={`text-xs font-medium ${item.trendColor}`}>{item.trendLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Enterprise API Adoption */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Enterprise API Adoption — % of Enterprise AI Spend
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <EnterpriseBarChart data={enterpriseShares} />
        </div>
      </section>

      {/* Section 3 — Developer Ecosystem */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Developer Ecosystem — GitHub Repos Using Each SDK
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <DevEcosystemChart data={devEcosystem} />
        </div>
      </section>

      {/* Section 4 — Trending Topics */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Trending Topics — Search Volume Index (base 100)
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <SearchTrendsRadar data={searchTrends} />
        </div>
      </section>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        Data estimated from public signals: SimilarWeb, GitHub API stats, SEMrush search trends, Statista enterprise surveys. Updated April 2026. Figures are approximations and may not reflect real-time market conditions.
      </p>
    </div>
  );
}
