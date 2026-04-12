import type { Metadata } from "next";
import Link from "next/link";
import { getVsPage, getVsSlugs, VS_CATEGORIES } from "@/lib/vs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI VS Comparisons — 1,200+ Head-to-Head Tool Battles | We Compare AI",
  description:
    "1,200+ head-to-head AI comparisons: ChatGPT vs Claude, Midjourney vs DALL-E, Cursor vs Copilot, Sora vs Runway & more — every tool pair scored on Performance, Value, Reliability, and Ease of Use.",
  alternates: { canonical: `${SITE_URL}/vs` },
  openGraph: {
    title: "AI VS Comparisons — 1,200+ Head-to-Head | We Compare AI",
    description: "1,200+ head-to-head AI comparisons grouped by category.",
    url: `${SITE_URL}/vs`,
    siteName: "We Compare AI",
    type: "website",
  },
};

export default function VsIndexPage() {
  const allSlugs = getVsSlugs();
  const totalCount = allSlugs.length;

  // Build all pages and group by category
  const allPages = allSlugs
    .map((slug) => getVsPage(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getVsPage>>[];

  // Category order from VS_CATEGORIES, plus a catch-all "AI Tools" for cross-category
  const knownLabels = VS_CATEGORIES.map((c) => c.label);
  const byCategory = [
    ...VS_CATEGORIES.map((cat) => ({
      label: cat.label,
      emoji: cat.emoji,
      pages: allPages.filter((p) => p.category === cat.label),
    })),
    {
      label: "AI Tools",
      emoji: "🤖" as const,
      pages: allPages.filter((p) => !knownLabels.includes(p.category as typeof knownLabels[number])),
    },
  ].filter((g) => g.pages.length > 0);

  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">VS Comparisons</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            AI VS Comparisons
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            {totalCount.toLocaleString()} head-to-head comparisons across AI models, coding tools, image generators, video tools & more.
            Every matchup scored on Performance, Value, Reliability, and Ease of Use.
          </p>
        </div>

        {/* Category sections */}
        <div className="space-y-12">
          {byCategory.map((cat) => {
            // Show first 12 cards per category with a "see all" link if more
            const shown = cat.pages.slice(0, 12);
            const remaining = cat.pages.length - shown.length;
            return (
              <section key={cat.label}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.emoji}</span>
                  <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
                  <span className="text-xs text-muted-foreground">({cat.pages.length.toLocaleString()} comparisons)</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shown.map((page) => {
                    const aWins = page.toolA.overall >= page.toolB.overall;
                    const winner = aWins ? page.toolA : page.toolB;
                    return (
                      <Link
                        key={page.slug}
                        href={`/vs/${page.slug}`}
                        className="group rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-4 flex flex-col gap-3"
                      >
                        {/* Tool names */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <span className="truncate">{page.toolA.name}</span>
                          <span className="text-muted-foreground shrink-0 text-xs">vs</span>
                          <span className="truncate">{page.toolB.name}</span>
                        </div>

                        {/* Score chips */}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${aWins ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border"}`}>
                            {page.toolA.overall.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">vs</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${!aWins ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border"}`}>
                            {page.toolB.overall.toFixed(1)}
                          </span>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            Winner: <span className="font-medium text-foreground">{winner.name.split(" ")[0]}</span>
                          </span>
                        </div>

                        {/* Verdict snippet */}
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {page.verdict}
                        </p>

                        <span className="text-xs text-primary group-hover:underline underline-offset-2 mt-auto">
                          See full comparison →
                        </span>
                      </Link>
                    );
                  })}
                </div>
                {remaining > 0 && (
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    + {remaining.toLocaleString()} more {cat.label} comparisons — search or browse via the rankings page
                  </p>
                )}
              </section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Looking for a specific comparison?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Any two AI tools can be compared — just type{" "}
            <span className="font-mono text-foreground">/vs/tool-a-vs-tool-b</span> in the URL, e.g.{" "}
            <Link href="/vs/claude-opus-4-vs-gpt-4-1" className="text-primary hover:underline underline-offset-2">/vs/claude-opus-4-vs-gpt-4-1</Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/categories" className="text-sm px-4 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-foreground">
              Browse by Category
            </Link>
            <Link href="/rankings" className="text-sm px-4 py-1.5 rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              View Rankings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
