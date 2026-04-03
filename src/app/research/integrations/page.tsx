"use client";

import { useState } from "react";
import Link from "next/link";

type IntegrationStatus = "native" | "api" | "zapier" | "none";

interface AITool {
  name: string;
  category: string;
  color: string;
  dot: string;
  href?: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  category: string;
  href?: string;
}

interface IntegrationEntry {
  tool: string;
  platform: string;
  status: IntegrationStatus;
  note?: string;
}

const AI_TOOLS: AITool[] = [
  { name: "ChatGPT", category: "LLM", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  { name: "Claude", category: "LLM", color: "bg-orange-500/10 text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  { name: "Gemini", category: "LLM", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  { name: "GitHub Copilot", category: "Coding", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400", dot: "bg-gray-500" },
  { name: "Cursor", category: "Coding", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400", dot: "bg-violet-500" },
  { name: "Midjourney", category: "Image", color: "bg-pink-500/10 text-pink-700 dark:text-pink-400", dot: "bg-pink-500" },
  { name: "DALL-E 3", category: "Image", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400", dot: "bg-cyan-500" },
  { name: "ElevenLabs", category: "Audio", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-500", href: "https://try.elevenlabs.io/wecompareai" },
  { name: "Perplexity", category: "Search", color: "bg-teal-500/10 text-teal-700 dark:text-teal-400", dot: "bg-teal-500" },
  { name: "Notion AI", category: "Productivity", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400", dot: "bg-slate-500" },
];

const PLATFORMS: Platform[] = [
  { id: "zapier", name: "Zapier", icon: "⚡", category: "Automation" },
  { id: "make", name: "Make.com", icon: "🔄", category: "Automation", href: "https://www.make.com/en/register?pc=wecompareai" },
  { id: "notion", name: "Notion", icon: "📝", category: "Productivity" },
  { id: "slack", name: "Slack", icon: "💬", category: "Communication" },
  { id: "vscode", name: "VS Code", icon: "💻", category: "Development" },
  { id: "figma", name: "Figma", icon: "🎨", category: "Design" },
  { id: "hubspot", name: "HubSpot", icon: "🏢", category: "CRM" },
  { id: "salesforce", name: "Salesforce", icon: "☁️", category: "CRM" },
  { id: "googleworkspace", name: "Google Workspace", icon: "📊", category: "Productivity" },
  { id: "msoffice", name: "Microsoft 365", icon: "🪟", category: "Productivity" },
  { id: "github", name: "GitHub", icon: "🐙", category: "Development" },
  { id: "jira", name: "Jira", icon: "📋", category: "Project Mgmt" },
];

const INTEGRATIONS: IntegrationEntry[] = [
  // ChatGPT
  { tool: "ChatGPT", platform: "zapier", status: "native", note: "Official ChatGPT Zapier app" },
  { tool: "ChatGPT", platform: "make", status: "native", note: "Official OpenAI module" },
  { tool: "ChatGPT", platform: "notion", status: "native", note: "Notion AI uses GPT-4" },
  { tool: "ChatGPT", platform: "slack", status: "native", note: "ChatGPT Slack app available" },
  { tool: "ChatGPT", platform: "vscode", status: "api", note: "Via Copilot or custom extensions" },
  { tool: "ChatGPT", platform: "figma", status: "zapier", note: "Via Zapier automation" },
  { tool: "ChatGPT", platform: "hubspot", status: "native", note: "OpenAI integration in HubSpot" },
  { tool: "ChatGPT", platform: "salesforce", status: "native", note: "Einstein AI uses GPT" },
  { tool: "ChatGPT", platform: "googleworkspace", status: "api", note: "Via Apps Script + OpenAI API" },
  { tool: "ChatGPT", platform: "msoffice", status: "native", note: "Copilot for M365 uses GPT-4" },
  { tool: "ChatGPT", platform: "github", status: "api", note: "Via GitHub Actions + API" },
  { tool: "ChatGPT", platform: "jira", status: "zapier", note: "Via Zapier or Atlassian AI" },
  // Claude
  { tool: "Claude", platform: "zapier", status: "native", note: "Official Claude Zapier app" },
  { tool: "Claude", platform: "make", status: "native", note: "Anthropic module in Make.com" },
  { tool: "Claude", platform: "notion", status: "api", note: "Via API + Notion integration" },
  { tool: "Claude", platform: "slack", status: "native", note: "Claude for Slack (beta)" },
  { tool: "Claude", platform: "vscode", status: "native", note: "Claude via Cursor, Cline, Continue" },
  { tool: "Claude", platform: "figma", status: "api", note: "Via API + custom plugin" },
  { tool: "Claude", platform: "hubspot", status: "zapier", note: "Via Zapier workflow" },
  { tool: "Claude", platform: "salesforce", status: "api", note: "Via Anthropic API" },
  { tool: "Claude", platform: "googleworkspace", status: "api", note: "Via Apps Script + Anthropic API" },
  { tool: "Claude", platform: "msoffice", status: "api", note: "Via API + Power Automate" },
  { tool: "Claude", platform: "github", status: "native", note: "Claude Code CLI + GitHub Actions" },
  { tool: "Claude", platform: "jira", status: "zapier", note: "Via Zapier" },
  // Gemini
  { tool: "Gemini", platform: "zapier", status: "native", note: "Google AI Zapier app" },
  { tool: "Gemini", platform: "make", status: "native", note: "Google AI module" },
  { tool: "Gemini", platform: "notion", status: "none", note: "No official integration" },
  { tool: "Gemini", platform: "slack", status: "api", note: "Via Google Workspace add-on" },
  { tool: "Gemini", platform: "vscode", status: "native", note: "Gemini Code Assist extension" },
  { tool: "Gemini", platform: "figma", status: "none", note: "No direct integration" },
  { tool: "Gemini", platform: "hubspot", status: "zapier", note: "Via Zapier" },
  { tool: "Gemini", platform: "salesforce", status: "api", note: "Via Google Cloud AI" },
  { tool: "Gemini", platform: "googleworkspace", status: "native", note: "Gemini built into Docs, Sheets, Gmail" },
  { tool: "Gemini", platform: "msoffice", status: "none", note: "No integration" },
  { tool: "Gemini", platform: "github", status: "api", note: "Via Google Cloud + Actions" },
  { tool: "Gemini", platform: "jira", status: "zapier", note: "Via Zapier" },
  // GitHub Copilot
  { tool: "GitHub Copilot", platform: "zapier", status: "none" },
  { tool: "GitHub Copilot", platform: "make", status: "none" },
  { tool: "GitHub Copilot", platform: "notion", status: "none" },
  { tool: "GitHub Copilot", platform: "slack", status: "none" },
  { tool: "GitHub Copilot", platform: "vscode", status: "native", note: "Fully native VS Code integration" },
  { tool: "GitHub Copilot", platform: "figma", status: "none" },
  { tool: "GitHub Copilot", platform: "hubspot", status: "none" },
  { tool: "GitHub Copilot", platform: "salesforce", status: "none" },
  { tool: "GitHub Copilot", platform: "googleworkspace", status: "none" },
  { tool: "GitHub Copilot", platform: "msoffice", status: "none" },
  { tool: "GitHub Copilot", platform: "github", status: "native", note: "Native GitHub PR reviews & chat" },
  { tool: "GitHub Copilot", platform: "jira", status: "api", note: "Via GitHub Actions" },
  // Cursor
  { tool: "Cursor", platform: "zapier", status: "none" },
  { tool: "Cursor", platform: "make", status: "none" },
  { tool: "Cursor", platform: "notion", status: "none" },
  { tool: "Cursor", platform: "slack", status: "none" },
  { tool: "Cursor", platform: "vscode", status: "native", note: "VS Code fork — all extensions work" },
  { tool: "Cursor", platform: "figma", status: "none" },
  { tool: "Cursor", platform: "hubspot", status: "none" },
  { tool: "Cursor", platform: "salesforce", status: "none" },
  { tool: "Cursor", platform: "googleworkspace", status: "none" },
  { tool: "Cursor", platform: "msoffice", status: "none" },
  { tool: "Cursor", platform: "github", status: "native", note: "Git built-in" },
  { tool: "Cursor", platform: "jira", status: "api", note: "Via extensions" },
  // Midjourney
  { tool: "Midjourney", platform: "zapier", status: "zapier", note: "Via unofficial Zapier actions" },
  { tool: "Midjourney", platform: "make", status: "api", note: "Via Make HTTP module" },
  { tool: "Midjourney", platform: "notion", status: "none" },
  { tool: "Midjourney", platform: "slack", status: "native", note: "Midjourney runs in Discord; Discord→Slack via Zapier" },
  { tool: "Midjourney", platform: "vscode", status: "none" },
  { tool: "Midjourney", platform: "figma", status: "api", note: "Import generated images" },
  { tool: "Midjourney", platform: "hubspot", status: "none" },
  { tool: "Midjourney", platform: "salesforce", status: "none" },
  { tool: "Midjourney", platform: "googleworkspace", status: "none" },
  { tool: "Midjourney", platform: "msoffice", status: "none" },
  { tool: "Midjourney", platform: "github", status: "none" },
  { tool: "Midjourney", platform: "jira", status: "none" },
  // DALL-E 3
  { tool: "DALL-E 3", platform: "zapier", status: "native", note: "Via OpenAI Zapier app" },
  { tool: "DALL-E 3", platform: "make", status: "native", note: "OpenAI module supports DALL-E" },
  { tool: "DALL-E 3", platform: "notion", status: "api", note: "Via API" },
  { tool: "DALL-E 3", platform: "slack", status: "zapier", note: "Via Zapier" },
  { tool: "DALL-E 3", platform: "vscode", status: "api", note: "Via custom extension" },
  { tool: "DALL-E 3", platform: "figma", status: "native", note: "DALL-E Figma plugins available" },
  { tool: "DALL-E 3", platform: "hubspot", status: "zapier" },
  { tool: "DALL-E 3", platform: "salesforce", status: "api" },
  { tool: "DALL-E 3", platform: "googleworkspace", status: "api" },
  { tool: "DALL-E 3", platform: "msoffice", status: "api" },
  { tool: "DALL-E 3", platform: "github", status: "none" },
  { tool: "DALL-E 3", platform: "jira", status: "none" },
  // ElevenLabs
  { tool: "ElevenLabs", platform: "zapier", status: "native", note: "Official ElevenLabs Zapier app" },
  { tool: "ElevenLabs", platform: "make", status: "native", note: "ElevenLabs module in Make.com" },
  { tool: "ElevenLabs", platform: "notion", status: "api" },
  { tool: "ElevenLabs", platform: "slack", status: "zapier" },
  { tool: "ElevenLabs", platform: "vscode", status: "api" },
  { tool: "ElevenLabs", platform: "figma", status: "none" },
  { tool: "ElevenLabs", platform: "hubspot", status: "zapier" },
  { tool: "ElevenLabs", platform: "salesforce", status: "api" },
  { tool: "ElevenLabs", platform: "googleworkspace", status: "api" },
  { tool: "ElevenLabs", platform: "msoffice", status: "api" },
  { tool: "ElevenLabs", platform: "github", status: "none" },
  { tool: "ElevenLabs", platform: "jira", status: "none" },
  // Perplexity
  { tool: "Perplexity", platform: "zapier", status: "zapier", note: "Via unofficial integration" },
  { tool: "Perplexity", platform: "make", status: "api" },
  { tool: "Perplexity", platform: "notion", status: "api" },
  { tool: "Perplexity", platform: "slack", status: "api" },
  { tool: "Perplexity", platform: "vscode", status: "none" },
  { tool: "Perplexity", platform: "figma", status: "none" },
  { tool: "Perplexity", platform: "hubspot", status: "none" },
  { tool: "Perplexity", platform: "salesforce", status: "none" },
  { tool: "Perplexity", platform: "googleworkspace", status: "api" },
  { tool: "Perplexity", platform: "msoffice", status: "none" },
  { tool: "Perplexity", platform: "github", status: "none" },
  { tool: "Perplexity", platform: "jira", status: "none" },
  // Notion AI
  { tool: "Notion AI", platform: "zapier", status: "native", note: "Notion has official Zapier app" },
  { tool: "Notion AI", platform: "make", status: "native", note: "Notion module in Make.com" },
  { tool: "Notion AI", platform: "notion", status: "native", note: "Built into Notion natively" },
  { tool: "Notion AI", platform: "slack", status: "zapier", note: "Via Zapier Notion→Slack" },
  { tool: "Notion AI", platform: "vscode", status: "none" },
  { tool: "Notion AI", platform: "figma", status: "none" },
  { tool: "Notion AI", platform: "hubspot", status: "zapier" },
  { tool: "Notion AI", platform: "salesforce", status: "zapier" },
  { tool: "Notion AI", platform: "googleworkspace", status: "api" },
  { tool: "Notion AI", platform: "msoffice", status: "none" },
  { tool: "Notion AI", platform: "github", status: "zapier" },
  { tool: "Notion AI", platform: "jira", status: "native", note: "Notion-Jira sync available" },
];

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; bg: string; text: string; dot: string }> = {
  native: { label: "Native", bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  api: { label: "Via API", bg: "bg-blue-500/15", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  zapier: { label: "Via Zapier", bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  none: { label: "None", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground/30" },
};

function StatusBadge({ status, note }: { status: IntegrationStatus; note?: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="group relative flex items-center justify-center">
      <div className={`w-full h-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${cfg.bg}`}>
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
        <span className={`text-xs font-medium ${cfg.text} hidden sm:inline`}>{cfg.label}</span>
      </div>
      {note && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 rounded-lg border border-border bg-background shadow-lg p-2 text-xs text-foreground z-50 hidden group-hover:block">
          {note}
        </div>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  const [filterTool, setFilterTool] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<IntegrationStatus | "all">("all");

  const visibleTools = filterTool === "all" ? AI_TOOLS : AI_TOOLS.filter((t) => t.name === filterTool);
  const visiblePlatforms = filterPlatform === "all" ? PLATFORMS : PLATFORMS.filter((p) => p.id === filterPlatform);

  function getStatus(tool: string, platform: string): IntegrationEntry {
    return INTEGRATIONS.find((i) => i.tool === tool && i.platform === platform) ?? { tool, platform, status: "none" };
  }

  // Count integrations per tool for summary
  function countByStatus(toolName: string, s: IntegrationStatus) {
    return INTEGRATIONS.filter((i) => i.tool === toolName && i.status === s).length;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb + Header */}
      <div className="space-y-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/research" className="hover:text-foreground transition-colors">Dynamic Research</Link>
          <span>/</span>
          <span className="text-foreground">Integration Graphs</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Integration Graphs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              See which AI tools plug into your existing workflow — hover cells for details.
            </p>
          </div>
        </div>
      </div>

      {/* Legend + Filters */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {(Object.entries(STATUS_CONFIG) as [IntegrationStatus, typeof STATUS_CONFIG[IntegrationStatus]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-all ${filterStatus === key ? "border-primary" : "border-border"} ${cfg.bg} ${cfg.text}`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All AI Tools</option>
            {AI_TOOLS.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Platforms</option>
            {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px] sticky left-0 bg-muted/50 z-10">
                AI Tool
              </th>
              {visiblePlatforms.map((p) => (
                <th key={p.id} className="px-3 py-3 font-medium text-muted-foreground text-center min-w-[110px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base">{p.icon}</span>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer sponsored" className="text-xs text-primary hover:underline">{p.name}</a>
                    ) : (
                      <span className="text-xs">{p.name}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground/60">{p.category}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleTools.map((tool, i) => (
              <tr key={tool.name} className={i < visibleTools.length - 1 ? "border-b border-border" : ""}>
                <td className="px-4 py-3 sticky left-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tool.dot}`} />
                    <div>
                      {tool.href ? (
                        <a href={tool.href} target="_blank" rel="noopener noreferrer sponsored" className="font-medium text-foreground text-sm hover:text-primary hover:underline">{tool.name}</a>
                      ) : (
                        <div className="font-medium text-foreground text-sm">{tool.name}</div>
                      )}
                      <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${tool.color}`}>{tool.category}</div>
                    </div>
                  </div>
                </td>
                {visiblePlatforms.map((p) => {
                  const entry = getStatus(tool.name, p.id);
                  if (filterStatus !== "all" && entry.status !== filterStatus) {
                    return (
                      <td key={p.id} className="px-2 py-2">
                        <div className="h-8 rounded-md bg-muted/30" />
                      </td>
                    );
                  }
                  return (
                    <td key={p.id} className="px-2 py-2">
                      <StatusBadge status={entry.status} note={entry.note} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary cards */}
      {filterTool === "all" && filterPlatform === "all" && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Integration Coverage by Tool</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {AI_TOOLS.map((tool) => {
              const native = countByStatus(tool.name, "native");
              const api = countByStatus(tool.name, "api");
              const zapier = countByStatus(tool.name, "zapier");
              const total = PLATFORMS.length;
              const covered = native + api + zapier;
              const pct = Math.round((covered / total) * 100);
              return (
                <div key={tool.name} className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tool.dot}`} />
                    {tool.href ? (
                      <a href={tool.href} target="_blank" rel="noopener noreferrer sponsored" className="text-sm font-medium text-foreground hover:text-primary hover:underline">{tool.name}</a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{tool.name}</span>
                    )}
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div className="flex justify-between"><span>Coverage</span><span className="font-medium text-foreground">{pct}%</span></div>
                    <div className="flex justify-between"><span>Native</span><span>{native}</span></div>
                    <div className="flex justify-between"><span>Via API</span><span>{api}</span></div>
                    <div className="flex justify-between"><span>Via Zapier</span><span>{zapier}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
