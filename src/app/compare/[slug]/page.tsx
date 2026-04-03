import { notFound } from "next/navigation";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import AddPlatformModal from "@/components/AddPlatformModal";
import { ScoreCard } from "@/components/ScoreCard";
import { RatingsSummary } from "@/components/StarRating";
import { getComparisonData, getFeaturedComparisonSlugs } from "@/lib/data";
import { getScoreByName } from "@/lib/scores";
import { auth } from "@/lib/auth";

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
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${data.title} - AI Compare`,
      description: enrichedDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

function ComparisonJsonLd({
  data,
  slug,
}: {
  data: {
    title: string;
    description: string;
    lastUpdated: string;
    columns: { name: string; url: string }[];
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
    publisher: {
      "@type": "Organization",
      name: "AI Compare",
      url: SITE_URL,
    },
    author: [
      { "@type": "Person", name: "Jigar Acharya" },
      { "@type": "Person", name: "Saurabh Gera" },
    ],
    about: data.columns.map((col) => ({
      "@type": "SoftwareApplication",
      name: col.name,
      url: col.url,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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

  return (
    <div className="py-8 sm:py-12 px-4">
      <ComparisonJsonLd data={data} slug={slug} />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{data.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {data.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{data.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Data verified: {data.lastUpdated}
              </span>
              <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
                How we collect this data →
              </Link>
            </div>
          </div>
          {ADD_ENTRY_CONFIG[slug] && canAddEntry && (
            <AddPlatformModal slug={slug} entityLabel={ADD_ENTRY_CONFIG[slug]} />
          )}
        </div>

        {/* Score Cards */}
        {(() => {
          const scored = data.columns.map((col) => getScoreByName(col.name)).filter(Boolean);
          if (scored.length < 2) return null;
          return (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Scores at a Glance</h2>
                <Link href="/rankings" className="text-xs text-primary hover:underline underline-offset-2">See full rankings →</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {scored.map((score) => score && <ScoreCard key={score.id} score={score} />)}
              </div>
            </div>
          );
        })()}

        {/* Table */}
        <ComparisonTable data={data} enableColumnFilter={COLUMN_FILTER_SLUGS.has(slug)} />

        {/* User Ratings */}
        {(() => {
          const scored = data.columns
            .map((col) => getScoreByName(col.name))
            .filter(Boolean);
          if (scored.length < 1) return null;
          return (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">Community Ratings</h2>
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
          );
        })()}
      </div>
    </div>
  );
}
