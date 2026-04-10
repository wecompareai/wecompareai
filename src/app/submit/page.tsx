import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Submit Your AI Tool | We Compare AI",
  description:
    "Submit your AI tool to be reviewed and listed on We Compare AI — the most accurate AI model & pricing comparison platform. Free listings available.",
  alternates: { canonical: `${SITE_URL}/submit` },
  openGraph: {
    title: "Submit Your AI Tool | We Compare AI",
    description: "Get your AI tool listed on the most accurate AI comparison platform.",
    url: `${SITE_URL}/submit`,
    siteName: "We Compare AI",
    type: "website",
  },
};

const LISTING_TIERS = [
  {
    name: "Free Listing",
    price: "Free",
    priceNote: "forever",
    highlight: false,
    features: [
      "Listed in our AI directory",
      "Basic tool profile (name, description, pricing)",
      "Category & use-case tags",
      "Link to your website",
      "Included in relevant comparison pages",
    ],
    cta: "Submit for free",
    ctaStyle: "border border-border bg-card text-foreground hover:border-primary/50",
  },
  {
    name: "Verified Listing",
    price: "$49",
    priceNote: "one-time",
    highlight: true,
    features: [
      "Everything in Free",
      "Verified badge on your profile",
      "Extended data points (integrations, compliance, benchmarks)",
      "Priority review within 5 business days",
      "Featured in category newsletters",
      "Correction requests within 48 hrs",
    ],
    cta: "Get verified",
    ctaStyle: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    name: "Featured Placement",
    price: "$199",
    priceNote: "per month",
    highlight: false,
    features: [
      "Everything in Verified",
      "Featured card on homepage & category pages",
      "Highlighted in VS comparison pages",
      "Priority in AI News digest mentions",
      "Dedicated comparison page vs top competitor",
      "Monthly performance report",
    ],
    cta: "Contact us",
    ctaStyle: "border border-primary text-primary hover:bg-primary/5",
  },
];

const CATEGORIES = [
  "Large Language Model (LLM)",
  "AI Coding Tool / IDE",
  "Image Generation",
  "Video Generation",
  "Voice & Audio AI",
  "Music Generation",
  "Cloud AI Platform",
  "AI Search & Research",
  "AI Writing & Content",
  "AI Data & Analytics",
  "AI Security & Compliance",
  "AI Agent / Automation",
  "Other",
];

const FAQS = [
  {
    q: "How long does a review take?",
    a: "Free submissions are reviewed within 10–14 business days. Verified listings are reviewed within 5 business days. We manually verify all data points before publishing.",
  },
  {
    q: "What data do you collect about each tool?",
    a: "We collect pricing tiers, API costs, context windows, benchmark scores, supported integrations, compliance certifications, supported languages, and key use cases. The more data you provide, the richer your listing.",
  },
  {
    q: "Can I update my listing after it's published?",
    a: "Yes. Free listings can request updates via email (updates@wecompareai.com). Verified listings receive priority update turnaround within 48 hours.",
  },
  {
    q: "Do you accept all AI tools?",
    a: "We list tools with a public product or API — B2B and B2C. We do not list tools that are not publicly accessible, in stealth, or that violate our content policies.",
  },
  {
    q: "Is this a paid placement or editorial?",
    a: "Our rankings and scores are 100% editorial and independent. Paid listings receive more visibility and data completeness, but cannot influence their benchmark scores or ranking position.",
  },
];

export default function SubmitPage() {
  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Submit a Tool</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Submit Your AI Tool
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Get listed on the most accurate AI comparison platform. Reach developers, startups,
            and enterprise AI teams actively comparing tools before purchase.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: "100+", label: "Tools tracked" },
            { value: "50K+", label: "Monthly visitors" },
            { value: "280+", label: "Comparison pages" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-xl font-extrabold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Listing tiers */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-foreground mb-5">Listing Options</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {LISTING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-5 flex flex-col ${
                  tier.highlight
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                    Most popular
                  </span>
                )}
                <p className="font-semibold text-foreground">{tier.name}</p>
                <div className="mt-1 mb-4">
                  <span className="text-2xl font-extrabold text-foreground">{tier.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">{tier.priceNote}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`text-center text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Submission form */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-foreground mb-5">Free Submission Form</h2>
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Tool Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Claude, Cursor, Midjourney"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Website URL *</label>
                <input
                  type="url"
                  placeholder="https://yourtool.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category *</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Short Description *</label>
              <textarea
                rows={3}
                placeholder="Describe your tool in 1–2 sentences. What does it do? Who is it for?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Free Tier Available?</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                  <option>Yes — free tier available</option>
                  <option>Free trial only</option>
                  <option>No — paid only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Starting Price</label>
                <input
                  type="text"
                  placeholder="e.g. $20/mo or $0.002/1K tokens"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Your Name *</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Work Email *</label>
                <input
                  type="email"
                  placeholder="jane@yourtool.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Additional Notes</label>
              <textarea
                rows={2}
                placeholder="API docs URL, benchmark results, compliance certifications, notable integrations — anything that helps us build a richer listing."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
              >
                Submit tool for review →
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                Or email submissions@wecompareai.com · We review every submission manually.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial independence note */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm font-semibold text-foreground mb-1">Editorial independence</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We Compare AI is independently operated. Paid listings receive greater visibility and
            data richness, but <strong className="text-foreground">cannot influence benchmark scores, ranking positions, or written analysis</strong>.
            Our methodology is publicly documented at{" "}
            <Link href="/methodology" className="text-primary hover:underline">wecompareai.com/methodology</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}
