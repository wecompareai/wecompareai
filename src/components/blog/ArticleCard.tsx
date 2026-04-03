import Link from "next/link";

interface ArticleCardProps {
  article: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: Date | string;
    author: {
      name: string;
      avatar: string | null;
    };
    _count: {
      comments: number;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 overflow-hidden"
    >
      {article.coverImage && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium text-[10px]">
                {article.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{date}</span>
            <span>{article._count.comments} comments</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
