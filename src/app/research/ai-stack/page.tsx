"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumGate from "@/components/PremiumGate";

type Role =
  | "developer"
  | "data-analyst"
  | "content-creator"
  | "marketing"
  | "product-manager"
  | "business-ops"
  | "student"
  | "healthcare"
  | "legal"
  | "designer";

type BudgetTier = "free" | "under-50" | "50-200" | "200-plus";

type UseCase =
  | "Writing & Editing"
  | "Code Generation"
  | "Research & Summarization"
  | "Data Analysis"
  | "Image Generation"
  | "Customer Interaction"
  | "Document Processing"
  | "Automation / APIs";

interface ComplianceFlags {
  hipaa: boolean;
  gdpr: boolean;
  fedramp: boolean;
  onPrem: boolean;
}

interface StackTool {
  name: string;
  purpose: string;
  price: string;
  compliance: string;
  category: "AI Model" | "Coding" | "Research" | "Writing" | "Image" | "Enterprise";
}

interface Recommendation {
  tools: StackTool[];
  totalCost: string;
  integrationMap: string;
  workflow: string;
}

const roleOptions: { id: Role; label: string; emoji: string }[] = [
  { id: "developer", label: "Developer / Engineer", emoji: "🧑‍💻" },
  { id: "data-analyst", label: "Data Analyst", emoji: "📊" },
  { id: "content-creator", label: "Content Creator", emoji: "✍️" },
  { id: "marketing", label: "Marketing / Growth", emoji: "📈" },
  { id: "product-manager", label: "Product Manager", emoji: "🎯" },
  { id: "business-ops", label: "Business Operations", emoji: "🏢" },
  { id: "student", label: "Student / Researcher", emoji: "🎓" },
  { id: "healthcare", label: "Healthcare Professional", emoji: "🏥" },
  { id: "legal", label: "Legal / Compliance", emoji: "⚖️" },
  { id: "designer", label: "Designer / Creative", emoji: "🎨" },
];

const budgetOptions: { id: BudgetTier; label: string; sublabel: string }[] = [
  { id: "free", label: "Free / $0", sublabel: "Free tiers only" },
  { id: "under-50", label: "Under $50/mo", sublabel: "Essential tools" },
  { id: "50-200", label: "$50–200/mo", sublabel: "Professional stack" },
  { id: "200-plus", label: "$200+/mo", sublabel: "Power user / Team" },
];

const useCaseOptions: UseCase[] = [
  "Writing & Editing",
  "Code Generation",
  "Research & Summarization",
  "Data Analysis",
  "Image Generation",
  "Customer Interaction",
  "Document Processing",
  "Automation / APIs",
];

