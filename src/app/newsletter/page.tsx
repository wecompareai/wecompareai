import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Pricing & Model News — Weekly Newsletter | We Compare AI",
  description:
    "Subscribe to the We Compare AI weekly newsletter. Every Thursday: AI model releases, pricing changes, benchmark results, and compliance updates. Free.",
  alternates: { canonical: `${SITE_URL}/newsletter` },
  openGraph: {
    title: "AI Pricing & Model News — Weekly Newsletter | We Compare AI",
    description: "Weekly AI pricing changes, model releases, and benchmark results. Free every Thursday.",
    url: `${SITE_URL}/newsletter`,
    siteName: "We Compare AI",
    type: "website",
  },
};

const PAST_ISSUES = [
  {
    week: "Week 15, 2026",
    date: "April 9, 2026",
    headline: "Gemini 2.5 Flash at $0.15/1M — cheapest frontier model ever",
    preview: "Google cuts Gemini pricing 40%, Claude Sonnet 4.6 beats GPT-4o on benchmarks, GPT-4.1 launches with 1M token context.",
    href: "/research/ai-news",
  },
  {
    week: "Week 14, 2026",
    date: "April 2, 2026",
    headline: "EU AI Act enforcement begins — compliance status of all major models",
    preview: "GPT-4.1 and GPT-4.1 Mini launched, EU AI Act enforcement live, DeepSeek compliance unclear for EU deployments.",
    href: "/research/ai-news",
  },
  {
    week: "Week 13, 2026",
    date: "March 26, 2026",
    headline: "GitHub Copilot goes free for 2,000 completions/month",
    preview: "GitHub Copilot free tier announced, Sora expands to Plus users, ElevenLabs raises Series C at $3B valuation.",
    href: "/research/ai-news",
  },
];

const WHAT_YOU_GET = [
  {
    icon: "💰",
    title: "Pricing changes",
    desc: "Every API price cut or increase across OpenAI, Anthropic, Google, Mistral, and more — with context on what it means.",
  },
  {
    icon: "🚀",
    title: "Model releases",
    desc: "New model launches, capability upgrades, and context window expansions — with benchmark comparisons to existing models.",
  },
  {
    icon: "📊",
    title: "Benchmark results",
    desc: "Our independent test results and third-party benchmark data — MMLU, MATH, SWE-bench, HumanEval, and more.",
  },
  {
    icon: "⚖️",
    title: "Compliance updates",
    desc: "EU AI Act, SOC 2, HIPAA, GDPR — regulatory changes that affect enterprise AI purchasing decisions.",
  },
  {
    icon: "🏆",
    title: "Rankings movement",
    desc: "Which tools moved up or down in our independent rankings this week, and why.",
  },
  {
    icon: "🔍",
    title: "Deals & changes",
    desc: "Free tier expansions, plan restructuring, acquisition news, and major product announcements.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Newsletter</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Free · Every Thursday · No spam
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            The AI Pricing & Model Update
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Every Thursday, we send one email: what changed in AI pricing, which models launched,
            and what it means for developers and teams.
          </p>
        </div>

        {/* Signup box */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 mb-10">
          <p className="text-center text-sm font-semibold text-foreground mb-5">
            Join developers, startups & AI teams making smarter decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <button
              type="button"
              className="shrink-0 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Subscribe free
            </button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            No spam. Unsubscribe with one click at any time.
          </p>
        </div>

        {/* What you get */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">What&apos;s in each issue</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {WHAT_YOU_GET.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-4 flex gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past issues */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Recent issues</h2>
            <Link href="/research/ai-news" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {PAST_ISSUES.map((issue) => (
              <Link
                key={issue.week}
                href={issue.href}
                className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{issue.week}</span>
                  <span className="text-[10px] text-muted-foreground">{issue.date}</span>
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{issue.headline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{issue.preview}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <div className="rounded-xl border border-border bg-card p-6 text-center mb-10">
          <p className="text-2xl font-extrabold text-primary mb-1">Thursday.</p>
          <p className="text-sm text-muted-foreground">
            One email, one day a week. Covers everything that changed in AI pricing and models.<br />
            Read in under 3 minutes.
          </p>
        </div>

        {/* Second CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Ready to stay ahead?</p>
            <p className="text-xs text-muted-foreground">Free. No credit card. Unsubscribe any time.</p>
          </div>
          <Link
            href="#"
            className="shrink-0 inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
          >
            Subscribe free →
          </Link>
        </div>

      </div>
    </div>
  );
}
