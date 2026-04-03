"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCountryPage() {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [flag, setFlag] = useState("");
  const [providerName, setProviderName] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!country.trim() || !flag.trim() || !providerName.trim() || !model.trim()) {
      setError("Country, flag, provider name, and model are required.");
      return;
    }

    setSaving(true);
    setError("");

    const res = await fetch("/api/countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, flag, providerName, model, description, features }),
    });

    if (res.ok) {
      router.push("/countries");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add country.");
      setSaving(false);
    }
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => router.push("/countries")}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          &larr; Back to Countries
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Add Country / Provider</h1>
        <p className="text-sm text-muted-foreground mb-6">
          If the country already exists, the new provider will be appended to it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Country Name <span className="text-red-500">*</span>
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. South Korea"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Flag Emoji <span className="text-red-500">*</span>
              </label>
              <input
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="e.g. 🇰🇷"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <hr className="border-border" />
          <p className="text-sm font-medium text-foreground">Provider Details</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Provider Name <span className="text-red-500">*</span>
              </label>
              <input
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. NAVER"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. HyperCLOVA X"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the model and its capabilities"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Key Features
            </label>
            <input
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Comma-separated, e.g. Open source, 128K context, Multilingual"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">Separate features with commas</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Country / Provider"}
          </button>
        </form>
      </div>
    </div>
  );
}
