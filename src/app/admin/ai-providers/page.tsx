"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const TIER_LABELS: Record<number, string> = {
  1: "Tier 1 — Frontier LLM Labs",
  2: "Tier 2 — Major Global LLM Builders",
  3: "Tier 3 — Open Model / Research LLM Labs",
  4: "Tier 4 — Enterprise LLM Builders",
  5: "Tier 5 — Regional LLM Builders",
};

const API_FORMATS = ["openai", "anthropic", "gemini"];

const COLOR_PRESETS = [
  { label: "Emerald", colorClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", borderClass: "border-emerald-500/20", gradientClass: "from-emerald-500/10 to-emerald-500/5" },
  { label: "Orange", colorClass: "bg-orange-500/10 text-orange-700 dark:text-orange-400", borderClass: "border-orange-500/20", gradientClass: "from-orange-500/10 to-orange-500/5" },
  { label: "Blue", colorClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400", borderClass: "border-blue-500/20", gradientClass: "from-blue-500/10 to-blue-500/5" },
  { label: "Violet", colorClass: "bg-violet-500/10 text-violet-700 dark:text-violet-400", borderClass: "border-violet-500/20", gradientClass: "from-violet-500/10 to-violet-500/5" },
  { label: "Rose", colorClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400", borderClass: "border-rose-500/20", gradientClass: "from-rose-500/10 to-rose-500/5" },
  { label: "Zinc", colorClass: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400", borderClass: "border-zinc-500/20", gradientClass: "from-zinc-500/10 to-zinc-500/5" },
  { label: "Cyan", colorClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400", borderClass: "border-cyan-500/20", gradientClass: "from-cyan-500/10 to-cyan-500/5" },
  { label: "Amber", colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400", borderClass: "border-amber-500/20", gradientClass: "from-amber-500/10 to-amber-500/5" },
];

type AIModel = {
  id: string;
  name: string;
  slug: string;
  modelId: string;
  description: string | null;
  initial: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  isActive: boolean;
  order: number;
};

type AIProvider = {
  id: string;
  name: string;
  slug: string;
  tier: number;
  description: string | null;
  website: string | null;
  apiKeyEnv: string | null;
  encryptedApiKey: string | null;
  apiFormat: string;
  apiBaseUrl: string | null;
  isActive: boolean;
  order: number;
  models: AIModel[];
};

const emptyProviderForm = {
  name: "",
  tier: 1,
  description: "",
  website: "",
  apiKeyEnv: "",
  apiFormat: "openai",
  apiBaseUrl: "",
};

const emptyModelForm = {
  providerId: "",
  name: "",
  modelId: "",
  description: "",
  initial: "",
  colorPreset: 0,
  order: 0,
};

export default function AIProvidersAdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set([1]));
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());

  // Provider form
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [providerForm, setProviderForm] = useState(emptyProviderForm);
  const [providerSaving, setProviderSaving] = useState(false);

  // API Key form
  const [apiKeyProvider, setApiKeyProvider] = useState<AIProvider | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [apiKeySaving, setApiKeySaving] = useState(false);

  // Model form
  const [showModelForm, setShowModelForm] = useState(false);
  const [modelFormProviderId, setModelFormProviderId] = useState<string>("");
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [modelForm, setModelForm] = useState(emptyModelForm);
  const [modelSaving, setModelSaving] = useState(false);

  const [statusMsg, setStatusMsg] = useState("");

  const loadProviders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ai-providers?withModels=true&activeOnly=false");
    if (res.ok) {
      setProviders(await res.json());
    } else if (res.status === 401) {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/ai-providers?withModels=true&activeOnly=false")
      .then((res) => {
        if (res.ok) { setIsLoggedIn(true); return res.json(); }
        return null;
      })
      .then((data) => { if (data) setProviders(data); });
  }, []);

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
      loadProviders();
    } else {
      setAuthError("Invalid password");
    }
  }

  function flash(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  }

  // Grouping
  const byTier: Record<number, AIProvider[]> = {};
  for (const p of providers) {
    (byTier[p.tier] ??= []).push(p);
  }

  function toggleTier(tier: number) {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      next.has(tier) ? next.delete(tier) : next.add(tier);
      return next;
    });
  }

  function toggleProvider(id: string) {
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Provider CRUD
  function openNewProviderForm() {
    setEditingProvider(null);
    setProviderForm(emptyProviderForm);
    setShowProviderForm(true);
  }

  function openEditProviderForm(p: AIProvider) {
    setEditingProvider(p);
    setProviderForm({
      name: p.name,
      tier: p.tier,
      description: p.description || "",
      website: p.website || "",
      apiKeyEnv: p.apiKeyEnv || "",
      apiFormat: p.apiFormat,
      apiBaseUrl: p.apiBaseUrl || "",
    });
    setShowProviderForm(true);
  }

  async function saveProvider() {
    setProviderSaving(true);
    const body = {
      name: providerForm.name,
      tier: providerForm.tier,
      description: providerForm.description || null,
      website: providerForm.website || null,
      apiKeyEnv: providerForm.apiKeyEnv || null,
      apiFormat: providerForm.apiFormat,
      apiBaseUrl: providerForm.apiBaseUrl || null,
    };
    const res = editingProvider
      ? await fetch(`/api/ai-providers/${editingProvider.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/ai-providers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    if (res.ok) {
      flash(editingProvider ? "Provider updated." : "Provider created.");
      setShowProviderForm(false);
      loadProviders();
    } else {
      const err = await res.json();
      flash(err.error || "Error saving provider.");
    }
    setProviderSaving(false);
  }

  async function toggleProviderActive(p: AIProvider) {
    const res = await fetch(`/api/ai-providers/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    if (res.ok) {
      flash(`Provider ${p.isActive ? "disabled" : "enabled"}.`);
      loadProviders();
    }
  }

  async function saveApiKey() {
    if (!apiKeyProvider) return;
    setApiKeySaving(true);
    const res = await fetch(`/api/ai-providers/${apiKeyProvider.id}/api-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: apiKeyValue || null }),
    });
    if (res.ok) {
      flash(apiKeyValue ? "API key saved and encrypted." : "API key cleared.");
      setApiKeyProvider(null);
      setApiKeyValue("");
      loadProviders();
    } else {
      flash("Failed to save API key.");
    }
    setApiKeySaving(false);
  }

  async function deleteProvider(p: AIProvider) {
    if (!confirm(`Delete "${p.name}" and all its models? This cannot be undone.`)) return;
    const res = await fetch(`/api/ai-providers/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      flash("Provider deleted.");
      loadProviders();
    }
  }

  // Model CRUD
  function openNewModelForm(providerId: string) {
    setEditingModel(null);
    setModelFormProviderId(providerId);
    setModelForm({ ...emptyModelForm, providerId });
    setShowModelForm(true);
  }

  function openEditModelForm(model: AIModel, providerId: string) {
    setEditingModel(model);
    setModelFormProviderId(providerId);
    const presetIdx = COLOR_PRESETS.findIndex((c) => c.colorClass === model.colorClass);
    setModelForm({
      providerId,
      name: model.name,
      modelId: model.modelId,
      description: model.description || "",
      initial: model.initial,
      colorPreset: presetIdx >= 0 ? presetIdx : 5,
      order: model.order,
    });
    setShowModelForm(true);
  }

  async function saveModel() {
    setModelSaving(true);
    const preset = COLOR_PRESETS[modelForm.colorPreset] || COLOR_PRESETS[5];
    const body = {
      providerId: modelFormProviderId,
      name: modelForm.name,
      modelId: modelForm.modelId,
      description: modelForm.description || null,
      initial: modelForm.initial || modelForm.name.charAt(0).toUpperCase(),
      colorClass: preset.colorClass,
      borderClass: preset.borderClass,
      gradientClass: preset.gradientClass,
      order: modelForm.order,
    };
    const res = editingModel
      ? await fetch(`/api/ai-models/${editingModel.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/ai-models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    if (res.ok) {
      flash(editingModel ? "Model updated." : "Model added.");
      setShowModelForm(false);
      loadProviders();
    } else {
      const err = await res.json();
      flash(err.error || "Error saving model.");
    }
    setModelSaving(false);
  }

  async function toggleModelActive(model: AIModel) {
    const res = await fetch(`/api/ai-models/${model.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !model.isActive }),
    });
    if (res.ok) {
      flash(`Model ${model.isActive ? "disabled" : "enabled"}.`);
      loadProviders();
    }
  }

  async function deleteModel(model: AIModel) {
    if (!confirm(`Delete model "${model.name}"?`)) return;
    const res = await fetch(`/api/ai-models/${model.id}`, { method: "DELETE" });
    if (res.ok) {
      flash("Model deleted.");
      loadProviders();
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin — AI Providers</h1>
            <p className="mt-2 text-sm text-muted-foreground">Enter the admin password to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-muted-foreground mb-1">
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">AI Providers &amp; Models</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">AI Providers &amp; Models</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {providers.length} providers across {Object.keys(byTier).length} tiers &bull;{" "}
            {providers.reduce((n, p) => n + p.models.length, 0)} models configured
          </p>
        </div>
        <button
          onClick={openNewProviderForm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Provider
        </button>
      </div>

      {statusMsg && (
        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-500/20">
          {statusMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {([1, 2, 3, 4, 5] as const).map((tier) => {
            const tierProviders = byTier[tier] || [];
            const isOpen = expandedTiers.has(tier);
            return (
              <div key={tier} className="rounded-xl border border-border overflow-hidden">
                {/* Tier header */}
                <button
                  onClick={() => toggleTier(tier)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary text-xs font-bold">
                      T{tier}
                    </span>
                    <div>
                      <span className="font-semibold text-foreground">{TIER_LABELS[tier]}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {tierProviders.length} providers &bull;{" "}
                        {tierProviders.filter((p) => p.isActive).length} active
                      </span>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="divide-y divide-border border-t border-border">
                    {tierProviders.length === 0 && (
                      <div className="px-5 py-4 text-sm text-muted-foreground italic">No providers in this tier.</div>
                    )}
                    {tierProviders.map((p) => {
                      const isProviderOpen = expandedProviders.has(p.id);
                      return (
                        <div key={p.id} className="bg-background">
                          {/* Provider row */}
                          <div className="flex items-center gap-3 px-5 py-3">
                            <button onClick={() => toggleProvider(p.id)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                              <svg
                                className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${isProviderOpen ? "rotate-90" : ""}`}
                                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="min-w-0">
                                <span className={`font-medium text-sm ${p.isActive ? "text-foreground" : "text-muted-foreground line-through"}`}>
                                  {p.name}
                                </span>
                                {p.apiKeyEnv && (
                                  <span className="ml-2 text-xs font-mono text-muted-foreground">{p.apiKeyEnv}</span>
                                )}
                                {p.models.length > 0 && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    {p.models.filter((m) => m.isActive).length}/{p.models.length} models
                                  </span>
                                )}
                              </div>
                            </button>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => openNewModelForm(p.id)}
                                className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                              >
                                + Model
                              </button>
                              <button
                                onClick={() => { setApiKeyProvider(p); setApiKeyValue(""); }}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  p.encryptedApiKey
                                    ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                                    : "border-border text-muted-foreground hover:text-foreground"
                                }`}
                                title={p.encryptedApiKey ? "API key stored — click to update" : "Set API key"}
                              >
                                {p.encryptedApiKey ? "Key ✓" : "Set Key"}
                              </button>
                              <button
                                onClick={() => openEditProviderForm(p)}
                                className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => toggleProviderActive(p)}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  p.isActive
                                    ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                                    : "border-border text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {p.isActive ? "Active" : "Inactive"}
                              </button>
                              <button
                                onClick={() => deleteProvider(p)}
                                className="text-xs px-2 py-1 rounded border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                Del
                              </button>
                            </div>
                          </div>

                          {/* Models list */}
                          {isProviderOpen && (
                            <div className="ml-8 border-l border-border pl-4 pb-3 space-y-1">
                              {p.models.length === 0 && (
                                <div className="text-xs text-muted-foreground italic py-1">No models yet.</div>
                              )}
                              {p.models.map((m) => (
                                <div key={m.id} className="flex items-center gap-3 py-1.5">
                                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${m.colorClass}`}>
                                    {m.initial}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-medium ${m.isActive ? "text-foreground" : "text-muted-foreground line-through"}`}>
                                      {m.name}
                                    </span>
                                    <span className="ml-2 text-xs font-mono text-muted-foreground">{m.modelId}</span>
                                    {m.description && (
                                      <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">{m.description}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => openEditModelForm(m, p.id)}
                                      className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => toggleModelActive(m)}
                                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                                        m.isActive
                                          ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                                          : "border-border text-muted-foreground hover:text-foreground"
                                      }`}
                                    >
                                      {m.isActive ? "On" : "Off"}
                                    </button>
                                    <button
                                      onClick={() => deleteModel(m)}
                                      className="text-xs px-2 py-0.5 rounded border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                      Del
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Provider Form Modal */}
      {showProviderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingProvider ? "Edit Provider" : "New Provider"}
              </h2>
              <button onClick={() => setShowProviderForm(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                <input
                  value={providerForm.name}
                  onChange={(e) => setProviderForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. OpenAI"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tier *</label>
                <select
                  value={providerForm.tier}
                  onChange={(e) => setProviderForm((f) => ({ ...f, tier: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[1, 2, 3, 4, 5].map((t) => (
                    <option key={t} value={t}>{TIER_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Website</label>
                <input
                  value={providerForm.website}
                  onChange={(e) => setProviderForm((f) => ({ ...f, website: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://openai.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">API Key Env Variable</label>
                <input
                  value={providerForm.apiKeyEnv}
                  onChange={(e) => setProviderForm((f) => ({ ...f, apiKeyEnv: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="OPENAI_API_KEY"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">API Format *</label>
                <select
                  value={providerForm.apiFormat}
                  onChange={(e) => setProviderForm((f) => ({ ...f, apiFormat: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {API_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>{fmt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">API Base URL</label>
                <input
                  value={providerForm.apiBaseUrl}
                  onChange={(e) => setProviderForm((f) => ({ ...f, apiBaseUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <input
                  value={providerForm.description}
                  onChange={(e) => setProviderForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Short description"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveProvider}
                disabled={providerSaving || !providerForm.name.trim()}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {providerSaving ? "Saving…" : editingProvider ? "Save Changes" : "Create Provider"}
              </button>
              <button
                onClick={() => setShowProviderForm(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Form Modal */}
      {showModelForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingModel ? "Edit Model" : "Add Model"}
              </h2>
              <button onClick={() => setShowModelForm(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Provider</label>
                <select
                  value={modelFormProviderId}
                  onChange={(e) => setModelFormProviderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (T{p.tier})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Display Name *</label>
                <input
                  value={modelForm.name}
                  onChange={(e) => setModelForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. GPT-4o"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">API Model ID *</label>
                <input
                  value={modelForm.modelId}
                  onChange={(e) => setModelForm((f) => ({ ...f, modelId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. gpt-4o or meta-llama/Llama-3.3-70B-Instruct-Turbo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Initial (avatar letter)</label>
                <input
                  value={modelForm.initial}
                  onChange={(e) => setModelForm((f) => ({ ...f, initial: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. G"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModelForm((f) => ({ ...f, colorPreset: idx }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${preset.colorClass} ${preset.borderClass} ${
                        modelForm.colorPreset === idx ? "ring-2 ring-primary ring-offset-1" : ""
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <input
                  value={modelForm.description}
                  onChange={(e) => setModelForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Order</label>
                <input
                  type="number"
                  value={modelForm.order}
                  onChange={(e) => setModelForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveModel}
                disabled={modelSaving || !modelForm.name.trim() || !modelForm.modelId.trim()}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {modelSaving ? "Saving…" : editingModel ? "Save Changes" : "Add Model"}
              </button>
              <button
                onClick={() => setShowModelForm(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {apiKeyProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Set API Key</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{apiKeyProvider.name}</p>
              </div>
              <button onClick={() => setApiKeyProvider(null)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p className="font-medium">Stored encrypted with AES-256-GCM</p>
              <p>The key is encrypted before saving to the database. It is never returned to the browser.</p>
              {apiKeyProvider.apiKeyEnv && (
                <p className="mt-1">
                  Note: If <span className="font-mono">{apiKeyProvider.apiKeyEnv}</span> is set in your environment, it takes priority over this stored key.
                </p>
              )}
            </div>

            {apiKeyProvider.encryptedApiKey && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                API key is currently stored. Enter a new value to replace it.
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                API Key {apiKeyProvider.apiKeyEnv && <span className="font-mono">({apiKeyProvider.apiKeyEnv})</span>}
              </label>
              <input
                type="password"
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder={apiKeyProvider.encryptedApiKey ? "Enter new key to replace…" : "sk-..."}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveApiKey}
                disabled={apiKeySaving || !apiKeyValue.trim()}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {apiKeySaving ? "Encrypting & Saving…" : "Save Encrypted Key"}
              </button>
              {apiKeyProvider.encryptedApiKey && (
                <button
                  onClick={() => { setApiKeyValue(""); saveApiKey(); }}
                  disabled={apiKeySaving}
                  className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setApiKeyProvider(null)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
