import { notFound } from "next/navigation";
import Link from "next/link";
import { alternativePages, getAlternativePage, getAlternativeSlugs } from "@/lib/alternatives";

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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    url: pageUrl,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [{ "@type": "Person", name: "Jigar Acharya" }, { "@type": "Person", name: "Saurabh Gera" }],
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/alternatives" className="hover:text-foreground transition-colors">Alternatives</Link>
        <span>/</span>
        <span className="text-foreground">{page.tool}</span>
      </nav>

      {/* TL;DR Executive Summary */}
      {topAlt && (
        <div className="rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">TL;DR</p>
          <p className="text-sm text-foreground leading-relaxed">
            The best {page.tool} alternative in 2026 is <strong>{topAlt.name}</strong> — {topAlt.tagline.toLowerCase()}.{page.alternatives?.[1] ? ` ${page.alternatives[1].name} is the best runner-up.` : ""}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{page.headline}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{page.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated: {page.lastUpdated}
          </span>
          <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
            How we rank →
          </Link>
        </div>
      </div>

      {/* Why look */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <h2 className="font-semibold text-foreground mb-3 text-sm">Why look for a {page.tool} alternative?</h2>
        <ul className="space-y-1.5">
          {page.whyLook.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">→</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Alternatives */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Top {page.alternatives.length} {page.tool} Alternatives</h2>
        {page.alternatives.map((alt, idx) => (
          <div key={alt.name} className={`rounded-xl border p-5 sm:p-6 space-y-4 ${RANK_COLORS[idx] ?? "border-border bg-card"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                  {RANK_BADGES[idx]}
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{alt.name}</h3>
                  <p className="text-sm text-muted-foreground">{alt.tagline}</p>
                </div>
              </div>
              {alt.badge && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {alt.badge}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">✓ Pros</div>
                <ul className="space-y-1">
                  {alt.pros.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5 shrink-0">+</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">✗ Cons</div>
                <ul className="space-y-1">
                  {alt.cons.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-rose-500 mt-0.5 shrink-0">−</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border">
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">Pricing</div>
                <div className="text-sm font-medium text-foreground">{alt.pricing}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">Best for</div>
                <div className="text-sm text-foreground">{alt.bestFor}</div>
              </div>
              {alt.href && (
                <a
                  href={alt.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Try {alt.name.split(" ")[0]} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2">
        <h2 className="font-semibold text-foreground">Our Verdict</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{page.verdict}</p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {page.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Related Comparisons</h2>
          <div className="flex flex-wrap gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/alternatives/${r.slug}`}
                className="text-sm px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-all"
              >
                Best {r.tool} Alternatives →
              </Link>
            ))}
            <Link href="/alternatives" className="text-sm px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-all">
              All Alternatives →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
