import Link from "next/link";

interface TokenPriceRow {
  model: string;
  provider: string;
  inputPer1M: string;
  outputPer1M: string;
  inputRaw: number;
  outputRaw: number;
  contextWindow: string;
  updated: string;
}

const tokenPrices: TokenPriceRow[] = [
  { model: "GPT-4o",            provider: "OpenAI",     inputPer1M: "$2.50",   outputPer1M: "$10.00",  inputRaw: 2.50,   outputRaw: 10.00,  contextWindow: "128K", updated: "Jan 2026"  },
  { model: "GPT-4o mini",       provider: "OpenAI",     inputPer1M: "$0.15",   outputPer1M: "$0.60",   inputRaw: 0.15,   outputRaw: 0.60,   contextWindow: "128K", updated: "Jan 2026"  },
  { model: "GPT-o1",            provider: "OpenAI",     inputPer1M: "$15.00",  outputPer1M: "$60.00",  inputRaw: 15.00,  outputRaw: 60.00,  contextWindow: "200K", updated: "Jan 2026"  },
  { model: "Claude 3.7 Sonnet", provider: "Anthropic",  inputPer1M: "$3.00",   outputPer1M: "$15.00",  inputRaw: 3.00,   outputRaw: 15.00,  contextWindow: "200K", updated: "Feb 2026"  },
  { model: "Claude 3.5 Haiku",  provider: "Anthropic",  inputPer1M: "$0.80",   outputPer1M: "$4.00",   inputRaw: 0.80,   outputRaw: 4.00,   contextWindow: "200K", updated: "Dec 2025"  },
  { model: "Claude Opus 4",     provider: "Anthropic",  inputPer1M: "$15.00",  outputPer1M: "$75.00",  inputRaw: 15.00,  outputRaw: 75.00,  contextWindow: "200K", updated: "Mar 2026"  },
  { model: "Gemini 2.0 Flash",  provider: "Google",     inputPer1M: "$0.075",  outputPer1M: "$0.30",   inputRaw: 0.075,  outputRaw: 0.30,   contextWindow: "1M",   updated: "Feb 2026"  },
  { model: "Gemini 1.5 Pro",    provider: "Google",     inputPer1M: "$1.25",   outputPer1M: "$5.00",   inputRaw: 1.25,   outputRaw: 5.00,   contextWindow: "2M",   updated: "Oct 2025"  },
  { model: "Llama 3.3 70B",     provider: "Together AI",inputPer1M: "$0.88",   outputPer1M: "$0.88",   inputRaw: 0.88,   outputRaw: 0.88,   contextWindow: "128K", updated: "Jan 2026"  },
  { model: "Mistral Large",     provider: "Mistral",    inputPer1M: "$2.00",   outputPer1M: "$6.00",   inputRaw: 2.00,   outputRaw: 6.00,   contextWindow: "128K", updated: "Nov 2025"  },
  { model: "Grok-2",            provider: "xAI",        inputPer1M: "$2.00",   outputPer1M: "$10.00",  inputRaw: 2.00,   outputRaw: 10.00,  contextWindow: "131K", updated: "Jan 2026"  },
];

const minInput = Math.min(...tokenPrices.map((r) => r.inputRaw));
const maxInput = Math.max(...tokenPrices.map((r) => r.inputRaw));

function inputClass(raw: number): string {
  if (raw === minInput) return "text-emerald-700 dark:text-emerald-400 font-bold";
  if (raw === maxInput) return "text-red-600 dark:text-red-400 font-bold";
  return "text-foreground";
}

const subscriptionTiers = [
  { name: "ChatGPT Plus",   price: "$20/mo",       features: ["GPT-4o access", "DALL-E 3 image gen", "Advanced data analysis", "Custom GPTs"] },
  { name: "ChatGPT Pro",    price: "$200/mo",       features: ["Unlimited GPT-o1 access", "Extended compute", "Operator mode", "Priority capacity"] },
  { name: "Claude Pro",     price: "$20/mo",        features: ["Claude 3.7 Sonnet + Opus 4", "5× more usage", "Priority access", "Projects feature"] },
  { name: "Claude Team",    price: "$30/user/mo",   features: ["Team billing", "Central admin", "No training on data", "Higher rate limits"] },
  { name: "Gemini Advanced",price: "$20/mo",        features: ["Gemini 1.5 Ultra access", "1M context window", "Google One 2TB storage", "Workspace integration"] },
  { name: "Copilot Pro",    price: "$20/mo",        features: ["GPT-4o in Office apps", "Copilot in Word/Excel/PPT", "Designer boosts", "Priority access"] },
];

const priceChanges = [
  { date: "Feb 2026", text: "Gemini 2.0 Flash launched at $0.075/1M input — a 40% reduction vs Flash 1.5. Output priced at $0.30/1M.",     direction: "down" },
  { date: "Jan 2026", text: "OpenAI raised GPT-o1 pricing to $15/$60 per 1M input/output tokens, reflecting increased reasoning compute cost.", direction: "up" },
  { date: "Mar 2026", text: "Anthropic released Claude Opus 4 at $15/$75 per 1M tokens, their flagship model targeting complex enterprise reasoning tasks.", direction: "neutral" },
  { date: "Nov 2025", text: "Mistral cut Mistral Large pricing by 20% to $2.00/$6.00 per 1M tokens in response to competitive pressure from Google and Anthropic.", direction: "down" },
  { date: "Oct 2025", text: "Google extended Gemini 1.5 Pro context window from 1M to 2M tokens with no price change, maintaining $1.25/$5.00 per 1M.", direction: "neutral" },
];

function DirectionIcon({ direction }: { direction: string }) {
  if (direction === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        Price drop
      </span>
    );
  }
  if (direction === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        Price increase
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
      New launch
    </span>
  );
}

export default function PricingIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Pricing Index</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 shrink-0">
          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Pricing Index</h1>
          <p className="mt-1 text-muted-foreground">
            Current token prices, subscription tiers, and recent cost changes across major AI models. Updated Q1 2026.
          </p>
        </div>
      </div>

      {/* Section 1 — API Token Prices */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            API Token Prices — per 1M Tokens
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Model</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Input ($/1M)</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Output ($/1M)</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Context</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Updated</th>
                </tr>
              </thead>
              <tbody>
                {tokenPrices.map((row, i) => (
                  <tr key={row.model} className={i < tokenPrices.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{row.model}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{row.provider}</td>
                    <td className={`px-4 py-3 text-right font-mono ${inputClass(row.inputRaw)}`}>{row.inputPer1M}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{row.outputPer1M}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{row.contextWindow}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Green = cheapest input price</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="text-red-600 dark:text-red-400 font-semibold">Red = most expensive input price</span>
          </div>
        </div>
      </section>

      {/* Section 2 — Consumer Subscription Tiers */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Consumer Subscription Tiers
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <div key={tier.name} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{tier.name}</h3>
                <span className="text-lg font-bold text-primary">{tier.price}</span>
              </div>
              <ul className="space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Recent Price Changes */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Recent Price Changes
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {priceChanges.map((change, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4">
              <div className="shrink-0">
                <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg whitespace-nowrap">
                  {change.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{change.text}</p>
              <DirectionIcon direction={change.direction} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
