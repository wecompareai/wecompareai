import type { Metadata } from "next";
import Link from "next/link";
import { pricingPages, PRICING_CATEGORIES } from "@/lib/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tool Pricing Comparison 2026 — Token Costs, Plans & Real-World Prices | We Compare AI",
  description:
    "Compare AI pricing across ChatGPT, Claude, Gemini, Midjourney, ElevenLabs & more. Token costs, subscription tiers, real-world cost examples, and cheapest alternatives.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "AI Tool Pricing Comparison 2026 | We Compare AI",
    description: "Token costs, subscription tiers, and real-world pricing for 15 major AI tools.",
    url: `${SITE_URL}/pricing`,
    siteName: "We Compare AI",
    type: "website",
  },
};

const FREE_BADGE = (
  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium shrink-0">
    Free tier
  </span>
);

export default function PricingIndexPage() {
  // Build a quick lookup
  const bySlug = Object.fromEntries(pricingPages.map((p) => [p.slug, p]));

  // LLM API comparison table
  const llmApi = pricingPages.filter(
    (p) => p.category === "LLM" && p.apiPricing.length > 0
  );

  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI Pricing</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated April 9, 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            AI Tool Pricing Comparison 2026
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Token costs, subscription tiers, and real-world price examples for 15 major AI tools —
            so you can pick the right tool without blowing your budget.
          </p>
        </div>

        {/* ── LLM API Quick Comparison Table ── */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            💸 LLM API Pricing at a Glance
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input / 1M tokens</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output / 1M tokens</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {llmApi.flatMap((page) =>
                    page.apiPricing.map((api, i) => (
                      <tr key={`${page.slug}-${i}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/pricing/${page.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {api.modelName}
                          </Link>
                          {api.notes && <p className="text-xs text-muted-foreground mt-0.5">{api.notes}</p>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{page.provider}</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          {api.inputPer1M !== null ? `$${api.inputPer1M.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          {api.outputPer1M !== null ? `$${api.outputPer1M.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{api.contextWindow}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Prices shown are on-demand rates. Batch pricing is typically 50% lower. All prices in USD.
          </p>
        </section>

        {/* ── Category sections ── */}
        {PRICING_CATEGORIES.map((cat) => {
          const pages = cat.slugs.map((s) => bySlug[s]).filter(Boolean);
          if (pages.length === 0) return null;
          return (
            <section key={cat.label} className="mb-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {cat.emoji} {cat.label}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => {
                  const cheapest = page.subscriptionTiers[0];
                  return (
                    <Link
                      key={page.slug}
                      href={`/pricing/${page.slug}`}
                      className="group rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{page.name}</p>
                          <p className="text-xs text-muted-foreground">{page.provider}</p>
                        </div>
                        {page.freeTier && FREE_BADGE}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{page.tagline}</p>

                      {/* Pricing highlight */}
                      <div className="flex flex-wrap gap-2">
                        {page.subscriptionTiers.slice(0, 3).map((t) => (
                          <span key={t.name} className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-muted text-foreground">
                            {t.name}: <span className="font-semibold">{t.price}</span>
                          </span>
                        ))}
                      </div>

                      {/* Cheapest API note */}
                      {page.apiPricing.length > 0 && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          API from ${Math.min(...page.apiPricing.filter(a => a.inputPer1M !== null).map(a => a.inputPer1M!)).toFixed(3)}/1M tokens
                        </p>
                      )}

                      <span className="text-xs text-primary group-hover:underline underline-offset-2 mt-auto">
                        Full pricing breakdown →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ── Cheapest LLM by task ── */}
        <section className="mb-12 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">🏆 Cheapest AI for Common Tasks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Based on actual token usage, not marketing claims</p>
          </div>
          <div className="divide-y divide-border">
            {[
              { task: "Write a blog post (1,000 words)", winner: "DeepSeek V3", cost: "$0.0004", vs: "GPT-4o costs $0.06" },
              { task: "Summarise a large PDF (50 pages)", winner: "Gemini 1.5 Flash-8B", cost: "$0.001", vs: "Claude Haiku costs $0.012" },
              { task: "Process 1M customer support messages", winner: "Amazon Nova Lite", cost: "$18", vs: "GPT-4o mini costs $45" },
              { task: "Reason through a complex problem", winner: "DeepSeek R1", cost: "$0.001", vs: "OpenAI o3 costs $0.08+" },
              { task: "Generate 500 product images", winner: "Stable Diffusion (self-hosted)", cost: "~$0", vs: "DALL-E 3 costs $20" },
              { task: "10 minutes of voice narration", winner: "ElevenLabs Flash", cost: "$0.72", vs: "Multilingual v2 costs $2.70" },
            ].map((row) => (
              <div key={row.task} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{row.task}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.vs}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{row.cost}</p>
                  <p className="text-xs text-muted-foreground">{row.winner}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Not sure which AI fits your budget?</p>
          <p className="text-xs text-muted-foreground mb-3">Our AI finder picks the right tool for your use case and team size.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/research/finder" className="text-sm px-4 py-1.5 rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Find my AI →
            </Link>
            <Link href="/compare/ai-models" className="text-sm px-4 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-foreground">
              Compare LLMs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
