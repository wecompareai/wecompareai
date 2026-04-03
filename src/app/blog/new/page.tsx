"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TipTapEditor from "@/components/blog/TipTapEditor";
import ImageUpload from "@/components/blog/ImageUpload";

export default function NewArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
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
    router.push("/blog");
    return null;
  }

  async function handlePublish(published: boolean) {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError("");

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, excerpt, coverImage, youtubeUrl, published }),
    });

    if (res.ok) {
      const article = await res.json();
      router.push(`/blog/${article.slug}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create article");
    }
    setSaving(false);
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
          <span className="text-foreground">New Article</span>
        </nav>

        <h1 className="text-2xl font-bold text-foreground mb-8">
          Write New Article
        </h1>

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
            <TipTapEditor content={content} onChange={setContent} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePublish(true)}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
            <button
              onClick={() => handlePublish(false)}
              disabled={saving}
              className="px-6 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
