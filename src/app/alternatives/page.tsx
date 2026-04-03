import { Metadata } from "next";
import Link from "next/link";
import { alternativePages } from "@/lib/alternatives";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Best AI Alternatives in 2026 — ChatGPT, Claude, Midjourney & More",
  description: "Find the best alternatives to every major AI tool. Honest comparisons of ChatGPT alternatives, Claude alternatives, Midjourney alternatives, and more.",
  alternates: { canonical: `${SITE_URL}/alternatives` },
  openGraph: {
    title: "Best AI Alternatives 2026 | We Compare AI",
    description: "Top alternatives to ChatGPT, Claude, Midjourney, GitHub Copilot, ElevenLabs and more — honest, updated comparisons.",
    url: `${SITE_URL}/alternatives`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const TOOL_ICONS: Record<string, string> = {
  "ChatGPT": "🤖",
  "Claude": "🧠",
  "Midjourney": "🎨",
  "GitHub Copilot": "💻",
  "ElevenLabs": "🎙️",
  "Perplexity": "🔬",
  "Cursor": "⌨️",
  "Gemini": "✨",
};

export default function AlternativesIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI Alternatives</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Best AI Alternatives</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Not happy with your current AI tool? Find the best alternative — ranked honestly by use case, price, and real-world performance.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {alternativePages.length} tool comparisons · Updated in real-time ·{" "}
          <Link href="/methodology" className="text-primary hover:underline underline-offset-2">How we rank →</Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternativePages.map((page) => (
          <Link
            key={page.slug}
            href={`/alternatives/${page.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
          >
            <div className="text-3xl mb-3">{TOOL_ICONS[page.tool] ?? "🔄"}</div>
            <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Best {page.tool} Alternatives
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {page.description}
            </p>
            <div className="mt-4 flex items-center gap-1.5 flex-wrap">
              {page.alternatives.slice(0, 3).map((alt) => (
                <span key={alt.name} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {alt.name.split(" ")[0]}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-primary font-medium group-hover:underline underline-offset-2">
              See {page.alternatives.length} alternatives →
            </div>
          </Link>
        ))}
      </div>

      {/* Popular searches */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">Popular Comparisons</h2>
        <div className="flex flex-wrap gap-2">
          {["ChatGPT vs Claude", "Cursor vs GitHub Copilot", "Midjourney vs DALL-E 3", "ElevenLabs vs Murf", "Perplexity vs ChatGPT", "Claude vs Gemini"].map((comp) => (
            <Link key={comp} href="/compare/ai-models" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              {comp}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Not sure which AI to choose?</h3>
          <p className="text-sm text-muted-foreground mt-1">Answer 6 questions and get a personalized AI recommendation for your use case.</p>
        </div>
        <Link href="/research/finder" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Try AI Finder →
        </Link>
      </div>
    </div>
  );
}
