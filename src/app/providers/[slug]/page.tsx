import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

async function getProvider(slug: string) {
  return prisma.aIProvider.findFirst({
    where: { slug, isActive: true },
    include: {
      models: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function generateStaticParams() {
  const providers = await prisma.aIProvider.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return { title: "Provider Not Found | We Compare AI" };

  const modelNames = provider.models.slice(0, 3).map((m) => m.name).join(", ");
  const description =
    provider.description ??
    `Compare all ${provider.name} AI models${modelNames ? ` including ${modelNames}` : ""}. View pricing, capabilities and how ${provider.name} stacks up against other providers.`;

  return {
    title: `${provider.name} AI Models & Pricing | We Compare AI`,
    description,
    openGraph: {
      title: `${provider.name} — AI Models & Pricing`,
      description,
      url: `https://wecompareai.com/providers/${provider.slug}`,
      type: "website",
    },
    alternates: { canonical: `https://wecompareai.com/providers/${provider.slug}` },
  };
}

const TIER_BADGE: Record<number, string> = {
  1: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  2: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  3: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
};

const TIER_LABEL: Record<number, string> = {
  1: "Tier 1 · Frontier Lab",
  2: "Tier 2 · Major Builder",
  3: "Tier 3 · Open / Research",
};

const API_FORMAT_LABEL: Record<string, string> = {
  openai: "OpenAI-compatible",
  anthropic: "Anthropic Messages API",
  gemini: "Google Gemini API",
};

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) notFound();

  const tierBadge = TIER_BADGE[provider.tier] ?? "bg-zinc-500/10 text-zinc-700 border-zinc-500/20";
  const tierLabel = TIER_LABEL[provider.tier] ?? `Tier ${provider.tier}`;
  const modelsWithPrice = provider.models.filter((m) => m.inputPricePer1M > 0 || m.outputPricePer1M > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: provider.name,
    url: provider.website ?? undefined,
    description:
      provider.description ??
      `${provider.name} is an AI provider offering ${provider.models.length} model${provider.models.length !== 1 ? "s" : ""}.`,
    sameAs: provider.website ? [provider.website] : [],
    subjectOf: {
      "@type": "WebPage",
      name: `${provider.name} AI Models & Pricing`,
      url: `https://wecompareai.com/providers/${provider.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/providers" className="hover:text-foreground transition-colors">AI Providers</Link>
          <span>/</span>
          <span className="text-foreground">{provider.name}</span>
        </nav>

        {/* Provider header */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-foreground shrink-0">
              {provider.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{provider.name}</h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tierBadge}`}>
                  {tierLabel}
                </span>
              </div>
              {provider.description && (
                <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              )}
              <div className="flex flex-wrap gap-4 pt-1 text-sm text-muted-foreground">
                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {provider.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9" />
                  </svg>
                  {provider.models.length} model{provider.models.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {API_FORMAT_LABEL[provider.apiFormat] ?? provider.apiFormat}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Models table */}
        {provider.models.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Available Models
              <span className="ml-2 text-sm font-normal text-muted-foreground">({provider.models.length})</span>
            </h2>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Model</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Model ID</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Input / 1M tokens</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Output / 1M tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {provider.models.map((model) => (
                    <tr key={model.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold shrink-0 ${model.colorClass}`}>
                            {model.initial}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{model.name}</p>
                            {model.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{model.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          {model.modelId}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {model.inputPricePer1M > 0 ? (
                          <span className="text-foreground">${model.inputPricePer1M.toFixed(2)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs hidden md:table-cell">
                        {model.outputPricePer1M > 0 ? (
                          <span className="text-foreground">${model.outputPricePer1M.toFixed(2)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {modelsWithPrice.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Prices are per 1 million tokens. Actual billing may vary — always verify on the provider&apos;s official pricing page.
              </p>
            )}
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            No models listed yet for this provider.
          </div>
        )}

        {/* CTA */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">Compare {provider.name} models live</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Run the same prompt across {provider.name} and other providers simultaneously.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/research/compare"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Compare Live
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              All Providers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
