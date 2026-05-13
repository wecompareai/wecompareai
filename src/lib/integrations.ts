/**
 * Integration matrix: AI tools × workflow platforms.
 *
 * Add a new tool: append to AI_TOOLS, then add its rows to INTEGRATIONS.
 * Add a new platform: append to PLATFORMS, then add cells across tools.
 * Add a new status: extend IntegrationStatus + STATUS_CONFIG.
 *
 * Foreign keys are stable IDs (not display names), so renaming is safe.
 */

export type IntegrationStatus = "native" | "api" | "zapier" | "none";

export const TOOL_CATEGORIES = ["LLM", "Coding", "Image", "Audio", "Search", "Productivity"] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  href?: string;
  color: { bg: string; dot: string };
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  category: string;
  href?: string;
}

export interface IntegrationEntry {
  toolId: string;
  platformId: string;
  status: IntegrationStatus;
  note?: string;
  docsUrl?: string;
}

export interface StatusConfig {
  label: string;
  description: string;
  bg: string;
  text: string;
  dot: string;
  weight: number;
}

export const STATUS_CONFIG: Record<IntegrationStatus, StatusConfig> = {
  native: {
    label: "Native",
    description: "Built-in / official integration — no setup needed",
    bg: "bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    weight: 3,
  },
  api: {
    label: "Via API",
    description: "Connect with custom code via the tool's API",
    bg: "bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    weight: 2,
  },
  zapier: {
    label: "Via Zapier",
    description: "Reachable through no-code automation (Zapier, Make, etc.)",
    bg: "bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    weight: 1,
  },
  none: {
    label: "None",
    description: "No known integration path",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/30",
    weight: 0,
  },
};

