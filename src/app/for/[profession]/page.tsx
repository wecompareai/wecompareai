import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProfession, getProfessionSlugs, PROFESSIONS } from "@/lib/professions";
import { ALL_SCORES, type ToolScore } from "@/lib/scores";
import { getVsPage, buildMultiVsSlug } from "@/lib/vs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProfessionSlugs().map((profession) => ({ profession }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) return { title: "Not Found" };

  const url = `${SITE_URL}/for/${profession}`;
  return {
    title: `${p.headline} | We Compare AI`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.headline,
      description: p.description,
      url,
      siteName: "We Compare AI",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.headline,
      description: p.description,
      images: ["/og-image.png"],
    },
  };
}

function scoreColor(n: number) {
  if (n >= 9.0) return "text-emerald-600 dark:text-emerald-400";
  if (n >= 8.0) return "text-blue-600 dark:text-blue-400";
  if (n >= 7.0) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function scoreBg(n: number) {
  if (n >= 9.0) return "bg-emerald-500/10 border-emerald-500/20";
  if (n >= 8.0) return "bg-blue-500/10 border-blue-500/20";
  if (n >= 7.0) return "bg-amber-500/10 border-amber-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

export default async function ProfessionPage({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession } = await params;
  const p = getProfession(profession);
  if (!p) notFound();

  // Resolve tool scores
  const resolvedTools = p.tools
    .map((t) => {
      const score = ALL_SCORES.find((s) => s.id === t.toolId);
      return score ? { ...t, score } : null;
    })
    .filter(Boolean) as Array<{ toolId: string; useCase: string; why: string; score: ToolScore }>;

  const topPick = resolvedTools.find((t) => t.toolId === p.topPickId) ?? resolvedTools[0];

  // Build a VS slug for the top 3 tools (multi-tool comparison link)
  const top3Ids = resolvedTools.slice(0, 3).map((t) => t.toolId);
  const compareSlug = buildMultiVsSlug(top3Ids);

  // Related professions
  const relatedProfessions = p.relatedSlugs
    .map((s) => PROFESSIONS.find((pr) => pr.slug === s))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/for" className="hover:text-foreground transition-colors">AI by Profession</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{p.plural}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
            {p.emoji} {p.plural}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {p.headline}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{p.intro}</p>
        </div>

        {/* Quick use-case chips */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Common Use Cases</p>
          <div className="flex flex-wrap gap-2">
            {p.useCases.map((u) => (
              <span key={u} className="text-xs px-3 py-1 rounded-full border border-border bg-muted text-foreground font-medium">
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Top Pick banner */}
        {topPick && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                Top Pick for {p.plural}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-foreground">{topPick.score.name}</span>
                <span className={`text-sm font-bold tabular-nums ${scoreColor(topPick.score.overall)}`}>
                  {topPick.score.overall}/10
                </span>
                <span className="text-xs text-muted-foreground">by {topPick.score.provider}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                <span className="font-medium text-foreground">For {p.plural}:</span> {topPick.why}
              </p>
            </div>
          </div>
        )}

        {/* Tool cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Best AI Tools for {p.plural}
            </h2>
            <Link
              href={`/vs/${compareSlug}`}
              className="text-xs text-primary font-medium hover:underline underline-offset-2"
            >
              Compare top 3 →
            </Link>
          </div>

          <div className="space-y-3">
            {resolvedTools.map((t, idx) => {
              const isTop = t.toolId === p.topPickId;
              return (
                <div
                  key={t.toolId}
                  className={`rounded-2xl border p-5 transition-colors ${
                    isTop
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-black shrink-0 ${
                      isTop ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-foreground">{t.score.name}</span>
                        {isTop && (
                          <span className="text-[9px] font-bold text-primary uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            Top Pick
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{t.score.provider}</span>
                      </div>

                      {/* Use case tag */}
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1.5">
                        Used for: {t.useCase}
                      </p>

                      {/* Why it works */}
                      <p className="text-xs text-muted-foreground leading-relaxed">{t.why}</p>

                      {/* Score pills */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {[
                          { label: "Overall", val: t.score.overall },
                          { label: "Performance", val: t.score.performance },
                          { label: "Value", val: t.score.value },
                          { label: "Ease of Use", val: t.score.easeOfUse },
                        ].map((dim) => (
                          <div key={dim.label} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${scoreBg(dim.val)}`}>
                            <span className={scoreColor(dim.val)}>{dim.val}</span>
                            <span className="text-muted-foreground">{dim.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overall score badge */}
                    <div className="shrink-0 text-right">
                      <div className={`text-2xl font-black tabular-nums ${scoreColor(t.score.overall)}`}>
                        {t.score.overall}
                      </div>
                      <div className="text-[10px] text-muted-foreground">/ 10</div>
                      <Link
                        href={`/vs/${[t.toolId, resolvedTools.find(x => x.toolId !== t.toolId)?.toolId ?? "gpt-4o"].sort().join("-vs-")}`}
                        className="text-[10px] text-primary hover:underline mt-1 block"
                      >
                        Compare →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score comparison table */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Side-by-Side Scores</h2>
          <div className="rounded-2xl border border-border overflow-x-auto" style={{ backgroundColor: 'var(--background)' }}>
            <table className="w-full border-collapse" style={{ minWidth: `${160 + resolvedTools.length * 110}px` }}>
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-r border-border bg-muted/30 w-36">
                    Dimension
                  </th>
                  {resolvedTools.map((t) => (
                    <th key={t.toolId} className={`px-3 py-3 border-b border-r last:border-r-0 border-border text-center text-xs ${t.toolId === p.topPickId ? "bg-primary/5" : "bg-muted/10"}`}>
                      {t.toolId === p.topPickId && (
                        <div className="text-[8px] font-bold text-primary uppercase tracking-widest mb-0.5">★ Top</div>
                      )}
                      <div className="font-bold text-foreground truncate max-w-[90px] mx-auto">{t.score.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["performance", "value", "reliability", "easeOfUse"] as const).map((dim, i) => {
                  const label = { performance: "Performance", value: "Value", reliability: "Reliability", easeOfUse: "Ease of Use" }[dim];
                  const vals = resolvedTools.map((t) => t.score[dim]);
                  const max = Math.max(...vals);
                  return (
                    <tr key={dim} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                      <td className="px-4 py-2.5 border-b border-r border-border text-xs font-medium text-foreground">{label}</td>
                      {resolvedTools.map((t) => {
                        const val = t.score[dim];
                        const isTop = val === max;
                        return (
                          <td key={t.toolId} className={`px-3 py-2.5 border-b border-r last:border-r-0 border-border text-center ${isTop ? "bg-primary/5" : ""}`}>
                            <span className={`text-sm font-bold tabular-nums ${scoreColor(val)}`}>{val}</span>
                            {isTop && vals.filter(v => v === max).length === 1 && (
                              <span className="text-[10px] text-primary ml-0.5">▲</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  <td className="px-4 py-3 border-r border-border text-xs font-bold text-foreground uppercase tracking-wide">Overall</td>
                  {resolvedTools.map((t) => (
                    <td key={t.toolId} className={`px-3 py-3 border-r last:border-r-0 border-border text-center ${t.toolId === p.topPickId ? "bg-primary/10" : ""}`}>
                      <div className={`text-xl font-black tabular-nums ${scoreColor(t.score.overall)}`}>{t.score.overall}</div>
                      <div className="text-[9px] text-muted-foreground">/ 10</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Scores based on independent benchmarking across performance, value, reliability, and ease of use.{" "}
            <Link href="/methodology" className="text-primary hover:underline">How we score →</Link>
          </p>
        </div>

        {/* Full multi-tool comparison CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-foreground">See a full {resolvedTools.length}-way comparison</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {resolvedTools.map(t => t.score.name).join(", ")} — head-to-head with detailed scores
            </p>
          </div>
          <Link
            href={`/vs/${compareSlug}`}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Compare all {resolvedTools.length} tools →
          </Link>
        </div>

        {/* Related professions */}
        {relatedProfessions.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-foreground mb-3">Related Professions</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {relatedProfessions.map((rp) => rp && (
                <Link
                  key={rp.slug}
                  href={`/for/${rp.slug}`}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
                >
                  <div className="text-xl mb-1">{rp.emoji}</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    AI for {rp.plural}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{rp.tools.length} curated tools</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Browse all professions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Link href="/for" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← All professions
          </Link>
          <Link href="/vs" className="text-sm text-primary hover:underline underline-offset-2">
            Compare any two tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
