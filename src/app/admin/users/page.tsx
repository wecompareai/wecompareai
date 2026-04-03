"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { articles: number; comments: number };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Password change modal state
  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      loadUsers();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!session?.user) {
    router.push("/auth/login");
    return null;
  }
  if (session.user.role !== "admin") {
    router.push("/");
    return null;
  }

  async function loadUsers() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    } else {
      setError("Failed to load users");
    }
    setLoading(false);
  }

  async function changeRole(userId: string, newRole: string) {
    setUpdating(userId);
    setError("");

    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update role");
    }
    setUpdating(null);
  }

  function openPasswordModal(userId: string) {
    setPasswordModal(userId);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  }

  function closePasswordModal() {
    setPasswordModal(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  }

  async function changePassword(userId: string) {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordUpdating(true);
    const res = await fetch(`/api/users/${userId}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      setPasswordSuccess("Password updated successfully!");
      setTimeout(() => closePasswordModal(), 1500);
    } else {
      const data = await res.json();
      setPasswordError(data.error || "Failed to update password");
    }
    setPasswordUpdating(false);
  }

  const modalUser = users.find((u) => u.id === passwordModal);

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin"
            className="hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <span>/</span>
          <span className="text-foreground">Users</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading users...
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">
                        {user.name}
                      </h3>
                      {user.role === "admin" && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">
                          Admin
                        </span>
                      )}
                      {user.role === "contributor" && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Contributor
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{user._count.articles} articles</span>
                      <span>{user._count.comments} comments</span>
                      <span>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Change Password */}
                  <button
                    onClick={() => openPasswordModal(user.id)}
                    className="px-3 py-2 text-sm rounded-lg font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    title="Change password"
                  >
                    Change Password
                  </button>

                  {/* Role Selector */}
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    disabled={updating === user.id || user.id === session?.user?.id}
                    title={
                      user.id === session?.user?.id
                        ? "Cannot change your own role"
                        : undefined
                    }
                    className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="contributor">Contributor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {updating === user.id && (
                    <span className="text-xs text-muted-foreground">Updating...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {passwordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePasswordModal();
          }}
        >
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Set a new password for{" "}
              <span className="text-foreground font-medium">
                {modalUser?.name}
              </span>{" "}
              <span className="text-xs">({modalUser?.email})</span>
            </p>

            {passwordSuccess ? (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 text-center">
                {passwordSuccess}
              </div>
            ) : (
              <>
                {passwordError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      autoFocus
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") changePassword(passwordModal);
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => changePassword(passwordModal)}
                    disabled={passwordUpdating}
                    className="flex-1 px-4 py-2 text-sm rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {passwordUpdating ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    onClick={closePasswordModal}
                    className="px-4 py-2 text-sm rounded-lg font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
