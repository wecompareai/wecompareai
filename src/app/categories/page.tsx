import { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import CategorySearch from "@/components/CategorySearch";
import Pagination from "@/components/Pagination";
import { getPaginatedCategories } from "@/lib/data";
import { auth } from "@/lib/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "All AI Comparison Categories — Compare AI Tools, Models & Platforms",
  description:
    "Browse all AI comparison categories. Compare AI models, LLMs, platforms, coding tools, cloud providers, chips, security tools, and more — free side-by-side comparisons.",
  keywords: [
    "AI comparison categories",
    "compare AI models",
    "compare AI tools",
    "AI comparison list",
    "best AI comparison site",
    "AI tool categories",
    "LLM comparison categories",
    "AI platform comparison",
    "compare AI",
    "AI comparison",
  ],
  openGraph: {
    title: "All AI Comparison Categories | AI Compare",
    description: "Browse all AI comparison categories — models, platforms, coding tools, cloud providers, chips, and more. Free side-by-side comparisons.",
    url: `${SITE_URL}/categories`,
    siteName: "AI Compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Compare — All Comparison Categories" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All AI Comparison Categories | AI Compare",
    description: "Browse all AI comparison categories — models, platforms, coding tools, cloud providers, and more.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: `${SITE_URL}/categories` },
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 24;

  const [{ categories, total, totalPages }, session] = await Promise.all([
    getPaginatedCategories({ page, pageSize, search: query }),
    auth(),
  ]);

  const canAdd =
    session?.user?.role === "admin" || session?.user?.role === "contributor";

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Categories</span>
          </nav>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                All Categories
              </h1>
              <p className="mt-2 text-muted-foreground">
                {total} comparison {total === 1 ? "category" : "categories"}{" "}
                available
              </p>
            </div>
            {canAdd && (
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </Link>
            )}
          </div>
        </div>

        {/* Search */}
        <CategorySearch initialQuery={query} />

        {/* Grid */}
        {categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            {query
              ? `No categories found matching "${query}".`
              : "No categories yet."}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/categories"
            searchParams={query ? { q: query } : undefined}
          />
        )}
      </div>
    </div>
  );
}
