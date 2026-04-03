"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Rating {
  id: string;
  rating: number;
  review: string | null;
  createdAt: string;
  user: { name: string; avatar: string | null };
}

interface RatingsData {
  ratings: Rating[];
  average: number | null;
  count: number;
}

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-5 h-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {half ? (
        <>
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-fill)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      )}
    </svg>
  );
}

function StarDisplay({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={sizeClass} fill={i <= Math.round(value) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground w-3">{star}</span>
      <svg viewBox="0 0 20 20" className="w-3 h-3 text-amber-400" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-muted-foreground w-6 text-right">{count}</span>
    </div>
  );
}

export function RatingsSummary({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [data, setData] = useState<RatingsData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`/api/ratings?toolId=${encodeURIComponent(toolId)}`)
      .then((r) => r.json())
      .then(setData);
  }, [toolId]);

  function refresh() {
    fetch(`/api/ratings?toolId=${encodeURIComponent(toolId)}`)
      .then((r) => r.json())
      .then(setData);
  }

  if (!data) return null;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.ratings.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">User Ratings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{data.count} {data.count === 1 ? "review" : "reviews"} for {toolName}</p>
        </div>
        {data.average && (
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground tabular-nums">{data.average}</div>
            <StarDisplay value={data.average} size="sm" />
            <div className="text-[10px] text-muted-foreground mt-0.5">out of 5</div>
          </div>
        )}
      </div>

      {data.count > 0 && (
        <div className="space-y-1.5">
          {distribution.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={data.count} />
          ))}
        </div>
      )}

      {session ? (
        showForm ? (
          <RatingForm
            toolId={toolId}
            toolName={toolName}
            onDone={() => { setShowForm(false); refresh(); }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full text-sm py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors font-medium"
          >
            Rate this tool
          </button>
        )
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          <Link href="/auth/signin" className="text-primary hover:underline underline-offset-2">Sign in</Link> to leave a rating
        </p>
      )}

      {data.ratings.length > 0 && (
        <div className="space-y-3 pt-1 border-t border-border">
          {data.ratings.map((r) => (
            <div key={r.id} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {r.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-xs font-medium text-foreground">{r.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarDisplay value={r.rating} size="sm" />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
              {r.review && <p className="text-xs text-muted-foreground pl-8 leading-relaxed">{r.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingForm({
  toolId,
  toolName,
  onDone,
  onCancel,
}: {
  toolId: string;
  toolName: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  async function submit() {
    if (!selected) { setError("Please select a star rating"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, toolName, rating: selected, review }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); }
      else { onDone(); }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  const display = hover || selected;

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <div className="text-sm font-medium text-foreground">Your rating for {toolName}</div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setSelected(i)}
            className={`transition-colors ${i <= display ? "text-amber-400" : "text-muted-foreground/30 hover:text-amber-300"}`}
          >
            <StarIcon filled={i <= display} />
          </button>
        ))}
        {display > 0 && (
          <span className="ml-2 text-xs text-muted-foreground">{LABELS[display]}</span>
        )}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        maxLength={500}
        className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          disabled={submitting}
          className="flex-1 text-sm py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit rating"}
        </button>
        <button
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
