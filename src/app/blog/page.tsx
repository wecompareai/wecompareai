import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPublishedArticles } from "@/lib/articles";
import ArticleCard from "@/components/blog/ArticleCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata = {
  title: "AI Comparison Blog — Insights, Reviews & Analysis",
  description:
    "In-depth articles, reviews, and analysis about AI models, platforms, and tools. Stay up to date on the latest AI comparisons — ChatGPT vs Claude, best coding AI, top LLMs, and more.",
  keywords: [
    "AI comparison blog",
    "AI model reviews",
    "best AI 2025",
    "ChatGPT vs Claude analysis",
    "AI technology insights",
    "LLM comparison articles",
    "AI tools review",
    "AI news and analysis",
  ],
  openGraph: {
    type: "website" as const,
    url: `${SITE_URL}/blog`,
    title: "AI Comparison Blog — Insights, Reviews & Analysis | AI Compare",
    description: "In-depth articles and analysis about AI models, platforms, and tools. Latest AI comparisons, reviews, and insights.",
    siteName: "AI Compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Compare Blog" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "AI Comparison Blog | AI Compare",
    description: "In-depth articles and analysis about AI models, platforms, and tools.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");
  const { articles, totalPages } = await getPublishedArticles(page);
  const session = await auth();

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Blog
            </h1>
            <p className="mt-2 text-muted-foreground">
              Insights and analysis about AI technologies.
            </p>
          </div>
          {session?.user?.role === "admin" && (
            <Link
              href="/blog/new"
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Write Article
            </Link>
          )}
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No articles published yet. Be the first to write one!
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
