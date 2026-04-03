"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Row {
  key: string;
  label: string;
}

interface Category {
  id: string;
  label: string;
  rows: Row[];
  featureKey?: string;
}

interface Pricing {
  free: boolean;
  paid: string;
  api: string;
}

interface Tool {
  id: string;
  name: string;
  provider: string;
  logo: string;
  url: string;
  pricing: Pricing;
  pros: string[];
  cons: string[];
  features: Record<string, boolean | undefined>;
  [key: string]: unknown;
}

interface FeaturesData {
  title: string;
  description: string;
  lastUpdated: string;
  providers: string[];
  tools: Tool[];
  categories: Category[];
}

function getNestedValue(obj: Tool, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function renderCell(value: unknown): React.ReactNode {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-sm">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 font-bold text-sm">
        ✗
      </span>
    );
  }
  if (Array.isArray(value)) {
    return (
      <ul className="text-xs text-left space-y-1 min-w-[140px]">
        {value.map((item, i) => (
          <li key={i} className="flex items-start gap-1">
            <span className="mt-0.5 text-muted-foreground">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (value === "N/A" || value === undefined || value === null) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }
  return <span className="text-xs">{String(value)}</span>;
}

export default function FeaturesPage({ data }: { data: FeaturesData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProvider, setSelectedProvider] = useState("All");

  const activeCategory = data.categories.find((c) => c.id === activeTab)!;

  const filteredTools = useMemo(() => {
    let tools = data.tools;
    if (selectedProvider !== "All") {
      tools = tools.filter((t) => t.provider === selectedProvider);
    }
    if (activeCategory?.featureKey) {
      tools = tools.filter((t) => t.features[activeCategory.featureKey!] === true);
    }
    return tools;
  }, [data.tools, selectedProvider, activeCategory]);

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Features</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{data.title}</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">{data.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">Last updated: {data.lastUpdated}</p>
        </div>

        {/* Provider Filter */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
          <span className="text-xs sm:text-sm font-medium text-foreground">Filter by provider:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {data.providers.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProvider(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  selectedProvider === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 border-b border-border min-w-max">
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === cat.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-medium text-foreground">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? "s" : ""}
          {selectedProvider !== "All" && <> from <span className="font-medium text-foreground">{selectedProvider}</span></>}
        </p>

        {/* Mobile scroll hint */}
        <p className="md:hidden mb-2 text-xs text-muted-foreground text-center">
          ← Swipe table left/right to see all columns →
        </p>

        {/* Table */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground rounded-xl border border-border">
            No tools found for the selected provider.
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full text-sm min-w-[500px] sm:min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-semibold text-foreground min-w-[120px] sm:min-w-[160px] sticky left-0 bg-muted/50 z-10" style={{boxShadow: "2px 0 4px -2px rgba(0,0,0,0.08)"}}>
                      Feature
                    </th>
                    {filteredTools.map((tool) => (
                      <th
                        key={tool.id}
                        className="px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[140px]"
                      >
                        <Link
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1 sm:gap-2 group"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            <Image
                              src={tool.logo}
                              alt={tool.provider}
                              width={24}
                              height={24}
                              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs leading-tight">
                              {tool.name}
                            </div>
                            <div className="text-xs text-muted-foreground hidden sm:block">{tool.provider}</div>
                          </div>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeCategory.rows.map((row, rowIdx) => (
                    <tr
                      key={row.key}
                      className={`border-b border-border last:border-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-foreground sticky left-0 bg-inherit z-10 text-xs sm:text-sm" style={{boxShadow: "2px 0 4px -2px rgba(0,0,0,0.08)"}}>
                        {row.label}
                      </td>
                      {filteredTools.map((tool) => {
                        const value = getNestedValue(tool, row.key);
                        return (
                          <td key={tool.id} className="px-2 sm:px-4 py-2 sm:py-3 text-center align-middle">
                            {renderCell(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold">✓</span>
            Supported
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold">✗</span>
            Not supported
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">—</span>
            Not applicable
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-foreground font-medium">Partial</span>
            Partial support
          </div>
        </div>
      </div>
    </div>
  );
}
