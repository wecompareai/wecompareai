import { notFound } from "next/navigation";
import Link from "next/link";
import { alternativePages, getAlternativePage, getAlternativeSlugs } from "@/lib/alternatives";
import { getScoreByName } from "@/lib/scores";
import { MiniScoreChart } from "@/components/charts/ScoreBarChart";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAlternativeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAlternativePage(slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.description,
    keywords: [`best ${page.tool} alternatives`, `${page.tool} alternative`, `alternatives to ${page.tool}`, "AI comparison 2026"],
    alternates: { canonical: `${SITE_URL}/alternatives/${slug}` },
    openGraph: {
      title: `${page.title} | We Compare AI`,
      description: page.description,
      url: `${SITE_URL}/alternatives/${slug}`,
      siteName: "We Compare AI",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

const RANK_COLORS = [
  "border-amber-500/40 bg-amber-500/5",
  "border-slate-400/40 bg-slate-400/5",
  "border-orange-500/30 bg-orange-500/5",
  "border-border bg-card",
  "border-border bg-card",
];

const RANK_BADGES = ["🥇 #1 Pick", "🥈 #2 Pick", "🥉 #3 Pick", "#4", "#5"];

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAlternativePage(slug);
  if (!page) notFound();

  const related = alternativePages.filter((p) => page.relatedSlugs.includes(p.slug));

  const pageUrl = `${SITE_URL}/alternatives/${slug}`;
  const topAlt = page.alternatives?.[0];

  // Look up scores for chart
  const chartTools = page.alternatives
    .slice(0, 5)
    .map((alt) => getScoreByName(alt.name.split(" ")[0]))
    .filter(Boolean) as NonNullable<ReturnType<typeof getScoreByName>>[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    datePublished: page.lastUpdated,
    url: pageUrl,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [
      { "@type": "Person", name: "Jigar Acharya", jobTitle: "Co-founder & Solution Architect", url: `${SITE_URL}/about` },
      { "@type": "Person", name: "Saurabh Gera", jobTitle: "Co-founder & Infrastructure Architect", url: `${SITE_URL}/about` },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".alternatives-verdict", ".top-pick-card"],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Alternatives", item: `${SITE_URL}/alternatives` },
      { "@type": "ListItem", position: 3, name: `${page.tool} Alternatives`, item: pageUrl },
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/alternatives" className="hover:text-foreground transition-colors">Alternatives</Link>
        <span>/</span>
        <span className="text-foreground">{page.tool}</span>
      </nav>

      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{page.headline}</h1>
        <p className="text-muted-foreground leading-relaxed">{page.description}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated: {page.lastUpdated}
          </span>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
            How we rank →
          </Link>
        </div>
      </div>

      {/* TL;DR */}
      {topAlt && (
        <div className="rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-3 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">TL;DR</p>
          <p className="text-sm text-foreground leading-relaxed">
            The best {page.tool} alternative in 2026 is <strong>{topAlt.name}</strong> — {topAlt.tagline.toLowerCase()}.
            {page.alternatives?.[1] ? ` ${page.alternatives[1].name} is the best runner-up.` : ""}
          </p>
        </div>
      )}

      {/* ── Score comparison chart ── */}
      {chartTools.length >= 2 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Score Comparison — {page.tool} Alternatives
            </p>
            <Link href="/rankings" className="text-xs text-primary hover:underline underline-offset-2">All rankings →</Link>
          </div>
          <MiniScoreChart tools={chartTools} />
          <p className="text-[10px] text-muted-foreground text-center">Scores: Performance · Value · Reliability · Ease of Use (0–10)</p>
        </div>
      )}

      {/* Quick comparison table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">Alternative</th>
              <th className="px-4 py-2 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Best For</th>
              <th className="px-4 py-2 text-xs font-semibold text-muted-foreground">Pricing</th>
            </tr>
          </thead>
          <tbody>
            {page.alternatives.map((alt, idx) => (
              <tr key={alt.name} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{["🥇","🥈","🥉","4️⃣","5️⃣"][idx]}</span>
                    <span className="font-medium text-foreground">{alt.name}</span>
                    {alt.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{alt.badge}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground hidden sm:table-cell">{alt.bestFor}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{alt.pricing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Why look */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <h2 className="font-semibold text-sm text-foreground mb-2">Why look for a {page.tool} alternative?</h2>
        <ul className="space-y-1">
          {page.whyLook.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">→</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Alternatives detail cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Top {page.alternatives.length} {page.tool} Alternatives</h2>
        {page.alternatives.map((alt, idx) => (
          <div key={alt.name} className={`rounded-xl border p-4 sm:p-5 space-y-3 ${RANK_COLORS[idx] ?? "border-border bg-card"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                  {RANK_BADGES[idx]}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{alt.name}</h3>
                  <p className="text-xs text-muted-foreground">{alt.tagline}</p>
                </div>
              </div>
              {alt.badge && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {alt.badge}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">✓ Pros</div>
                <ul className="space-y-1">
                  {alt.pros.map((p, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0">+</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1.5">✗ Cons</div>
                <ul className="space-y-1">
                  {alt.cons.map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0">−</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="flex gap-4 text-xs">
                <span className="text-muted-foreground"><strong className="text-foreground">Pricing:</strong> {alt.pricing}</span>
                <span className="text-muted-foreground hidden sm:inline"><strong className="text-foreground">Best for:</strong> {alt.bestFor}</span>
              </div>
              {alt.href && (
                <a
                  href={alt.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Try {alt.name.split(" ")[0]} →
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Verdict */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
        <h2 className="font-semibold text-sm text-foreground">Our Verdict</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">{page.verdict}</p>
      </div>

      {/* FAQs */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">FAQ</h2>
        {page.faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-sm text-foreground mb-1.5">{faq.q}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-foreground">Related Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/alternatives/${r.slug}`}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-all"
              >
                Best {r.tool} Alternatives →
              </Link>
            ))}
            <Link href="/alternatives" className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-all">
              All Alternatives →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
