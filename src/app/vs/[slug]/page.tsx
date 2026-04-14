import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getVsPage, getVsSlugs } from "@/lib/vs";
import { VsRadarChart } from "@/components/charts/VsRadarChart";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getVsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getVsPage(slug);
  if (!page) return { title: "Not Found" };

  const url = `${SITE_URL}/vs/${slug}`;
  return {
    title: `${page.toolA.name} vs ${page.toolB.name} (${new Date().getFullYear()}) | We Compare AI`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.headline,
      description: page.description,
      url,
      siteName: "We Compare AI",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.headline,
      description: page.description,
      images: ["/og-image.png"],
    },
  };
}

function VsJsonLd({ slug, page }: { slug: string; page: ReturnType<typeof getVsPage> & {} }) {
  const url = `${SITE_URL}/vs/${slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.headline,
    description: page.description,
    url,
    dateModified: page.lastUpdated,
    datePublished: page.lastUpdated,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [
      { "@type": "Person", name: "Jigar Acharya", jobTitle: "Co-founder & Solution Architect", url: `${SITE_URL}/authors/jigar-acharya` },
      { "@type": "Person", name: "Saurabh Gera", jobTitle: "Co-founder & Infrastructure Architect", url: `${SITE_URL}/authors/saurabh-gera` },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".verdict-banner", ".choose-if-section"],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "VS Comparisons", item: `${SITE_URL}/vs` },
      { "@type": "ListItem", position: 3, name: `${page.toolA.name} vs ${page.toolB.name}`, item: url },
    ],
  };

  const faqLd = page.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
    </>
  );
}

const SCORE_COLOR = (s: number) =>
  s >= 9.0 ? "text-emerald-600 dark:text-emerald-400"
  : s >= 8.0 ? "text-blue-600 dark:text-blue-400"
  : "text-amber-600 dark:text-amber-400";

const DIM_LABEL: Record<string, string> = {
  performance: "Performance",
  value: "Value",
  reliability: "Reliability",
  easeOfUse: "Ease of Use",
};

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getVsPage(slug);
  if (!page) notFound();

  const { toolA, toolB } = page;
  const aWins = toolA.overall >= toolB.overall;

  const dims = [
    { key: "performance", labelA: toolA.performance, labelB: toolB.performance },
    { key: "value",       labelA: toolA.value,       labelB: toolB.value },
    { key: "reliability", labelA: toolA.reliability, labelB: toolB.reliability },
    { key: "easeOfUse",   labelA: toolA.easeOfUse,   labelB: toolB.easeOfUse },
  ];

  return (
    <div className="py-8 sm:py-10 px-4">
      <VsJsonLd slug={slug} page={page} />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/vs" className="hover:text-foreground transition-colors">VS</Link>
          <span>/</span>
          <span className="text-foreground">{toolA.name} vs {toolB.name}</span>
        </nav>

        {/* Category badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground font-medium">
            {page.categoryEmoji} {page.category}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{page.headline}</h1>
        <p className="text-sm text-muted-foreground mb-2">{page.description}</p>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated: {page.lastUpdated}
          </span>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2">
            How we score →
          </Link>
        </div>

        {/* ── Score Hero ── */}
        <div className="mb-8 rounded-2xl border border-border bg-card overflow-hidden">
          {/* Tool name headers */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <div className="p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">{toolA.provider}</p>
              <p className="text-lg font-bold text-foreground">{toolA.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{toolA.tagline}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">{toolB.provider}</p>
              <p className="text-lg font-bold text-foreground">{toolB.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{toolB.tagline}</p>
            </div>
          </div>

          {/* Overall scores */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-muted/30">
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{toolA.overall.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Overall Score</p>
              {aWins && <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">WINNER</span>}
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">{toolB.overall.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Overall Score</p>
              {!aWins && <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">WINNER</span>}
            </div>
          </div>

          {/* Radar chart */}
          <div className="p-4">
            <VsRadarChart
              nameA={toolA.name}
              nameB={toolB.name}
              performance={[toolA.performance, toolB.performance]}
              value={[toolA.value, toolB.value]}
              reliability={[toolA.reliability, toolB.reliability]}
              easeOfUse={[toolA.easeOfUse, toolB.easeOfUse]}
            />
          </div>

          {/* Dimension breakdown grid */}
          <div className="border-t border-border">
            {dims.map((d) => {
              const aWin = d.labelA > d.labelB;
              const bWin = d.labelB > d.labelA;
              return (
                <div key={d.key} className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border last:border-0">
                  <div className={`p-3 text-center text-base font-semibold ${aWin ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                    {d.labelA.toFixed(1)}
                    {aWin && <span className="ml-1 text-[9px] text-emerald-600 dark:text-emerald-400">▲</span>}
                  </div>
                  <div className="px-3 py-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold text-center border-x border-border bg-muted/20 min-w-[90px]">
                    {DIM_LABEL[d.key]}
                  </div>
                  <div className={`p-3 text-center text-base font-semibold ${bWin ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                    {d.labelB.toFixed(1)}
                    {bWin && <span className="ml-1 text-[9px] text-emerald-600 dark:text-emerald-400">▲</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Verdict banner ── */}
        <div className="mb-8 rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Our Verdict</p>
          <p className="text-sm text-foreground leading-relaxed">{page.verdict}</p>
        </div>

        {/* ── Pricing row ── */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          {[toolA, toolB].map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pricing — {t.name}</p>
              <p className="text-sm text-foreground">{t.pricing}</p>
            </div>
          ))}
        </div>

        {/* ── Pros / Cons ── */}
        <div className="mb-8 grid sm:grid-cols-2 gap-6">
          {[toolA, toolB].map((t) => (
            <div key={t.name}>
              <h2 className="text-base font-semibold text-foreground mb-3">{t.name}</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">Pros</p>
                  <ul className="space-y-1">
                    {t.pros.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1.5">Cons</p>
                  <ul className="space-y-1">
                    {t.cons.map((c) => (
                      <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Best For</p>
                  <p className="text-xs text-foreground">{t.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Choose if... ── */}
        <div className="mb-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              Choose {toolA.name} if…
            </p>
            <ul className="space-y-2">
              {page.chooseA.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground">
                  <span className="text-indigo-500 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
              Choose {toolB.name} if…
            </p>
            <ul className="space-y-2">
              {page.chooseB.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground">
                  <span className="text-amber-500 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── FAQ ── */}
        {page.faqs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related VS ── */}
        {page.relatedSlugs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-foreground mb-3">Related Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {page.relatedSlugs.map((s) => {
                const related = getVsPage(s);
                if (!related) return null;
                return (
                  <Link
                    key={s}
                    href={`/vs/${s}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {related.toolA.name} vs {related.toolB.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">See all VS comparisons</p>
          <p className="text-xs text-muted-foreground mb-3">28 head-to-head comparisons across AI models, coding tools, image generators & more.</p>
          <Link href="/vs" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2">
            Browse all comparisons →
          </Link>
        </div>
      </div>
    </div>
  );
}