function buildRecommendation(
  role: Role,
  budget: BudgetTier,
  useCases: UseCase[],
  compliance: ComplianceFlags
): Recommendation {
  // Enterprise / compliance-heavy overrides
  if (compliance.hipaa || compliance.fedramp) {
    return {
      tools: [
        { name: "Azure OpenAI", purpose: "Primary AI model with BAA and FedRAMP", price: "Enterprise pricing", compliance: "HIPAA ✓ FedRAMP ✓", category: "Enterprise" },
        { name: "AWS HealthLake", purpose: "HIPAA-compliant healthcare data platform", price: "Usage-based", compliance: "HIPAA ✓ SOC 2 ✓", category: "Enterprise" },
        { name: "AWS Bedrock", purpose: "Multi-model API with compliance suite", price: "Usage-based", compliance: "HIPAA ✓ SOC 2 ✓", category: "Enterprise" },
      ],
      totalCost: "Enterprise — contact vendors for pricing",
      integrationMap: "Your App → AWS Bedrock / Azure OpenAI → AWS HealthLake (storage) → Your Data Warehouse",
      workflow: "Route all AI inference through Azure OpenAI or AWS Bedrock for BAA coverage. Store all outputs and PHI in AWS HealthLake for audit-ready HIPAA compliance. Ensure all API calls use zero-retention headers.",
    };
  }

  if (compliance.onPrem) {
    return {
      tools: [
        { name: "Ollama", purpose: "Run open-source LLMs locally", price: "Free (hardware costs)", compliance: "Full data sovereignty", category: "AI Model" },
        { name: "Open WebUI", purpose: "ChatGPT-style UI for local models", price: "Free", compliance: "Self-hosted", category: "AI Model" },
        { name: "LM Studio", purpose: "Desktop app for local model management", price: "Free", compliance: "Self-hosted", category: "AI Model" },
      ],
      totalCost: "$0/mo (+ hardware)",
      integrationMap: "Your Hardware → Ollama (model server) → Open WebUI (interface) → Your local apps",
      workflow: "Run Ollama on your local machine or server. Use Open WebUI for a polished chat interface. Integrate Ollama's API endpoint with your internal tools for private, on-premises AI inference.",
    };
  }

  // Role + budget combinations
  if (role === "developer") {
    if (budget === "free") return {
      tools: [
        { name: "GitHub Copilot Free", purpose: "AI code completion in VS Code", price: "$0/mo (limited)", compliance: "SOC 2", category: "Coding" },
        { name: "Claude.ai Free", purpose: "Reasoning and code review", price: "$0/mo (limited)", compliance: "SOC 2", category: "AI Model" },
        { name: "ChatGPT Free", purpose: "General problem solving", price: "$0/mo (limited)", compliance: "SOC 2", category: "AI Model" },
      ],
      totalCost: "$0/mo",
      integrationMap: "IDE → GitHub Copilot → Claude.ai (review) → ChatGPT (research)",
      workflow: "Use GitHub Copilot in your IDE for real-time code completion. Paste complex problems or full files into Claude.ai for deep reasoning. Use ChatGPT for quick lookups, regex, and general dev questions.",
    };
    return {
      tools: [
        { name: "GitHub Copilot", purpose: "Real-time code completion in any IDE", price: "$10/mo", compliance: "SOC 2 ✓", category: "Coding" },
        { name: "Cursor IDE", purpose: "AI-native code editor with multi-model support", price: "$20/mo", compliance: "SOC 2 ✓", category: "Coding" },
        { name: "Claude Pro", purpose: "Deep reasoning for architecture and debugging", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
      ],
      totalCost: "~$50/mo",
      integrationMap: "Cursor IDE (GPT-4o + Claude) → GitHub Copilot → Claude.ai (complex reasoning)",
      workflow: "Use Cursor as your primary AI-native editor for code generation and refactoring. Pair with Claude Pro for complex architectural decisions and code reviews. GitHub Copilot fills in as a safety net in other editors.",
    };
  }

  if (role === "content-creator") {
    if (budget === "free") return {
      tools: [
        { name: "ChatGPT Free", purpose: "Drafting and editing", price: "$0/mo", compliance: "SOC 2", category: "Writing" },
        { name: "Claude.ai Free", purpose: "Long-form writing and editing", price: "$0/mo", compliance: "SOC 2", category: "Writing" },
        { name: "Canva AI", purpose: "Image generation and design", price: "$0/mo", compliance: "SOC 2", category: "Image" },
      ],
      totalCost: "$0/mo",
      integrationMap: "Claude.ai (drafts) → ChatGPT (polish) → Canva AI (visuals)",
      workflow: "Use Claude for first drafts and long-form content. Polish with ChatGPT's cleaner formatting. Generate supporting visuals with Canva's built-in AI tools.",
    };
    return {
      tools: [
        { name: "ChatGPT Plus", purpose: "Content drafting, research, and ideation", price: "$20/mo", compliance: "SOC 2 ✓", category: "Writing" },
        { name: "Claude Pro", purpose: "Long-form writing and editing", price: "$20/mo", compliance: "SOC 2 ✓", category: "Writing" },
        { name: "Midjourney", purpose: "AI image generation for visuals", price: "$10/mo", compliance: "Basic", category: "Image" },
      ],
      totalCost: "~$50/mo",
      integrationMap: "Claude Pro (drafting) → ChatGPT Plus (SEO & structure) → Midjourney (visuals)",
      workflow: "Use Claude Pro for long-form drafting and editing — its writing style is more natural. Switch to ChatGPT Plus for SEO research, social captions, and structured content. Midjourney handles hero images and visual assets.",
    };
  }

  if (role === "data-analyst") {
    return {
      tools: [
        { name: "ChatGPT Plus", purpose: "Data analysis, Python code generation", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
        { name: "Claude Pro", purpose: "Document analysis and data summarization", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
        { name: "Perplexity Pro", purpose: "Research and source-cited answers", price: "$20/mo", compliance: "SOC 2 ✓", category: "Research" },
      ],
      totalCost: "~$60/mo",
      integrationMap: "ChatGPT (code + analysis) → Claude (document review) → Perplexity (research context)",
      workflow: "Use ChatGPT's code interpreter for data manipulation and visualization. Route large documents and reports through Claude for summarization. Use Perplexity when you need cited, current data for reports.",
    };
  }

  if (role === "marketing") {
    return {
      tools: [
        { name: "ChatGPT Plus", purpose: "Ad copy, SEO content, campaign planning", price: "$20/mo", compliance: "SOC 2 ✓", category: "Writing" },
        { name: "Jasper AI", purpose: "Brand voice and marketing copy at scale", price: "$39/mo", compliance: "SOC 2 ✓", category: "Writing" },
        { name: "Midjourney", purpose: "Ad visuals and social media images", price: "$10/mo", compliance: "Basic", category: "Image" },
      ],
      totalCost: "~$69/mo",
      integrationMap: "Jasper (brand copy) → ChatGPT (research + variations) → Midjourney (visuals)",
      workflow: "Use Jasper for maintaining consistent brand voice across long-form content. ChatGPT handles quick variations, A/B testing copy, and keyword research. Midjourney creates scroll-stopping social visuals.",
    };
  }

  if (role === "business-ops") {
    return {
      tools: [
        { name: "Microsoft Copilot", purpose: "M365 integration — emails, docs, spreadsheets", price: "$30/mo", compliance: "SOC 2 ✓ GDPR ✓", category: "Enterprise" },
        { name: "Claude Team", purpose: "Complex reasoning for business analysis", price: "$30/mo", compliance: "SOC 2 ✓", category: "AI Model" },
        { name: "Notion AI", purpose: "Knowledge base and process documentation", price: "$16/mo", compliance: "SOC 2 ✓", category: "Writing" },
      ],
      totalCost: "~$76/mo",
      integrationMap: "Microsoft Copilot (M365) → Claude Team (analysis) → Notion AI (documentation)",
      workflow: "Microsoft Copilot handles day-to-day Office tasks. Escalate complex business analysis and strategy work to Claude Team. Notion AI keeps your SOPs, playbooks, and knowledge bases always up to date.",
    };
  }

  if (role === "student") {
    return {
      tools: [
        { name: "Claude.ai Free", purpose: "Research, essays, problem solving", price: "$0/mo", compliance: "SOC 2", category: "AI Model" },
        { name: "ChatGPT Free", purpose: "Explanations, tutoring, quick Q&A", price: "$0/mo", compliance: "SOC 2", category: "AI Model" },
        { name: "Perplexity Free", purpose: "Research with cited sources", price: "$0/mo", compliance: "SOC 2", category: "Research" },
        { name: "NotebookLM", purpose: "Chat with your own documents and notes", price: "$0/mo", compliance: "Google policies", category: "Research" },
      ],
      totalCost: "$0/mo",
      integrationMap: "Perplexity (source research) → Claude (analysis & writing) → NotebookLM (your own docs)",
      workflow: "Start research with Perplexity for cited sources. Move to Claude for writing and analysis. Upload your lecture notes and papers to NotebookLM to chat directly with your own materials.",
    };
  }

  if (role === "legal") {
    return {
      tools: [
        { name: "Claude Pro", purpose: "Contract analysis and legal research", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
        { name: "Harvey AI", purpose: "Legal-specific AI for document review", price: "Enterprise", compliance: "SOC 2 ✓ HIPAA ✓", category: "Enterprise" },
        { name: "ChatGPT Plus", purpose: "General research and drafting", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
      ],
      totalCost: "~$40/mo + Harvey",
      integrationMap: "Claude (contract review) → Harvey AI (legal-specific tasks) → ChatGPT (research)",
      workflow: "Claude's 200K context window makes it ideal for reviewing long contracts. Use Harvey AI for jurisdiction-specific legal work. ChatGPT handles general legal research and client communication drafts.",
    };
  }

  if (role === "healthcare") {
    return {
      tools: [
        { name: "Azure OpenAI", purpose: "HIPAA-compliant AI with BAA", price: "Usage-based", compliance: "HIPAA ✓ SOC 2 ✓", category: "Enterprise" },
        { name: "AWS Bedrock", purpose: "Multi-model API with HIPAA compliance", price: "Usage-based", compliance: "HIPAA ✓ SOC 2 ✓", category: "Enterprise" },
      ],
      totalCost: "Enterprise pricing",
      integrationMap: "Your EHR → Azure OpenAI (HIPAA endpoint) → AWS Bedrock (backup) → Audit logs",
      workflow: "Route all AI inference through HIPAA-compliant endpoints with BAA coverage. Use Azure OpenAI for primary inference and AWS Bedrock for model diversity. Ensure all PHI handling is logged and auditable.",
    };
  }

  if (role === "designer") {
    return {
      tools: [
        { name: "Midjourney", purpose: "Concept art, mood boards, illustrations", price: "$10/mo", compliance: "Basic", category: "Image" },
        { name: "Adobe Firefly", purpose: "Commercial-safe AI image editing", price: "$4.99/mo", compliance: "Commercial license ✓", category: "Image" },
        { name: "ChatGPT Plus", purpose: "Prompt engineering and project briefs", price: "$20/mo", compliance: "SOC 2 ✓", category: "Writing" },
        { name: "DALL-E 3 (via ChatGPT)", purpose: "Quick image concepts and variations", price: "Included in Plus", compliance: "SOC 2 ✓", category: "Image" },
      ],
      totalCost: "~$35/mo",
      integrationMap: "ChatGPT (briefs + prompts) → Midjourney (concepts) → Adobe Firefly (production edits)",
      workflow: "Use ChatGPT to craft detailed prompts and creative briefs. Explore concepts with Midjourney for maximum aesthetic quality. Finalize with Adobe Firefly for commercially safe assets you can use in client work.",
    };
  }

  // product-manager default
  return {
    tools: [
      { name: "ChatGPT Plus", purpose: "PRDs, user stories, research synthesis", price: "$20/mo", compliance: "SOC 2 ✓", category: "Writing" },
      { name: "Claude Pro", purpose: "Long-form docs and structured thinking", price: "$20/mo", compliance: "SOC 2 ✓", category: "AI Model" },
      { name: "Perplexity Pro", purpose: "Market research with cited sources", price: "$20/mo", compliance: "SOC 2 ✓", category: "Research" },
    ],
    totalCost: "~$60/mo",
    integrationMap: "Perplexity (research) → Claude (PRDs & strategy) → ChatGPT (stakeholder comms)",
    workflow: "Use Perplexity for competitive research and market analysis with citations. Write PRDs and strategy docs in Claude for better structure and reasoning. Use ChatGPT for stakeholder emails, executive summaries, and quick slide content.",
  };
}

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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span className="text-sm text-muted-foreground">{label}</span>
      <button
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted border border-border"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}

export default function AIStackPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | null>(null);
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [compliance, setCompliance] = useState<ComplianceFlags>({ hipaa: false, gdpr: false, fedramp: false, onPrem: false });
  const [copied, setCopied] = useState(false);

  const toggleUseCase = (uc: UseCase) => {
    setSelectedUseCases((prev) =>
      prev.includes(uc) ? prev.filter((u) => u !== uc) : [...prev, uc]
    );
  };

  const recommendation =
    selectedRole && selectedBudget
      ? buildRecommendation(selectedRole, selectedBudget, selectedUseCases, compliance)
      : null;

  const copyRecommendation = async () => {
    if (!recommendation) return;
    const text = `MY AI STACK RECOMMENDATION\n\nRole: ${roleOptions.find((r) => r.id === selectedRole)?.label}\nBudget: ${budgetOptions.find((b) => b.id === selectedBudget)?.label}\n\nTools:\n${recommendation.tools.map((t) => `• ${t.name} (${t.price}) — ${t.purpose}`).join("\n")}\n\nTotal: ${recommendation.totalCost}\n\nIntegration Map:\n${recommendation.integrationMap}\n\nWorkflow:\n${recommendation.workflow}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setSelectedRole(null);
    setSelectedBudget(null);
    setSelectedUseCases([]);
    setCompliance({ hipaa: false, gdpr: false, fedramp: false, onPrem: false });
  };

  const categoryColors: Record<StackTool["category"], string> = {
    "AI Model": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    "Coding": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "Research": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    "Writing": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    "Image": "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    "Enterprise": "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20",
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
        <span className="text-foreground">Your AI Stack</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your AI Stack (Auto-Generated)</h1>
          <p className="mt-1 text-muted-foreground max-w-2xl">
            Answer a few questions about your role, budget, and use cases — get a personalized AI tool stack recommendation.
          </p>
        </div>
      </div>

      {/* Step nav */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {["Your Role", "Budget", "Use Cases", "Compliance", "Your Stack"].map((label, i) => (
          <div key={label} className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 ${currentStep > i + 1 ? "cursor-pointer" : ""}`} onClick={() => { if (currentStep > i + 1) setCurrentStep(i + 1); }}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i + 1 === currentStep ? "border-primary bg-primary text-primary-foreground"
                : i + 1 < currentStep ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-border text-muted-foreground"
              }`}>
                {i + 1 < currentStep ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${i + 1 === currentStep ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < 4 && <div className={`w-6 h-0.5 shrink-0 ${i + 1 < currentStep ? "bg-emerald-500" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Role */}
      {currentStep === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-foreground">What best describes your role?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  selectedRole === role.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className="text-2xl shrink-0">{role.emoji}</span>
                <span className={`text-sm font-medium ${selectedRole === role.id ? "text-primary" : "text-foreground"}`}>
                  {role.label}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              disabled={!selectedRole}
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-foreground">What is your monthly budget for AI tools?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetOptions.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBudget(b.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all ${
                  selectedBudget === b.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className={`text-lg font-bold ${selectedBudget === b.id ? "text-primary" : "text-foreground"}`}>{b.label}</span>
                <span className="text-xs text-muted-foreground mt-1">{b.sublabel}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setCurrentStep(1)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">← Back</button>
            <button disabled={!selectedBudget} onClick={() => setCurrentStep(3)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
          </div>
        </div>
      )}

      {/* Step 3: Use Cases */}
      {currentStep === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-foreground">What will you primarily use AI for?</h2>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {useCaseOptions.map((uc) => (
              <CheckboxItem key={uc} label={uc} checked={selectedUseCases.includes(uc)} onChange={() => toggleUseCase(uc)} />
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">← Back</button>
            <button onClick={() => setCurrentStep(4)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Next →</button>
          </div>
        </div>
      )}

      {/* Step 4: Compliance */}
      {currentStep === 4 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-foreground">Any compliance requirements?</h2>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Toggle label="HIPAA — healthcare data compliance required" checked={compliance.hipaa} onChange={() => setCompliance((p) => ({ ...p, hipaa: !p.hipaa }))} />
            <Toggle label="GDPR — EU data protection required" checked={compliance.gdpr} onChange={() => setCompliance((p) => ({ ...p, gdpr: !p.gdpr }))} />
            <Toggle label="FedRAMP — US federal compliance required" checked={compliance.fedramp} onChange={() => setCompliance((p) => ({ ...p, fedramp: !p.fedramp }))} />
            <Toggle label="On-premises deployment required" checked={compliance.onPrem} onChange={() => setCompliance((p) => ({ ...p, onPrem: !p.onPrem }))} />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">← Back</button>
            <button onClick={() => setCurrentStep(5)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Generate My Stack →</button>
          </div>
        </div>
      )}

      {/* Step 5: Results */}
      {currentStep === 5 && recommendation && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-foreground">Your Personalized AI Stack</h2>
            <div className="flex gap-2">
              <button onClick={copyRecommendation} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleRestart} className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                Start Over
              </button>
            </div>
          </div>

          {/* Profile summary */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
              {roleOptions.find((r) => r.id === selectedRole)?.emoji} {roleOptions.find((r) => r.id === selectedRole)?.label}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
              {budgetOptions.find((b) => b.id === selectedBudget)?.label}
            </span>
            {selectedUseCases.map((uc) => (
              <span key={uc} className="px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">{uc}</span>
            ))}
          </div>

          {/* Tools */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendation.tools.map((tool) => (
              <div key={tool.name} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{tool.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${categoryColors[tool.category]}`}>
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.purpose}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">{tool.price}</span>
                  <span className="text-muted-foreground">{tool.compliance}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total cost */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-foreground">Estimated total:</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{recommendation.totalCost}</span>
            </div>
          </div>

          {/* Integration map */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Integration Map</h3>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">{recommendation.integrationMap}</p>
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Suggested Workflow</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{recommendation.workflow}</p>
          </div>
        </div>
      )}
    </div>
    </PremiumGate>
  );
}
