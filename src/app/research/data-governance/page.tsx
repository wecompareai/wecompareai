"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

type DeploymentModel = "on-premises" | "cloud" | "hybrid";
type Region = "US" | "EU" | "APAC" | "Global";
type PIISensitivity = "none" | "low" | "high";
type DataRetention = "no-storage" | "30-day" | "any";
type Certification = "SOC2" | "ISO27001" | "HIPAA" | "FedRAMP" | "GDPR";

type ComplianceStatus = "Compliant" | "Requires Configuration" | "Not Compliant" | "In Progress";

interface GovernanceState {
  deployment: DeploymentModel;
  region: Region;
  pii: PIISensitivity;
  retention: DataRetention;
  certs: Set<Certification>;
}

interface ToolResult {
  tool: string;
  provider: string;
  status: ComplianceStatus;
  note: string;
}

const allCerts: { id: Certification; label: string }[] = [
  { id: "SOC2", label: "SOC 2" },
  { id: "ISO27001", label: "ISO 27001" },
  { id: "HIPAA", label: "HIPAA" },
  { id: "FedRAMP", label: "FedRAMP" },
  { id: "GDPR", label: "GDPR" },
];

const statusConfig: Record<ComplianceStatus, { bg: string; text: string; dot: string; border: string }> = {
  "Compliant": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-500/30",
  },
  "Requires Configuration": {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-500/30",
  },
  "Not Compliant": {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    border: "border-red-500/30",
  },
  "In Progress": {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    border: "border-blue-500/30",
  },
};

function evaluateCompliance(tool: string, state: GovernanceState): { status: ComplianceStatus; note: string } {
  const { deployment, region, pii, certs } = state;

  // On-premises deployment
  if (deployment === "on-premises") {
    if (tool === "Ollama") return { status: "Compliant", note: "Fully self-hosted, no data leaves your infrastructure." };
    return { status: "Requires Configuration", note: "Requires private deployment or VPC configuration." };
  }

  // FedRAMP requirement
  if (certs.has("FedRAMP")) {
    if (tool === "Azure OpenAI") return { status: "Compliant", note: "FedRAMP High authorized via Azure Government." };
    if (tool === "AWS Bedrock") return { status: "Requires Configuration", note: "FedRAMP in progress; some regions available." };
    if (tool === "Ollama") return { status: "Compliant", note: "Self-hosted, inherits your FedRAMP boundary." };
    return { status: "Not Compliant", note: "No FedRAMP authorization available." };
  }

  // HIPAA requirement
  if (certs.has("HIPAA")) {
    if (tool === "Azure OpenAI") return { status: "Compliant", note: "BAA available through Microsoft." };
    if (tool === "AWS Bedrock") return { status: "Compliant", note: "BAA available through AWS." };
    if (tool === "Google Vertex AI") return { status: "Compliant", note: "BAA available through Google Cloud." };
    if (tool === "OpenAI API") return { status: "Compliant", note: "HIPAA BAA available on healthcare plan." };
    if (tool === "Anthropic API") return { status: "In Progress", note: "HIPAA BAA not yet generally available." };
    if (tool === "Ollama") return { status: "Compliant", note: "Self-hosted; you control all PHI handling." };
    if (tool === "Together AI") return { status: "Requires Configuration", note: "Contact Together AI for BAA options." };
    if (tool === "Hugging Face Inference") return { status: "Not Compliant", note: "No HIPAA BAA currently available." };
  }

  // EU region + GDPR
  if (region === "EU" || certs.has("GDPR")) {
    if (tool === "Azure OpenAI") return { status: "Compliant", note: "EU data center option; GDPR DPA available." };
    if (tool === "AWS Bedrock") return { status: "Compliant", note: "EU regions available; GDPR compliant." };
    if (tool === "Google Vertex AI") return { status: "Compliant", note: "EU region processing; GDPR DPA signed." };
    if (tool === "OpenAI API") return { status: "Requires Configuration", note: "Requires DPA and EU data residency add-on." };
    if (tool === "Anthropic API") return { status: "Requires Configuration", note: "Requires DPA; EU residency roadmap in progress." };
    if (tool === "Ollama") return { status: "Compliant", note: "Self-hosted in EU; fully GDPR compliant." };
    if (tool === "Together AI") return { status: "Requires Configuration", note: "DPA available on request." };
    if (tool === "Hugging Face Inference") return { status: "Requires Configuration", note: "EU endpoints available; DPA required." };
  }

  // High PII + No storage
  if (pii === "high" && state.retention === "no-storage") {
    if (tool === "Ollama") return { status: "Compliant", note: "No data retention by default." };
    if (tool === "Azure OpenAI") return { status: "Compliant", note: "No-log mode available; zero data retention option." };
    if (tool === "AWS Bedrock") return { status: "Compliant", note: "No retention by default; audit logs available." };
    if (tool === "OpenAI API") return { status: "Requires Configuration", note: "Zero Data Retention available via API header." };
    if (tool === "Anthropic API") return { status: "Requires Configuration", note: "No-training option available; requires DPA." };
    return { status: "Requires Configuration", note: "Review vendor data handling policy for high-PII use." };
  }

  // Default: Cloud + US + Low PII + SOC2
  const soc2Tools: Record<string, { status: ComplianceStatus; note: string }> = {
    "OpenAI API": { status: "Compliant", note: "SOC 2 Type II certified." },
    "Anthropic API": { status: "Compliant", note: "SOC 2 Type II certified." },
    "Google Vertex AI": { status: "Compliant", note: "SOC 2 Type II + ISO 27001." },
    "Azure OpenAI": { status: "Compliant", note: "Full compliance suite via Microsoft Azure." },
    "AWS Bedrock": { status: "Compliant", note: "SOC 2 + multiple compliance frameworks." },
    "Ollama": { status: "Compliant", note: "Self-hosted; inherits your compliance posture." },
    "Together AI": { status: "Compliant", note: "SOC 2 Type II certified." },
    "Hugging Face Inference": { status: "Requires Configuration", note: "SOC 2 in progress; review DPA for your region." },
  };

  return soc2Tools[tool] ?? { status: "Requires Configuration", note: "Review vendor documentation for your requirements." };
}

