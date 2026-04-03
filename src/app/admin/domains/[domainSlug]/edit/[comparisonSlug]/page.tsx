"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ComparisonData, Column, Group, Row } from "@/types";

export default function EditDomainComparisonPage({
  params,
}: {
  params: Promise<{ domainSlug: string; comparisonSlug: string }>;
}) {
  const { domainSlug, comparisonSlug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdomainSlug = searchParams.get("sub") || "general";

  const [data, setData] = useState<ComparisonData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const apiBase = `/api/domains/${domainSlug}/subdomains/${subdomainSlug}/comparisons/${comparisonSlug}`;

  useEffect(() => {
    fetch(apiBase)
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin");
          return null;
        }
        if (res.status === 404) {
          setData({
            id: comparisonSlug,
            title: comparisonSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            description: "",
            lastUpdated: new Date().toISOString().split("T")[0],
            columns: [],
            groups: [],
          });
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
      });
  }, [apiBase, comparisonSlug, router]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    data.lastUpdated = new Date().toISOString().split("T")[0];
    const res = await fetch(apiBase, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessage(res.ok ? "Saved successfully!" : "Failed to save.");
    setSaving(false);
  }

  function updateColumn(index: number, field: keyof Column, value: string) {
    if (!data) return;
    const columns = [...data.columns];
    columns[index] = { ...columns[index], [field]: value };
    setData({ ...data, columns });
  }

  function addColumn() {
    if (!data) return;
    const id = `new-${Date.now()}`;
    const newCol: Column = {
      id,
      name: "New Entry",
      provider: "Provider",
      logo: "/logos/openai.svg",
      url: "https://example.com",
    };
    const columns = [...data.columns, newCol];
    const groups = data.groups.map((g) => ({
      ...g,
      rows: g.rows.map((r) => ({
        ...r,
        values: { ...r.values, [id]: "" },
      })),
    }));
    setData({ ...data, columns, groups });
  }

  function removeColumn(colIndex: number) {
    if (!data) return;
    const colId = data.columns[colIndex].id;
    const columns = data.columns.filter((_, i) => i !== colIndex);
    const groups = data.groups.map((g) => ({
      ...g,
      rows: g.rows.map((r) => {
        const values = { ...r.values };
        delete values[colId];
        return { ...r, values };
      }),
    }));
    setData({ ...data, columns, groups });
  }

  function updateRowValue(
    groupIndex: number,
    rowIndex: number,
    colId: string,
    value: string
  ) {
    if (!data) return;
    const groups = [...data.groups];
    const row = { ...groups[groupIndex].rows[rowIndex] };
    if (value.toLowerCase() === "true") {
      row.values = { ...row.values, [colId]: true };
    } else if (value.toLowerCase() === "false") {
      row.values = { ...row.values, [colId]: false };
    } else {
      row.values = { ...row.values, [colId]: value };
    }
    groups[groupIndex] = {
      ...groups[groupIndex],
      rows: groups[groupIndex].rows.map((r, i) => (i === rowIndex ? row : r)),
    };
    setData({ ...data, groups });
  }

  function updateRowFeature(
    groupIndex: number,
    rowIndex: number,
    feature: string
  ) {
    if (!data) return;
    const groups = [...data.groups];
    groups[groupIndex] = {
      ...groups[groupIndex],
      rows: groups[groupIndex].rows.map((r, i) =>
        i === rowIndex ? { ...r, feature } : r
      ),
    };
    setData({ ...data, groups });
  }

  function addRow(groupIndex: number) {
    if (!data) return;
    const groups = [...data.groups];
    const newRow: Row = {
      feature: "New Feature",
      values: Object.fromEntries(data.columns.map((c) => [c.id, ""])),
    };
    groups[groupIndex] = {
      ...groups[groupIndex],
      rows: [...groups[groupIndex].rows, newRow],
    };
    setData({ ...data, groups });
  }

  function removeRow(groupIndex: number, rowIndex: number) {
    if (!data) return;
    const groups = [...data.groups];
    groups[groupIndex] = {
      ...groups[groupIndex],
      rows: groups[groupIndex].rows.filter((_, i) => i !== rowIndex),
    };
    setData({ ...data, groups });
  }

  function addGroup() {
    if (!data) return;
    const newGroup: Group = { name: "New Group", rows: [] };
    setData({ ...data, groups: [...data.groups, newGroup] });
  }

  function updateGroupName(groupIndex: number, name: string) {
    if (!data) return;
    const groups = [...data.groups];
    groups[groupIndex] = { ...groups[groupIndex], name };
    setData({ ...data, groups });
  }

  function removeGroup(groupIndex: number) {
    if (!data) return;
    setData({
      ...data,
      groups: data.groups.filter((_, i) => i !== groupIndex),
    });
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <button
              onClick={() => router.push(`/admin/domains/${domainSlug}`)}
              className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1"
            >
              &larr; Back to Domain
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              Edit: {data.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span
                className={`text-sm ${message.includes("success") ? "text-emerald-500" : "text-red-500"}`}
              >
                {message}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-8 p-4 rounded-xl border border-border space-y-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Title
            </label>
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <input
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Columns */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Columns</h2>
            <button
              onClick={addColumn}
              className="px-3 py-1.5 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              + Add Column
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.columns.map((col, i) => (
              <div
                key={col.id}
                className="p-3 rounded-xl border border-border space-y-2 relative"
              >
                <button
                  onClick={() => removeColumn(i)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                >
                  x
                </button>
                <input
                  value={col.name}
                  onChange={(e) => updateColumn(i, "name", e.target.value)}
                  placeholder="Name"
                  className="w-full px-2 py-1 rounded border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <input
                  value={col.provider}
                  onChange={(e) => updateColumn(i, "provider", e.target.value)}
                  placeholder="Provider"
                  className="w-full px-2 py-1 rounded border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <input
                  value={col.url}
                  onChange={(e) => updateColumn(i, "url", e.target.value)}
                  placeholder="URL"
                  className="w-full px-2 py-1 rounded border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <input
                  value={col.logo}
                  onChange={(e) => updateColumn(i, "logo", e.target.value)}
                  placeholder="Logo path"
                  className="w-full px-2 py-1 rounded border border-border bg-background text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Groups & Rows */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Feature Groups
            </h2>
            <button
              onClick={addGroup}
              className="px-3 py-1.5 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              + Add Group
            </button>
          </div>

          <div className="space-y-6">
            {data.groups.map((group, gi) => (
              <div key={gi} className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <input
                    value={group.name}
                    onChange={(e) => updateGroupName(gi, e.target.value)}
                    className="text-base font-semibold px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addRow(gi)}
                      className="px-2 py-1 text-xs rounded border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      + Row
                    </button>
                    <button
                      onClick={() => removeGroup(gi)}
                      className="px-2 py-1 text-xs rounded border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Delete Group
                    </button>
                  </div>
                </div>

                <div className="comparison-table-wrapper">
                  <table className="w-full border-collapse min-w-[600px] text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 font-medium text-muted-foreground min-w-[150px]">
                          Feature
                        </th>
                        {data.columns.map((col) => (
                          <th
                            key={col.id}
                            className="p-2 text-center font-medium text-muted-foreground min-w-[120px]"
                          >
                            {col.name}
                          </th>
                        ))}
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((row, ri) => (
                        <tr key={ri} className="border-t border-border">
                          <td className="p-2">
                            <input
                              value={row.feature}
                              onChange={(e) =>
                                updateRowFeature(gi, ri, e.target.value)
                              }
                              className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </td>
                          {data.columns.map((col) => (
                            <td key={col.id} className="p-2">
                              <input
                                value={String(row.values[col.id] ?? "")}
                                onChange={(e) =>
                                  updateRowValue(gi, ri, col.id, e.target.value)
                                }
                                className="w-full px-2 py-1 rounded border border-border bg-background text-foreground text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                                placeholder="-"
                              />
                            </td>
                          ))}
                          <td className="p-2">
                            <button
                              onClick={() => removeRow(gi, ri)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
