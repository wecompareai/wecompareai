import type { Metadata } from "next";
import Link from "next/link";
import { getDomains } from "@/lib/domains";
import DomainCard from "@/components/DomainCard";
import { auth } from "@/lib/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Comparisons by Industry Domain — Medical, Law, Education & More",
  description:
    "Compare AI models, providers, and applications across industry domains — pharmaceutical, law, medical, education, defence, IT development, IT management, and more. Find the best AI for your industry.",
  keywords: [
    "AI comparison by industry",
    "AI for healthcare",
    "AI for legal",
    "AI for education",
    "AI for pharma",
    "AI for IT development",
    "industry AI comparison",
    "best AI per domain",
    "AI tools by sector",
  ],
  openGraph: {
    title: "AI Comparisons by Industry Domain | AI Compare",
    description: "Compare AI models and tools across industries — medical, pharmaceutical, law, education, defence, IT, and more.",
    url: `${SITE_URL}/domains`,
    siteName: "AI Compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Compare — Industry Domains" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Comparisons by Industry Domain | AI Compare",
    description: "Compare AI tools across medical, law, education, pharma, defence, and IT industries.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/domains` },
};

export default async function DomainsPage() {
  const [domains, session] = await Promise.all([getDomains(), auth()]);

  const canAdd =
    session?.user?.role === "admin" || session?.user?.role === "contributor";

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Domains</span>
        </nav>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Industry Domains
            </h1>
            <p className="mt-2 text-muted-foreground">
              Compare AI providers, models, and applications across different
              industries and sectors.
            </p>
          </div>
          {canAdd && (
            <Link
              href="/admin/domains/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Domain
            </Link>
          )}
        </div>

        {domains.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-muted-foreground">
            No domains available yet.
          </p>
        )}
      </div>
    </div>
  );
}
