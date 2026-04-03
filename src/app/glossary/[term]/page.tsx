import { notFound } from "next/navigation";
import Link from "next/link";
import { glossaryTerms, getGlossaryTerm } from "@/lib/glossary";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamicParams = true;

export async function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }) {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return { title: "Not Found" };
  return {
    title: `${term.term} — AI Glossary | We Compare AI`,
    description: term.definition,
    keywords: [term.term, `what is ${term.term}`, `${term.term} meaning`, "AI glossary", "AI terminology"],
    alternates: { canonical: `${SITE_URL}/glossary/${slug}` },
    openGraph: {
      title: `${term.term} — AI Glossary`,
      description: term.definition,
      url: `${SITE_URL}/glossary/${slug}`,
      siteName: "We Compare AI",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Core Concepts": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Architecture": "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  "Training": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "Techniques": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Applications": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "Infrastructure": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Parameters": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  "Safety": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  "Performance": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "Evaluation": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
};

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const related = term.relatedTerms
    .map((s) => glossaryTerms.find((t) => t.slug === s))
    .filter(Boolean) as typeof glossaryTerms;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.definition,
            inDefinedTermSet: { "@type": "DefinedTermSet", name: "AI Glossary", url: `${SITE_URL}/glossary` },
            url: `${SITE_URL}/glossary/${slug}`,
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
        <span>/</span>
        <span className="text-foreground">{term.term}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex-1">{term.term}</h1>
          <span className={`text-xs px-2.5 py-1.5 rounded-full border font-medium ${CATEGORY_COLORS[term.category] ?? "bg-muted text-muted-foreground border-border"}`}>
            {term.category}
          </span>
        </div>

        {/* Simple definition */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Simple Definition</div>
          <p className="text-foreground leading-relaxed">{term.definition}</p>
        </div>
      </div>

      {/* Full explanation */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Full Explanation</h2>
        <p className="text-muted-foreground leading-relaxed">{term.expanded}</p>
      </div>

      {/* Example */}
      {term.example && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-1.5">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Example</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{term.example}</p>
        </div>
      )}

      {/* Related terms */}
      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Related Terms</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/glossary/${r.slug}`}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all"
              >
                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{r.term}</div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.definition}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Last updated + back */}
      <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
        <span>Last verified: {term.lastUpdated}</span>
        <Link href="/glossary" className="text-primary hover:underline underline-offset-2">
          ← Back to Glossary
        </Link>
      </div>
    </div>
  );
}
