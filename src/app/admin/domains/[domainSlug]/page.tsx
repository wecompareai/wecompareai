"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Subdomain {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: { comparisons: number };
}

interface Comparison {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export default function AdminDomainDetailPage({
  params,
}: {
  params: Promise<{ domainSlug: string }>;
}) {
  const { domainSlug } = use(params);
  const router = useRouter();
  const [domainName, setDomainName] = useState("");
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [comparisons, setComparisons] = useState<Record<string, Comparison[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/domains/${domainSlug}`)
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/domains");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setDomainName(data.name);
          setSubdomains(data.subdomains);
        }
        setLoading(false);
      });
  }, [domainSlug, router]);

  async function loadComparisons(subdomainSlug: string) {
    if (comparisons[subdomainSlug]) {
      setExpandedSub(
        expandedSub === subdomainSlug ? null : subdomainSlug
      );
      return;
    }

    const res = await fetch(
      `/api/domains/${domainSlug}/subdomains/${subdomainSlug}/comparisons`
    );
    if (res.ok) {
      const data = await res.json();
      setComparisons((prev) => ({ ...prev, [subdomainSlug]: data }));
      setExpandedSub(subdomainSlug);
    }
  }

  async function deleteSubdomain(subdomainSlug: string) {
    if (!confirm("Delete this subdomain and all its comparisons?")) return;
    await fetch(`/api/domains/${domainSlug}/subdomains/${subdomainSlug}`, {
      method: "DELETE",
    });
    setSubdomains((s) => s.filter((sub) => sub.slug !== subdomainSlug));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin/domains")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          &larr; Back to Domains
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">{domainName}</h1>
          <Link
            href={`/admin/domains/${domainSlug}/subdomains/new`}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            + New Subdomain
          </Link>
        </div>

        <div className="space-y-4">
          {subdomains.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-border bg-background"
            >
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => loadComparisons(sub.slug)}
                  className="text-left flex-1"
                >
                  <h3 className="font-medium text-foreground">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {sub._count.comparisons} comparisons
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadComparisons(sub.slug)}
                    className="px-3 py-1 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedSub === sub.slug ? "Collapse" : "Expand"}
                  </button>
                  <button
                    onClick={() => deleteSubdomain(sub.slug)}
                    className="px-3 py-1 text-xs rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedSub === sub.slug && comparisons[sub.slug] && (
                <div className="border-t border-border p-4 space-y-2">
                  {comparisons[sub.slug].map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <span className="text-sm text-foreground">
                        {comp.title}
                      </span>
                      <Link
                        href={`/admin/domains/${domainSlug}/edit/${comp.slug}?sub=${sub.slug}`}
                        className="px-3 py-1 text-xs rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                  {comparisons[sub.slug].length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No comparisons yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {subdomains.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">
              No subdomains yet. Create one to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
