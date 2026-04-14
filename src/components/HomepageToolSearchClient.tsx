"use client";

import dynamic from "next/dynamic";

// Disable SSR entirely — the combobox has browser-only state (open/close,
// rotating placeholders) that would cause a hydration mismatch if pre-rendered.
const HomepageToolSearch = dynamic(() => import("./HomepageToolSearch"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 rounded-lg bg-muted w-full" />
      <div className="flex gap-2">
        <div className="h-10 rounded-xl bg-muted flex-1" />
        <div className="h-10 w-8 rounded-xl bg-muted shrink-0" />
        <div className="h-10 rounded-xl bg-muted flex-1" />
      </div>
      <div className="h-10 rounded-xl bg-muted w-full" />
      <div className="flex gap-2">
        {[1,2,3,4].map((i) => <div key={i} className="h-5 w-24 rounded-full bg-muted" />)}
      </div>
    </div>
  ),
});

export default HomepageToolSearch;
