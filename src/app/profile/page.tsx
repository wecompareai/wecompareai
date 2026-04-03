import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import { getArticlesByAuthor } from "@/lib/articles";

export const metadata = { title: "My Profile - AI Compare" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const isAdmin = user.role === "admin";
  const articles = isAdmin ? await getArticlesByAuthor(user.id) : [];

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-6 mb-8 p-6 rounded-xl bg-muted/50 border border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.bio && (
              <p className="mt-2 text-sm text-foreground">{user.bio}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                My Articles ({articles.length})
              </h2>
              <Link
                href="/blog/new"
                className="px-3 py-1.5 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                + New Article
              </Link>
            </div>
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-foreground">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span
                        className={
                          article.published
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                      <span>{article._count.comments} comments</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/blog/${article.slug}/edit`}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  You haven&apos;t written any articles yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
