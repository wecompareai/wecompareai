export interface ToolScore {
  id: string;
  name: string;
  provider: string;
  category: string;
  performance: number;   // 0–10: benchmark scores, output quality
  value: number;         // 0–10: price-to-performance ratio
  reliability: number;   // 0–10: uptime, stability, vendor risk
  easeOfUse: number;     // 0–10: interface, docs, setup friction
  overall: number;       // weighted: perf 35% + value 30% + reliability 20% + ease 15%
  verdict: string;       // one-line summary
  lastUpdated: string;
}

function calcOverall(p: number, v: number, r: number, e: number) {
  return Math.round((p * 0.35 + v * 0.30 + r * 0.20 + e * 0.15) * 10) / 10;
}

export const ALL_SCORES: ToolScore[] = [
  // ── LLM Models ──
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    category: "LLM",
    performance: 9.0,
    value: 8.2,
    reliability: 9.0,
    easeOfUse: 9.5,
    overall: calcOverall(9.0, 8.2, 9.0, 9.5),
    verdict: "Best all-rounder. Unmatched ecosystem and ease of use.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    category: "LLM",
    performance: 9.5,
    value: 7.5,
    reliability: 9.0,
    easeOfUse: 8.5,
    overall: calcOverall(9.5, 7.5, 9.0, 8.5),
    verdict: "Top reasoning quality. Best for complex, high-stakes tasks.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    category: "LLM",
    performance: 8.8,
    value: 8.5,
    reliability: 8.5,
    easeOfUse: 8.2,
    overall: calcOverall(8.8, 8.5, 8.5, 8.2),
    verdict: "Excellent value. Best choice for Google Workspace teams.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    category: "LLM",
    performance: 8.5,
    value: 9.5,
    reliability: 6.5,
    easeOfUse: 7.0,
    overall: calcOverall(8.5, 9.5, 6.5, 7.0),
    verdict: "Exceptional value. Strong performance at a fraction of the cost.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    category: "LLM",
    performance: 8.0,
    value: 8.5,
    reliability: 7.5,
    easeOfUse: 7.5,
    overall: calcOverall(8.0, 8.5, 7.5, 7.5),
    verdict: "Strong European alternative with good price and GDPR compliance.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "llama-3-1-405b",
    name: "LLaMA 3.1 405B",
    provider: "Meta",
    category: "LLM",
    performance: 8.5,
    value: 9.5,
    reliability: 6.0,
    easeOfUse: 5.0,
    overall: calcOverall(8.5, 9.5, 6.0, 5.0),
    verdict: "Best open-source model. Free to run, but requires infrastructure.",
    lastUpdated: "2026-04-09",
  },

  // ── Coding Tools ──
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    provider: "GitHub / Microsoft",
    category: "Coding",
    performance: 8.5,
    value: 8.2,
    reliability: 9.0,
    easeOfUse: 9.5,
    overall: calcOverall(8.5, 8.2, 9.0, 9.5),
    verdict: "Best IDE integration. The most frictionless coding assistant available.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "cursor",
    name: "Cursor",
    provider: "Anysphere",
    category: "Coding",
    performance: 9.0,
    value: 8.0,
    reliability: 8.0,
    easeOfUse: 8.5,
    overall: calcOverall(9.0, 8.0, 8.0, 8.5),
    verdict: "Best AI-native editor. Codebase-wide context sets it apart.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    provider: "Anthropic",
    category: "Coding",
    performance: 9.2,
    value: 7.5,
    reliability: 8.5,
    easeOfUse: 8.0,
    overall: calcOverall(9.2, 7.5, 8.5, 8.0),
    verdict: "Best for complex engineering tasks and large refactors.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    provider: "Codeium",
    category: "Coding",
    performance: 8.5,
    value: 8.8,
    reliability: 7.5,
    easeOfUse: 8.5,
    overall: calcOverall(8.5, 8.8, 7.5, 8.5),
    verdict: "Best value coding editor. Strong Cursor alternative at lower price.",
    lastUpdated: "2026-04-09",
  },

  // ── Image Generation ──
  {
    id: "midjourney",
    name: "Midjourney",
    provider: "Midjourney",
    category: "Image",
    performance: 9.5,
    value: 7.5,
    reliability: 8.0,
    easeOfUse: 7.0,
    overall: calcOverall(9.5, 7.5, 8.0, 7.0),
    verdict: "Best image quality available. Discord interface is the main drawback.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    category: "Image",
    performance: 8.5,
    value: 9.0,
    reliability: 8.5,
    easeOfUse: 9.5,
    overall: calcOverall(8.5, 9.0, 8.5, 9.5),
    verdict: "Most accessible image generator. Included in ChatGPT Plus.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    provider: "Stability AI",
    category: "Image",
    performance: 8.0,
    value: 10.0,
    reliability: 7.0,
    easeOfUse: 5.5,
    overall: calcOverall(8.0, 10.0, 7.0, 5.5),
    verdict: "Best open-source option. Free to run locally with no restrictions.",
    lastUpdated: "2026-04-09",
  },

  // ── Audio / Voice ──
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    provider: "ElevenLabs",
    category: "Audio",
    performance: 9.5,
    value: 7.5,
    reliability: 8.5,
    easeOfUse: 8.5,
    overall: calcOverall(9.5, 7.5, 8.5, 8.5),
    verdict: "Best-in-class voice cloning. Unmatched realism and language support.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "openai-tts",
    name: "OpenAI TTS",
    provider: "OpenAI",
    category: "Audio",
    performance: 8.5,
    value: 9.0,
    reliability: 9.0,
    easeOfUse: 9.0,
    overall: calcOverall(8.5, 9.0, 9.0, 9.0),
    verdict: "Best value TTS. Fast, natural, and priced for scale.",
    lastUpdated: "2026-04-09",
  },

  // ── Cloud Providers ──
  {
    id: "aws-bedrock",
    name: "AWS Bedrock",
    provider: "Amazon",
    category: "Cloud",
    performance: 8.5,
    value: 7.8,
    reliability: 9.5,
    easeOfUse: 7.0,
    overall: calcOverall(8.5, 7.8, 9.5, 7.0),
    verdict: "Most reliable enterprise AI platform. Best for AWS-native teams.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    provider: "Microsoft",
    category: "Cloud",
    performance: 9.0,
    value: 7.5,
    reliability: 9.5,
    easeOfUse: 8.0,
    overall: calcOverall(9.0, 7.5, 9.5, 8.0),
    verdict: "Best for Microsoft/enterprise shops. GPT-4o with enterprise SLAs.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "vertex-ai",
    name: "Vertex AI",
    provider: "Google Cloud",
    category: "Cloud",
    performance: 8.8,
    value: 8.0,
    reliability: 9.0,
    easeOfUse: 7.5,
    overall: calcOverall(8.8, 8.0, 9.0, 7.5),
    verdict: "Best for Google Cloud teams. Gemini natively integrated.",
    lastUpdated: "2026-04-09",
  },

  // ── New April 2026 models ──
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    category: "LLM",
    performance: 9.2,
    value: 8.8,
    reliability: 9.0,
    easeOfUse: 8.5,
    overall: calcOverall(9.2, 8.8, 9.0, 8.5),
    verdict: "Best price-performance LLM in 2026. Outperforms GPT-4o at lower cost.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    category: "LLM",
    performance: 8.5,
    value: 9.8,
    reliability: 8.5,
    easeOfUse: 8.8,
    overall: calcOverall(8.5, 9.8, 8.5, 8.8),
    verdict: "Best value LLM — ultra-fast, incredibly cheap, strong for high-volume tasks.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "gpt-4-1-mini",
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    category: "LLM",
    performance: 8.2,
    value: 9.5,
    reliability: 9.0,
    easeOfUse: 9.5,
    overall: calcOverall(8.2, 9.5, 9.0, 9.5),
    verdict: "Best budget OpenAI model. Near GPT-4o quality at a fraction of the API cost.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    category: "LLM",
    performance: 9.3,
    value: 8.0,
    reliability: 9.2,
    easeOfUse: 9.5,
    overall: calcOverall(9.3, 8.0, 9.2, 9.5),
    verdict: "OpenAI's latest flagship. Best coding performance in the GPT family.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    provider: "Mistral AI",
    category: "LLM",
    performance: 8.5,
    value: 8.8,
    reliability: 8.0,
    easeOfUse: 7.8,
    overall: calcOverall(8.5, 8.8, 8.0, 7.8),
    verdict: "Best European sovereign AI. Strong GDPR compliance and multilingual capabilities.",
    lastUpdated: "2026-04-09",
  },

  // ── Video Generation ──
  {
    id: "sora",
    name: "Sora",
    provider: "OpenAI",
    category: "Video",
    performance: 9.2,
    value: 6.0,
    reliability: 8.0,
    easeOfUse: 8.0,
    overall: calcOverall(9.2, 6.0, 8.0, 8.0),
    verdict: "Best AI video quality. Requires ChatGPT Pro at $200/mo.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3",
    provider: "Runway",
    category: "Video",
    performance: 8.5,
    value: 7.5,
    reliability: 8.0,
    easeOfUse: 8.5,
    overall: calcOverall(8.5, 7.5, 8.0, 8.5),
    verdict: "Industry standard for creative professionals. Best camera control and editing tools.",
    lastUpdated: "2026-04-09",
  },
  {
    id: "pika",
    name: "Pika",
    provider: "Pika Labs",
    category: "Video",
    performance: 7.5,
    value: 9.0,
    reliability: 7.5,
    easeOfUse: 9.0,
    overall: calcOverall(7.5, 9.0, 7.5, 9.0),
    verdict: "Best value AI video. Fast, easy, and generous free tier for social content.",
    lastUpdated: "2026-04-09",
  },
];

export function getScoresByCategory(category: string) {
  return ALL_SCORES.filter((s) => s.category === category).sort((a, b) => b.overall - a.overall);
}

export function getScoreById(id: string) {
  return ALL_SCORES.find((s) => s.id === id);
}

export function getScoreByName(name: string) {
  return ALL_SCORES.find(
    (s) => s.name.toLowerCase() === name.toLowerCase() ||
           s.name.toLowerCase().includes(name.toLowerCase())
  );
}

export const CATEGORIES = [...new Set(ALL_SCORES.map((s) => s.category))];

export const SCORE_DIMENSIONS = [
  { key: "performance" as const, label: "Performance", color: "bg-blue-500",    desc: "Benchmark scores & output quality" },
  { key: "value"       as const, label: "Value",       color: "bg-emerald-500", desc: "Price-to-performance ratio" },
  { key: "reliability" as const, label: "Reliability", color: "bg-violet-500",  desc: "Uptime, stability & vendor risk" },
  { key: "easeOfUse"   as const, label: "Ease of Use", color: "bg-amber-500",   desc: "Interface, docs & setup friction" },
];
