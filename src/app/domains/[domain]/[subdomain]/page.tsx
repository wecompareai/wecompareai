import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubdomainWithComparisons } from "@/lib/domains";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string }>;
}) {
  const { domain, subdomain } = await params;
  const data = await getSubdomainWithComparisons(domain, subdomain);
  if (!data) return { title: "Not Found" };

  return {
    title: `${data.subdomain.name} - ${data.domain.name}`,
    description: data.subdomain.description,
  };
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string }>;
}) {
  const { domain: domainSlug, subdomain: subdomainSlug } = await params;
  const data = await getSubdomainWithComparisons(domainSlug, subdomainSlug);

  if (!data) notFound();

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
          <Link
            href={`/domains/${data.domain.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {data.domain.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{data.subdomain.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {data.subdomain.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data.subdomain.description}
          </p>
        </div>

        {data.comparisons.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.comparisons.map((comp) => (
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
                <p className="mt-2 text-xs text-muted-foreground">
                  Last updated: {comp.lastUpdated}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-muted-foreground">
            No comparisons available yet.
          </p>
        )}
      </div>
    </div>
  );
}
