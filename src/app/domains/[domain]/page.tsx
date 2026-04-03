import { notFound } from "next/navigation";
import Link from "next/link";
import { getDomainBySlug } from "@/lib/domains";
import { iconMap } from "@/components/IconMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: slug } = await params;
  const domain = await getDomainBySlug(slug);
  if (!domain) return { title: "Not Found" };

  return {
    title: `${domain.name} - AI Comparisons`,
    description: domain.description,
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: slug } = await params;
  const domain = await getDomainBySlug(slug);

  if (!domain) notFound();

  const singleSubdomain =
    domain.subdomains.length === 1 ? domain.subdomains[0] : null;

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/domains"
            className="hover:text-foreground transition-colors"
          >
            Domains
          </Link>
          <span>/</span>
          <span className="text-foreground">{domain.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {domain.name}
          </h1>
          <p className="mt-2 text-muted-foreground">{domain.description}</p>
        </div>

        {singleSubdomain ? (
          /* Single subdomain — show comparisons directly */
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Comparisons ({singleSubdomain._count.comparisons})
            </h2>
            {singleSubdomain._count.comparisons > 0 ? (
              <ComparisonLinks
                domainSlug={domain.slug}
                subdomainSlug={singleSubdomain.slug}
                subdomainId={singleSubdomain.id}
              />
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No comparisons available yet.
              </p>
            )}
          </div>
        ) : (
          /* Multiple subdomains — show subdomain cards */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domain.subdomains.map((sub) => (
              <Link
                key={sub.id}
                href={`/domains/${domain.slug}/${sub.slug}`}
                className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {iconMap[sub.icon] || iconMap.brain}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {sub.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sub.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {sub._count.comparisons} comparisons
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Server component to load and display comparison links */
import { prisma } from "@/lib/prisma";

async function ComparisonLinks({
  domainSlug,
  subdomainSlug,
  subdomainId,
}: {
  domainSlug: string;
  subdomainSlug: string;
  subdomainId: string;
}) {
  const comparisons = await prisma.domainComparison.findMany({
    where: { subdomainId },
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true, description: true },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {comparisons.map((comp) => (
        <Link
          key={comp.id}
          href={`/domains/${domainSlug}/${subdomainSlug}/${comp.slug}`}
          className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
        >
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {comp.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {comp.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
