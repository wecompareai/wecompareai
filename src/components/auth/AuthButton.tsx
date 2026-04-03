"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-xs">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <span className="hidden sm:inline">{session.user.name}</span>
        </button>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-50">
              <Link
                href="/profile"
                onClick={() => setShowMenu(false)}
                className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg"
              >
                My Profile
              </Link>
              {(session.user.role === "admin" || session.user.role === "contributor") && (
                <Link
                  href="/research"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Dynamic Research
                </Link>
              )}
              {session.user.role === "admin" && (
                <Link
                  href="/blog/new"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Write Article
                </Link>
              )}
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors rounded-b-lg"
              >
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
    >
      Login
    </Link>
  );
}