const tools = [
  "OpenAI API",
  "Anthropic API",
  "Google Vertex AI",
  "Azure OpenAI",
  "AWS Bedrock",
  "Ollama",
  "Together AI",
  "Hugging Face Inference",
];

const toolProviders: Record<string, string> = {
  "OpenAI API": "OpenAI",
  "Anthropic API": "Anthropic",
  "Google Vertex AI": "Google",
  "Azure OpenAI": "Microsoft",
  "AWS Bedrock": "Amazon",
  "Ollama": "Open Source",
  "Together AI": "Together AI",
  "Hugging Face Inference": "Hugging Face",
};

export default function DataGovernancePage() {
  const [state, setState] = useState<GovernanceState>({
    deployment: "cloud",
    region: "US",
    pii: "low",
    retention: "30-day",
    certs: new Set(["SOC2"]),
  });

  const toggleCert = (cert: Certification) => {
    setState((prev) => {
      const next = new Set(prev.certs);
      if (next.has(cert)) next.delete(cert);
      else next.add(cert);
      return { ...prev, certs: next };
    });
  };

  const results: ToolResult[] = tools.map((tool) => {
    const { status, note } = evaluateCompliance(tool, state);
    return { tool, provider: toolProviders[tool], status, note };
  });

  const compliantCount = results.filter((r) => r.status === "Compliant").length;
  const configCount = results.filter((r) => r.status === "Requires Configuration").length;
  const nonCompliantCount = results.filter((r) => r.status === "Not Compliant").length;
  const inProgressCount = results.filter((r) => r.status === "In Progress").length;

  return (
    <PremiumGate>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Data Governance Simulator</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Data Governance Simulator</h1>
          <p className="mt-1 text-muted-foreground max-w-2xl">
            Toggle your requirements and instantly see which AI tools are compliant, at risk, or blocked for your use case.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Controls panel */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Your Requirements</h2>

            {/* Deployment Model */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deployment Model</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["on-premises", "cloud", "hybrid"] as DeploymentModel[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setState((p) => ({ ...p, deployment: d }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      state.deployment === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {d === "on-premises" ? "On-Prem" : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Region</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["US", "EU", "APAC", "Global"] as Region[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setState((p) => ({ ...p, region: r }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      state.region === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* PII Sensitivity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">PII Sensitivity</label>
              <div className="space-y-1.5">
                {[
                  { id: "none" as PIISensitivity, label: "None" },
                  { id: "low" as PIISensitivity, label: "Low" },
                  { id: "high" as PIISensitivity, label: "High (GDPR/HIPAA)" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => setState((p) => ({ ...p, pii: opt.id }))}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        state.pii === opt.id ? "border-primary" : "border-border"
                      }`}
                    >
                      {state.pii === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Retention */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Data Retention</label>
              <div className="space-y-1.5">
                {[
                  { id: "no-storage" as DataRetention, label: "No storage required" },
                  { id: "30-day" as DataRetention, label: "30-day logs OK" },
                  { id: "any" as DataRetention, label: "Any retention OK" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => setState((p) => ({ ...p, retention: opt.id }))}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        state.retention === opt.id ? "border-primary" : "border-border"
                      }`}
                    >
                      {state.retention === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Required Certifications</label>
              <div className="space-y-1.5">
                {allCerts.map((cert) => (
                  <label key={cert.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleCert(cert.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        state.certs.has(cert.id) ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {state.certs.has(cert.id) && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {cert.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-5">
          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="font-medium text-foreground">Compliance Summary:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{compliantCount} Compliant</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{configCount} Require Config</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-red-700 dark:text-red-400 font-semibold">{nonCompliantCount} Not Compliant</span>
              {inProgressCount > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-blue-700 dark:text-blue-400 font-semibold">{inProgressCount} In Progress</span>
                </>
              )}
            </div>
          </div>

          {/* Tool cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((result) => {
              const cfg = statusConfig[result.status];
              return (
                <div key={result.tool} className={`rounded-xl border ${cfg.border} bg-card p-5 space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{result.tool}</p>
                      <p className="text-xs text-muted-foreground">{result.provider}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {result.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.note}</p>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            Compliance assessments are based on publicly available vendor documentation as of Q1 2026. Always verify with your legal and compliance team before deploying AI in regulated environments.
          </p>
        </div>
      </div>
    </div>
    </PremiumGate>
  );
}
