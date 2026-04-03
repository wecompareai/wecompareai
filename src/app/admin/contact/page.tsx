"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Recipient {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

interface Submission {
  id: string;
  fullName: string;
  email: string;
  mobile: string | null;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [tab, setTab] = useState<"recipients" | "submissions">("recipients");

  useEffect(() => {
    loadRecipients();
    loadSubmissions();
  }, []);

  async function loadRecipients() {
    const res = await fetch("/api/contact/recipients");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (res.ok) setRecipients(await res.json());
  }

  async function loadSubmissions() {
    const res = await fetch("/api/contact/submissions");
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
    }
  }

  async function addRecipient(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    const res = await fetch("/api/contact/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });
    if (res.ok) {
      setNewName("");
      setNewEmail("");
      loadRecipients();
    }
  }

  async function toggleRecipient(id: string, active: boolean) {
    await fetch(`/api/contact/recipients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    loadRecipients();
  }

  async function removeRecipient(id: string) {
    await fetch(`/api/contact/recipients/${id}`, { method: "DELETE" });
    loadRecipients();
  }

  async function deleteSubmission(id: string) {
    await fetch(`/api/contact/submissions/${id}`, { method: "DELETE" });
    loadSubmissions();
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

        <h1 className="text-2xl font-bold text-foreground mb-6">
          Contact Management
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setTab("recipients")}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "recipients"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recipients
          </button>
          <button
            onClick={() => setTab("submissions")}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === "submissions"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Submissions ({submissions.length})
          </button>
        </div>

        {tab === "recipients" && (
          <div className="space-y-4">
            {/* Add recipient form */}
            <form
              onSubmit={addRecipient}
              className="flex flex-wrap gap-3 p-4 rounded-xl border border-border"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </form>

            {/* Recipient list */}
            {recipients.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRecipient(r.id, r.active)}
                    className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                      r.active
                        ? "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => removeRecipient(r.id)}
                    className="px-3 py-1 text-xs rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {recipients.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No recipients configured. Add one above.
              </p>
            )}
          </div>
        )}

        {tab === "submissions" && (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-border space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{s.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.email}
                      {s.mobile && ` | ${s.mobile}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteSubmission(s.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {s.description}
                </p>
              </div>
            ))}

            {submissions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No submissions yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
