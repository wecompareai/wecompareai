"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import type { ComparisonData } from "@/types";

function ColumnLogo({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-foreground text-xs font-bold uppercase">
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      width={32}
      height={32}
      className="rounded-lg"
      onError={() => setFailed(true)}
    />
  );
}

function CellValue({ value }: { value: string | boolean | number }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  return <span className="text-sm">{String(value)}</span>;
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function FilterChip({ label, active, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

interface Props {
  data: ComparisonData;
  enableColumnFilter?: boolean;
}

export default function ComparisonTable({ data, enableColumnFilter = false }: Props) {
  const [search, setSearch] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const syncScroll = useCallback((source: "top" | "table") => {
    if (syncing.current) return;
    syncing.current = true;
    const top = topScrollRef.current;
    const table = tableWrapperRef.current;
    if (top && table) {
      if (source === "top") {
        table.scrollLeft = top.scrollLeft;
      } else {
        top.scrollLeft = table.scrollLeft;
      }
    }
    requestAnimationFrame(() => {
      syncing.current = false;
    });
  }, []);

  // Sync the top scrollbar width with the table's scroll width
  const [scrollWidth, setScrollWidth] = useState(0);
  useEffect(() => {
    const table = tableWrapperRef.current;
    if (!table) return;
    const observer = new ResizeObserver(() => {
      setScrollWidth(table.scrollWidth);
    });
    observer.observe(table);
    setScrollWidth(table.scrollWidth);
    return () => observer.disconnect();
  }, [data]);

  // Unique providers in stable insertion order
  const uniqueProviders = useMemo(
    () => [...new Set(data.columns.map((c) => c.provider))],
    [data.columns]
  );

  // Columns visible after provider filter — feeds the model chip list
  const providerFilteredCols = useMemo(
    () =>
      selectedProviders.length === 0
        ? data.columns
        : data.columns.filter((c) => selectedProviders.includes(c.provider)),
    [data.columns, selectedProviders]
  );

  // When provider selection changes, drop any model selections that no longer
  // belong to the remaining providers.
  useEffect(() => {
    if (selectedProviders.length > 0) {
      const validIds = new Set(providerFilteredCols.map((c) => c.id));
      setSelectedModels((prev) => prev.filter((id) => validIds.has(id)));
    }
  }, [selectedProviders, providerFilteredCols]);

  // Final visible columns (provider AND model filter combined)
  const visibleColumns = useMemo(
    () =>
      selectedModels.length === 0
        ? providerFilteredCols
        : providerFilteredCols.filter((c) => selectedModels.includes(c.id)),
    [providerFilteredCols, selectedModels]
  );

  function toggleProvider(provider: string) {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    );
  }

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setSelectedProviders([]);
    setSelectedModels([]);
  }

  const hasActiveFilters = selectedProviders.length > 0 || selectedModels.length > 0;

  const filteredGroups = data.groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) =>
        row.feature.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <div>
      {/* Search + Column Filters */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Feature search */}
        <div className="relative w-full sm:max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>

        {/* Column filters — only shown when enabled */}
        {enableColumnFilter && (
          <div className="space-y-3">
            {/* Provider filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground shrink-0 w-16">
                Provider
              </span>
              {uniqueProviders.map((provider) => (
                <FilterChip
                  key={provider}
                  label={provider}
                  active={selectedProviders.includes(provider)}
                  onToggle={() => toggleProvider(provider)}
                />
              ))}
            </div>

            {/* Model / tool filter — chips limited to provider-filtered set */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground shrink-0 w-16">
                {providerFilteredCols.length !== data.columns.length ? "Filtered" : "All"}
              </span>
              {providerFilteredCols.map((col) => (
                <FilterChip
                  key={col.id}
                  label={col.name}
                  active={selectedModels.includes(col.id)}
                  onToggle={() => toggleModel(col.id)}
                />
              ))}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Active filter summary */}
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">{visibleColumns.length}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{data.columns.length}</span>{" "}
                entries
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mobile scroll hint */}
      <p className="md:hidden mb-2 text-xs text-muted-foreground text-center">
        ← Swipe table left/right to see all columns →
      </p>

      {/* Top scrollbar */}
      <div
        ref={topScrollRef}
        onScroll={() => syncScroll("top")}
        className="comparison-table-wrapper overflow-x-auto rounded-t-xl border border-b-0 border-border"
        style={{ overflowY: "hidden", height: 12 }}
      >
        <div style={{ width: scrollWidth, height: 1 }} />
      </div>

      <div
        ref={tableWrapperRef}
        onScroll={() => syncScroll("table")}
        className="comparison-table-wrapper rounded-b-xl border border-border"
      >
        <table className="w-full border-collapse min-w-[600px] sm:min-w-[800px]">
          <thead>
            <tr className="bg-muted">
              <th className="sticky-col text-left p-2 sm:p-4 font-semibold text-sm text-muted-foreground min-w-[130px] sm:min-w-[200px] bg-muted">
                Feature
              </th>
              {visibleColumns.map((col) => (
                <th
                  key={col.id}
                  className="p-2 sm:p-4 text-center min-w-[100px] sm:min-w-[150px]"
                >
                  <a
                    href={col.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-col items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity"
                  >
                    <ColumnLogo src={col.logo} name={col.name} />
                    <span className="font-semibold text-xs sm:text-sm text-foreground">
                      {col.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal hidden sm:block">
                      {col.provider}
                    </span>
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <>
                <tr key={`group-${group.name}`} className="group-header">
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="sticky-col px-2 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm text-primary bg-muted/70 border-t border-border"
                  >
                    {group.name}
                  </td>
                </tr>
                {group.rows.map((row) => (
                  <tr
                    key={`row-${group.name}-${row.feature}`}
                    className="border-t border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="sticky-col p-2 sm:p-4 text-xs sm:text-sm font-medium text-foreground">
                      {row.feature}
                      {row.tooltip && (
                        <span
                          className="ml-1 text-muted-foreground cursor-help"
                          title={row.tooltip}
                        >
                          (?)
                        </span>
                      )}
                    </td>
                    {visibleColumns.map((col) => (
                      <td
                        key={col.id}
                        className="p-2 sm:p-4 text-center text-foreground"
                      >
                        <CellValue
                          value={
                            row.values[col.id] !== undefined
                              ? row.values[col.id]
                              : "-"
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No features match your search.
        </div>
      )}
    </div>
  );
}
