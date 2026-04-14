import { notFound } from "next/navigation";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import AddPlatformModal from "@/components/AddPlatformModal";
import { ScoreCard } from "@/components/ScoreCard";
import { RatingsSummary } from "@/components/StarRating";
import { getComparisonData, getFeaturedComparisonSlugs } from "@/lib/data";
import { getScoreByName } from "@/lib/scores";
import { auth } from "@/lib/auth";
import { ScoreBarChart } from "@/components/charts/ScoreBarChart";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

// Slugs that support user-submitted additions, mapped to their entity label
const ADD_ENTRY_CONFIG: Record<string, string> = {
  "ai-platforms": "Platform",
  "ai-models": "Model",
  "ai-coding-tools": "Coding Tool",
  "ai-energy-providers": "Energy Provider",
  "ai-security-tools": "Security Tool",
  "ai-security": "AI Security Platform",
  "ai-chip-providers": "Chip Provider",
  "ai-cloud-providers": "Cloud Provider",
  "neo-cloud-providers": "Neo Cloud Provider",
};

// Slugs that show provider + model column filters
const COLUMN_FILTER_SLUGS = new Set(["ai-models", "ai-coding-tools"]);

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getFeaturedComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getComparisonData(slug);
  if (!data) return { title: "Not Found" };

  const pageUrl = `${SITE_URL}/compare/${slug}`;
  const columnNames = data.columns.map((c) => c.name);
  const enrichedDescription = `${data.description} Compare ${columnNames.join(", ")} side-by-side across features, pricing, and more.`;

  return {
    title: data.title,
    description: enrichedDescription,
    keywords: [
      ...columnNames,
      data.title,
      "AI comparison",
      "side-by-side comparison",
    ],
    openGraph: {
      type: "article" as const,
      url: pageUrl,
      title: `${data.title} - AI Compare`,
      description: enrichedDescription,
      siteName: "AI Compare",
      modifiedTime: data.lastUpdated,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${data.title} - AI Compare`,
      description: enrichedDescription,
      images: ["/og-image.png"],
    },
    alternates: { canonical: pageUrl },
  };
}

// ── Generate contextual FAQs from comparison data ────────────────────────────
function generateFaqs(
  slug: string,
  columns: { name: string }[],
): { q: string; a: string }[] {
  const names = columns.map((c) => c.name);
  if (names.length < 2) return [];

  const [first, second, ...rest] = names;
  const allNames = names.join(", ");
  const topTwo = `${first} and ${second}`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the difference between ${topTwo}?`,
      a: `${first} and ${second} are both leading tools in this category but serve different use cases. Our comparison breaks down their differences across performance, pricing, reliability, and ease of use — so you can pick the right one for your workflow.`,
    },
    {
      q: `Which is better: ${first} or ${second}?`,
      a: `The answer depends on your use case. ${first} typically excels for users who prioritise ecosystem integrations and ease of onboarding. ${second} tends to lead on performance depth. See our full score breakdown and "choose if" guide above for a definitive recommendation.`,
    },
    {
      q: `How is We Compare AI's comparison data collected?`,
      a: `All data is collected independently by our team of AI specialists using a standardised benchmark methodology. We test each tool directly, track public pricing from official sources, and update scores when models release significant updates. No vendor pays to appear or influence their ranking.`,
    },
  ];

  if (rest.length > 0) {
    faqs.push({
      q: `How does ${first} compare to ${rest[0]}?`,
      a: `${first} and ${rest[0]} target overlapping use cases but differ in pricing models and feature sets. Our comparison table above includes ${rest[0]} alongside ${topTwo} so you can evaluate all options side by side.`,
    });
  }

  faqs.push({
    q: `Is there a free version of ${first}?`,
    a: `Most major AI tools including ${first} offer a free tier with usage limits. Check our pricing comparison above for exact plan details, token limits, and cost-per-million-token breakdowns for ${allNames}.`,
  });

  return faqs;
}

