import Link from "next/link";

interface LatencyRow {
  model: string;
  provider: string;
  usEast: number;
  usWest: number;
  euWest: number;
  asiaPacific: number;
}

const rows: LatencyRow[] = [
  { model: "GPT-4o",             provider: "OpenAI",    usEast: 320, usWest: 410, euWest: 520, asiaPacific: 780 },
  { model: "GPT-4o mini",        provider: "OpenAI",    usEast: 180, usWest: 230, euWest: 310, asiaPacific: 490 },
  { model: "Claude 3.7 Sonnet",  provider: "Anthropic", usEast: 290, usWest: 380, euWest: 460, asiaPacific: 710 },
  { model: "Claude 3.5 Haiku",   provider: "Anthropic", usEast: 160, usWest: 210, euWest: 290, asiaPacific: 440 },
  { model: "Gemini 2.0 Flash",   provider: "Google",    usEast: 210, usWest: 190, euWest: 380, asiaPacific: 320 },
  { model: "Gemini 1.5 Pro",     provider: "Google",    usEast: 380, usWest: 360, euWest: 490, asiaPacific: 410 },
  { model: "Llama 3.3 70B",      provider: "Meta/Together", usEast: 260, usWest: 290, euWest: 440, asiaPacific: 620 },
  { model: "Mistral Large",      provider: "Mistral",   usEast: 340, usWest: 420, euWest: 280, asiaPacific: 590 },
];

function latencyClass(ms: number): string {
  if (ms <= 250) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  if (ms <= 450) return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
  return "bg-red-500/15 text-red-600 dark:text-red-400";
}

const regions = [
  { key: "usEast" as const,      label: "US East" },
  { key: "usWest" as const,      label: "US West" },
  { key: "euWest" as const,      label: "EU West" },
  { key: "asiaPacific" as const, label: "Asia Pacific" },
];

export default function LatencyHeatmapPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">Latency Heatmap by Region</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 shrink-0">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Latency Heatmap by Region</h1>
          <p className="mt-1 text-muted-foreground">
            Compare model response speeds (median TTFT in ms) across US East, US West, EU West, and Asia Pacific.
          </p>
        </div>
      </div>

      {/* Heatmap table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Model</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                {regions.map((r) => (
                  <th key={r.key} className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.model} className={i < rows.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{row.model}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{row.provider}</td>
                  {regions.map((r) => {
                    const ms = row[r.key];
                    return (
                      <td key={r.key} className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-mono font-semibold ${latencyClass(ms)}`}>
                          {ms} ms
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs">
        <span className="text-muted-foreground font-medium uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
            ≤ 250 ms
          </span>
          <span className="text-muted-foreground">Fast</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono font-semibold">
            251–450 ms
          </span>
          <span className="text-muted-foreground">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 font-mono font-semibold">
            &gt; 450 ms
          </span>
          <span className="text-muted-foreground">Slow</span>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-foreground">Measurement Notes</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-foreground">TTFT (Time to First Token)</strong> — All values represent median TTFT in milliseconds, measured across 50 samples per region per model. TTFT is the elapsed time from request dispatch to receipt of the first streamed token byte.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-foreground">Infrastructure</strong> — Tests were run from AWS EC2 instances in us-east-1, us-west-2, eu-west-1, and ap-southeast-1 to simulate real cloud-hosted application latency. No VPN or proxy was used.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-foreground">Period</strong> — Data collected Q1 2026 during business hours (09:00–17:00 local time) under typical API load. Results may vary under peak traffic or with provider infrastructure changes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Llama 3.3 70B values reflect Together AI hosted inference endpoints. Self-hosted deployments may differ significantly depending on hardware and geography.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
