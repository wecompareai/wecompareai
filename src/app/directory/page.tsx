"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { directoryTools, DIRECTORY_CATEGORIES, PRICING_FILTERS, getFeaturedTools } from "@/lib/directory";

const PRICING_BADGE: Record<string, string> = {
  free: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  freemium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "open-source": "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  paid: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  enterprise: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const PRICING_LABEL: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  "open-source": "Open Source",
  paid: "Paid",
  enterprise: "Enterprise",
};

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [pricing, setPricing] = useState("all");

  const filtered = useMemo(() => {
    return directoryTools.filter((tool) => {
      const matchSearch = !search || [tool.name, tool.tagline, tool.description, ...tool.tags].some((f) =>
        f.toLowerCase().includes(search.toLowerCase())
      );
      const matchCategory = category === "All" || tool.category === category;
      const matchPricing = pricing === "all" || tool.pricing === pricing;
      return matchSearch && matchCategory && matchPricing;
    });
  }, [search, category, pricing]);

  const featured = getFeaturedTools();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">AI Directory</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">AI Tool Directory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {directoryTools.length}+ AI tools across {DIRECTORY_CATEGORIES.length} categories — searchable, filterable, and honest.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Updated in real-time by AI agents ·{" "}
          <Link href="/methodology" className="text-primary hover:underline underline-offset-2">How we vet tools →</Link>
        </div>
      </div>

      {/* Featured */}
      {category === "All" && !search && pricing === "all" && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Featured Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group rounded-xl border border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tool.name}</span>
                  {tool.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium shrink-0">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{tool.tagline}</p>
                <div className="mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${PRICING_BADGE[tool.pricing]}`}>
                    {PRICING_LABEL[tool.pricing]}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search tools, categories, or use cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {["All", ...DIRECTORY_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Pricing filter */}
          <div className="ml-auto">
            <select
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
            >
              {PRICING_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> tools
        {search && <span> matching "<span className="text-primary">{search}</span>"</span>}
        {category !== "All" && <span> in <span className="text-primary">{category}</span></span>}
      </div>

      {/* Tool Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl">🔍</div>
          <p className="text-muted-foreground">No tools found for your search.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); setPricing("all"); }} className="text-sm text-primary hover:underline underline-offset-2">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <a
              key={tool.id}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tool.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{tool.tagline}</div>
                </div>
                {tool.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium shrink-0">
                    {tool.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">{tool.description}</p>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${PRICING_BADGE[tool.pricing]}`}>
                    {PRICING_LABEL[tool.pricing]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tool.category}</span>
                </div>
                <span className="text-xs text-muted-foreground">{tool.pricingLabel}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="rounded-xl border border-border bg-muted/30 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Know an AI tool we&apos;re missing?</h3>
          <p className="text-sm text-muted-foreground mt-1">Submit it for review and we&apos;ll add it to the directory.</p>
        </div>
        <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:border-primary/40 transition-all">
          Submit a tool →
        </Link>
      </div>
    </div>
  );
}
