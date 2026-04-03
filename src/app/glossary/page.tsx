import { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms, getTermsByLetter, GLOSSARY_CATEGORIES } from "@/lib/glossary";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Glossary 2026 — Every AI Term Explained Simply",
  description: "The complete A-Z glossary of AI terms. LLM, RAG, token, hallucination, fine-tuning, embeddings, and 40+ more terms explained in plain English.",
  alternates: { canonical: `${SITE_URL}/glossary` },
  openGraph: {
    title: "AI Glossary A–Z | We Compare AI",
    description: "40+ AI terms explained simply — LLM, RAG, token, hallucination, embeddings, and more.",
    url: `${SITE_URL}/glossary`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

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

export default function GlossaryPage() {
  const byLetter = getTermsByLetter();
  const letters = Object.keys(byLetter).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "AI Glossary",
            description: "Complete glossary of artificial intelligence terms",
            url: `${SITE_URL}/glossary`,
            hasDefinedTerm: glossaryTerms.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.definition,
              url: `${SITE_URL}/glossary/${t.slug}`,
            })),
          }),
        }}
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI Glossary</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">AI Glossary</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {glossaryTerms.length} AI terms explained in plain English — from LLMs and tokens to RAG, fine-tuning, and agentic AI.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {glossaryTerms.length} terms · Updated 2026-03-30
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {GLOSSARY_CATEGORIES.map((cat) => (
          <span key={cat} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_COLORS[cat] ?? "bg-muted text-muted-foreground border-border"}`}>
            {cat}
          </span>
        ))}
      </div>

      {/* A-Z Quick Nav */}
      <div className="flex flex-wrap gap-1.5">
        {letters.map((letter) => (
          <a key={letter} href={`#letter-${letter}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
            {letter}
          </a>
        ))}
      </div>

      {/* Terms by letter */}
      <div className="space-y-8">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-foreground w-8">{letter}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {byLetter[letter].map((term) => (
                <Link
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-muted/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                      {term.term}
                    </div>
                    <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[term.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {term.category}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {term.definition}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Ready to compare AI tools?</h3>
          <p className="text-sm text-muted-foreground mt-1">Now that you know the terminology, see how the top AI tools actually stack up.</p>
        </div>
        <Link href="/compare/ai-models" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Compare AI Models →
        </Link>
      </div>
    </div>
  );
}
