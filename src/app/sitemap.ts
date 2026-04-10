import type { MetadataRoute } from "next";
import { getAllComparisonSlugs, getComparisonData } from "@/lib/data";
import { getAllPublishedSlugs } from "@/lib/articles";
import { getAllDomainComparisonSlugs } from "@/lib/domains";
import { bestForPages } from "@/lib/best-for";
import { alternativePages } from "@/lib/alternatives";
import { glossaryTerms } from "@/lib/glossary";
import { getVsSlugs } from "@/lib/vs";
import { getPricingSlugs } from "@/lib/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllComparisonSlugs();
  const articleSlugs = await getAllPublishedSlugs();
  const domainComparisons = await getAllDomainComparisonSlugs();

  const bestForSitemapEntries = bestForPages.map((p) => ({
    url: `${SITE_URL}/best/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const alternativesSitemapEntries = alternativePages.map((p) => ({
    url: `${SITE_URL}/alternatives/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const pricingSlugs = getPricingSlugs();
  const pricingSitemapEntries = [
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...pricingSlugs.map((slug) => ({
      url: `${SITE_URL}/pricing/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];

  const vsSlugs = getVsSlugs();
  const vsSitemapEntries = [
    {
      url: `${SITE_URL}/vs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...vsSlugs.map((slug) => ({
      url: `${SITE_URL}/vs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  const glossarySitemapEntries = glossaryTerms.map((t) => ({
    url: `${SITE_URL}/glossary/${t.slug}`,
    lastModified: new Date(t.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

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
      url: `${SITE_URL}/rankings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/best`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/research/market-share`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/research/pricing-index`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/roi-calculator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/cost-per-task`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/research/model-tracker`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
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
    {
      url: `${SITE_URL}/research/llm-leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/research/ai-news`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/press`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
    ...comparisonPages,
    ...blogPages,
    ...domainPages,
    ...subdomainPages,
    ...domainComparisonPages,
    ...bestForSitemapEntries,
    ...alternativesSitemapEntries,
    ...glossarySitemapEntries,
    ...vsSitemapEntries,
    ...pricingSitemapEntries,
  ];
}
