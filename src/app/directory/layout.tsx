import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tool Directory — 100+ Tools by Category & Pricing | We Compare AI",
  description:
    "Browse the most complete AI tool directory. 100+ tools filterable by category (LLM, coding, image, audio, video, cloud) and pricing model (free, freemium, paid, enterprise). Find the right AI tool instantly.",
  alternates: { canonical: `${SITE_URL}/directory` },
  keywords: [
    "AI tool directory", "AI tools list", "best AI tools 2026", "free AI tools",
    "AI software comparison", "LLM directory", "AI coding tools", "image generation AI",
  ],
  openGraph: {
    title: "AI Tool Directory — 100+ Tools | We Compare AI",
    description: "Browse 100+ AI tools by category, pricing, and use case. The most complete AI directory.",
    url: `${SITE_URL}/directory`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Directory — 100+ Tools | We Compare AI",
    description: "Browse 100+ AI tools by category and pricing. Find the right AI tool instantly.",
  },
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  const SITE_URL_CONST = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Tool Directory — We Compare AI",
    description: "100+ AI tools across LLM, coding, image, audio, video, and cloud categories",
    url: `${SITE_URL_CONST}/directory`,
    numberOfItems: 100,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL_CONST },
      { "@type": "ListItem", position: 2, name: "AI Tool Directory", item: `${SITE_URL_CONST}/directory` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {children}
    </>
  );
}
