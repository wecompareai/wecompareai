import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

const AUTHORS: Record<string, {
  name: string;
  slug: string;
  title: string;
  bio: string;
  longBio: string;
  expertise: string[];
  credentials: string[];
  twitter?: string;
  linkedin?: string;
  initials: string;
  color: string;
}> = {
  "jigar-acharya": {
    name: "Jigar Acharya",
    slug: "jigar-acharya",
    title: "Co-founder & Solution Architect",
    bio: "12+ years designing AI and cloud solutions for enterprises across finance, retail, and SaaS.",
    longBio: "Jigar Acharya is the Co-founder and Solution Architect at We Compare AI. With over 12 years of experience designing AI and cloud solutions for enterprises across finance, retail, and SaaS, Jigar leads independent tool evaluations, benchmark methodology, and enterprise AI advisory at We Compare AI. He has personally evaluated over 100 AI models and platforms, building the scoring framework that powers the site's rankings. His background spans solution architecture, ML systems design, and enterprise AI procurement — giving him a uniquely practical lens on what AI tools actually deliver versus what they promise.",
    expertise: [
      "AI model benchmarking & evaluation",
      "Enterprise AI solution architecture",
      "LLM performance analysis",
      "AI procurement & vendor selection",
      "Cloud AI platform design",
      "ML systems architecture",
    ],
    credentials: [
      "12+ years in enterprise AI & cloud architecture",
      "Evaluated 100+ AI models and platforms",
      "Led AI adoption for Fortune 500 clients",
      "Co-built the We Compare AI scoring framework",
    ],
    twitter: "https://x.com/wecompareai",
    initials: "JA",
    color: "bg-indigo-500",
  },
  "saurabh-gera": {
    name: "Saurabh Gera",
    slug: "saurabh-gera",
    title: "Co-founder & Infrastructure Architect",
    bio: "10+ years in cloud infrastructure, DevOps, and AI platform engineering.",
    longBio: "Saurabh Gera is the Co-founder and Infrastructure Architect at We Compare AI. With a decade of experience in cloud infrastructure, DevOps, and AI platform engineering, Saurabh oversees reliability scoring, pricing data integrity, and the technical architecture of the comparison platform. He built the autonomous data pipeline that keeps We Compare AI's pricing and benchmark data updated in real time — tracking model releases, API price changes, and performance updates across 100+ AI tools. His expertise spans multi-cloud infrastructure, high-availability system design, and AI platform operations.",
    expertise: [
      "Cloud infrastructure & DevOps",
      "AI platform reliability engineering",
      "Real-time data pipeline architecture",
      "API pricing analysis",
      "Multi-cloud platform design",
      "Autonomous AI agent systems",
    ],
    credentials: [
      "10+ years in cloud infrastructure & AI platform engineering",
      "Built the real-time AI pricing data pipeline",
      "Architect of We Compare AI's autonomous update system",
      "Expert in AI API cost optimization",
    ],
    twitter: "https://x.com/wecompareai",
    initials: "SG",
    color: "bg-violet-500",
  },
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) return { title: "Not Found" };

  const url = `${SITE_URL}/authors/${slug}`;
  return {
    title: `${author.name} — ${author.title} | We Compare AI`,
    description: `${author.name} is ${author.title} at We Compare AI. ${author.bio}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${author.name} — ${author.title}`,
      description: author.bio,
      url,
      siteName: "We Compare AI",
      type: "profile",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary",
      title: `${author.name} — ${author.title}`,
      description: author.bio,
    },
  };
}

function AuthorJsonLd({ author }: { author: typeof AUTHORS[string] }) {
  const url = `${SITE_URL}/authors/${author.slug}`;

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url,
    jobTitle: author.title,
    description: author.longBio,
    knowsAbout: author.expertise,
    worksFor: {
      "@type": "Organization",
      name: "We Compare AI",
      url: SITE_URL,
    },
    sameAs: [
      author.twitter,
      author.linkedin,
    ].filter(Boolean),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Authors", item: `${SITE_URL}/authors` },
      { "@type": "ListItem", position: 3, name: author.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </>
  );
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) notFound();

  return (
    <div className="py-10 px-4">
      <AuthorJsonLd author={author} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <span>/</span>
          <span className="text-foreground">{author.name}</span>
        </nav>

        {/* Profile header */}
        <div className="flex items-start gap-5 mb-8">
          <div className={`w-20 h-20 rounded-2xl ${author.color} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
            {author.initials}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{author.name}</h1>
            <p className="text-sm text-primary font-medium mt-0.5">{author.title}</p>
            <p className="text-sm text-muted-foreground mt-1">We Compare AI · wecompareai.com</p>
            {author.twitter && (
              <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.632 5.9-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @wecompareai
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">About</h2>
          <p className="text-sm text-foreground leading-relaxed">{author.longBio}</p>
        </div>

        {/* Expertise */}
        <div className="mb-8 grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Areas of Expertise</h2>
            <ul className="space-y-2">
              {author.expertise.map((e) => (
                <li key={e} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-0.5 shrink-0">→</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Credentials</h2>
            <ul className="space-y-2">
              {author.credentials.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editorial standards */}
        <div className="mb-8 rounded-xl border-l-4 border-primary bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Editorial Independence</p>
          <p className="text-sm text-foreground leading-relaxed">
            All content on We Compare AI is produced independently. We have no paid placements, sponsored rankings, or affiliate relationships that influence our scores. Every tool is evaluated using our{" "}
            <Link href="/methodology" className="text-primary hover:underline underline-offset-2">published methodology</Link>.
          </p>
        </div>

        {/* CTA links */}
        <div className="flex flex-wrap gap-3">
          <Link href="/blog" className="text-sm px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Read articles →
          </Link>
          <Link href="/methodology" className="text-sm px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted transition-colors">
            Our methodology
          </Link>
          <Link href="/about" className="text-sm px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted transition-colors">
            About the team
          </Link>
        </div>
      </div>
    </div>
  );
}
