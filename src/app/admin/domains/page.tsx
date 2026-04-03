"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  _count: { subdomains: number };
}

export default function AdminDomainsPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/domains")
      .then((res) => res.json())
      .then(setDomains)
      .finally(() => setLoading(false));
  }, []);

  async function deleteDomain(slug: string) {
    if (!confirm("Delete this domain and all its data?")) return;
    await fetch(`/api/domains/${slug}`, { method: "DELETE" });
    setDomains((d) => d.filter((dom) => dom.slug !== slug));
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Domain Management
          </h1>
          <Link
            href="/admin/domains/new"
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            + New Domain
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
              >
                <div>
                  <h3 className="font-medium text-foreground">{domain.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {domain.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {domain._count.subdomains} subdomains
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/domains/${domain.slug}`}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => deleteDomain(domain.slug)}
                    className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {domains.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No domains yet. Create one to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
