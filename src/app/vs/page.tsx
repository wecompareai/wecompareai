import type { Metadata } from "next";
import Link from "next/link";
import { vsPages, getVsSlugs, VS_CATEGORIES } from "@/lib/vs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI VS Comparisons — 500+ Head-to-Head Tool Battles | We Compare AI",
  description:
    "500+ head-to-head AI comparisons: ChatGPT vs Claude, Midjourney vs DALL-E, Cursor vs Copilot, Sora vs Runway & more — every tool pair scored on Performance, Value, Reliability, and Ease of Use.",
  alternates: { canonical: `${SITE_URL}/vs` },
  openGraph: {
    title: "AI VS Comparisons — 500+ Head-to-Head | We Compare AI",
    description: "500+ head-to-head AI comparisons grouped by category.",
    url: `${SITE_URL}/vs`,
    siteName: "We Compare AI",
    type: "website",
  },
};

export default function VsIndexPage() {
  const byCategory = VS_CATEGORIES.map((cat) => ({
    ...cat,
    pages: vsPages.filter((p) => p.category === cat.label),
  }));

  const totalCount = getVsSlugs().length;

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
            {totalCount} head-to-head comparisons across AI models, coding tools, image generators, video tools & more.
            Every matchup scored on Performance, Value, Reliability, and Ease of Use.
          </p>
        </div>

        {/* Category sections */}
        <div className="space-y-12">
          {byCategory.map((cat) => {
            if (cat.pages.length === 0) return null;
            return (
              <section key={cat.label}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.emoji}</span>
                  <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
                  <span className="text-xs text-muted-foreground">({cat.pages.length})</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.pages.map((page) => {
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
              </section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Want a comparison we haven't covered?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Use our full comparison table to browse 100+ tools side-by-side, or search a specific VS page above.
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
