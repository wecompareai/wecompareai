import { notFound } from "next/navigation";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { getDomainComparisonData } from "@/lib/domains";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string; comparison: string }>;
}) {
  const { domain, subdomain, comparison } = await params;
  const data = await getDomainComparisonData(domain, subdomain, comparison);
  if (!data) return { title: "Not Found" };

  const columnNames = data.comparison.columns.map((c) => c.name);
  const enrichedDescription = `${data.comparison.description} Compare ${columnNames.join(", ")} side-by-side.`;

  return {
    title: `${data.comparison.title} - ${data.domain.name}`,
    description: enrichedDescription,
  };
}

export default async function DomainComparisonPage({
  params,
}: {
  params: Promise<{ domain: string; subdomain: string; comparison: string }>;
}) {
  const {
    domain: domainSlug,
    subdomain: subdomainSlug,
    comparison: comparisonSlug,
  } = await params;

  const data = await getDomainComparisonData(
    domainSlug,
    subdomainSlug,
    comparisonSlug
  );

  if (!data) notFound();

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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
          <Link
            href={`/domains/${data.domain.slug}/${data.subdomain.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {data.subdomain.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{data.comparison.title}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {data.comparison.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {data.comparison.description}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Last updated: {data.comparison.lastUpdated}
          </p>
        </div>

        <ComparisonTable data={data.comparison} />
      </div>
    </div>
  );
}
