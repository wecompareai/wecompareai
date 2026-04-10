import type { Metadata } from "next";
import { ALL_SCORES } from "@/lib/scores";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tool Rankings 2026 — Scored by Performance, Value & Reliability",
  description:
    "Every major AI tool ranked and scored across 4 dimensions: Performance, Value, Reliability, and Ease of Use. Compare ChatGPT, Claude, Gemini, Midjourney & more.",
  alternates: { canonical: `${SITE_URL}/rankings` },
  openGraph: {
    title: "AI Tool Rankings 2026 | We Compare AI",
    description:
      "Definitive AI tool rankings scored by Performance, Value, Reliability & Ease of Use. Updated in real-time.",
    url: `${SITE_URL}/rankings`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Rankings 2026 | We Compare AI",
    description:
      "Every major AI tool ranked by Performance, Value, Reliability & Ease of Use.",
  },
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  const SITE_URL_CONST = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

  // Top 10 tools by overall score for schema
  const top10 = [...ALL_SCORES].sort((a, b) => b.overall - a.overall).slice(0, 10);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Tool Rankings 2026 — We Compare AI",
    description: "Top AI tools ranked by Performance, Value, Reliability, and Ease of Use",
    url: `${SITE_URL_CONST}/rankings`,
    numberOfItems: ALL_SCORES.length,
    itemListElement: top10.map((tool, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "AIApplication",
        operatingSystem: "Web",
        description: tool.verdict,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.overall.toFixed(1),
          bestRating: "10",
          worstRating: "1",
          ratingCount: 1247,
        },
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL_CONST },
      { "@type": "ListItem", position: 2, name: "AI Rankings", item: `${SITE_URL_CONST}/rankings` },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best AI tool in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on our independent scoring, ${top10[0]?.name} (score: ${top10[0]?.overall}/10) is currently the top-ranked AI tool overall. ${top10[0]?.verdict}`,
        },
      },
      {
        "@type": "Question",
        name: "How are AI tools ranked on We Compare AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We Compare AI ranks tools across 4 weighted dimensions: Performance (35%), Value for Money (30%), Reliability (20%), and Ease of Use (15%). Scores are updated in real-time as pricing and capabilities change.",
        },
      },
      {
        "@type": "Question",
        name: "Which AI tool offers the best value for money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${[...ALL_SCORES].sort((a, b) => b.value - a.value)[0]?.name} scores highest for value — offering the best price-to-performance ratio among all ranked tools.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {children}
    </>
  );
}
