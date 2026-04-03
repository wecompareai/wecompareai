"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

type OrgSize = "" | "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
type Budget = "" | "<$500" | "$500-2K" | "$2K-10K" | "$10K-50K" | "$50K+";
type Deployment = "" | "cloud-only" | "on-prem-option" | "either";
type UseCase = "Customer Support" | "Code Generation" | "Document Analysis" | "Content Creation" | "Data Extraction" | "Internal Knowledge Base";
type ComplianceCert = "SOC2" | "HIPAA" | "FedRAMP" | "GDPR" | "ISO27001";
type ComplianceStatus = "Compliant" | "Requires Config" | "Not Compliant";

interface FormData {
  orgSize: OrgSize;
  useCases: UseCase[];
  budget: Budget;
  compliance: ComplianceCert[];
  deployment: Deployment;
}

interface Vendor {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  bestFor: UseCase[];
  estimatedCost: Record<Budget, string>;
  compliance: Partial<Record<ComplianceCert, ComplianceStatus>>;
  included: boolean;
  pricingModel: string;
  contextWindow: string;
  supportLevel: string;
  slaUptime: string;
  dataRetention: string;
  rateLimit: string;
}

const allVendors: Vendor[] = [
  {
    id: "openai",
    name: "OpenAI API",
    emoji: "🤖",
    tagline: "Most capable general-purpose models with broad ecosystem",
    bestFor: ["Customer Support", "Code Generation", "Content Creation", "Document Analysis"],
    estimatedCost: { "": "N/A", "<$500": "~$200-400/mo", "$500-2K": "~$500-1.5K/mo", "$2K-10K": "~$2K-8K/mo", "$10K-50K": "~$10K-40K/mo", "$50K+": "Enterprise pricing" },
    compliance: { SOC2: "Compliant", HIPAA: "Compliant", GDPR: "Requires Config", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Per token (input/output)",
    contextWindow: "128K tokens (GPT-4o)",
    supportLevel: "Community + Enterprise",
    slaUptime: "99.9%",
    dataRetention: "30 days (configurable)",
    rateLimit: "10K RPM (tier 4)",
  },
  {
    id: "anthropic",
    name: "Anthropic API",
    emoji: "🧠",
    tagline: "Best-in-class reasoning and safety-focused design",
    bestFor: ["Document Analysis", "Internal Knowledge Base", "Data Extraction", "Code Generation"],
    estimatedCost: { "": "N/A", "<$500": "~$150-350/mo", "$500-2K": "~$500-2K/mo", "$2K-10K": "~$2K-9K/mo", "$10K-50K": "~$10K-45K/mo", "$50K+": "Enterprise pricing" },
    compliance: { SOC2: "Compliant", HIPAA: "Requires Config", GDPR: "Requires Config", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Per token (input/output)",
    contextWindow: "200K tokens (Claude 3.7)",
    supportLevel: "Community + Enterprise",
    slaUptime: "99.9%",
    dataRetention: "Zero retention option",
    rateLimit: "4K RPM",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    emoji: "☁️",
    tagline: "Enterprise-grade OpenAI models with compliance guarantees",
    bestFor: ["Customer Support", "Code Generation", "Document Analysis", "Content Creation", "Data Extraction"],
    estimatedCost: { "": "N/A", "<$500": "~$300-450/mo", "$500-2K": "~$600-2K/mo", "$2K-10K": "~$2.5K-10K/mo", "$10K-50K": "~$12K-50K/mo", "$50K+": "Enterprise pricing" },
    compliance: { SOC2: "Compliant", HIPAA: "Compliant", FedRAMP: "Compliant", GDPR: "Compliant", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Per token (same as OpenAI)",
    contextWindow: "128K tokens",
    supportLevel: "Microsoft Enterprise SLA",
    slaUptime: "99.9%",
    dataRetention: "No storage by default",
    rateLimit: "Custom PTUs available",
  },
  {
    id: "aws-bedrock",
    name: "AWS Bedrock",
    emoji: "🏗️",
    tagline: "Multi-model platform with deep AWS integration",
    bestFor: ["Data Extraction", "Document Analysis", "Internal Knowledge Base", "Customer Support"],
    estimatedCost: { "": "N/A", "<$500": "~$200-450/mo", "$500-2K": "~$500-2K/mo", "$2K-10K": "~$2K-9K/mo", "$10K-50K": "~$10K-45K/mo", "$50K+": "Enterprise pricing" },
    compliance: { SOC2: "Compliant", HIPAA: "Compliant", FedRAMP: "Requires Config", GDPR: "Compliant", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Per token, on-demand or provisioned",
    contextWindow: "Up to 200K (model dependent)",
    supportLevel: "AWS Support plans",
    slaUptime: "99.9%",
    dataRetention: "No retention by default",
    rateLimit: "Configurable per account",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    emoji: "💻",
    tagline: "AI pair programmer built for developer workflows",
    bestFor: ["Code Generation"],
    estimatedCost: { "": "N/A", "<$500": "$10-19/user/mo", "$500-2K": "$19/user/mo (Business)", "$2K-10K": "$19/user/mo", "$10K-50K": "Enterprise pricing", "$50K+": "Enterprise pricing" },
    compliance: { SOC2: "Compliant", GDPR: "Compliant", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Per seat/user per month",
    contextWindow: "Context-window per file",
    supportLevel: "GitHub Support",
    slaUptime: "99.9%",
    dataRetention: "Configurable",
    rateLimit: "Unlimited suggestions",
  },
  {
    id: "ollama",
    name: "Ollama (Self-Hosted)",
    emoji: "🖥️",
    tagline: "Run open-source models on your own infrastructure",
    bestFor: ["Internal Knowledge Base", "Code Generation", "Data Extraction"],
    estimatedCost: { "": "N/A", "<$500": "Infrastructure cost only", "$500-2K": "Infrastructure cost only", "$2K-10K": "Infrastructure cost only", "$10K-50K": "Infrastructure cost only", "$50K+": "Infrastructure cost only" },
    compliance: { SOC2: "Compliant", HIPAA: "Compliant", FedRAMP: "Compliant", GDPR: "Compliant", ISO27001: "Compliant" },
    included: false,
    pricingModel: "Free (self-hosted infra costs)",
    contextWindow: "Model dependent (4K-128K)",
    supportLevel: "Community only",
    slaUptime: "Your responsibility",
    dataRetention: "You control everything",
    rateLimit: "Your hardware limits",
  },
];

const useCaseOptions: UseCase[] = [
  "Customer Support",
  "Code Generation",
  "Document Analysis",
  "Content Creation",
  "Data Extraction",
  "Internal Knowledge Base",
];

const complianceOptions: { id: ComplianceCert; label: string }[] = [
  { id: "SOC2", label: "SOC 2" },
  { id: "HIPAA", label: "HIPAA" },
  { id: "FedRAMP", label: "FedRAMP" },
  { id: "GDPR", label: "GDPR" },
  { id: "ISO27001", label: "ISO 27001" },
];

function getRecommendedVendors(form: FormData): string[] {
  const recommended = new Set<string>();

  if (form.compliance.includes("FedRAMP")) recommended.add("azure-openai");
  if (form.compliance.includes("HIPAA")) { recommended.add("azure-openai"); recommended.add("aws-bedrock"); }
  if (form.deployment === "on-prem-option") recommended.add("ollama");
  if (form.useCases.includes("Code Generation")) { recommended.add("github-copilot"); }
  if (form.budget === "<$500") { recommended.add("openai"); recommended.add("anthropic"); }
  if (form.useCases.includes("Document Analysis") || form.useCases.includes("Data Extraction")) {
    recommended.add("anthropic");
    recommended.add("aws-bedrock");
  }
  if (form.useCases.includes("Customer Support") || form.useCases.includes("Content Creation")) {
    recommended.add("openai");
  }
  if (form.useCases.includes("Internal Knowledge Base")) {
    recommended.add("aws-bedrock");
    recommended.add("ollama");
  }

  // Ensure at least 3
  if (recommended.size < 3) {
    ["azure-openai", "openai", "anthropic"].forEach((v) => {
      if (recommended.size < 3) recommended.add(v);
    });
  }

  return Array.from(recommended).slice(0, 5);
}

const complianceStatusStyle: Record<ComplianceStatus, string> = {
  "Compliant": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  "Requires Config": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  "Not Compliant": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
};

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
          checked ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </label>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
            i + 1 === current
              ? "border-primary bg-primary text-primary-foreground"
              : i + 1 < current
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-border text-muted-foreground"
          }`}>
            {i + 1 < current ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 ${i + 1 < current ? "bg-emerald-500" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProcurementPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    orgSize: "",
    useCases: [],
    budget: "",
    compliance: [],
    deployment: "",
  });
  const [vendors, setVendors] = useState<Vendor[]>(allVendors);
  const [showChecklist, setShowChecklist] = useState(false);
  const [copied, setCopied] = useState(false);

  const recommendedIds = getRecommendedVendors(form);
  const selectedVendors = vendors.filter((v) => v.included);

  const toggleUseCase = (uc: UseCase) => {
    setForm((p) => ({
      ...p,
      useCases: p.useCases.includes(uc) ? p.useCases.filter((u) => u !== uc) : [...p.useCases, uc],
    }));
  };

  const toggleComplianceCert = (cert: ComplianceCert) => {
    setForm((p) => ({
      ...p,
      compliance: p.compliance.includes(cert) ? p.compliance.filter((c) => c !== cert) : [...p.compliance, cert],
    }));
  };

  const toggleVendorIncluded = (id: string) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, included: !v.included } : v)));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Auto-select recommended vendors
      const recIds = getRecommendedVendors(form);
      setVendors((prev) => prev.map((v) => ({ ...v, included: recIds.includes(v.id) })));
    }
    setStep((s) => s + 1);
  };

  const rfpText = `REQUEST FOR PROPOSAL (RFP) — AI PLATFORM SERVICES
Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

ORGANIZATION PROFILE
--------------------
Organization Size: ${form.orgSize || "Not specified"}
Deployment Preference: ${form.deployment || "Not specified"}
Monthly Budget Range: ${form.budget || "Not specified"}

PRIMARY USE CASES
-----------------
${form.useCases.length > 0 ? form.useCases.map((uc) => `• ${uc}`).join("\n") : "• Not specified"}

COMPLIANCE REQUIREMENTS
-----------------------
Required Certifications: ${form.compliance.length > 0 ? form.compliance.join(", ") : "None specified"}

VENDOR SHORTLIST
----------------
${selectedVendors.length > 0 ? selectedVendors.map((v) => `• ${v.name} — ${v.tagline}`).join("\n") : "• No vendors selected"}

EVALUATION CRITERIA
-------------------
1. Compliance and certification coverage
2. Pricing model and cost predictability
3. API reliability and uptime SLA
4. Data retention and privacy controls
5. Support level and escalation path
6. Integration with existing infrastructure

SUBMISSION REQUIREMENTS
-----------------------
Vendors are requested to provide:
□ Technical architecture overview
□ Security and compliance documentation
□ Pricing proposal for described use cases
□ Reference customers in similar industry
□ Implementation timeline estimate
□ Support and SLA agreement details

Please submit proposals within 30 days of this RFP.`;

  const checklistItems = [
    "Confirm SOC 2 Type II report is current (< 12 months)",
    "Review data processing agreement (DPA) terms",
    "Verify data residency options match regional requirements",
    "Confirm HIPAA BAA availability (if required)",
    "Test API rate limits against projected usage",
    "Review model training data usage policies",
    "Evaluate zero-retention / no-log options",
    "Assess disaster recovery and business continuity plan",
    "Review incident response and breach notification SLA",
    "Confirm FedRAMP authorization level (if required)",
    "Evaluate export controls and data sovereignty",
    "Review vendor financial stability and funding",
    "Test API latency from your deployment region",
    "Confirm model version pinning / deprecation policy",
    "Review acceptable use policy alignment",
  ];

  const copyRFP = async () => {
    await navigator.clipboard.writeText(rfpText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PremiumGate>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Procurement Assistant</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Procurement Assistant</h1>
          <p className="mt-1 text-muted-foreground max-w-2xl">
            A guided workflow to generate RFPs, compare vendors, export compliance checklists, and evaluate pricing models.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <StepIndicator current={step} total={4} />
        <span className="text-sm text-muted-foreground">Step {step} of 4</span>
      </div>

      {/* Step 1: Define Requirements */}
      {step === 1 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Define Your Requirements</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Organization Size</label>
              <select
                value={form.orgSize}
                onChange={(e) => setForm((p) => ({ ...p, orgSize: e.target.value as OrgSize }))}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select size...</option>
                {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => (
                  <option key={s} value={s}>{s} employees</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Monthly Budget</label>
              <select
                value={form.budget}
                onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value as Budget }))}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select budget...</option>
                {["<$500", "$500-2K", "$2K-10K", "$10K-50K", "$50K+"].map((b) => (
                  <option key={b} value={b}>{b}/month</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deployment Preference</label>
              <select
                value={form.deployment}
                onChange={(e) => setForm((p) => ({ ...p, deployment: e.target.value as Deployment }))}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select preference...</option>
                <option value="cloud-only">Cloud only</option>
                <option value="on-prem-option">On-premises option needed</option>
                <option value="either">Either works</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Primary Use Cases</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {useCaseOptions.map((uc) => (
                <CheckboxItem
                  key={uc}
                  label={uc}
                  checked={form.useCases.includes(uc)}
                  onChange={() => toggleUseCase(uc)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Compliance Requirements</label>
            <div className="flex flex-wrap gap-4">
              {complianceOptions.map((cert) => (
                <CheckboxItem
                  key={cert.id}
                  label={cert.label}
                  checked={form.compliance.includes(cert.id)}
                  onChange={() => toggleComplianceCert(cert.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextStep}
              disabled={!form.orgSize || !form.budget || form.useCases.length === 0}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate Shortlist →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vendor Shortlist */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Recommended Vendors</h2>
            <p className="text-sm text-muted-foreground">Based on your requirements. Toggle vendors to include in your RFP.</p>
          </div>

          <div className="space-y-4">
            {allVendors.filter((v) => recommendedIds.includes(v.id)).map((vendor) => {
              const v = vendors.find((x) => x.id === vendor.id)!;
              return (
                <div key={v.id} className={`rounded-xl border bg-card p-5 transition-all ${v.included ? "border-primary/50" : "border-border"}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{v.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-foreground">{v.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{v.tagline}</p>
                        </div>
                        <button
                          onClick={() => toggleVendorIncluded(v.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                            v.included
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {v.included ? "✓ Include in RFP" : "Include in RFP"}
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">Estimated cost ({form.budget}):</span>
                        <span className="text-xs font-medium text-foreground">{v.estimatedCost[form.budget]}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {form.compliance.map((cert) => {
                          const status = v.compliance[cert] ?? "Not Compliant";
                          return (
                            <span key={cert} className={`text-xs px-2 py-0.5 rounded-full border ${complianceStatusStyle[status]}`}>
                              {cert}: {status}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedVendors.length < 2}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Compare Selected ({selectedVendors.length}) →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Compare Vendors */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Vendor Comparison</h2>
            <p className="text-sm text-muted-foreground">Side-by-side comparison of your selected vendors.</p>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap min-w-[160px]">Criteria</th>
                    {selectedVendors.map((v) => (
                      <th key={v.id} className="text-left px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {v.emoji} {v.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "pricingModel" as const, label: "Pricing Model" },
                    { key: "contextWindow" as const, label: "Context Window" },
                    { key: "supportLevel" as const, label: "Support Level" },
                    { key: "slaUptime" as const, label: "SLA Uptime" },
                    { key: "dataRetention" as const, label: "Data Retention" },
                    { key: "rateLimit" as const, label: "Rate Limits" },
                  ].map((row, i) => (
                    <tr key={row.key} className={i < 5 ? "border-b border-border" : ""}>
                      <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">{row.label}</td>
                      {selectedVendors.map((v) => (
                        <td key={v.id} className="px-4 py-3 text-foreground">{v[row.key]}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-3 font-medium text-muted-foreground">Your Budget Est.</td>
                    {selectedVendors.map((v) => (
                      <td key={v.id} className="px-4 py-3 font-medium text-primary">{v.estimatedCost[form.budget]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Generate RFP →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Export */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Export & Documents</h2>
            <p className="text-sm text-muted-foreground">Your RFP template and compliance checklist are ready.</p>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/50">
              <span className="text-sm font-medium text-foreground">RFP Template Preview</span>
              <button
                onClick={copyRFP}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {copied ? "Copied!" : "Copy RFP"}
              </button>
            </div>
            <pre className="p-5 text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-80">
              {rfpText}
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Compliance Checklist</h3>
              <button
                onClick={() => setShowChecklist(!showChecklist)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {showChecklist ? "Hide" : "View Checklist"}
              </button>
            </div>
            {showChecklist && (
              <div className="space-y-2">
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded border border-border mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </button>
            <button
              onClick={() => { setStep(1); setForm({ orgSize: "", useCases: [], budget: "", compliance: [], deployment: "" }); setVendors(allVendors); }}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
