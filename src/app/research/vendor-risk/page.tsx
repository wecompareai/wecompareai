import Link from "next/link";

interface VendorScore {
  name: string;
  fundingStability: number;
  modelDependency: number;
  complianceMaturity: number;
  dataRetentionRisk: number;
  outageHistory: number;
  overall: number;
}

const vendors: VendorScore[] = [
  { name: "OpenAI",           fundingStability: 78, modelDependency: 45, complianceMaturity: 72, dataRetentionRisk: 55, outageHistory: 62, overall: 62 },
  { name: "Anthropic",        fundingStability: 81, modelDependency: 60, complianceMaturity: 85, dataRetentionRisk: 75, outageHistory: 88, overall: 78 },
  { name: "Google DeepMind",  fundingStability: 95, modelDependency: 30, complianceMaturity: 88, dataRetentionRisk: 48, outageHistory: 71, overall: 66 },
  { name: "Meta AI",          fundingStability: 92, modelDependency: 35, complianceMaturity: 62, dataRetentionRisk: 40, outageHistory: 82, overall: 62 },
  { name: "Mistral AI",       fundingStability: 65, modelDependency: 70, complianceMaturity: 68, dataRetentionRisk: 72, outageHistory: 90, overall: 73 },
  { name: "Cohere",           fundingStability: 58, modelDependency: 75, complianceMaturity: 80, dataRetentionRisk: 78, outageHistory: 92, overall: 77 },
  { name: "xAI (Grok)",       fundingStability: 72, modelDependency: 55, complianceMaturity: 45, dataRetentionRisk: 50, outageHistory: 85, overall: 61 },
  { name: "Amazon Bedrock",   fundingStability: 98, modelDependency: 25, complianceMaturity: 91, dataRetentionRisk: 52, outageHistory: 75, overall: 68 },
];

function scoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 80) return "text-emerald-700 dark:text-emerald-400";
  if (score >= 60) return "text-amber-700 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function overallBadge(score: number): { label: string; classes: string } {
  if (score >= 75) return { label: "Low Risk", classes: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" };
  if (score >= 65) return { label: "Medium", classes: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30" };
  return { label: "High Risk", classes: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" };
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-7 text-right ${scoreTextColor(score)}`}>{score}</span>
    </div>
  );
}

const methodology = [
  {
    category: "Funding Stability",
    description:
      "Assessed using total disclosed funding, revenue trajectory, and investor backing quality. A higher score indicates a vendor with lower risk of sudden shutdown or drastic pivot due to financial pressure. Considers burn rate vs revenue for private companies.",
  },
  {
    category: "Model Dependency Risk",
    description:
      "Measures how exposed your workloads are if the vendor changes, deprecates, or restricts a specific model. Lower scores indicate high dependency on a single flagship model (e.g. GPT-4). Higher scores reflect vendors offering multi-model or open-weight alternatives.",
  },
  {
    category: "Compliance Maturity",
    description:
      "Based on publicly verified certifications: SOC 2 Type II, ISO 27001, HIPAA BAA availability, GDPR DPA coverage, and FedRAMP status. Scores reflect the breadth and depth of enterprise-grade compliance documentation available.",
  },
  {
    category: "Data Retention Risk",
    description:
      "Evaluates default data handling practices — whether prompt/response data is retained, used for training, or shared with third parties. Higher scores indicate vendor policies that default to zero-retention, offer contractual data deletion, and provide audit logs.",
  },
  {
    category: "Outage History",
    description:
      "Derived from publicly reported incidents on status pages and outage trackers over the past 18 months. Considers frequency, duration, and severity of API outages. A score of 90+ means fewer than two minor incidents; below 60 indicates multiple extended outages.",
  },
];

export default function VendorRiskPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Vendor Risk Score</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Vendor Risk Score</h1>
          <p className="mt-1 text-muted-foreground">
            Evaluate AI vendors across funding stability, compliance maturity, outage history, and data policies.
          </p>
        </div>
      </div>

      {/* Main table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Vendor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">Funding Stability</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">Model Dependency</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">Compliance Maturity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">Data Retention Risk</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">Outage History</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Overall</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => {
                const badge = overallBadge(v.overall);
                return (
                  <tr key={v.name} className={i < vendors.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-foreground whitespace-nowrap">{v.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={v.fundingStability} />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={v.modelDependency} />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={v.complianceMaturity} />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={v.dataRetentionRisk} />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={v.outageHistory} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}>
                        {badge.label}
                        <span className="font-mono">{v.overall}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>≥ 80 — Strong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>60–79 — Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>&lt; 60 — Weak</span>
        </div>
        <span className="ml-2">Overall risk badge: ≥ 75 = Low Risk, 65–74 = Medium, &lt; 65 = High Risk</span>
      </div>

      {/* Methodology */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Score Methodology
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methodology.map((m) => (
            <div key={m.category} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">{m.category}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Scores are composite estimates derived from public information, vendor documentation, and industry analyst reports. They represent relative risk signals, not absolute guarantees. Last updated Q1 2026.
        </p>
      </div>
    </div>
  );
}
