import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI News & Pricing Updates — Weekly Digest | We Compare AI",
  description:
    "Weekly AI news digest: model releases, pricing changes, benchmark results, and compliance updates across OpenAI, Anthropic, Google, Meta & more. Updated every week.",
  alternates: { canonical: `${SITE_URL}/research/ai-news` },
  openGraph: {
    title: "AI News & Pricing Updates — Weekly Digest | We Compare AI",
    description: "Model releases, pricing changes, and benchmark updates tracked weekly.",
    url: `${SITE_URL}/research/ai-news`,
    siteName: "We Compare AI",
    type: "website",
  },
};

const NEWS_ITEMS = [
  {
    date: "April 9, 2026",
    week: "Week 15, 2026",
    category: "Pricing",
    categoryColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    headline: "Gemini 2.5 Flash drops to $0.15/1M input tokens — now cheapest frontier model",
    body: "Google cut Gemini 2.5 Flash pricing by 40%, making it the cheapest frontier-quality LLM API. At $0.15/$0.60 per 1M tokens, it now undercuts GPT-4o mini while delivering significantly higher quality. This is the most significant pricing shift since DeepSeek's launch.",
    impact: "High",
    tools: ["Gemini", "GPT-4o mini"],
    links: [{ label: "Gemini pricing", href: "/pricing/gemini" }, { label: "Compare LLM costs", href: "/pricing" }],
  },
  {
    date: "April 7, 2026",
    week: "Week 15, 2026",
    category: "Model Release",
    categoryColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    headline: "Anthropic releases Claude Sonnet 4.6 — beats GPT-4o on most benchmarks",
    body: "Claude Sonnet 4.6 is Anthropic's new mid-tier model replacing Sonnet 3.7. It scores 9.2 on performance in our testing, outperforming GPT-4o (9.0) at a lower API price ($3/$15 vs $2.50/$10 per 1M tokens). Extended thinking mode is now included at no extra cost.",
    impact: "High",
    tools: ["Claude", "GPT-4o"],
    links: [{ label: "Claude pricing", href: "/pricing/claude" }, { label: "Claude vs GPT-4o", href: "/vs/chatgpt-vs-claude" }],
  },
  {
    date: "April 5, 2026",
    week: "Week 14, 2026",
    category: "Model Release",
    categoryColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    headline: "OpenAI launches GPT-4.1 and GPT-4.1 Mini with 1M token context",
    body: "OpenAI's GPT-4.1 introduces a 1M token context window — previously only Gemini offered this at scale. GPT-4.1 Mini at $0.40/$1.60 per 1M tokens sits between GPT-4o mini and GPT-4o in the pricing stack. Coding benchmarks show GPT-4.1 outperforming its predecessor.",
    impact: "High",
    tools: ["ChatGPT", "GPT-4.1"],
    links: [{ label: "ChatGPT pricing", href: "/pricing/chatgpt" }, { label: "Compare AI models", href: "/compare/ai-models" }],
  },
  {
    date: "April 2, 2026",
    week: "Week 14, 2026",
    category: "Compliance",
    categoryColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    headline: "EU AI Act enforcement begins — which AI tools are compliant?",
    body: "The EU AI Act began enforcement for high-risk AI systems. General-purpose AI models with >10^25 FLOPs training compute must now register with the EU AI Office. OpenAI, Google, Meta, and Anthropic have all filed compliance documentation. DeepSeek's status remains unclear for EU deployments.",
    impact: "Medium",
    tools: ["ChatGPT", "Claude", "Gemini", "DeepSeek"],
    links: [{ label: "Compliance matrix", href: "/research/compliance" }],
  },
  {
    date: "March 28, 2026",
    week: "Week 13, 2026",
    category: "Pricing",
    categoryColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    headline: "GitHub Copilot adds free tier — 2,000 completions/month for all users",
    body: "Microsoft expanded GitHub Copilot access with a permanent free tier: 2,000 code completions and 50 chat messages per month. The free tier includes access to Claude Sonnet and GPT-4o (with rate limits). This puts significant pressure on Cursor and Windsurf who charge from $0/mo.",
    impact: "Medium",
    tools: ["GitHub Copilot", "Cursor", "Windsurf"],
    links: [{ label: "Copilot pricing", href: "/pricing/github-copilot" }, { label: "Copilot vs Cursor", href: "/vs/copilot-vs-cursor" }],
  },
  {
    date: "March 24, 2026",
    week: "Week 12, 2026",
    category: "Benchmark",
    categoryColor: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    headline: "DeepSeek R1 matches o3 on MATH benchmark at 95% lower cost",
    body: "Independent testing confirms DeepSeek R1 achieves 97.3% on MATH-500 vs OpenAI o3's 97.9% — essentially matched performance at $0.55/$2.19 vs $10/$40 per 1M tokens. This is the starkest price-performance gap in reasoning model history.",
    impact: "High",
    tools: ["DeepSeek", "ChatGPT"],
    links: [{ label: "DeepSeek pricing", href: "/pricing/deepseek" }, { label: "DeepSeek vs ChatGPT", href: "/vs/deepseek-vs-chatgpt" }],
  },
  {
    date: "March 19, 2026",
    week: "Week 12, 2026",
    category: "Model Release",
    categoryColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    headline: "Sora available to all ChatGPT Plus users — $20/mo plan unlocked",
    body: "OpenAI expanded Sora access from Pro-only ($200/mo) to Plus ($20/mo), with a cap of 50 video generations per month for Plus users. Video quality at 720p, up to 20 seconds. Pro users retain unlimited access and 1080p. This dramatically changes the competitive landscape for Runway and Pika.",
    impact: "Medium",
    tools: ["Sora", "Runway", "Pika"],
    links: [{ label: "Sora vs Runway", href: "/vs/sora-vs-runway" }, { label: "Best video generators", href: "/best/video-generation" }],
  },
  {
    date: "March 15, 2026",
    week: "Week 11, 2026",
    category: "Industry",
    categoryColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    headline: "ElevenLabs hits $3B valuation — expands to 32 languages",
    body: "ElevenLabs raised Series C at $3B valuation and announced support for 32 languages with real-time voice cloning. New Flash v2.5 model reduces latency to under 75ms — enabling true real-time voice applications. Enterprise plan now includes on-premises deployment option.",
    impact: "Low",
    tools: ["ElevenLabs"],
    links: [{ label: "ElevenLabs pricing", href: "/pricing/elevenlabs" }, { label: "Best voice tools", href: "/best/voice-cloning" }],
  },
];

