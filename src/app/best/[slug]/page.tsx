import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { bestForPages, getBestForPage, RANK_MEDALS, RANK_LABELS } from "@/lib/best-for";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export async function generateStaticParams() {
  return bestForPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getBestForPage(slug);
  if (!page) return { title: "Not Found" };

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${SITE_URL}/best/${slug}` },
    openGraph: {
      title: `${page.title} | We Compare AI`,
      description: page.description,
      url: `${SITE_URL}/best/${slug}`,
      siteName: "We Compare AI",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og-image.png"],
    },
  };
}

const RANK_COLORS = {
  1: { border: "border-amber-500/40", bg: "bg-amber-500/5", badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" },
  2: { border: "border-slate-400/40", bg: "bg-slate-500/5", badge: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30" },
  3: { border: "border-orange-400/30", bg: "bg-orange-500/5", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30" },
} as const;

export default async function BestForPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getBestForPage(slug);
  if (!page) notFound();

  const relatedPages = bestForPages.filter((p) => page.relatedSlugs.includes(p.slug));

  const pageUrl = `${SITE_URL}/best/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    datePublished: page.lastUpdated,
    url: pageUrl,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [{ "@type": "Person", name: "Jigar Acharya" }, { "@type": "Person", name: "Saurabh Gera" }],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Best AI For…", item: `${SITE_URL}/best` },
      { "@type": "ListItem", position: 3, name: page.headline, item: pageUrl },
    ],
  };

  const faqJsonLd = page.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq: { q: string; a: string }) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } : null;

  const topPick = page.tools?.[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/best" className="hover:text-foreground transition-colors">Best AI For…</Link>
        <span>/</span>
        <span className="text-foreground">{page.headline}</span>
      </div>

      {/* TL;DR Executive Summary */}
      {topPick && (
        <div className="rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">TL;DR</p>
          <p className="text-sm text-foreground leading-relaxed">
            <strong>{topPick.name}</strong> is the best {page.headline.toLowerCase()} in 2026 — {topPick.tagline.toLowerCase()}. {page.tools?.[1] ? `${page.tools[1].name} is the best runner-up.` : ""}
          </p>
        </div>
      )}

      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{page.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{page.intro}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Data verified: {page.lastUpdated}
          </span>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
            How we pick these →
          </Link>
        </div>
      </div>

      {/* Criteria */}
      <section className="rounded-xl border border-border bg-muted/30 px-5 py-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">How We Evaluated These Tools</h2>
        <ul className="space-y-1.5">
          {page.criteria.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Top 3 Tools */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Top 3 Picks</h2>
        {page.tools.map((tool) => {
          const colors = RANK_COLORS[tool.rank];
          return (
            <div key={tool.name} className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-6 space-y-5`}>
              {/* Tool Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl">{RANK_MEDALS[tool.rank]}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                      {RANK_LABELS[tool.rank]}
                    </span>
                    {tool.badge && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground">Pricing</div>
                  <div className="text-sm font-medium text-foreground mt-0.5 max-w-[200px] text-right">{tool.pricing}</div>
                </div>
              </div>

              {/* Why */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Why it's #{tool.rank}</div>
                <p className="text-sm text-foreground leading-relaxed">{tool.why}</p>
              </div>

              {/* Pros / Cons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Pros</div>
                  <ul className="space-y-1.5">
                    {tool.pros.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Cons</div>
                  <ul className="space-y-1.5">
                    {tool.cons.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-rose-500 mt-0.5 shrink-0">−</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For + Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Best for: </span>
                  {tool.bestFor}
                </div>
                <div className="flex items-center gap-2">
                  {tool.compareHref && (
                    <Link href={tool.compareHref} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors">
                      Full comparison →
                    </Link>
                  )}
                  {tool.href && (
                    <a href={tool.href} target="_blank" rel="noopener noreferrer sponsored" className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
                      Try it →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {page.faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {relatedPages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Related Guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedPages.map((related) => (
              <Link
                key={related.slug}
                href={`/best/${related.slug}`}
                className="group block rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all"
              >
                <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{related.headline}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{related.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Want a personalized recommendation?</h3>
          <p className="text-sm text-muted-foreground mt-1">Answer 6 questions and get your perfect AI stack — tailored to your budget, skill level, and use case.</p>
        </div>
        <Link href="/research/finder" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Try AI Tool Finder →
        </Link>
      </div>
    </div>
  );
}
