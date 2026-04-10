import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPricingPage, getPricingSlugs, pricingPages } from "@/lib/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getPricingSlugs().map((tool) => ({ tool }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const page = getPricingPage(tool);
  if (!page) return { title: "Not Found" };

  const url = `${SITE_URL}/pricing/${tool}`;
  const title = `${page.name} Pricing ${new Date().getFullYear()} — Plans, API Costs & Real-World Examples`;
  return {
    title: `${title} | We Compare AI`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: page.description,
      url,
      siteName: "We Compare AI",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: ["/og-image.png"] },
  };
}

function PricingJsonLd({ tool, page }: { tool: string; page: NonNullable<ReturnType<typeof getPricingPage>> }) {
  const url = `${SITE_URL}/pricing/${tool}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${page.name} Pricing ${new Date().getFullYear()}`,
    description: page.description,
    url,
    dateModified: page.lastUpdated,
    datePublished: page.lastUpdated,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [
      { "@type": "Person", name: "Jigar Acharya", jobTitle: "Co-founder & Solution Architect", url: `${SITE_URL}/about` },
      { "@type": "Person", name: "Saurabh Gera", jobTitle: "Co-founder & Infrastructure Architect", url: `${SITE_URL}/about` },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".pricing-verdict", ".pricing-summary"],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Pricing", item: `${SITE_URL}/pricing` },
      { "@type": "ListItem", position: 3, name: `${page.name} Pricing`, item: url },
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

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.name,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    offers: page.subscriptionTiers.map((t) => ({
      "@type": "Offer",
      name: t.name,
      price: t.price === "Free" ? "0" : t.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      priceValidUntil: "2027-01-01",
      availability: "https://schema.org/InStock",
      url,
      description: t.features.join(", "),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
    </>
  );
}

export default async function PricingToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const page = getPricingPage(tool);
  if (!page) notFound();

  const cheapestSub = page.subscriptionTiers.find((t) => t.price !== "Free" && t.price !== "Custom") ?? page.subscriptionTiers[0];
  const hasApi = page.apiPricing.length > 0;
  const cheapestApi = hasApi
    ? page.apiPricing.filter((a) => a.inputPer1M !== null).sort((a, b) => a.inputPer1M! - b.inputPer1M!)[0]
    : null;

  const relatedPages = pricingPages
    .filter((p) => p.slug !== tool && p.category === page.category)
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-10 px-4">
      <PricingJsonLd tool={tool} page={page} />
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <span>/</span>
          <span className="text-foreground">{page.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground font-medium">{page.category}</span>
            {page.freeTier && (
              <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                Free tier available
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Updated {page.lastUpdated}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {page.name} Pricing {new Date().getFullYear()} — Complete Breakdown
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{page.description}</p>
        </div>

        {/* ── Quick Summary ── */}
        <div className="mb-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-foreground">{page.freeTier ? "Free" : page.subscriptionTiers[0]?.price ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">{page.freeTier ? "Free tier available" : "Starting price"}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-foreground">{cheapestSub?.price ?? "Custom"}</p>
            <p className="text-xs text-muted-foreground mt-1">Paid plan starts at</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-extrabold text-foreground">
              {cheapestApi ? `$${cheapestApi.inputPer1M!.toFixed(3)}` : page.subscriptionTiers.at(-1)?.price ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {cheapestApi ? "Cheapest API (per 1M tokens)" : "Max plan price"}
            </p>
          </div>
        </div>

        {/* ── Verdict ── */}
        <div className="mb-8 rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Our Verdict</p>
          <p className="text-sm text-foreground leading-relaxed">{page.verdict}</p>
          <p className="text-xs text-muted-foreground mt-2">
            <strong className="text-foreground">Best for:</strong> {page.bestFor}
          </p>
        </div>

        {/* ── Free tier note ── */}
        {page.freeTier && page.freeTierNote && (
          <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3 flex items-start gap-3">
            <span className="text-emerald-500 text-lg shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Free Tier</p>
              <p className="text-xs text-muted-foreground mt-0.5">{page.freeTierNote}</p>
            </div>
          </div>
        )}

        {/* ── Subscription Plans ── */}
        {page.subscriptionTiers.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-4">Subscription Plans</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.subscriptionTiers.map((tier) => (
                <div key={tier.name} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{tier.name}</p>
                    <p className="text-2xl font-extrabold text-primary mt-1">{tier.price}</p>
                    {tier.billingNote && <p className="text-[10px] text-muted-foreground mt-0.5">{tier.billingNote}</p>}
                  </div>
                  <ul className="space-y-1.5 mt-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                        <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── API Pricing ── */}
        {hasApi && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-2">API Pricing</h2>
            <p className="text-xs text-muted-foreground mb-4">Pay-per-token pricing for developers building applications. All prices in USD.</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input / 1M</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output / 1M</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {page.apiPricing.map((api, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{api.modelName}</p>
                        {api.notes && <p className="text-xs text-muted-foreground mt-0.5">{api.notes}</p>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {api.inputPer1M !== null ? `$${api.inputPer1M.toFixed(3)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {api.outputPer1M !== null ? `$${api.outputPer1M.toFixed(3)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{api.contextWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              1M tokens ≈ 750,000 words ≈ 1,500 pages. Batch API pricing is typically 50% lower.
              <Link href={page.pricingUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">
                Official pricing page →
              </Link>
            </p>
          </section>
        )}

        {/* ── Real-World Costs ── */}
        {page.realWorldCosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-2">Real-World Cost Examples</h2>
            <p className="text-xs text-muted-foreground mb-4">What does it actually cost to run common tasks?</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {page.realWorldCosts.map((row) => (
                  <div key={row.task} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{row.task}</p>
                      <div className="flex flex-wrap gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">{row.tokens}</span>
                        {row.note && <span className="text-xs text-muted-foreground">· {row.note}</span>}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">{row.cost}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        {page.faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Cheaper alternatives ── */}
        {page.cheaperAlternatives.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-3">Cheaper Alternatives to {page.name}</h2>
            <div className="flex flex-wrap gap-2">
              {page.cheaperAlternatives.map((slug) => {
                const alt = getPricingPage(slug);
                if (!alt) return null;
                return (
                  <Link
                    key={slug}
                    href={`/pricing/${slug}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {alt.name} pricing →
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Related in same category ── */}
        {relatedPages.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-foreground mb-3">Compare More {page.category} Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPages.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/pricing/${rel.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card hover:border-primary/40 px-4 py-3 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{rel.name} Pricing</p>
                    <p className="text-xs text-muted-foreground">{rel.provider}</p>
                  </div>
                  <span className="text-xs text-primary shrink-0">Compare →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Compare {page.name} against competitors</p>
          <p className="text-xs text-muted-foreground mb-3">Side-by-side feature, benchmark, and pricing comparison.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/pricing" className="text-sm px-4 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors text-foreground">
              All pricing pages
            </Link>
            <Link href="/compare/ai-models" className="text-sm px-4 py-1.5 rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Full comparison table →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
