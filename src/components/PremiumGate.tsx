"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const role = session?.user?.role;
  const hasAccess = role === "admin" || role === "contributor";

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Premium Feature</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Sign in to access this tool</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This is an interactive Premium tool that takes your input and responds with live AI data.
              Sign in with your account to get started.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign in to access
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Browse free tools
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Looking for free tools?{" "}
            <Link href="/research" className="text-primary hover:underline">
              View all available tools →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
