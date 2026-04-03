import { prisma } from "@/lib/prisma";
import type {
  ComparisonData,
  DomainSummary,
  SubdomainSummary,
  DomainComparisonSummary,
} from "@/types";

// ============ Domain Queries ============

const domainSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  icon: true,
} as const;

export async function getDomains(): Promise<DomainSummary[]> {
  const domains = await prisma.domain.findMany({
    orderBy: { order: "asc" },
    select: {
      ...domainSelect,
      _count: { select: { subdomains: true } },
    },
  });
  return domains.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    icon: d.icon,
    subdomainCount: d._count.subdomains,
  }));
}

export async function getDomainBySlug(slug: string) {
  return prisma.domain.findUnique({
    where: { slug },
    include: {
      subdomains: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { comparisons: true } },
        },
      },
    },
  });
}

// ============ Subdomain Queries ============

export async function getSubdomainWithComparisons(
  domainSlug: string,
  subdomainSlug: string
): Promise<{
  domain: { id: string; name: string; slug: string };
  subdomain: { id: string; name: string; slug: string; description: string };
  comparisons: DomainComparisonSummary[];
} | null> {
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    select: { id: true, name: true, slug: true },
  });
  if (!domain) return null;

  const subdomain = await prisma.subdomain.findUnique({
    where: { domainId_slug: { domainId: domain.id, slug: subdomainSlug } },
    include: {
      comparisons: {
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          lastUpdated: true,
        },
      },
    },
  });
  if (!subdomain) return null;

  return {
    domain,
    subdomain: {
      id: subdomain.id,
      name: subdomain.name,
      slug: subdomain.slug,
      description: subdomain.description,
    },
    comparisons: subdomain.comparisons.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      lastUpdated: c.lastUpdated.toISOString().split("T")[0],
    })),
  };
}

// ============ Comparison Queries ============

export async function getDomainComparisonData(
  domainSlug: string,
  subdomainSlug: string,
  comparisonSlug: string
): Promise<{
  domain: { name: string; slug: string };
  subdomain: { name: string; slug: string };
  comparison: ComparisonData;
} | null> {
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    select: { id: true, name: true, slug: true },
  });
  if (!domain) return null;

  const subdomain = await prisma.subdomain.findUnique({
    where: { domainId_slug: { domainId: domain.id, slug: subdomainSlug } },
    select: { id: true, name: true, slug: true },
  });
  if (!subdomain) return null;

  const comparison = await prisma.domainComparison.findUnique({
    where: {
      subdomainId_slug: { subdomainId: subdomain.id, slug: comparisonSlug },
    },
  });
  if (!comparison) return null;

  const { columns, groups } = JSON.parse(comparison.data);

  return {
    domain: { name: domain.name, slug: domain.slug },
    subdomain: { name: subdomain.name, slug: subdomain.slug },
    comparison: {
      id: comparison.slug,
      title: comparison.title,
      description: comparison.description,
      lastUpdated: comparison.lastUpdated.toISOString().split("T")[0],
      columns,
      groups,
    },
  };
}

// ============ Mutation Helpers (Admin) ============

export async function saveDomainComparison(
  subdomainId: string,
  slug: string,
  data: ComparisonData
): Promise<void> {
  const dataPayload = JSON.stringify({
    columns: data.columns,
    groups: data.groups,
  });

  await prisma.domainComparison.upsert({
    where: { subdomainId_slug: { subdomainId, slug } },
    update: {
      title: data.title,
      description: data.description,
      data: dataPayload,
      lastUpdated: new Date(data.lastUpdated),
    },
    create: {
      subdomainId,
      slug,
      title: data.title,
      description: data.description,
      data: dataPayload,
      lastUpdated: new Date(data.lastUpdated),
    },
  });
}

export async function getAllDomainComparisonSlugs(): Promise<
  { domain: string; subdomain: string; comparison: string }[]
> {
  const comparisons = await prisma.domainComparison.findMany({
    select: {
      slug: true,
      subdomain: {
        select: {
          slug: true,
          domain: { select: { slug: true } },
        },
      },
    },
  });

  return comparisons.map((c) => ({
    domain: c.subdomain.domain.slug,
    subdomain: c.subdomain.slug,
    comparison: c.slug,
  }));
}
