import { redirect } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tool Rankings — We Compare AI",
  description: "AI tool rankings across Performance, Value, Reliability and Ease of Use.",
  alternates: { canonical: `${SITE_URL}/rankings` },
  robots: { index: false },
};

export default function ResearchRankingsPage() {
  redirect("/rankings");
}
