import Link from "next/link";
import type { Metadata } from "next";
import { PROFESSIONS } from "@/lib/professions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tools by Profession (2026) | We Compare AI",
  description: "Find the best AI tools for your profession. Curated recommendations for lawyers, doctors, teachers, marketers, developers, designers, and 10+ more professions.",
  alternates: { canonical: `${SITE_URL}/for` },
  openGraph: {
    title: "AI Tools by Profession | We Compare AI",
    description: "Find the best AI tools for your specific profession — curated, scored, and compared.",
    url: `${SITE_URL}/for`,
    siteName: "We Compare AI",
    type: "website",
  },
};

export default function ForIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Profession-specific AI recommendations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            AI Tools for Your Profession
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Not all AI tools are equal for every job. We&apos;ve curated the best tools for each profession — with specific use cases and honest scoring.
          </p>
        </div>

        {/* Profession grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROFESSIONS.map((p) => (
            <Link
              key={p.slug}
              href={`/for/${p.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    AI for {p.plural}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {p.tools.length} curated tools · {p.useCases[0]}, {p.useCases[1]}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.useCases.slice(0, 3).map((u) => (
                  <span key={u} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-sm font-bold text-foreground mb-1">Don&apos;t see your profession?</p>
          <p className="text-xs text-muted-foreground mb-4">Browse all 90+ AI tools and compare any two head-to-head.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/categories" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Browse all tools →
            </Link>
            <Link href="/vs" className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              Compare tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
