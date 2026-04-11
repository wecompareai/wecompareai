"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type LogEntry = {
  id: string;
  userId: string | null;
  feature: string;
  promptTruncated: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  providerName: string;
  modelName: string;
  modelSlug: string;
  latencyMs: number | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
};

type Aggregates = {
  totalCostUsd: number;
  totalTokens: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalRequests: number;
};

type FilterState = {
  userId: string;
  providerName: string;
  modelSlug: string;
  status: string;
  feature: string;
  dateFrom: string;
  dateTo: string;
};

const EMPTY_FILTERS: FilterState = {
  userId: "",
  providerName: "",
  modelSlug: "",
  status: "",
  feature: "",
  dateFrom: "",
  dateTo: "",
};

function formatCost(usd: number): string {
  if (usd === 0) return "$0.00";
  if (usd < 0.0001) return "<$0.0001";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(4)}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ok:      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    error:   "bg-red-500/10 text-red-600 dark:text-red-400",
    timeout: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    no_key:  "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.error}`}>
      {status}
    </span>
  );
}

function FeatureBadge({ feature }: { feature: string }) {
  const styles: Record<string, string> = {
    compare:       "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    "prompt-battle": "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[feature] ?? "bg-zinc-500/10 text-zinc-600"}`}>
      {feature}
    </span>
  );
}

export default function RequestLogsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword]     = useState("");
  const [authError, setAuthError]   = useState("");

  const [filters, setFilters]   = useState<FilterState>(EMPTY_FILTERS);
  const [applied, setApplied]   = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage]         = useState(1);

  const [logs, setLogs]             = useState<LogEntry[]>([]);
  const [aggregates, setAggregates] = useState<Aggregates | null>(null);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  // Filter options for dropdowns
  const [providers, setProviders] = useState<string[]>([]);
  const [models, setModels]       = useState<{ slug: string; name: string }[]>([]);
  const [users, setUsers]         = useState<{ id: string; name: string; email: string }[]>([]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
    } else {
      setAuthError("Invalid password");
    }
  }

  // Load dropdown options once logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/ai-providers?activeOnly=false")
      .then((r) => r.json())
      .then((data: { name: string }[]) => setProviders(data.map((p) => p.name)))
      .catch(() => {});
    fetch("/api/ai-models?activeOnly=false")
      .then((r) => r.json())
      .then((data: { slug: string; name: string }[]) => setModels(data))
      .catch(() => {});
    fetch("/api/admin/users")
      .then((r) => r.ok ? r.json() : [])
      .then((data: { id: string; name: string; email: string }[]) => setUsers(data))
      .catch(() => {});
  }, [isLoggedIn]);

  const fetchLogs = useCallback(async (f: FilterState, p: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.userId)      params.set("userId", f.userId);
    if (f.providerName) params.set("providerName", f.providerName);
    if (f.modelSlug)   params.set("modelSlug", f.modelSlug);
    if (f.status)      params.set("status", f.status);
    if (f.feature)     params.set("feature", f.feature);
    if (f.dateFrom)    params.set("dateFrom", f.dateFrom);
    if (f.dateTo)      params.set("dateTo", f.dateTo);
    params.set("page", String(p));

    try {
      const res = await fetch(`/api/admin/request-logs?${params}`);
      if (res.status === 401) { setIsLoggedIn(false); return; }
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setAggregates(data.aggregates);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchLogs(applied, page);
  }, [isLoggedIn, applied, page, fetchLogs]);

  function applyFilters() {
    setPage(1);
    setApplied({ ...filters });
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setApplied(EMPTY_FILTERS);
  }

  function set(key: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // Check session on mount
  useEffect(() => {
    fetch("/api/data/categories").then((r) => {
      if (r.ok) setIsLoggedIn(true);
    });
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="mt-2 text-sm text-muted-foreground">Enter the admin password to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              autoFocus
            />
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-muted-foreground mb-1">
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">API Request Logs</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">API Request Logs</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

          {/* User */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">User</label>
            <select
              value={filters.userId}
              onChange={(e) => set("userId", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All users</option>
              <option value="__null__">Anonymous</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          {/* Provider */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Provider</label>
            <select
              value={filters.providerName}
              onChange={(e) => set("providerName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All providers</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Model</label>
            <select
              value={filters.modelSlug}
              onChange={(e) => set("modelSlug", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All models</option>
              {models.map((m) => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={filters.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All statuses</option>
              <option value="ok">ok</option>
              <option value="error">error</option>
              <option value="timeout">timeout</option>
              <option value="no_key">no_key</option>
            </select>
          </div>

          {/* Feature */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Feature</label>
            <select
              value={filters.feature}
              onChange={(e) => set("feature", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All features</option>
              <option value="compare">Compare</option>
              <option value="prompt-battle">Prompt Battle</option>
            </select>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Date from</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => set("dateFrom", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Date to</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => set("dateTo", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Actions */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">&nbsp;</label>
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregates */}
      {aggregates && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Requests", value: aggregates.totalRequests.toLocaleString() },
            { label: "Total Cost",     value: formatCost(aggregates.totalCostUsd) },
            { label: "Total Tokens",   value: formatTokens(aggregates.totalTokens) },
            { label: "Prompt Tokens",  value: formatTokens(aggregates.totalPromptTokens) },
            { label: "Output Tokens",  value: formatTokens(aggregates.totalCompletionTokens) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card px-4 py-3 space-y-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold text-foreground font-mono">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">
            {loading ? "Loading…" : `${total.toLocaleString()} log${total !== 1 ? "s" : ""}`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Feature</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Provider / Model</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Tokens</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Cost</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">Latency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Prompt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && logs.length === 0 ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No logs found for the selected filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.user ? (
                        <div>
                          <p className="text-xs font-medium text-foreground">{log.user.name}</p>
                          <p className="text-xs text-muted-foreground">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">anonymous</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <FeatureBadge feature={log.feature} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-medium text-foreground">{log.providerName}</p>
                      <p className="text-xs text-muted-foreground">{log.modelName}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={log.status} />
                      {log.errorMessage && (
                        <p className="text-xs text-red-500 mt-0.5 max-w-[180px] truncate" title={log.errorMessage}>
                          {log.errorMessage}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-foreground whitespace-nowrap">
                      {log.totalTokens > 0 ? (
                        <span title={`${log.promptTokens} in · ${log.completionTokens} out`}>
                          {formatTokens(log.totalTokens)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-foreground whitespace-nowrap">
                      {log.costUsd > 0 ? formatCost(log.costUsd) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {log.latencyMs != null ? `${(log.latencyMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <p className="text-xs text-muted-foreground truncate" title={log.promptTruncated}>
                        {log.promptTruncated}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-muted-foreground">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