export const AI_TOOLS: AITool[] = [
  { id: "chatgpt",        name: "ChatGPT",         category: "LLM",          color: { bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" } },
  { id: "claude",         name: "Claude",          category: "LLM",          color: { bg: "bg-orange-500/10 text-orange-700 dark:text-orange-400",   dot: "bg-orange-500" } },
  { id: "gemini",         name: "Gemini",          category: "LLM",          color: { bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400",         dot: "bg-blue-500" } },
  { id: "github-copilot", name: "GitHub Copilot",  category: "Coding",       color: { bg: "bg-gray-500/10 text-gray-700 dark:text-gray-400",         dot: "bg-gray-500" } },
  { id: "cursor",         name: "Cursor",          category: "Coding",       color: { bg: "bg-violet-500/10 text-violet-700 dark:text-violet-400",   dot: "bg-violet-500" } },
  { id: "midjourney",     name: "Midjourney",      category: "Image",        color: { bg: "bg-pink-500/10 text-pink-700 dark:text-pink-400",         dot: "bg-pink-500" } },
  { id: "dalle-3",        name: "DALL-E 3",        category: "Image",        color: { bg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",         dot: "bg-cyan-500" } },
  { id: "elevenlabs",     name: "ElevenLabs",      category: "Audio",        color: { bg: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",   dot: "bg-yellow-500" }, href: "https://try.elevenlabs.io/wecompareai" },
  { id: "perplexity",     name: "Perplexity",      category: "Search",       color: { bg: "bg-teal-500/10 text-teal-700 dark:text-teal-400",         dot: "bg-teal-500" } },
  { id: "notion-ai",      name: "Notion AI",       category: "Productivity", color: { bg: "bg-slate-500/10 text-slate-700 dark:text-slate-400",      dot: "bg-slate-500" } },
];

export const PLATFORMS: Platform[] = [
  { id: "zapier",          name: "Zapier",           icon: "⚡", category: "Automation" },
  { id: "make",            name: "Make.com",         icon: "🔄", category: "Automation",  href: "https://www.make.com/en/register?pc=wecompareai" },
  { id: "n8n",             name: "n8n",              icon: "🔗", category: "Automation",  href: "https://n8n.io" },
  { id: "notion",          name: "Notion",           icon: "📝", category: "Productivity" },
  { id: "slack",           name: "Slack",            icon: "💬", category: "Communication" },
  { id: "vscode",          name: "VS Code",          icon: "💻", category: "Development" },
  { id: "figma",           name: "Figma",            icon: "🎨", category: "Design" },
  { id: "hubspot",         name: "HubSpot",          icon: "🏢", category: "CRM" },
  { id: "salesforce",      name: "Salesforce",       icon: "☁️", category: "CRM" },
  { id: "googleworkspace", name: "Google Workspace", icon: "📊", category: "Productivity" },
  { id: "msoffice",        name: "Microsoft 365",    icon: "🪟", category: "Productivity" },
  { id: "github",          name: "GitHub",           icon: "🐙", category: "Development" },
  { id: "jira",            name: "Jira",             icon: "📋", category: "Project Mgmt" },
];

export const INTEGRATIONS: IntegrationEntry[] = [
  // ChatGPT
  { toolId: "chatgpt", platformId: "zapier",          status: "native", note: "Official ChatGPT Zapier app" },
  { toolId: "chatgpt", platformId: "make",            status: "native", note: "Official OpenAI module" },
  { toolId: "chatgpt", platformId: "n8n",             status: "native", note: "Official OpenAI node ships with n8n" },
  { toolId: "chatgpt", platformId: "notion",          status: "native", note: "Notion AI uses GPT-4" },
  { toolId: "chatgpt", platformId: "slack",           status: "native", note: "ChatGPT Slack app available" },
  { toolId: "chatgpt", platformId: "vscode",          status: "api",    note: "Via Copilot or custom extensions" },
  { toolId: "chatgpt", platformId: "figma",           status: "zapier", note: "Via Zapier automation" },
  { toolId: "chatgpt", platformId: "hubspot",         status: "native", note: "OpenAI integration in HubSpot" },
  { toolId: "chatgpt", platformId: "salesforce",      status: "native", note: "Einstein AI uses GPT" },
  { toolId: "chatgpt", platformId: "googleworkspace", status: "api",    note: "Via Apps Script + OpenAI API" },
  { toolId: "chatgpt", platformId: "msoffice",        status: "native", note: "Copilot for M365 uses GPT-4" },
  { toolId: "chatgpt", platformId: "github",          status: "api",    note: "Via GitHub Actions + API" },
  { toolId: "chatgpt", platformId: "jira",            status: "zapier", note: "Via Zapier or Atlassian AI" },
  // Claude
  { toolId: "claude",  platformId: "zapier",          status: "native", note: "Official Claude Zapier app" },
  { toolId: "claude",  platformId: "make",            status: "native", note: "Anthropic module in Make.com" },
  { toolId: "claude",  platformId: "n8n",             status: "native", note: "Built-in Anthropic node" },
  { toolId: "claude",  platformId: "notion",          status: "api",    note: "Via API + Notion integration" },
  { toolId: "claude",  platformId: "slack",           status: "native", note: "Claude for Slack (beta)" },
  { toolId: "claude",  platformId: "vscode",          status: "native", note: "Claude via Cursor, Cline, Continue" },
  { toolId: "claude",  platformId: "figma",           status: "api",    note: "Via API + custom plugin" },
  { toolId: "claude",  platformId: "hubspot",         status: "zapier", note: "Via Zapier workflow" },
  { toolId: "claude",  platformId: "salesforce",      status: "api",    note: "Via Anthropic API" },
  { toolId: "claude",  platformId: "googleworkspace", status: "api",    note: "Via Apps Script + Anthropic API" },
  { toolId: "claude",  platformId: "msoffice",        status: "api",    note: "Via API + Power Automate" },
  { toolId: "claude",  platformId: "github",          status: "native", note: "Claude Code CLI + GitHub Actions" },
  { toolId: "claude",  platformId: "jira",            status: "zapier", note: "Via Zapier" },
  // Gemini
  { toolId: "gemini",  platformId: "zapier",          status: "native", note: "Google AI Zapier app" },
  { toolId: "gemini",  platformId: "make",            status: "native", note: "Google AI module" },
  { toolId: "gemini",  platformId: "n8n",             status: "native", note: "Google Gemini / Vertex AI nodes" },
  { toolId: "gemini",  platformId: "notion",          status: "none" },
  { toolId: "gemini",  platformId: "slack",           status: "api",    note: "Via Google Workspace add-on" },
  { toolId: "gemini",  platformId: "vscode",          status: "native", note: "Gemini Code Assist extension" },
  { toolId: "gemini",  platformId: "figma",           status: "none" },
  { toolId: "gemini",  platformId: "hubspot",         status: "zapier", note: "Via Zapier" },
  { toolId: "gemini",  platformId: "salesforce",      status: "api",    note: "Via Google Cloud AI" },
  { toolId: "gemini",  platformId: "googleworkspace", status: "native", note: "Gemini built into Docs, Sheets, Gmail" },
  { toolId: "gemini",  platformId: "msoffice",        status: "none" },
  { toolId: "gemini",  platformId: "github",          status: "api",    note: "Via Google Cloud + Actions" },
  { toolId: "gemini",  platformId: "jira",            status: "zapier", note: "Via Zapier" },
  // GitHub Copilot
  { toolId: "github-copilot", platformId: "zapier",          status: "none" },
  { toolId: "github-copilot", platformId: "make",            status: "none" },
  { toolId: "github-copilot", platformId: "n8n",             status: "none", note: "IDE-only — not workflow-callable" },
  { toolId: "github-copilot", platformId: "notion",          status: "none" },
  { toolId: "github-copilot", platformId: "slack",           status: "none" },
  { toolId: "github-copilot", platformId: "vscode",          status: "native", note: "Fully native VS Code integration" },
  { toolId: "github-copilot", platformId: "figma",           status: "none" },
  { toolId: "github-copilot", platformId: "hubspot",         status: "none" },
  { toolId: "github-copilot", platformId: "salesforce",      status: "none" },
  { toolId: "github-copilot", platformId: "googleworkspace", status: "none" },
  { toolId: "github-copilot", platformId: "msoffice",        status: "none" },
  { toolId: "github-copilot", platformId: "github",          status: "native", note: "Native GitHub PR reviews & chat" },
  { toolId: "github-copilot", platformId: "jira",            status: "api",    note: "Via GitHub Actions" },
  // Cursor
  { toolId: "cursor",  platformId: "zapier",          status: "none" },
  { toolId: "cursor",  platformId: "make",            status: "none" },
  { toolId: "cursor",  platformId: "n8n",             status: "none", note: "IDE-only — not workflow-callable" },
  { toolId: "cursor",  platformId: "notion",          status: "none" },
  { toolId: "cursor",  platformId: "slack",           status: "none" },
  { toolId: "cursor",  platformId: "vscode",          status: "native", note: "VS Code fork — all extensions work" },
  { toolId: "cursor",  platformId: "figma",           status: "none" },
  { toolId: "cursor",  platformId: "hubspot",         status: "none" },
  { toolId: "cursor",  platformId: "salesforce",      status: "none" },
  { toolId: "cursor",  platformId: "googleworkspace", status: "none" },
  { toolId: "cursor",  platformId: "msoffice",        status: "none" },
  { toolId: "cursor",  platformId: "github",          status: "native", note: "Git built-in" },
  { toolId: "cursor",  platformId: "jira",            status: "api",    note: "Via extensions" },
  // Midjourney
  { toolId: "midjourney", platformId: "zapier",          status: "zapier", note: "Via unofficial Zapier actions" },
  { toolId: "midjourney", platformId: "make",            status: "api",    note: "Via Make HTTP module" },
  { toolId: "midjourney", platformId: "n8n",             status: "api",    note: "Via HTTP Request node + unofficial endpoints" },
  { toolId: "midjourney", platformId: "notion",          status: "none" },
  { toolId: "midjourney", platformId: "slack",           status: "native", note: "Midjourney runs in Discord; Discord→Slack via Zapier" },
  { toolId: "midjourney", platformId: "vscode",          status: "none" },
  { toolId: "midjourney", platformId: "figma",           status: "api",    note: "Import generated images" },
  { toolId: "midjourney", platformId: "hubspot",         status: "none" },
  { toolId: "midjourney", platformId: "salesforce",      status: "none" },
  { toolId: "midjourney", platformId: "googleworkspace", status: "none" },
  { toolId: "midjourney", platformId: "msoffice",        status: "none" },
  { toolId: "midjourney", platformId: "github",          status: "none" },
  { toolId: "midjourney", platformId: "jira",            status: "none" },
  // DALL-E 3
  { toolId: "dalle-3", platformId: "zapier",          status: "native", note: "Via OpenAI Zapier app" },
  { toolId: "dalle-3", platformId: "make",            status: "native", note: "OpenAI module supports DALL-E" },
  { toolId: "dalle-3", platformId: "n8n",             status: "native", note: "Covered by the OpenAI node" },
  { toolId: "dalle-3", platformId: "notion",          status: "api",    note: "Via API" },
  { toolId: "dalle-3", platformId: "slack",           status: "zapier", note: "Via Zapier" },
  { toolId: "dalle-3", platformId: "vscode",          status: "api",    note: "Via custom extension" },
  { toolId: "dalle-3", platformId: "figma",           status: "native", note: "DALL-E Figma plugins available" },
  { toolId: "dalle-3", platformId: "hubspot",         status: "zapier" },
  { toolId: "dalle-3", platformId: "salesforce",      status: "api" },
  { toolId: "dalle-3", platformId: "googleworkspace", status: "api" },
  { toolId: "dalle-3", platformId: "msoffice",        status: "api" },
  { toolId: "dalle-3", platformId: "github",          status: "none" },
  { toolId: "dalle-3", platformId: "jira",            status: "none" },
  // ElevenLabs
  { toolId: "elevenlabs", platformId: "zapier",          status: "native", note: "Official ElevenLabs Zapier app" },
  { toolId: "elevenlabs", platformId: "make",            status: "native", note: "ElevenLabs module in Make.com" },
  { toolId: "elevenlabs", platformId: "n8n",             status: "api",    note: "Community node + HTTP Request" },
  { toolId: "elevenlabs", platformId: "notion",          status: "api" },
  { toolId: "elevenlabs", platformId: "slack",           status: "zapier" },
  { toolId: "elevenlabs", platformId: "vscode",          status: "api" },
  { toolId: "elevenlabs", platformId: "figma",           status: "none" },
  { toolId: "elevenlabs", platformId: "hubspot",         status: "zapier" },
  { toolId: "elevenlabs", platformId: "salesforce",      status: "api" },
  { toolId: "elevenlabs", platformId: "googleworkspace", status: "api" },
  { toolId: "elevenlabs", platformId: "msoffice",        status: "api" },
  { toolId: "elevenlabs", platformId: "github",          status: "none" },
  { toolId: "elevenlabs", platformId: "jira",            status: "none" },
  // Perplexity
  { toolId: "perplexity", platformId: "zapier",          status: "zapier", note: "Via unofficial integration" },
  { toolId: "perplexity", platformId: "make",            status: "api" },
  { toolId: "perplexity", platformId: "n8n",             status: "api",    note: "HTTP Request against Perplexity API" },
  { toolId: "perplexity", platformId: "notion",          status: "api" },
  { toolId: "perplexity", platformId: "slack",           status: "api" },
  { toolId: "perplexity", platformId: "vscode",          status: "none" },
  { toolId: "perplexity", platformId: "figma",           status: "none" },
  { toolId: "perplexity", platformId: "hubspot",         status: "none" },
  { toolId: "perplexity", platformId: "salesforce",      status: "none" },
  { toolId: "perplexity", platformId: "googleworkspace", status: "api" },
  { toolId: "perplexity", platformId: "msoffice",        status: "none" },
  { toolId: "perplexity", platformId: "github",          status: "none" },
  { toolId: "perplexity", platformId: "jira",            status: "none" },
  // Notion AI
  { toolId: "notion-ai", platformId: "zapier",          status: "native", note: "Notion has official Zapier app" },
  { toolId: "notion-ai", platformId: "make",            status: "native", note: "Notion module in Make.com" },
  { toolId: "notion-ai", platformId: "n8n",             status: "native", note: "Official Notion node (full Notion API)" },
  { toolId: "notion-ai", platformId: "notion",          status: "native", note: "Built into Notion natively" },
  { toolId: "notion-ai", platformId: "slack",           status: "zapier", note: "Via Zapier Notion→Slack" },
  { toolId: "notion-ai", platformId: "vscode",          status: "none" },
  { toolId: "notion-ai", platformId: "figma",           status: "none" },
  { toolId: "notion-ai", platformId: "hubspot",         status: "zapier" },
  { toolId: "notion-ai", platformId: "salesforce",      status: "zapier" },
  { toolId: "notion-ai", platformId: "googleworkspace", status: "api" },
  { toolId: "notion-ai", platformId: "msoffice",        status: "none" },
  { toolId: "notion-ai", platformId: "github",          status: "zapier" },
  { toolId: "notion-ai", platformId: "jira",            status: "native", note: "Notion-Jira sync available" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getTool(id: string): AITool | undefined {
  return AI_TOOLS.find((t) => t.id === id);
}

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export function getIntegration(toolId: string, platformId: string): IntegrationEntry {
  return (
    INTEGRATIONS.find((i) => i.toolId === toolId && i.platformId === platformId) ?? {
      toolId,
      platformId,
      status: "none",
    }
  );
}

export interface Coverage {
  native: number;
  api: number;
  zapier: number;
  none: number;
  covered: number;
  total: number;
  pct: number;
}

export function getCoverage(toolId: string): Coverage {
  const rows = INTEGRATIONS.filter((i) => i.toolId === toolId);
  const native = rows.filter((i) => i.status === "native").length;
  const api = rows.filter((i) => i.status === "api").length;
  const zapier = rows.filter((i) => i.status === "zapier").length;
  const none = PLATFORMS.length - (native + api + zapier);
  const covered = native + api + zapier;
  const pct = PLATFORMS.length ? Math.round((covered / PLATFORMS.length) * 100) : 0;
  return { native, api, zapier, none, covered, total: PLATFORMS.length, pct };
}

export function getIntegrationsByTool(toolId: string): IntegrationEntry[] {
  return PLATFORMS.map((p) => getIntegration(toolId, p.id));
}

export function totalIntegrations(): number {
  return INTEGRATIONS.filter((i) => i.status !== "none").length;
}
