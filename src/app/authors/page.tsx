import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Our Authors & Experts | We Compare AI",
  description: "Meet the AI specialists behind We Compare AI — independent researchers with 10-20+ years of experience evaluating AI models, pricing, and enterprise platforms.",
  alternates: { canonical: `${SITE_URL}/authors` },
  openGraph: {
    title: "Our Authors & Experts | We Compare AI",
    description: "Meet the team independently evaluating 100+ AI tools across performance, value, reliability, and ease of use.",
    url: `${SITE_URL}/authors`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const AUTHORS = [
  {
    name: "Jigar Acharya",
    slug: "jigar-acharya",
    title: "Co-founder & Solution Architect",
    bio: "12+ years designing AI and cloud solutions for enterprises across finance, retail, and SaaS. Leads independent tool evaluations, benchmark methodology, and enterprise AI advisory at We Compare AI.",
    expertise: ["AI model benchmarking", "Enterprise solution architecture", "LLM evaluation", "AI procurement"],
    initials: "JA",
    color: "bg-indigo-500",
    articles: "50+ articles",
  },
  {
    name: "Saurabh Gera",
    slug: "saurabh-gera",
    title: "Co-founder & Infrastructure Architect",
    bio: "10+ years in cloud infrastructure, DevOps, and AI platform engineering. Built the autonomous data pipeline that keeps We Compare AI's pricing and benchmark data updated in real time.",
    expertise: ["Cloud infrastructure", "AI platform reliability", "API pricing analysis", "DevOps & MLOps"],
    initials: "SG",
    color: "bg-violet-500",
    articles: "40+ articles",
  },
];

export default function AuthorsPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Authors", item: `${SITE_URL}/authors` },
    ],
  };

  return (
    <div className="py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Authors</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Our Authors & Experts</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Every score, ranking, and comparison on We Compare AI is produced by our team — independent AI specialists with combined 20+ years of real-world experience evaluating enterprise AI platforms. No paid placements. No affiliate bias.
        </p>

        <div className="space-y-5 mb-10">
          {AUTHORS.map((author) => (
            <Link
              key={author.slug}
              href={`/authors/${author.slug}`}
              className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-xl ${author.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                  {author.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-0.5">
                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{author.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{author.articles}</span>
                  </div>
                  <p className="text-xs text-primary font-medium mb-2">{author.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{author.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {author.expertise.map((e) => (
                      <span key={e} className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Editorial standards */}
        <div className="rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Editorial Standards</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content on We Compare AI is produced independently. We have no paid placements, sponsored rankings, or affiliate relationships that influence our scores. Every tool is evaluated using our{" "}
            <Link href="/methodology" className="text-primary hover:underline underline-offset-2">published methodology</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