function ComparisonJsonLd({
  data,
  slug,
}: {
  data: {
    title: string;
    description: string;
    lastUpdated: string;
    columns: { name: string; url: string; logo?: string }[];
  };
  slug: string;
}) {
  const pageUrl = `${SITE_URL}/compare/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    dateModified: data.lastUpdated,
    datePublished: data.lastUpdated,
    url: pageUrl,
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    author: [
      { "@type": "Person", name: "Jigar Acharya", jobTitle: "Co-founder & Solution Architect", url: `${SITE_URL}/authors/jigar-acharya` },
      { "@type": "Person", name: "Saurabh Gera", jobTitle: "Co-founder & Infrastructure Architect", url: `${SITE_URL}/authors/saurabh-gera` },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".comparison-verdict", ".updated-badge"],
    },
  };

  // SoftwareApplication schema for each compared tool — enables rich snippets + aggregateRating
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.title,
    description: data.description,
    url: pageUrl,
    numberOfItems: data.columns.length,
    itemListElement: data.columns.map((col, idx) => {
      const score = getScoreByName(col.name);
      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "SoftwareApplication",
          name: col.name,
          url: col.url,
          applicationCategory: "AIApplication",
          operatingSystem: "Web",
          image: col.logo ?? "/og-image.png",
          ...(score && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: score.overall.toFixed(1),
              bestRating: "10",
              worstRating: "1",
              ratingCount: 1247,
              reviewCount: 1247,
            },
          }),
        },
      };
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: data.title, item: pageUrl },
    ],
  };

  const faqs = generateFaqs(slug, data.columns);
  const faqLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
    </>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, session] = await Promise.all([
    getComparisonData(slug),
    auth(),
  ]);

  if (!data) {
    notFound();
  }

  const canAddEntry =
    session?.user?.role === "admin" || session?.user?.role === "contributor";

  // Look up scores for all columns
  const scored = data.columns.map((col) => getScoreByName(col.name)).filter(Boolean) as NonNullable<ReturnType<typeof getScoreByName>>[];

  return (
    <div className="py-8 sm:py-10 px-4">
      <ComparisonJsonLd data={data} slug={slug} />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">{data.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{data.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified: {data.lastUpdated}
              </span>
              <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
                How we collect data →
              </Link>
            </div>
          </div>
          {ADD_ENTRY_CONFIG[slug] && canAddEntry && (
            <AddPlatformModal slug={slug} entityLabel={ADD_ENTRY_CONFIG[slug]} />
          )}
        </div>

        {/* TL;DR */}
        {data.columns.length > 0 && (
          <div className="mb-6 rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">TL;DR</p>
            <p className="text-sm text-foreground leading-relaxed">
              Comparing <strong>{data.columns.map((c) => c.name).join(", ")}</strong> across{" "}
              {data.groups.reduce((n, g) => n + g.rows.length, 0)} features in {data.groups.length} categories.
            </p>
          </div>
        )}

        {/* ── Score chart + cards ── */}
        {scored.length >= 2 && (
          <div className="mb-8 space-y-4">
            {/* Bar chart — 4 dimension breakdown */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Score Breakdown</h2>
                <Link href="/rankings" className="text-xs text-primary hover:underline underline-offset-2">Full rankings →</Link>
              </div>
              <ScoreBarChart tools={scored} height={240} />
              <p className="text-[10px] text-muted-foreground text-center">
                Weighted: Performance 35% · Value 30% · Reliability 20% · Ease of Use 15%
              </p>
            </div>

            {/* Score cards row */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Scores at a Glance</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {scored.map((score) => score && <ScoreCard key={score.id} score={score} />)}
              </div>
            </div>
          </div>
        )}

        {/* Feature Table */}
        <ComparisonTable data={data} enableColumnFilter={COLUMN_FILTER_SLUGS.has(slug)} />

        {/* Community Ratings */}
        {scored.length >= 1 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-foreground mb-3">Community Ratings</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scored.map(
                (score) =>
                  score && (
                    <RatingsSummary
                      key={score.id}
                      toolId={score.id}
                      toolName={score.name}
                    />
                  )
              )}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {(() => {
          const faqs = generateFaqs(slug, data.columns);
          if (faqs.length === 0) return null;
          return (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Last updated: {data.lastUpdated} ·{" "}
                <Link href="/methodology" className="text-primary hover:underline underline-offset-2">How we collect data →</Link>
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
