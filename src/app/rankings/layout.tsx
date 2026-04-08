import type { Metadata } from "next";

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
  return <>{children}</>;
}
