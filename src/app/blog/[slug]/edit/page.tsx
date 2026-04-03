"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TipTapEditor from "@/components/blog/TipTapEditor";
import ImageUpload from "@/components/blog/ImageUpload";

export default function EditArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadArticle() {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) {
        setError("Article not found");
        setLoading(false);
        return;
      }
      const article = await res.json();
      setTitle(article.title);
      setContent(article.content);
      setExcerpt(article.excerpt || "");
      setCoverImage(article.coverImage || "");
      setYoutubeUrl(article.youtubeUrl || "");
      setPublished(article.published);
      setLoading(false);
    }
    loadArticle();
  }, [slug]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!session?.user) {
    router.push("/auth/login");
    return null;
  }
  if (session.user.role !== "admin") {
    router.push(`/blog/${slug}`);
    return null;
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch(`/api/articles/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, excerpt, coverImage, youtubeUrl, published }),
    });

    if (res.ok) {
      setMessage("Article saved successfully!");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save article");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/profile");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to delete article");
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <Link
            href={`/blog/${slug}`}
            className="hover:text-foreground transition-colors"
          >
            {title || "Article"}
          </Link>
          <span>/</span>
          <span className="text-foreground">Edit</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete Article
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-lg font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Article title"
            />
          </div>

          <ImageUpload value={coverImage} onChange={setCoverImage} />

          {/* YouTube Video */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              YouTube Video URL <span className="text-xs font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Paste a YouTube link — it will be embedded as a video player on the article page.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Excerpt (optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              placeholder="Brief summary of the article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Content
            </label>
            {content !== undefined && (
              <TipTapEditor content={content} onChange={setContent} />
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-border"
              />
              Published
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-emerald-500">{message}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/blog/${slug}`}
              className="px-6 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
