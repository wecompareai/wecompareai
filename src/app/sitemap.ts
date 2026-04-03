import type { MetadataRoute } from "next";
import { getAllComparisonSlugs, getComparisonData } from "@/lib/data";
import { getAllPublishedSlugs } from "@/lib/articles";
import { getAllDomainComparisonSlugs } from "@/lib/domains";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllComparisonSlugs();
  const articleSlugs = await getAllPublishedSlugs();
  const domainComparisons = await getAllDomainComparisonSlugs();

  const comparisonPages = await Promise.all(
    slugs.map(async (slug) => {
      const data = await getComparisonData(slug);
      return {
        url: `${SITE_URL}/compare/${slug}`,
        lastModified: data?.lastUpdated ? new Date(data.lastUpdated) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      };
    })
  );

  const blogPages = articleSlugs.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Derive unique domain slugs and domain+subdomain pairs
  const uniqueDomains = [...new Set(domainComparisons.map((dc) => dc.domain))];
  const uniqueSubdomains = [
    ...new Map(
      domainComparisons.map((dc) => [`${dc.domain}/${dc.subdomain}`, dc])
    ).values(),
  ];

  const domainPages = uniqueDomains.map((domain) => ({
    url: `${SITE_URL}/domains/${domain}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const subdomainPages = uniqueSubdomains.map((dc) => ({
    url: `${SITE_URL}/domains/${dc.domain}/${dc.subdomain}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  const domainComparisonPages = domainComparisons.map((dc) => ({
    url: `${SITE_URL}/domains/${dc.domain}/${dc.subdomain}/${dc.comparison}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/domains`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/countries`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/research/compliance`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/research/integrations`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/benchmark`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/finder`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/compare`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...comparisonPages,
    ...blogPages,
    ...domainPages,
    ...subdomainPages,
    ...domainComparisonPages,
  ];
}
