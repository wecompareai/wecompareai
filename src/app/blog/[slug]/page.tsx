import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getArticleBySlug } from "@/lib/articles";
import { getCommentsByArticle } from "@/lib/comments";
import ArticleContent from "@/components/blog/ArticleContent";
import CommentSection from "@/components/blog/CommentSection";

const AUTHOR_BIOS: Record<string, { title: string; bio: string; twitter?: string }> = {
  "Jigar Acharya": {
    title: "Co-founder & Solution Architect",
    bio: "Jigar has 12+ years of experience designing AI and cloud solutions for enterprises across finance, retail, and SaaS. At We Compare AI, he leads independent tool evaluations, benchmark methodology, and enterprise AI advisory.",
    twitter: "https://x.com/wecompareai",
  },
  "Saurabh Gera": {
    title: "Co-founder & Infrastructure Architect",
    bio: "Saurabh has a decade of experience in cloud infrastructure, DevOps, and AI platform engineering. At We Compare AI, he oversees reliability scoring, pricing data integrity, and the technical architecture of the comparison platform.",
    twitter: "https://x.com/wecompareai",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.published) return { title: "Not Found" };

  const pageUrl = `${SITE_URL}/blog/${slug}`;
  return {
    title: `${article.title} - AI Compare Blog`,
    description: article.excerpt || article.title,
    openGraph: {
      type: "article" as const,
      url: pageUrl,
      title: article.title,
      description: article.excerpt || article.title,
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      ...(article.coverImage && { images: [{ url: article.coverImage }] }),
    },
    alternates: { canonical: pageUrl },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) notFound();

  const comments = await getCommentsByArticle(article.id);
  const session = await auth();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    url: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${SITE_URL}/about`,
      worksFor: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    },
    publisher: {
      "@type": "Organization",
      name: "We Compare AI",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` },
    },
    ...(article.coverImage && { image: article.coverImage }),
    commentCount: article._count.comments,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-excerpt"],
    },
  };

  function getYouTubeId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  }

  const date = article.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="py-8 sm:py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">
            {article.title}
          </span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {article.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{article.author.name}</span>
            </div>
            <span>{date}</span>
            <span>{article._count.comments} comments</span>
          </div>
          {session?.user?.id === article.authorId && (
            <Link
              href={`/blog/${slug}/edit`}
              className="mt-4 inline-block px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Edit Article
            </Link>
          )}
        </header>

        {article.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full"
            />
          </div>
        )}

        {article.youtubeUrl && (() => {
          const videoId = getYouTubeId(article.youtubeUrl!);
          return videoId ? (
            <div className="mb-8 rounded-xl overflow-hidden aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Article Video"
              />
            </div>
          ) : null;
        })()}

        <ArticleContent content={article.content} />

        <hr className="my-12 border-border" />

        {/* About the Author */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-foreground mb-4">About the Author</h2>
          {(() => {
            const known = AUTHOR_BIOS[article.author.name];
            return (
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-lg">
                    {article.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{article.author.name}</p>
                    {known && (
                      <p className="text-xs text-muted-foreground">{known.title} · <Link href="/about" className="hover:text-primary transition-colors underline underline-offset-2">We Compare AI</Link></p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {known?.bio ?? `${article.author.name} is a contributor to We Compare AI, an independent platform that researches and compares AI tools across performance, value, reliability, and ease of use.`}
                  </p>
                  {known?.twitter && (
                    <a href={known.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2">
                      Follow on X →
                    </a>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Editorial note */}
          <div className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-start gap-3">
            <span className="text-muted-foreground shrink-0 mt-0.5 text-xs">🛡️</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Editorial independence:</strong> We Compare AI maintains strict editorial independence. Our writers are not paid by AI vendors and do not receive affiliate commissions that influence scores or recommendations.{" "}
              <Link href="/methodology" className="hover:text-primary underline underline-offset-2 transition-colors">Read our methodology →</Link>
            </p>
          </div>
        </section>

        <CommentSection
          articleSlug={slug}
          initialComments={comments}
          currentUserId={session?.user?.id || null}
        />
      </div>
    </div>
  );
}
