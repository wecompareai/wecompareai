"use client";

import { useState } from "react";

type ComplianceStatus = "yes" | "enterprise" | "partial" | "no" | "self" | "planned";

interface AITool {
  id: string;
  name: string;
  vendor: string;
  tier: string;
  color: string;
  dot: string;
}

interface ComplianceRow {
  toolId: string;
  soc2: ComplianceStatus;
  hipaa: ComplianceStatus;
  gdpr: ComplianceStatus;
  iso27001: ComplianceStatus;
  dataRetention: string;
  trainsOnData: "no" | "yes" | "opt-out" | "enterprise-no";
  onPrem: ComplianceStatus;
  euResidency: ComplianceStatus;
  zeroRetention: ComplianceStatus;
  baa: ComplianceStatus;
  notes?: string;
}

const TOOLS: AITool[] = [
  { id: "chatgpt",    name: "ChatGPT Enterprise", vendor: "OpenAI",    tier: "Enterprise", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  { id: "claude",     name: "Claude Enterprise",  vendor: "Anthropic", tier: "Enterprise", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",   dot: "bg-orange-500" },
  { id: "gemini",     name: "Gemini for Workspace", vendor: "Google",  tier: "Enterprise", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",         dot: "bg-blue-500" },
  { id: "copilot",    name: "Microsoft Copilot",  vendor: "Microsoft", tier: "M365 E3/E5", color: "bg-sky-500/10 text-sky-700 dark:text-sky-400",            dot: "bg-sky-500" },
  { id: "ghcopilot",  name: "GitHub Copilot",     vendor: "GitHub",    tier: "Business/Enterprise", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400", dot: "bg-gray-500" },
  { id: "azureoai",   name: "Azure OpenAI",       vendor: "Microsoft", tier: "Azure",      color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",   dot: "bg-indigo-500" },
  { id: "bedrock",    name: "Amazon Bedrock",     vendor: "AWS",       tier: "Cloud",      color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",   dot: "bg-yellow-500" },
  { id: "cohere",     name: "Cohere",             vendor: "Cohere",    tier: "Enterprise", color: "bg-teal-500/10 text-teal-700 dark:text-teal-400",         dot: "bg-teal-500" },
  { id: "mistral",    name: "Mistral AI",         vendor: "Mistral",   tier: "Cloud/Self", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400",   dot: "bg-violet-500" },
  { id: "llama",      name: "Meta Llama",         vendor: "Meta",      tier: "Self-hosted", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400",        dot: "bg-rose-500" },
];

const COMPLIANCE_DATA: ComplianceRow[] = [
  {
    toolId: "chatgpt",
    soc2: "yes", hipaa: "enterprise", gdpr: "yes", iso27001: "yes",
    dataRetention: "Zero retention by default (Enterprise)",
    trainsOnData: "no",
    onPrem: "no", euResidency: "enterprise", zeroRetention: "yes", baa: "enterprise",
    notes: "ChatGPT Enterprise includes DLP controls, SSO, and admin analytics. Zero data retention is on by default for Enterprise.",
  },
  {
    toolId: "claude",
    soc2: "yes", hipaa: "enterprise", gdpr: "yes", iso27001: "yes",
    dataRetention: "30 days (API); configurable for Enterprise",
    trainsOnData: "no",
    onPrem: "no", euResidency: "partial", zeroRetention: "yes", baa: "enterprise",
    notes: "Anthropic does not train on API or Enterprise data. BAA available on Enterprise plan. EU hosting limited to select regions.",
  },
  {
    toolId: "gemini",
    soc2: "yes", hipaa: "yes", gdpr: "yes", iso27001: "yes",
    dataRetention: "Configurable (0–180 days); no retention option available",
    trainsOnData: "no",
    onPrem: "no", euResidency: "yes", zeroRetention: "yes", baa: "yes",
    notes: "Google Workspace customers get HIPAA BAA included. Gemini for Workspace data is not used for training. EU data residency available.",
  },
  {
    toolId: "copilot",
    soc2: "yes", hipaa: "yes", gdpr: "yes", iso27001: "yes",
    dataRetention: "Follows Microsoft 365 retention policies",
    trainsOnData: "no",
    onPrem: "yes", euResidency: "yes", zeroRetention: "yes", baa: "yes",
    notes: "Microsoft Copilot inherits full M365 compliance posture. Supports EU Data Boundary. On-prem via Azure Arc. BAA included in M365 healthcare agreements.",
  },
  {
    toolId: "ghcopilot",
    soc2: "yes", hipaa: "partial", gdpr: "yes", iso27001: "yes",
    dataRetention: "Code suggestions not retained after session (Business/Enterprise)",
    trainsOnData: "enterprise-no",
    onPrem: "no", euResidency: "partial", zeroRetention: "partial", baa: "no",
    notes: "Individual plan optionally shares data for training. Business/Enterprise does not. GitHub Copilot Enterprise can be isolated to private models.",
  },
  {
    toolId: "azureoai",
    soc2: "yes", hipaa: "yes", gdpr: "yes", iso27001: "yes",
    dataRetention: "Zero retention by default; no Microsoft/OpenAI access to prompts",
    trainsOnData: "no",
    onPrem: "yes", euResidency: "yes", zeroRetention: "yes", baa: "yes",
    notes: "Azure OpenAI is the gold standard for enterprise compliance. Runs in your Azure tenant. Supports private endpoints, VNet isolation, customer-managed keys.",
  },
  {
    toolId: "bedrock",
    soc2: "yes", hipaa: "yes", gdpr: "yes", iso27001: "yes",
    dataRetention: "No retention by default; inputs/outputs not used for training",
    trainsOnData: "no",
    onPrem: "yes", euResidency: "yes", zeroRetention: "yes", baa: "yes",
    notes: "Amazon Bedrock inherits full AWS compliance (FedRAMP, PCI DSS, etc.). On-prem via AWS Outposts. VPC deployment supported.",
  },
  {
    toolId: "cohere",
    soc2: "yes", hipaa: "yes", gdpr: "yes", iso27001: "yes",
    dataRetention: "30 days default; configurable with Enterprise",
    trainsOnData: "no",
    onPrem: "yes", euResidency: "yes", zeroRetention: "enterprise", baa: "yes",
    notes: "Cohere offers dedicated cloud, hybrid, and on-prem deployment. Strong enterprise SLAs. Supports air-gapped environments.",
  },
  {
    toolId: "mistral",
    soc2: "planned", hipaa: "no", gdpr: "yes", iso27001: "planned",
    dataRetention: "30 days (La Plateforme); self-managed if self-hosted",
    trainsOnData: "opt-out",
    onPrem: "yes", euResidency: "yes", zeroRetention: "partial", baa: "no",
    notes: "Mistral is a French company — GDPR-native. SOC 2 and ISO 27001 certifications in progress. Strong on-prem option via open-weight models.",
  },
  {
    toolId: "llama",
    soc2: "self", hipaa: "self", gdpr: "self", iso27001: "self",
    dataRetention: "Fully self-managed",
    trainsOnData: "no",
    onPrem: "yes", euResidency: "yes", zeroRetention: "yes", baa: "self",
    notes: "Self-hosted Llama gives full control over compliance posture. You manage security, data, and certifications. No data leaves your infrastructure.",
  },
];

const COMPLIANCE_COLS = [
  { id: "soc2",         label: "SOC 2 Type II",   icon: "🔒", description: "Independent audit of security, availability, and confidentiality controls." },
  { id: "hipaa",        label: "HIPAA",            icon: "🏥", description: "Required for healthcare data. Look for a BAA (Business Associate Agreement) too." },
  { id: "gdpr",         label: "GDPR",             icon: "🇪🇺", description: "EU data protection regulation. Essential for European customers or employees." },
  { id: "iso27001",     label: "ISO 27001",        icon: "📋", description: "International standard for information security management systems." },
  { id: "onPrem",       label: "On-Prem / VPC",    icon: "🖥️", description: "Deploy within your own infrastructure. Critical for regulated industries." },
  { id: "trainsOnData", label: "Trains on Data",   icon: "🧠", description: "Does the vendor use your prompts/responses to train their models?" },
  { id: "euResidency",  label: "EU Data Residency",icon: "📍", description: "Data stays within EU borders. Required for some GDPR use cases." },
  { id: "zeroRetention",label: "Zero Retention",   icon: "🗑️", description: "Option to have zero data stored after the API call completes." },
  { id: "baa",          label: "BAA Available",    icon: "📝", description: "Business Associate Agreement — required to use the tool with PHI under HIPAA." },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  yes:          { label: "Yes",           color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  enterprise:   { label: "Enterprise",   color: "text-blue-700 dark:text-blue-400",       bg: "bg-blue-500/10" },
  partial:      { label: "Partial",      color: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-500/10" },
  no:           { label: "No",           color: "text-red-700 dark:text-red-400",         bg: "bg-red-500/10" },
  self:         { label: "Self-managed", color: "text-violet-700 dark:text-violet-400",   bg: "bg-violet-500/10" },
  planned:      { label: "Planned",      color: "text-gray-600 dark:text-gray-400",       bg: "bg-gray-500/10" },
};

const TRAINS_CONFIG = {
  "no":          { label: "No",          color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  "yes":         { label: "Yes",         color: "text-red-700 dark:text-red-400",         bg: "bg-red-500/10" },
  "opt-out":     { label: "Opt-out",     color: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-500/10" },
  "enterprise-no":{ label: "No (Biz+)", color: "text-blue-700 dark:text-blue-400",       bg: "bg-blue-500/10" },
};

function StatusBadge({ status }: { status: ComplianceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function TrainsBadge({ value }: { value: ComplianceRow["trainsOnData"] }) {
  const cfg = TRAINS_CONFIG[value];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function CompliancePage() {
  const [filterCol, setFilterCol] = useState<string>("all");
  const [filterTool, setFilterTool] = useState<string>("all");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const visibleTools = filterTool === "all" ? TOOLS : TOOLS.filter((t) => t.id === filterTool);
  const visibleCols  = filterCol  === "all" ? COMPLIANCE_COLS : COMPLIANCE_COLS.filter((c) => c.id === filterCol);

  function getCellValue(row: ComplianceRow, colId: string): React.ReactNode {
    if (colId === "trainsOnData") return <TrainsBadge value={row.trainsOnData} />;
    if (colId === "dataRetention") return <span className="text-xs text-muted-foreground">{row.dataRetention}</span>;
    return <StatusBadge status={row[colId as keyof ComplianceRow] as ComplianceStatus} />;
  }

  // Summary stats
  const enterpriseReadyCount = COMPLIANCE_DATA.filter(
    (r) => r.soc2 === "yes" && r.gdpr === "yes" && r.onPrem !== "no"
  ).length;
  const hipaaReadyCount = COMPLIANCE_DATA.filter((r) => r.baa !== "no" && r.hipaa !== "no").length;
  const noTrainingCount = COMPLIANCE_DATA.filter((r) => r.trainsOnData === "no").length;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10">
            <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Security &amp; Compliance Comparison</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              SOC 2, HIPAA, GDPR, ISO 27001, data retention, on-prem options — for every major AI platform.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { label: "Enterprise Ready",   value: `${enterpriseReadyCount}/${TOOLS.length}`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", desc: "SOC 2 + GDPR + On-prem" },
            { label: "HIPAA / BAA",        value: `${hipaaReadyCount}/${TOOLS.length}`,      color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-500/10",     desc: "BAA available" },
            { label: "No Training on Data",value: `${noTrainingCount}/${TOOLS.length}`,      color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10",   desc: "Never trains on your data" },
            { label: "Tools Reviewed",     value: `${TOOLS.length}`,                         color: "text-rose-600 dark:text-rose-400",     bg: "bg-rose-500/10",     desc: "Across 10 dimensions" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} p-4 space-y-1`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs font-semibold text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by tool:</label>
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All tools</option>
            {TOOLS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by standard:</label>
          <select
            value={filterCol}
            onChange={(e) => setFilterCol(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All standards</option>
            {COMPLIANCE_COLS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        {(filterTool !== "all" || filterCol !== "all") && (
          <button
            onClick={() => { setFilterTool("all"); setFilterCol("all"); }}
            className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
          <span key={k} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${v.bg} ${v.color}`}>
            {v.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
          Opt-out (trains)
        </span>
      </div>

      {/* Main comparison table */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-foreground whitespace-nowrap min-w-[180px]">AI Platform</th>
              {visibleCols.map((col) => (
                <th key={col.id} className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{col.icon}</span>
                    <span className="text-xs">{col.label}</span>
                  </div>
                </th>
              ))}
              <th className="text-left px-4 py-3 font-semibold text-foreground whitespace-nowrap">Data Retention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleTools.map((tool) => {
              const row = COMPLIANCE_DATA.find((r) => r.toolId === tool.id)!;
              const isExpanded = expandedTool === tool.id;
              return (
                <>
                  <tr
                    key={tool.id}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${tool.dot}`} />
                        <div>
                          <div className="font-medium text-foreground leading-tight">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">{tool.vendor} · {tool.tier}</div>
                        </div>
                        <svg
                          className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </td>
                    {visibleCols.map((col) => (
                      <td key={col.id} className="px-3 py-3 text-center">
                        {getCellValue(row, col.id)}
                      </td>
                    ))}
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="text-xs text-muted-foreground leading-snug">{row.dataRetention}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${tool.id}-note`} className="bg-muted/20">
                      <td colSpan={visibleCols.length + 2} className="px-6 py-3">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                          <p className="text-sm text-muted-foreground">{row.notes}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Per-standard info cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">What each standard means for your business</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPLIANCE_COLS.filter((c) => c.id !== "trainsOnData" && c.id !== "dataRetention").map((col) => (
            <div key={col.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{col.icon}</span>
                <h3 className="font-semibold text-foreground text-sm">{col.label}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{col.description}</p>
              <div className="text-xs">
                <span className="font-medium text-foreground">Supported by: </span>
                {COMPLIANCE_DATA
                  .filter((r) => {
                    const val = r[col.id as keyof ComplianceRow];
                    return val === "yes" || val === "enterprise";
                  })
                  .map((r) => TOOLS.find((t) => t.id === r.toolId)?.name.split(" ")[0])
                  .join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro tip */}
      <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-5 flex gap-4">
        <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Enterprise buying tip</p>
          <p className="text-sm text-muted-foreground">
            For regulated industries (healthcare, finance, government), prioritise <strong className="text-foreground">Azure OpenAI</strong> or <strong className="text-foreground">Amazon Bedrock</strong> — both run inside your own cloud tenant with zero data egress to the model vendor. For EU-first deployments, <strong className="text-foreground">Mistral AI</strong> is the only major model vendor incorporated in the EU. For maximum control, self-hosted <strong className="text-foreground">Meta Llama</strong> gives you a fully air-gapped option.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center pb-4">
        Data accurate as of Q1 2026. Compliance offerings change frequently — always verify with vendor documentation before procurement.
      </p>
    </div>
  );
}
