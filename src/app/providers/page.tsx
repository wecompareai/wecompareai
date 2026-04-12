import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // revalidate every hour

export const metadata: Metadata = {
  title: "AI Providers Directory — Compare All AI Companies by Tier | We Compare AI",
  description:
    "Browse every major AI provider — OpenAI, Google DeepMind, Anthropic, Meta AI, Mistral and more — organized by tier. Compare models, pricing and capabilities across all providers.",
  openGraph: {
    title: "AI Providers Directory | We Compare AI",
    description:
      "Every major AI provider ranked by tier. Compare OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral and 50+ more.",
    url: "https://wecompareai.com/providers",
    type: "website",
  },
  alternates: { canonical: "https://wecompareai.com/providers" },
};

const TIER_LABELS: Record<number, { label: string; description: string; badge: string }> = {
  1: {
    label: "Tier 1 — Frontier Labs",
    description: "Leading AI research labs building the most capable foundation models",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
  2: {
    label: "Tier 2 — Major Global Builders",
    description: "Large technology companies and well-funded AI startups with production-grade models",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  3: {
    label: "Tier 3 — Open & Research Labs",
    description: "Open-source research groups, academic institutions, and community-led model builders",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
};

async function getProviders() {
  return prisma.aIProvider.findMany({
    where: { isActive: true },
    orderBy: [{ tier: "asc" }, { order: "asc" }],
    include: {
      models: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true, inputPricePer1M: true, outputPricePer1M: true },
      },
    },
  });
}

type Provider = Awaited<ReturnType<typeof getProviders>>[number];

function ProviderCard({ provider }: { provider: Provider }) {
  const tierInfo = TIER_LABELS[provider.tier] ?? TIER_LABELS[3];
  const modelCount = provider.models.length;
  const hasLiveModels = modelCount > 0;
  const lowestInputPrice = hasLiveModels
    ? Math.min(...provider.models.map((m) => m.inputPricePer1M))
    : null;

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group block rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-base font-bold text-foreground group-hover:bg-primary/10 transition-colors">
            {provider.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
              {provider.name}
            </h3>
            {provider.website && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[160px]">
                {provider.website.replace(/^https?:\/\//, "")}
              </p>
            )}
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierInfo.badge}`}>
          T{provider.tier}
        </span>
      </div>

      {provider.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{provider.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9" />
          </svg>
          {modelCount > 0 ? `${modelCount} model${modelCount !== 1 ? "s" : ""}` : "No models yet"}
        </span>
        {lowestInputPrice !== null && lowestInputPrice > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            from ${lowestInputPrice.toFixed(2)}/1M tokens
          </span>
        )}
        <span className="ml-auto group-hover:text-primary transition-colors flex items-center gap-1">
          View
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  const byTier = providers.reduce<Record<number, Provider[]>>((acc, p) => {
    if (!acc[p.tier]) acc[p.tier] = [];
    acc[p.tier].push(p);
    return acc;
  }, {});

  const tiers = Object.keys(byTier)
    .map(Number)
    .sort((a, b) => a - b);

  const totalProviders = providers.length;
  const totalModels = providers.reduce((sum, p) => sum + p.models.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Providers Directory",
    description: "Compare all major AI providers organized by tier — from frontier labs to open-source research groups.",
    url: "https://wecompareai.com/providers",
    publisher: { "@type": "Organization", name: "We Compare AI", url: "https://wecompareai.com" },
    numberOfItems: totalProviders,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">AI Providers</span>
          </nav>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">AI Providers Directory</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Every major AI provider — from frontier research labs to open-source community projects — organized by tier.
              Compare models, pricing, and capabilities side by side.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: "Providers", value: totalProviders },
              { label: "Live Models", value: totalModels },
              { label: "Tiers", value: tiers.length },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span className="font-bold text-foreground text-lg">{s.value}</span>
                <span className="text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier sections */}
        {tiers.map((tier) => {
          const tierInfo = TIER_LABELS[tier] ?? { label: `Tier ${tier}`, description: "", badge: "bg-zinc-500/10 text-zinc-700 border-zinc-500/20" };
          const tierProviders = byTier[tier];
          return (
            <section key={tier} className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tierInfo.badge}`}>
                    {tierInfo.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{tierProviders.length} providers</span>
                </div>
                {tierInfo.description && (
                  <p className="text-sm text-muted-foreground">{tierInfo.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tierProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
