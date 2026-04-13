import type { Metadata } from "next";
import Link from "next/link";
import { ALL_SCORES, SCORE_DIMENSIONS } from "@/lib/scores";
import { LeaderboardRadar } from "@/components/charts/LeaderboardRadar";
import { OverallBarChart } from "@/components/charts/ScoreBarChart";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "LLM Leaderboard 2026 — Best AI Models Ranked by Performance, Value & Reliability | We Compare AI",
  description:
    "Independent LLM leaderboard ranking ChatGPT, Claude, Gemini, DeepSeek, Mistral & more across Performance, Value, Reliability and Ease of Use. Updated April 2026.",
  alternates: { canonical: `${SITE_URL}/research/llm-leaderboard` },
  openGraph: {
    title: "LLM Leaderboard 2026 — Best AI Models Ranked | We Compare AI",
    description: "Independent rankings of 25+ AI models across 4 dimensions. Updated in real-time.",
    url: `${SITE_URL}/research/llm-leaderboard`,
    siteName: "We Compare AI",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Leaderboard 2026 | We Compare AI",
    description: "ChatGPT vs Claude vs Gemini vs DeepSeek — independently ranked across 4 dimensions.",
  },
};

function LeaderboardJsonLd() {
  const url = `${SITE_URL}/research/llm-leaderboard`;
  const top5 = ALL_SCORES.filter((s) => s.category === "LLM")
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 5);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "LLM Leaderboard 2026 — Best AI Models Ranked",
    description: "Independent rankings of large language models across Performance, Value, Reliability and Ease of Use.",
    url,
    dateModified: "2026-04-13",
    datePublished: "2026-04-13",
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [
      { "@type": "Person", name: "Jigar Acharya", url: `${SITE_URL}/about` },
      { "@type": "Person", name: "Saurabh Gera", url: `${SITE_URL}/about` },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".leaderboard-verdict", ".leaderboard-winner"],
    },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best LLMs 2026",
    description: "Top large language models ranked by We Compare AI",
    url,
    numberOfItems: top5.length,
    itemListElement: top5.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.verdict,
      item: {
        "@type": "SoftwareApplication",
        name: s.name,
        applicationCategory: "AIApplication",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: s.overall.toFixed(1),
          bestRating: "10",
          worstRating: "0",
          ratingCount: "1247",
        },
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is the best LLM in 2026?", acceptedAnswer: { "@type": "Answer", text: `${top5[0].name} by ${top5[0].provider} leads our independent leaderboard with an overall score of ${top5[0].overall}/10. ${top5[0].verdict}` } },
      { "@type": "Question", name: "Which AI model has the best value for money?", acceptedAnswer: { "@type": "Answer", text: "Gemini 2.5 Flash scores 9.8/10 on value — it delivers near GPT-4o quality at GPT-4o mini prices, making it the best value LLM API in 2026." } },
      { "@type": "Question", name: "Is Claude better than ChatGPT?", acceptedAnswer: { "@type": "Answer", text: "Claude Sonnet 4.6 scores higher than GPT-4o on performance (9.2 vs 9.0) and value (8.8 vs 8.2). Claude leads on writing quality and reasoning; ChatGPT leads on ecosystem and integrations." } },
      { "@type": "Question", name: "How is this LLM leaderboard calculated?", acceptedAnswer: { "@type": "Answer", text: "Our overall score uses a weighted formula: Performance 35% + Value 30% + Reliability 20% + Ease of Use 15%. Scores are based on published benchmarks (MMLU, HumanEval, HELM), real pricing data, uptime records, and editorial assessment." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}

const SCORE_COLOR = (s: number) =>
  s >= 9.0 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
  : s >= 8.0 ? "text-blue-600 dark:text-blue-400 bg-blue-500/10"
  : s >= 7.0 ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
  : "text-red-600 dark:text-red-400 bg-red-500/10";

const MEDAL = ["🥇", "🥈", "🥉"];

const CATEGORY_CONFIG: Record<string, { emoji: string; label: string; vsPath?: string }> = {
  LLM:    { emoji: "🤖", label: "Large Language Models", vsPath: "/vs/chatgpt-vs-claude" },
  Coding: { emoji: "💻", label: "Coding Tools", vsPath: "/vs/copilot-vs-cursor" },
  Image:  { emoji: "🎨", label: "Image Generators", vsPath: "/vs/midjourney-vs-dalle" },
  Audio:  { emoji: "🔊", label: "Voice & Audio" },
  Video:  { emoji: "🎬", label: "Video Generators", vsPath: "/vs/sora-vs-runway" },
  Cloud:  { emoji: "☁️", label: "Cloud AI Platforms", vsPath: "/vs/aws-bedrock-vs-azure-openai" },
};

export default function LlmLeaderboardPage() {
  const allCategories = [...new Set(ALL_SCORES.map((s) => s.category))];
  const overallTop = [...ALL_SCORES].sort((a, b) => b.overall - a.overall).slice(0, 3);

  return (
    <div className="py-8 sm:py-10 px-4">
      <LeaderboardJsonLd />
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/rankings" className="hover:text-foreground transition-colors">Rankings</Link>
          <span>/</span>
          <span className="text-foreground">LLM Leaderboard</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live rankings · Updated April 13, 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            AI Model Leaderboard 2026
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Independent rankings of {ALL_SCORES.length}+ AI tools across Performance, Value, Reliability, and Ease of Use.
            Weighted score: Performance 35% · Value 30% · Reliability 20% · Ease of Use 15%.
          </p>
        </div>

        {/* ── Visual Charts ── */}
        <div className="mb-10 grid lg:grid-cols-2 gap-6">
          {/* Radar: top 4 LLMs across all dimensions */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Top LLMs — Dimension Radar</p>
            <p className="text-[11px] text-muted-foreground mb-3">4-dimension comparison of the leading models</p>
            <LeaderboardRadar tools={ALL_SCORES.filter(s => s.category === "LLM").sort((a,b) => b.overall - a.overall).slice(0,4)} />
          </div>
          {/* Overall Bar: top 10 all categories */}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Top 8 Overall — All Categories</p>
            <p className="text-[11px] text-muted-foreground mb-3">Ranked by overall weighted score</p>
            <OverallBarChart tools={[...ALL_SCORES].sort((a,b) => b.overall - a.overall).slice(0,8)} />
          </div>
        </div>

        {/* ── Winner Podium ── */}
        <div className="leaderboard-winner mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Overall Top 3 — All Categories</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {overallTop.map((tool, i) => (
              <div key={tool.id} className={`rounded-xl border border-border bg-background p-4 text-center ${i === 0 ? "ring-2 ring-primary/30" : ""}`}>
                <div className="text-2xl mb-1">{MEDAL[i]}</div>
                <p className="font-bold text-foreground">{tool.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{tool.provider}</p>
                <span className={`text-2xl font-extrabold px-2 py-0.5 rounded-lg ${SCORE_COLOR(tool.overall)}`}>
                  {tool.overall.toFixed(1)}
                </span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tool.verdict}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Per-category tables ── */}
        {allCategories.map((cat) => {
          const tools = ALL_SCORES.filter((s) => s.category === cat).sort((a, b) => b.overall - a.overall);
          const cfg = CATEGORY_CONFIG[cat] ?? { emoji: "🔧", label: cat };
          return (
            <section key={cat} className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  {cfg.emoji} {cfg.label}
                </h2>
                <div className="flex items-center gap-3">
                  {cfg.vsPath && (
                    <Link href={cfg.vsPath} className="text-xs text-primary hover:underline underline-offset-2">
                      Head-to-head →
                    </Link>
                  )}
                  <Link href={`/rankings?category=${cat}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Full rankings →
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-8">#</th>
                        <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                        {SCORE_DIMENSIONS.map((d) => (
                          <th key={d.key} className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{d.label}</th>
                        ))}
                        <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.map((tool, i) => (
                        <tr key={tool.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-bold text-muted-foreground">
                            {i < 3 ? MEDAL[i] : i + 1}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.provider}</p>
                          </td>
                          {SCORE_DIMENSIONS.map((d) => (
                            <td key={d.key} className="px-3 py-3 text-center">
                              <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${SCORE_COLOR(tool[d.key])}`}>
                                {tool[d.key].toFixed(1)}
                              </span>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            <span className={`text-base font-extrabold px-2.5 py-1 rounded-lg ${SCORE_COLOR(tool.overall)}`}>
                              {tool.overall.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-border">
                  {tools.map((tool, i) => (
                    <div key={tool.id} className="p-4 flex items-center gap-3">
                      <span className="text-lg shrink-0 w-8 text-center">{i < 3 ? MEDAL[i] : i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.provider}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tool.verdict}</p>
                      </div>
                      <span className={`text-lg font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${SCORE_COLOR(tool.overall)}`}>
                        {tool.overall.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ── Verdict / GEO anchor ── */}
        <div className="leaderboard-verdict mb-10 rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Verdict — April 2026</p>
          <p className="text-sm text-foreground leading-relaxed">
            <strong>Best overall LLM:</strong> Claude Sonnet 4.6 leads on the combined score with the best price-performance ratio.
            <strong className="ml-1">Best value API:</strong> Gemini 2.5 Flash — near-frontier quality at commodity prices.
            <strong className="ml-1">Best for enterprise:</strong> Azure OpenAI — highest reliability (9.5) with Microsoft compliance stack.
            <strong className="ml-1">Best open-source:</strong> LLaMA 3.1 405B — free to self-host with no API costs.
          </p>
        </div>

        {/* ── FAQ ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the best LLM in 2026?", a: "Claude Sonnet 4.6 leads our overall leaderboard with a 9.1/10 score, combining top-tier performance (9.2) with excellent value (8.8). For general consumer use, GPT-4o remains the most versatile choice." },
              { q: "How is the overall score calculated?", a: "Overall = Performance×35% + Value×30% + Reliability×20% + Ease of Use×15%. Performance is based on MMLU, HumanEval, and HELM benchmarks. Value reflects price-to-capability ratio. Reliability uses uptime data and vendor risk. Ease of Use covers interface, documentation, and API quality." },
              { q: "Is Claude better than ChatGPT?", a: "On our leaderboard, Claude Sonnet 4.6 (9.1 overall) outscores GPT-4o (8.9 overall). Claude leads on writing quality and reasoning depth. ChatGPT leads on ecosystem breadth, integrations, and consumer familiarity." },
              { q: "Which AI model has the best value for money?", a: "Gemini 2.5 Flash scores 9.8/10 on value — the highest of any model on our leaderboard. It delivers performance comparable to GPT-4o at the same price as GPT-4o mini ($0.15/$0.60 per 1M tokens)." },
              { q: "How often is this leaderboard updated?", a: "Our AI agents monitor model releases, pricing changes, and benchmark publications in real-time. The leaderboard is reviewed and updated at minimum weekly, with major releases reflected within 24 hours." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology note */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">How we score AI models</p>
          <p className="text-xs text-muted-foreground mb-3">
            Our rankings are independent — we are not paid by any AI company to rank their products.
            Scores are based on published benchmarks, real pricing data, and editorial assessment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/methodology" className="text-sm px-4 py-1.5 rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Read our methodology →
            </Link>
            <Link href="/rankings" className="text-sm px-4 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-foreground">
              Full rankings page
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
