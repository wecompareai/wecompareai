import { Metadata } from "next";
import Link from "next/link";
import { bestForPages } from "@/lib/best-for";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Best AI For… — Opinionated AI Recommendations for Every Use Case",
  description: "Find the best AI tool for your specific use case. Honest, opinionated top-3 picks for coding, writing, students, marketing, startups, image generation, and more.",
  alternates: { canonical: `${SITE_URL}/best` },
  openGraph: {
    title: "Best AI For… | We Compare AI",
    description: "Top-3 AI picks for every use case — coding, writing, marketing, students, startups, and more.",
    url: `${SITE_URL}/best`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const ICONS: Record<string, string> = {
  coding: "💻",
  students: "🎓",
  writing: "✍️",
  marketing: "📣",
  startups: "🚀",
  "image-generation": "🎨",
  "data-analysis": "📊",
  "video-generation": "🎬",
  productivity: "⚡",
  "social-media": "📱",
  research: "🔬",
  "voice-cloning": "🎙️",
  "music-generation": "🎵",
  "customer-support": "💬",
  healthcare: "🏥",
  legal: "⚖️",
  "hr-recruiting": "👥",
  finance: "💰",
  ecommerce: "🛒",
  cybersecurity: "🔒",
  business: "🏢",
  "education-teachers": "📚",
};

export default function BestForIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Best AI For…</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Best AI For…</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Stop comparing — start deciding. Our opinionated, use-case-specific top-3 picks, based on real testing and updated in real-time.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Updated in real-time by AI agents ·
          <Link href="/methodology" className="text-primary hover:underline underline-offset-2">How we pick →</Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bestForPages.map((page) => (
          <Link
            key={page.slug}
            href={`/best/${page.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
          >
            <div className="text-3xl mb-3">{ICONS[page.slug] ?? "🤖"}</div>
            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {page.headline}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {page.description}
            </p>
            <div className="mt-4 flex items-center gap-1.5">
              {page.tools.map((t) => (
                <span key={t.name} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {t.name.split(" ")[0]}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-primary font-medium group-hover:underline underline-offset-2">
              See top 3 picks →
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Not sure which use case fits you?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Answer 6 questions and get a personalized AI stack recommendation.
          </p>
        </div>
        <Link
          href="/research/finder"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try AI Tool Finder →
        </Link>
      </div>
    </div>
  );
}
