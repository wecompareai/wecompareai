"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "infrastructure" | "company" | "app";

interface InfraNode {
  name: string;
  color: string;
  borderColor: string;
  models: { name: string; items: string[] }[];
}

interface CompanyNode {
  name: string;
  subtitle: string;
  color: string;
  borderColor: string;
  models: string[];
  apps: string[];
}

interface AppNode {
  name: string;
  color: string;
  borderColor: string;
  models: string[];
  infra: string[];
}

const infraData: InfraNode[] = [
  {
    name: "AWS",
    color: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    models: [
      { name: "Anthropic", items: ["Claude 3.7 Sonnet", "Claude 3.5 Haiku"] },
      { name: "Amazon Bedrock", items: ["Hosted models", "Multi-model API"] },
    ],
  },
  {
    name: "GCP",
    color: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    models: [
      { name: "Google Gemini", items: ["Gemini 2.0 Flash", "Gemini 1.5 Pro"] },
      { name: "Vertex AI", items: ["Enterprise models", "Model Garden"] },
    ],
  },
  {
    name: "Azure",
    color: "bg-sky-500/10",
    borderColor: "border-sky-500/40",
    models: [
      { name: "OpenAI API", items: ["GPT-4o", "o1", "Whisper", "DALL-E"] },
      { name: "GitHub Copilot", items: ["GPT-4o powered", "VS Code integration"] },
      { name: "Microsoft Copilot", items: ["GPT-4o powered", "M365 integration"] },
    ],
  },
  {
    name: "Own Infrastructure",
    color: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    models: [
      { name: "Meta AI", items: ["Llama 3.3 (open weights)", "Meta.ai web app"] },
      { name: "xAI", items: ["Grok-2", "X/Twitter integration"] },
    ],
  },
];

const companyData: CompanyNode[] = [
  {
    name: "OpenAI",
    subtitle: "Microsoft investment",
    color: "bg-emerald-500/10",
    borderColor: "border-emerald-500/40",
    models: ["GPT-4o", "GPT-o1", "Whisper", "DALL-E 3"],
    apps: ["ChatGPT", "GitHub Copilot", "Perplexity (partner)", "Cursor", "Notion AI"],
  },
  {
    name: "Anthropic",
    subtitle: "Amazon investment",
    color: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    models: ["Claude 3.7 Sonnet", "Claude 3.5 Haiku"],
    apps: ["Claude.ai", "Cursor", "Slack AI", "Perplexity (partner)"],
  },
  {
    name: "Google",
    subtitle: "Alphabet subsidiary",
    color: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    models: ["Gemini 2.0 Flash", "Gemini 1.5 Pro"],
    apps: ["Gemini.ai", "NotebookLM", "Vertex AI", "Google Workspace AI"],
  },
  {
    name: "Meta",
    subtitle: "Open-source strategy",
    color: "bg-indigo-500/10",
    borderColor: "border-indigo-500/40",
    models: ["Llama 3.3 (open weights)"],
    apps: ["Meta AI", "Ollama ecosystem", "Together AI", "Groq"],
  },
  {
    name: "Mistral AI",
    subtitle: "European AI lab",
    color: "bg-violet-500/10",
    borderColor: "border-violet-500/40",
    models: ["Mistral Large", "Mixtral 8x7B"],
    apps: ["Le Chat", "API customers", "Together AI"],
  },
  {
    name: "xAI",
    subtitle: "Elon Musk",
    color: "bg-zinc-500/10",
    borderColor: "border-zinc-500/40",
    models: ["Grok-2"],
    apps: ["X/Twitter", "Grok.com"],
  },
];

const appData: AppNode[] = [
  {
    name: "ChatGPT",
    color: "bg-emerald-500/10",
    borderColor: "border-emerald-500/40",
    models: ["GPT-4o", "GPT-o1"],
    infra: ["Azure"],
  },
  {
    name: "Claude.ai",
    color: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    models: ["Claude 3.7 Sonnet", "Claude 3.5 Haiku"],
    infra: ["AWS"],
  },
  {
    name: "Gemini.ai",
    color: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    models: ["Gemini 2.0 Flash", "Gemini 1.5 Pro"],
    infra: ["GCP"],
  },
  {
    name: "GitHub Copilot",
    color: "bg-sky-500/10",
    borderColor: "border-sky-500/40",
    models: ["GPT-4o"],
    infra: ["Azure"],
  },
  {
    name: "Cursor IDE",
    color: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    models: ["GPT-4o", "Claude 3.7 Sonnet", "Gemini 1.5 Pro"],
    infra: ["Azure", "AWS", "GCP"],
  },
  {
    name: "Perplexity",
    color: "bg-rose-500/10",
    borderColor: "border-rose-500/40",
    models: ["GPT-4o", "Claude 3.7 Sonnet"],
    infra: ["Azure", "AWS"],
  },
  {
    name: "Notion AI",
    color: "bg-zinc-500/10",
    borderColor: "border-zinc-500/40",
    models: ["GPT-4o"],
    infra: ["Azure"],
  },
  {
    name: "Microsoft Copilot",
    color: "bg-cyan-500/10",
    borderColor: "border-cyan-500/40",
    models: ["GPT-4o"],
    infra: ["Azure"],
  },
];

