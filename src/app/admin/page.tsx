"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Category } from "@/types";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
      loadCategories();
    } else {
      setError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setIsLoggedIn(false);
    setCategories([]);
  }

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/data/categories");
    if (res.ok) {
      setCategories(await res.json());
    } else if (res.status === 401) {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/data/categories")
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) setCategories(data);
      });
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the admin password to manage comparison data.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage comparison categories and data.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#128101;</span>
            <div>
              <h3 className="font-medium text-foreground">Manage Users</h3>
              <p className="text-sm text-muted-foreground">
                View registered users and manage admin roles
              </p>
            </div>
          </Link>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#43;</span>
            <div>
              <h3 className="font-medium text-foreground">New Category</h3>
              <p className="text-sm text-muted-foreground">
                Create a new comparison category
              </p>
            </div>
          </Link>
          <Link
            href="/admin/domains"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#127760;</span>
            <div>
              <h3 className="font-medium text-foreground">Manage Domains</h3>
              <p className="text-sm text-muted-foreground">
                Industry-specific comparisons
              </p>
            </div>
          </Link>
          <Link
            href="/admin/contact"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#9993;</span>
            <div>
              <h3 className="font-medium text-foreground">Contact Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage recipients and view submissions
              </p>
            </div>
          </Link>
          <Link
            href="/admin/ai-providers"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#129302;</span>
            <div>
              <h3 className="font-medium text-foreground">AI Providers &amp; Models</h3>
              <p className="text-sm text-muted-foreground">
                Manage providers, tiers, and models for Prompt Battle
              </p>
            </div>
          </Link>
          <Link
            href="/admin/request-logs"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
          >
            <span className="text-lg">&#128202;</span>
            <div>
              <h3 className="font-medium text-foreground">API Request Logs</h3>
              <p className="text-sm text-muted-foreground">
                Filter by user, provider, model, status &amp; date — view cost &amp; token totals
              </p>
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Comparison Categories
            </h2>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={`/admin/edit/${cat.slug}`}
                  className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
