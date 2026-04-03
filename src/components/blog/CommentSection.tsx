"use client";

import { useState } from "react";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface Props {
  articleSlug: string;
  initialComments: Comment[];
  currentUserId: string | null;
}

export default function CommentSection({
  articleSlug,
  initialComments,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/articles/${articleSlug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setContent("");
    }
    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(
      `/api/articles/${articleSlug}/comments/${commentId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Comments ({comments.length})
      </h2>

      <div className="space-y-4 mb-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canDelete={currentUserId === comment.author.id}
            onDelete={() => handleDelete(comment.id)}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/auth/login" className="text-primary hover:underline">
            Log in
          </a>{" "}
          to join the conversation.
        </p>
      )}
    </section>
  );
}