const tabs: { id: TabId; label: string }[] = [
  { id: "infrastructure", label: "By Infrastructure" },
  { id: "company", label: "By Company" },
  { id: "app", label: "By App" },
];

export default function DependencyGraphPage() {
  const [activeTab, setActiveTab] = useState<TabId>("infrastructure");
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (key: string) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/research" className="hover:text-foreground transition-colors">
          Dynamic Research
        </Link>
        <span>/</span>
        <span className="text-foreground">AI Dependency Graph</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Dependency Graph</h1>
          <p className="mt-1 text-muted-foreground max-w-2xl">
            A visual map of which models power which apps, which companies own which models, and which tools share infrastructure.
          </p>
        </div>
      </div>

      {/* Dependency counts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Infrastructure Providers", count: 4, color: "text-blue-600 dark:text-blue-400" },
          { label: "AI Companies & Models", count: 6, color: "text-purple-600 dark:text-purple-400" },
          { label: "Apps & Products", count: 8, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setExpanded(null); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: By Infrastructure */}
        {activeTab === "infrastructure" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Explore which cloud infrastructure powers each AI model and application.
            </p>
            {infraData.map((infra) => {
              const isOpen = expanded === infra.name;
              return (
                <div key={infra.name} className={`rounded-xl border ${infra.borderColor} ${infra.color} overflow-hidden`}>
                  <button
                    onClick={() => toggle(infra.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground text-lg">{infra.name}</span>
                      <span className="text-xs text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full border border-border">
                        {infra.models.length} model families
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 space-y-3 border-t border-border/40">
                      {infra.models.map((model) => (
                        <div key={model.name} className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            <span className="font-medium text-foreground text-sm">{model.name}</span>
                          </div>
                          <div className="ml-4 flex flex-wrap gap-2">
                            {model.items.map((item) => (
                              <span
                                key={item}
                                className="text-xs px-2.5 py-1 rounded-full bg-background border border-border text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: By Company */}
        {activeTab === "company" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Explore the ownership chain from company to models to downstream applications.
            </p>
            {companyData.map((company) => {
              const isOpen = expanded === company.name;
              return (
                <div key={company.name} className={`rounded-xl border ${company.borderColor} ${company.color} overflow-hidden`}>
                  <button
                    onClick={() => toggle(company.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="font-semibold text-foreground text-base">{company.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({company.subtitle})</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-background/60 px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                          {company.models.length} models
                        </span>
                        <span className="text-xs bg-background/60 px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                          {company.apps.length} apps
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 border-t border-border/40 grid sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Models</p>
                        <div className="flex flex-wrap gap-2">
                          {company.models.map((m) => (
                            <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Powered Apps</p>
                        <div className="flex flex-wrap gap-2">
                          {company.apps.map((a) => (
                            <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: By App */}
        {activeTab === "app" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Trace each application back to the models it uses and the infrastructure it depends on.
            </p>
            {appData.map((app) => {
              const isOpen = expanded === app.name;
              return (
                <div key={app.name} className={`rounded-xl border ${app.borderColor} ${app.color} overflow-hidden`}>
                  <button
                    onClick={() => toggle(app.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground text-base">{app.name}</span>
                      <div className="flex gap-2">
                        <span className="text-xs bg-background/60 px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                          {app.models.length} {app.models.length === 1 ? "model" : "models"}
                        </span>
                        <span className="text-xs bg-background/60 px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                          {app.infra.length} {app.infra.length === 1 ? "infra" : "infra providers"}
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 border-t border-border/40 grid sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Models Used</p>
                        <div className="flex flex-wrap gap-2">
                          {app.models.map((m) => (
                            <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Infrastructure</p>
                        <div className="flex flex-wrap gap-2">
                          {app.infra.map((i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Layer Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            Infrastructure Layer (AWS, GCP, Azure)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            Model Layer (OpenAI, Anthropic, Google…)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            Application Layer (ChatGPT, Claude.ai…)
          </div>
        </div>
      </div>
    </div>
  );
}
