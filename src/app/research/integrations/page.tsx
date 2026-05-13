"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AI_TOOLS,
  PLATFORMS,
  STATUS_CONFIG,
  TOOL_CATEGORIES,
  getCoverage,
  getIntegration,
  getIntegrationsByTool,
  getPlatform,
  getTool,
  totalIntegrations,
  type AITool,
  type IntegrationEntry,
  type IntegrationStatus,
  type ToolCategory,
} from "@/lib/integrations";

type Selection = { toolId: string; platformId: string } | null;

const STATUS_KEYS = Object.keys(STATUS_CONFIG) as IntegrationStatus[];

function StatusPill({ status, label = true }: { status: IntegrationStatus; label?: boolean }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label && cfg.label}
    </span>
  );
}

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ToolCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IntegrationStatus>("all");
  const [selection, setSelection] = useState<Selection>(null);

  const visibleTools: AITool[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AI_TOOLS.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category]);

  const summary = useMemo(() => {
    const total = totalIntegrations();
    const native = AI_TOOLS.reduce((acc, t) => acc + getCoverage(t.id).native, 0);
    const api = AI_TOOLS.reduce((acc, t) => acc + getCoverage(t.id).api, 0);
    const zapier = AI_TOOLS.reduce((acc, t) => acc + getCoverage(t.id).zapier, 0);
    return { total, native, api, zapier };
  }, []);

  const selectedEntry: IntegrationEntry | null = selection
    ? getIntegration(selection.toolId, selection.platformId)
    : null;
  const selectedTool = selectedEntry ? getTool(selectedEntry.toolId) : null;
  const selectedPlatform = selectedEntry ? getPlatform(selectedEntry.platformId) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* ── Breadcrumb + Header ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
          <span>/</span>
          <span className="text-foreground">Integration Graphs</span>
        </nav>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground">Integration Graphs</h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Where each AI tool plugs into your workflow. Pick a tool to see which platforms it connects to (Zapier, Slack, VS Code, CRM, etc.) — and <em>how</em>: built-in (Native), through code (API), or via a no-code automation hop (Zapier).
            </p>
          </div>
        </div>
      </div>

      {/* ── Summary strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <SummaryCell label="AI tools tracked" value={AI_TOOLS.length} accent="text-foreground" />
        <SummaryCell label="Platforms tracked" value={PLATFORMS.length} accent="text-foreground" />
        <SummaryCell label="Total integrations" value={summary.total} accent="text-primary" />
        <SummaryCell label="Native (no setup)" value={summary.native} accent="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* ── Status legend ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Status legend</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {STATUS_KEYS.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(active ? "all" : s)}
                className={`text-left flex items-start gap-2 p-2 rounded-lg border transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                aria-pressed={active}
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
                  <span className="block text-xs text-muted-foreground leading-snug">{cfg.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        {statusFilter !== "all" && (
          <p className="text-xs text-muted-foreground mt-2">
            Filtering matrix to <span className="font-medium text-foreground">{STATUS_CONFIG[statusFilter].label}</span> cells.{" "}
            <button onClick={() => setStatusFilter("all")} className="text-primary hover:underline">Clear</button>
          </p>
        )}
      </div>

      {/* ── Search + Category filter ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI tools…"
          className="flex-1 min-h-[44px] px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "all" | ToolCategory)}
          className="min-h-[44px] px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
        >
          <option value="all">All categories</option>
          {TOOL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {visibleTools.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No AI tools match your filters.{" "}
          <button onClick={() => { setQuery(""); setCategory("all"); }} className="text-primary hover:underline">Reset</button>
        </div>
      ) : (
        <>
          {/* ── Mobile card view (< md) ───────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {visibleTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                statusFilter={statusFilter}
                selection={selection}
                onSelect={setSelection}
              />
            ))}
          </div>

          {/* ── Laptop matrix view (md+) ──────────────────────────────────── */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px] sticky left-0 bg-muted/50 z-10">
                      AI Tool
                    </th>
                    {PLATFORMS.map((p) => (
                      <th key={p.id} className="px-3 py-3 font-medium text-muted-foreground text-center min-w-[110px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-base">{p.icon}</span>
                          {p.href ? (
                            <a href={p.href} target="_blank" rel="noopener noreferrer sponsored" className="text-xs text-primary hover:underline">{p.name}</a>
                          ) : (
                            <span className="text-xs">{p.name}</span>
                          )}
                          <span className="text-[10px] text-muted-foreground/60">{p.category}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleTools.map((tool) => (
                    <tr key={tool.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tool.color.dot}`} />
                          <div>
                            {tool.href ? (
                              <a href={tool.href} target="_blank" rel="noopener noreferrer sponsored" className="font-medium text-foreground text-sm hover:text-primary hover:underline">{tool.name}</a>
                            ) : (
                              <div className="font-medium text-foreground text-sm">{tool.name}</div>
                            )}
                            <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${tool.color.bg}`}>{tool.category}</div>
                          </div>
                        </div>
                      </td>
                      {PLATFORMS.map((p) => {
                        const entry = getIntegration(tool.id, p.id);
                        const dim = statusFilter !== "all" && entry.status !== statusFilter;
                        const selected = selection?.toolId === tool.id && selection?.platformId === p.id;
                        return (
                          <td key={p.id} className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => setSelection(selected ? null : { toolId: tool.id, platformId: p.id })}
                              className={`w-full min-h-[36px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-all ${dim ? "opacity-25" : ""} ${selected ? "ring-2 ring-primary" : ""} ${STATUS_CONFIG[entry.status].bg}`}
                              aria-label={`${tool.name} on ${p.name}: ${STATUS_CONFIG[entry.status].label}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_CONFIG[entry.status].dot}`} />
                              <span className={`text-xs font-medium ${STATUS_CONFIG[entry.status].text}`}>
                                {STATUS_CONFIG[entry.status].label}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Selected cell detail panel (works on both views) ──────────────── */}
      {selectedEntry && selectedTool && selectedPlatform && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedTool.color.dot}`} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedTool.name} <span className="text-muted-foreground">×</span> {selectedPlatform.icon} {selectedPlatform.name}
                </p>
                <StatusPill status={selectedEntry.status} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelection(null)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors shrink-0"
              aria-label="Close detail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {selectedEntry.note ?? (
              <span className="text-muted-foreground italic">
                {STATUS_CONFIG[selectedEntry.status].description}
              </span>
            )}
          </p>
          {selectedEntry.docsUrl && (
            <a
              href={selectedEntry.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-primary hover:underline"
            >
              View setup docs →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────

function SummaryCell({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <div className={`text-xl font-bold tabular-nums ${accent}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
    </div>
  );
}

function ToolCard({
  tool,
  statusFilter,
  selection,
  onSelect,
}: {
  tool: AITool;
  statusFilter: "all" | IntegrationStatus;
  selection: Selection;
  onSelect: (s: Selection) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const coverage = getCoverage(tool.id);
  const rows = getIntegrationsByTool(tool.id);
  const visibleRows = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors min-h-[60px]"
        aria-expanded={expanded}
      >
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${tool.color.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm truncate">{tool.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${tool.color.bg}`}>{tool.category}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-[160px]">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${coverage.pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{coverage.pct}% coverage</span>
          </div>
        </div>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Coverage chips */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {coverage.native > 0 && <CoverageChip status="native" count={coverage.native} />}
        {coverage.api > 0 && <CoverageChip status="api" count={coverage.api} />}
        {coverage.zapier > 0 && <CoverageChip status="zapier" count={coverage.zapier} />}
        {coverage.covered === 0 && <span className="text-xs text-muted-foreground">No known integrations</span>}
      </div>

      {/* Expanded: list of platforms */}
      {expanded && (
        <ul className="border-t border-border divide-y divide-border">
          {visibleRows.length === 0 ? (
            <li className="px-4 py-3 text-xs text-muted-foreground text-center">
              No {statusFilter !== "all" ? STATUS_CONFIG[statusFilter].label.toLowerCase() : ""} integrations.
            </li>
          ) : (
            visibleRows.map((entry) => {
              const platform = getPlatform(entry.platformId)!;
              const isSelected = selection?.toolId === tool.id && selection?.platformId === entry.platformId;
              return (
                <li key={entry.platformId}>
                  <button
                    type="button"
                    onClick={() => onSelect(isSelected ? null : { toolId: tool.id, platformId: entry.platformId })}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 min-h-[44px] text-left transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-muted/30"}`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{platform.icon}</span>
                      <span className="text-sm text-foreground truncate">{platform.name}</span>
                    </span>
                    <StatusPill status={entry.status} />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

function CoverageChip({ status, count }: { status: IntegrationStatus; count: number }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {count} {cfg.label}
    </span>
  );
}
