import { getAllPublishedArticles } from "@/lib/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await getAllPublishedArticles({ limit: 50 });

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/blog/${article.slug}`;
      const pubDate = new Date(article.createdAt).toUTCString();
      const excerpt = article.excerpt ?? article.title;

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${article.author.name}]]></author>
      <description><![CDATA[${excerpt}]]></description>
      ${article.coverImage ? `<enclosure url="${article.coverImage}" type="image/jpeg" length="0" />` : ""}
    </item>`.trim();
    })
    .join("\n  ");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>We Compare AI — Blog</title>
    <link>${SITE_URL}</link>
    <description>Independent AI model comparisons, pricing breakdowns, benchmark results, and expert analysis from We Compare AI.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>We Compare AI</title>
      <link>${SITE_URL}</link>
    </image>
  ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