const IMPACT_COLOR = {
  High: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  Low: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function AiNewsPage() {
  const weeks = [...new Set(NEWS_ITEMS.map((n) => n.week))];

  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI News</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Weekly digest · Updated April 9, 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            AI News & Pricing Updates
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Model releases, pricing changes, compliance updates, and benchmark results — curated weekly.
            Everything that matters for developers, teams, and AI buyers.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Model Release", "Pricing", "Compliance", "Benchmark", "Industry"].map((cat) => (
            <span key={cat} className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${cat === "All" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* News items */}
        <div className="space-y-10">
          {weeks.map((week) => {
            const items = NEWS_ITEMS.filter((n) => n.week === week);
            return (
              <div key={week}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{week}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-5">
                  {items.map((item) => (
                    <article key={item.headline} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.categoryColor}`}>{item.category}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${IMPACT_COLOR[item.impact as keyof typeof IMPACT_COLOR]}`}>
                          {item.impact} Impact
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{item.date}</span>
                      </div>

                      <h2 className="text-sm font-semibold text-foreground mb-2 leading-snug">{item.headline}</h2>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.body}</p>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tools.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">{t}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3 ml-auto">
                          {item.links.map((l) => (
                            <Link key={l.href} href={l.href} className="text-xs text-primary hover:underline underline-offset-2">
                              {l.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-base font-semibold text-foreground mb-1">Get the weekly digest in your inbox</p>
          <p className="text-xs text-muted-foreground mb-4">
            Every Thursday: pricing changes, new model releases, and benchmark results.
            No spam. Unsubscribe any time.
          </p>
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold">
            Subscribe free →
          </Link>
        </div>

      </div>
    </div>
  );
}
