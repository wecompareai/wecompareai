// ─────────────────────────────────────────────────────────────────────────────
// Pricing data for major AI tools
// Updated: 2026-04-13
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingTier {
  name: string;           // "Free" | "Plus" | "Team" | "Enterprise"
  price: string;          // "$20/mo" or "Free"
  billingNote?: string;   // "per user" | "billed annually"
  features: string[];
}

export interface ApiPricing {
  inputPer1M: number | null;   // USD
  outputPer1M: number | null;  // USD
  contextWindow: string;       // "128K tokens"
  modelName: string;           // exact model name
  notes?: string;
}

export interface RealWorldCost {
  task: string;
  tokens: string;        // "~2,000 tokens"
  cost: string;          // "$0.01"
  note?: string;
}

export interface PricingPage {
  slug: string;
  name: string;
  provider: string;
  category: string;       // "LLM" | "Image" | "Audio" | "Video" | "Coding"
  tagline: string;
  description: string;
  freeTier: boolean;
  freeTierNote?: string;
  subscriptionTiers: PricingTier[];
  apiPricing: ApiPricing[];
  realWorldCosts: RealWorldCost[];
  cheaperAlternatives: string[];   // tool slugs
  verdict: string;
  bestFor: string;
  pricingUrl: string;
  lastUpdated: string;
  faqs: { q: string; a: string }[];
}

const LAST_UPDATED = "2026-04-13";

export const pricingPages: PricingPage[] = [

  // ═══════════════════════════════════════════════════════════════
  // ChatGPT / OpenAI
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    category: "LLM",
    tagline: "The world's most popular AI assistant",
    description: "ChatGPT pricing breakdown for 2026 — free tier, Plus ($20/mo), Team ($30/user/mo), and Enterprise. Includes API token costs for GPT-4o, GPT-4.1, and o3.",
    freeTier: true,
    freeTierNote: "GPT-4o with daily limits, DALL-E image generation, web browsing",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["GPT-4o (limited)", "DALL-E image generation", "Web browsing", "Basic memory"] },
      { name: "Plus", price: "$20/mo", features: ["GPT-4o (full access)", "o3-mini reasoning", "Advanced voice mode", "File uploads", "5× more messages"] },
      { name: "Team", price: "$30/user/mo", billingNote: "per user, billed monthly", features: ["Everything in Plus", "No data used for training", "Admin workspace controls", "Higher message limits"] },
      { name: "Pro", price: "$200/mo", features: ["Unlimited GPT-4o", "o1 pro mode", "Unlimited o3", "Priority access to new models"] },
      { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "SOC 2 compliance", "HIPAA BAA available", "Custom data retention", "Dedicated support"] },
    ],
    apiPricing: [
      { modelName: "GPT-4o", inputPer1M: 2.50, outputPer1M: 10.00, contextWindow: "128K tokens", notes: "Best quality/cost balance" },
      { modelName: "GPT-4o mini", inputPer1M: 0.15, outputPer1M: 0.60, contextWindow: "128K tokens", notes: "Best value for high-volume tasks" },
      { modelName: "GPT-4.1", inputPer1M: 2.00, outputPer1M: 8.00, contextWindow: "1M tokens", notes: "Latest frontier model" },
      { modelName: "GPT-4.1 mini", inputPer1M: 0.40, outputPer1M: 1.60, contextWindow: "1M tokens", notes: "Fast & cheap" },
      { modelName: "o3", inputPer1M: 10.00, outputPer1M: 40.00, contextWindow: "200K tokens", notes: "Best reasoning, highest cost" },
      { modelName: "o4-mini", inputPer1M: 1.10, outputPer1M: 4.40, contextWindow: "200K tokens", notes: "Affordable reasoning" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post", tokens: "~2,500 tokens", cost: "$0.006 (GPT-4o mini) — $0.06 (GPT-4o)", note: "Input + output combined" },
      { task: "Summarise a 50-page PDF", tokens: "~15,000 tokens", cost: "$0.04 (GPT-4o mini) — $0.38 (GPT-4o)" },
      { task: "Debug a 200-line code file", tokens: "~3,000 tokens", cost: "$0.007 (GPT-4o mini) — $0.08 (GPT-4o)" },
      { task: "Translate 10,000 words", tokens: "~13,000 tokens", cost: "$0.03 (GPT-4o mini) — $0.33 (GPT-4o)" },
      { task: "Customer support reply (100 words)", tokens: "~300 tokens", cost: "$0.0001 (GPT-4o mini)" },
    ],
    cheaperAlternatives: ["gemini", "claude", "deepseek", "mistral"],
    verdict: "ChatGPT is the most feature-rich consumer AI at $20/mo. For API use at scale, GPT-4o mini offers exceptional value. Enterprise teams get HIPAA BAA and SOC 2 compliance.",
    bestFor: "General use, non-technical users, image generation, broad integrations",
    pricingUrl: "https://openai.com/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is ChatGPT free?", a: "Yes — the free tier gives you GPT-4o with daily message limits, web browsing, and basic DALL-E image generation. No credit card required." },
      { q: "How much does ChatGPT Plus cost?", a: "ChatGPT Plus costs $20/month. It gives you full GPT-4o access, o3-mini reasoning, advanced voice mode, and 5× more messages than the free tier." },
      { q: "How much does the ChatGPT API cost?", a: "GPT-4o costs $2.50 per 1M input tokens and $10 per 1M output tokens. GPT-4o mini is much cheaper at $0.15/$0.60 per 1M tokens — best for high-volume applications." },
      { q: "Does ChatGPT have a free API?", a: "No — the API requires a paid account. However, you get $5 in free credits when you first sign up, which is enough for basic testing." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Claude / Anthropic
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "claude",
    name: "Claude",
    provider: "Anthropic",
    category: "LLM",
    tagline: "Best writing quality and reasoning",
    description: "Claude pricing for 2026 — free tier, Pro ($20/mo), Team ($30/user/mo), and API costs for Claude Opus 4, Sonnet 4.6, and Haiku 4.5.",
    freeTier: true,
    freeTierNote: "Claude Sonnet 3.5 with daily message limits",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["Claude Sonnet 3.5 (limited)", "Basic file uploads", "Web access (limited)"] },
      { name: "Pro", price: "$20/mo", features: ["Claude Opus 4 (full)", "5× more usage than free", "Priority access during peak hours", "Projects & memory", "Extended thinking"] },
      { name: "Team", price: "$30/user/mo", billingNote: "minimum 5 seats", features: ["Everything in Pro", "Higher rate limits", "Central billing", "No training on your data"] },
      { name: "Enterprise", price: "Custom", features: ["Custom rate limits", "SSO/SAML", "Audit logs", "HIPAA BAA", "Dedicated Slack support"] },
    ],
    apiPricing: [
      { modelName: "Claude Opus 4.6", inputPer1M: 15.00, outputPer1M: 75.00, contextWindow: "200K tokens", notes: "Most capable, highest cost" },
      { modelName: "Claude Sonnet 4.6", inputPer1M: 3.00, outputPer1M: 15.00, contextWindow: "200K tokens", notes: "Best balance — recommended for most use cases" },
      { modelName: "Claude Haiku 4.5", inputPer1M: 0.80, outputPer1M: 4.00, contextWindow: "200K tokens", notes: "Fastest and cheapest Claude model" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post", tokens: "~2,500 tokens", cost: "$0.002 (Haiku) — $0.05 (Sonnet) — $0.23 (Opus)" },
      { task: "Summarise a 50-page PDF", tokens: "~15,000 tokens", cost: "$0.012 (Haiku) — $0.30 (Sonnet)" },
      { task: "Debug a 200-line code file", tokens: "~3,000 tokens", cost: "$0.002 (Haiku) — $0.06 (Sonnet)" },
      { task: "Legal document review (5,000 words)", tokens: "~7,000 tokens", cost: "$0.006 (Haiku) — $0.14 (Sonnet)" },
      { task: "Full codebase analysis (50K tokens)", tokens: "50,000 tokens", cost: "$0.04 (Haiku) — $0.98 (Sonnet)" },
    ],
    cheaperAlternatives: ["gemini", "deepseek", "mistral"],
    verdict: "Claude is the best AI for writing and complex reasoning. Pro at $20/mo is great value. For API use, Haiku 4.5 is one of the cheapest capable models available.",
    bestFor: "Long documents, writing, analysis, coding, enterprise compliance",
    pricingUrl: "https://www.anthropic.com/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Claude free to use?", a: "Yes — Claude has a free tier with daily message limits on Claude Sonnet 3.5. No credit card required." },
      { q: "How much does Claude Pro cost?", a: "Claude Pro costs $20/month, the same as ChatGPT Plus. You get full access to Claude Opus 4 and 5× more usage than the free tier." },
      { q: "Is Claude cheaper than ChatGPT for API use?", a: "It depends on the model. Claude Haiku 4.5 ($0.80/$4.00 per 1M tokens) is cheaper than GPT-4o ($2.50/$10.00). Claude Opus is significantly more expensive than GPT-4o." },
      { q: "Does Claude have a 200K context window?", a: "Yes — all Claude models (Opus, Sonnet, Haiku) support 200K token context windows, equivalent to roughly 150,000 words or a full novel." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Gemini / Google
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "gemini",
    name: "Gemini",
    provider: "Google",
    category: "LLM",
    tagline: "Google's AI with 2M token context",
    description: "Google Gemini pricing for 2026 — free tier, Advanced ($19.99/mo via Google One), and API costs for Gemini 2.5 Pro, 2.5 Flash, and 1.5 Flash.",
    freeTier: true,
    freeTierNote: "Gemini 2.0 Flash with daily limits, Google Workspace integration",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["Gemini 2.0 Flash (limited)", "Google Workspace integration", "Image generation (limited)", "1M token context"] },
      { name: "Advanced", price: "$19.99/mo", billingNote: "via Google One AI Premium", features: ["Gemini 2.5 Pro (full)", "2TB Google Drive storage", "Gemini in Gmail, Docs, Sheets", "Deep Research mode"] },
      { name: "Workspace Business", price: "$30/user/mo", features: ["Gemini for Workspace", "Enterprise data protection", "Admin controls", "No training on data"] },
    ],
    apiPricing: [
      { modelName: "Gemini 2.5 Pro", inputPer1M: 1.25, outputPer1M: 10.00, contextWindow: "2M tokens", notes: "Longest context window of any model (2M tokens)" },
      { modelName: "Gemini 2.5 Flash", inputPer1M: 0.15, outputPer1M: 0.60, contextWindow: "1M tokens", notes: "Best value — matches GPT-4o quality at GPT-4o mini prices" },
      { modelName: "Gemini 1.5 Flash", inputPer1M: 0.075, outputPer1M: 0.30, contextWindow: "1M tokens", notes: "Cheapest capable Gemini model" },
      { modelName: "Gemini 1.5 Flash-8B", inputPer1M: 0.0375, outputPer1M: 0.15, contextWindow: "1M tokens", notes: "Extremely cheap for simple tasks" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post", tokens: "~2,500 tokens", cost: "$0.0004 (1.5 Flash-8B) — $0.003 (2.5 Flash) — $0.02 (2.5 Pro)" },
      { task: "Summarise a 50-page PDF", tokens: "~15,000 tokens", cost: "$0.001 (Flash-8B) — $0.01 (2.5 Flash)" },
      { task: "Analyse an entire codebase (500K tokens)", tokens: "500,000 tokens", cost: "$0.09 (2.5 Flash) — $0.63 (2.5 Pro)", note: "No other model can do this at this price" },
      { task: "Process a 2-hour video transcript", tokens: "~80,000 tokens", cost: "$0.012 (2.5 Flash)" },
      { task: "Daily customer support (1M queries/mo, 300 tokens each)", tokens: "300M tokens", cost: "$11.25 (1.5 Flash-8B) — $45 (2.5 Flash)" },
    ],
    cheaperAlternatives: ["deepseek", "mistral"],
    verdict: "Gemini 2.5 Flash is the best value LLM API in 2026 — near GPT-4o quality at GPT-4o mini prices. The 2M token context window on 2.5 Pro is unmatched for processing large documents.",
    bestFor: "Google Workspace users, large document processing, cost-sensitive API applications",
    pricingUrl: "https://ai.google.dev/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Gemini free?", a: "Yes — Gemini has a generous free tier with access to Gemini 2.0 Flash. The API also has a free tier with rate limits suitable for development and testing." },
      { q: "How much does Gemini Advanced cost?", a: "Gemini Advanced costs $19.99/month via Google One AI Premium, which also includes 2TB of Google Drive storage and Gemini integration across all Google Workspace apps." },
      { q: "Is Gemini 2.5 Flash cheaper than GPT-4o mini?", a: "Yes — Gemini 2.5 Flash costs $0.15/$0.60 per 1M tokens, identical in price to GPT-4o mini, but with much higher quality output. Gemini 1.5 Flash-8B is even cheaper at $0.0375/$0.15." },
      { q: "What is Gemini's context window?", a: "Gemini 2.5 Pro has a 2M token context window — the largest of any commercial AI model. This lets you process entire books, codebases, or hours of video in a single prompt." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // DeepSeek
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek AI",
    category: "LLM",
    tagline: "Cheapest frontier-quality LLM API",
    description: "DeepSeek pricing for 2026 — the cheapest frontier AI model. DeepSeek V3 and R1 API costs, free tier, and real-world cost comparisons vs OpenAI.",
    freeTier: true,
    freeTierNote: "DeepSeek chat is free to use at chat.deepseek.com with no limits",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["DeepSeek V3 chat (unlimited)", "DeepSeek R1 reasoning (limited)", "Web search", "File uploads"] },
    ],
    apiPricing: [
      { modelName: "DeepSeek V3", inputPer1M: 0.27, outputPer1M: 1.10, contextWindow: "64K tokens", notes: "98% cheaper than GPT-4o. GPT-4o quality." },
      { modelName: "DeepSeek R1", inputPer1M: 0.55, outputPer1M: 2.19, contextWindow: "64K tokens", notes: "Matches o1 reasoning at 95% lower cost" },
      { modelName: "DeepSeek V3 (cache hit)", inputPer1M: 0.07, outputPer1M: 1.10, contextWindow: "64K tokens", notes: "Cached prompts cost 75% less" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post", tokens: "~2,500 tokens", cost: "$0.0004 (V3)", note: "Equivalent GPT-4o task costs $0.06" },
      { task: "Summarise a 50-page PDF", tokens: "~15,000 tokens", cost: "$0.002 (V3)" },
      { task: "Debug a 200-line code file", tokens: "~3,000 tokens", cost: "$0.0005 (V3)" },
      { task: "1M customer support replies/month (300 tokens each)", tokens: "300M tokens", cost: "$81 (V3)", note: "Same task costs $3,000+ with GPT-4o" },
      { task: "Complex reasoning task (R1)", tokens: "~5,000 tokens", cost: "$0.001 (R1)", note: "OpenAI o1 equivalent costs $0.08+" },
    ],
    cheaperAlternatives: [],
    verdict: "DeepSeek V3 is the cheapest frontier-quality LLM API available. For most tasks it matches GPT-4o quality at 1/10th the price. Data residency is in China — check compliance requirements before use.",
    bestFor: "Cost-sensitive applications, startups, high-volume API usage where data residency isn't a concern",
    pricingUrl: "https://platform.deepseek.com/api-docs/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is DeepSeek really that much cheaper than OpenAI?", a: "Yes — DeepSeek V3 costs $0.27/$1.10 per 1M tokens vs GPT-4o at $2.50/$10.00. That's approximately 9× cheaper on input and 9× cheaper on output tokens." },
      { q: "Is DeepSeek safe to use for business?", a: "DeepSeek is built by a Chinese company and data is processed on servers in China. For applications handling sensitive personal data, European data, or US government data, this may conflict with GDPR, HIPAA, or data sovereignty requirements." },
      { q: "How does DeepSeek R1 compare to OpenAI o1?", a: "DeepSeek R1 matches OpenAI o1 on most reasoning benchmarks (MATH, coding, GPQA) and costs approximately 95% less. It's one of the most significant cost breakthroughs in AI history." },
      { q: "Can I self-host DeepSeek?", a: "Yes — DeepSeek models are open-source and can be self-hosted on your own infrastructure, giving you full data control and eliminating per-token API costs." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Mistral
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    category: "LLM",
    tagline: "Europe's best LLM — GDPR by default",
    description: "Mistral AI pricing for 2026 — API costs for Mistral Large 2, Mistral Small, and Codestral. The best GDPR-compliant LLM API for European companies.",
    freeTier: true,
    freeTierNote: "Le Chat (Mistral's chat interface) is free. API has a free tier for testing.",
    subscriptionTiers: [
      { name: "Free (Le Chat)", price: "Free", features: ["Mistral Large 2 (limited)", "Web search", "File uploads", "Image generation (Black Forest Labs)"] },
      { name: "Le Chat Pro", price: "$14.99/mo", features: ["Unlimited Mistral Large 2", "Advanced reasoning mode", "Priority speed", "Collaboration tools"] },
    ],
    apiPricing: [
      { modelName: "Mistral Large 2", inputPer1M: 2.00, outputPer1M: 6.00, contextWindow: "128K tokens", notes: "Best European frontier model" },
      { modelName: "Mistral Small 3.1", inputPer1M: 0.10, outputPer1M: 0.30, contextWindow: "128K tokens", notes: "Cheapest Mistral — great for classification & summarisation" },
      { modelName: "Codestral", inputPer1M: 0.20, outputPer1M: 0.60, contextWindow: "32K tokens", notes: "Optimised for code generation" },
      { modelName: "Pixtral Large", inputPer1M: 2.00, outputPer1M: 6.00, contextWindow: "128K tokens", notes: "Multimodal — text + image input" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post", tokens: "~2,500 tokens", cost: "$0.0004 (Small) — $0.008 (Large 2)" },
      { task: "Summarise a 50-page PDF", tokens: "~15,000 tokens", cost: "$0.002 (Small) — $0.045 (Large 2)" },
      { task: "Code review (500 lines)", tokens: "~5,000 tokens", cost: "$0.001 (Codestral)" },
      { task: "Customer support (1M replies, 300 tokens each)", tokens: "300M tokens", cost: "$30 (Small 3.1)", note: "With GDPR compliance — unique advantage" },
    ],
    cheaperAlternatives: ["deepseek", "gemini"],
    verdict: "Mistral is the best choice for EU companies that need GDPR compliance without sacrificing quality. Mistral Small 3.1 is one of the cheapest capable LLM APIs in Europe.",
    bestFor: "EU/GDPR-regulated businesses, code generation (Codestral), cost-efficient European AI",
    pricingUrl: "https://mistral.ai/technology/#pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Mistral GDPR compliant?", a: "Yes — Mistral AI is a French company. Data is processed in Europe and Mistral is fully GDPR compliant by default, making it the best choice for EU businesses." },
      { q: "How does Mistral Large compare to GPT-4o?", a: "Mistral Large 2 is slightly below GPT-4o on most benchmarks but costs $2.00/$6.00 per 1M tokens vs GPT-4o at $2.50/$10.00 — making it cheaper per token on output." },
      { q: "What is Codestral?", a: "Codestral is Mistral's code-specialised model. It costs $0.20/$0.60 per 1M tokens and outperforms larger general models on coding tasks." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GitHub Copilot
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    provider: "Microsoft / GitHub",
    category: "Coding",
    tagline: "The most widely used AI coding assistant",
    description: "GitHub Copilot pricing for 2026 — free tier (for verified students/OSS), Individual ($10/mo), Business ($19/user/mo), and Enterprise ($39/user/mo).",
    freeTier: true,
    freeTierNote: "Free for verified students, teachers, and popular open-source maintainers. Also now 2,000 completions/month free for all users.",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["2,000 code completions/month", "50 chat messages/month", "Claude Sonnet & GPT-4o access", "VS Code & JetBrains support"] },
      { name: "Individual", price: "$10/mo", features: ["Unlimited completions", "Unlimited chat", "Multi-model: GPT-4o, Claude Sonnet, Gemini", "CLI & IDE support"] },
      { name: "Business", price: "$19/user/mo", features: ["Everything in Individual", "Organisation-wide policy management", "Audit logs", "No data used for training"] },
      { name: "Enterprise", price: "$39/user/mo", features: ["Everything in Business", "Custom model fine-tuning", "Copilot Workspace", "Bing search integration", "Dedicated support"] },
    ],
    apiPricing: [],
    realWorldCosts: [
      { task: "Per developer per month (Individual)", tokens: "N/A", cost: "$10/mo", note: "Typically saves 3–8 hours of coding time" },
      { task: "10-person team (Business)", tokens: "N/A", cost: "$190/mo ($1,900/yr)" },
      { task: "50-person engineering team (Enterprise)", tokens: "N/A", cost: "$1,950/mo ($23,400/yr)" },
      { task: "ROI: avg developer saves 55 min/day", tokens: "N/A", cost: "$10 cost vs ~$500+ in time saved", note: "Based on $100K developer salary" },
    ],
    cheaperAlternatives: ["cursor", "windsurf"],
    verdict: "GitHub Copilot is the safest enterprise choice at $19/user/mo with Microsoft's compliance stack. Cursor and Windsurf offer better autocomplete quality at similar or lower prices.",
    bestFor: "Enterprise teams, GitHub-native workflows, JetBrains users",
    pricingUrl: "https://github.com/features/copilot#pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is GitHub Copilot free?", a: "Copilot now has a free tier with 2,000 code completions and 50 chat messages per month — enough for light use. Students and open-source maintainers get full free access." },
      { q: "Is GitHub Copilot worth $10/month?", a: "For most developers, yes. Studies show Copilot saves 55+ minutes per day. At a $100K salary, that's roughly $500/month in time saved for a $10 cost." },
      { q: "How does Copilot compare to Cursor?", a: "Cursor typically offers better autocomplete quality and more aggressive AI-assisted coding. Copilot has better enterprise compliance and integrates natively with GitHub. Cursor costs $20/mo vs Copilot at $10/mo." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Cursor
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "cursor",
    name: "Cursor",
    provider: "Anysphere",
    category: "Coding",
    tagline: "The AI-first code editor",
    description: "Cursor pricing for 2026 — free tier (Hobby), Pro ($20/mo), and Business ($40/user/mo). Includes GPT-4o, Claude Sonnet, and Gemini models.",
    freeTier: true,
    freeTierNote: "Hobby plan: 2,000 completions, 50 slow premium requests",
    subscriptionTiers: [
      { name: "Hobby", price: "Free", features: ["2,000 code completions", "50 slow premium model requests", "Claude Sonnet & GPT-4o (slow)", "Basic codebase indexing"] },
      { name: "Pro", price: "$20/mo", features: ["Unlimited completions", "500 fast premium requests/month", "Claude Opus, GPT-4o, Gemini (fast)", "Unlimited slow requests", "Advanced codebase context"] },
      { name: "Business", price: "$40/user/mo", features: ["Everything in Pro", "Centralised billing & admin", "Enforced privacy mode", "Audit logs", "No training on code"] },
    ],
    apiPricing: [],
    realWorldCosts: [
      { task: "Per developer per month (Pro)", tokens: "N/A", cost: "$20/mo" },
      { task: "10-person team (Business)", tokens: "N/A", cost: "$400/mo ($4,800/yr)" },
      { task: "Average time saved vs manual coding", tokens: "N/A", cost: "$20 cost vs 5–10 hours saved/week", note: "Power users report 30–50% productivity gains" },
    ],
    cheaperAlternatives: ["github-copilot", "windsurf"],
    verdict: "Cursor Pro at $20/mo is the best AI coding tool for individual developers and small teams who want maximum productivity. Business plan at $40/user/mo is competitive for enterprises needing privacy controls.",
    bestFor: "Individual developers, startups, teams wanting the best autocomplete & agent coding",
    pricingUrl: "https://cursor.com/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Cursor free?", a: "Cursor has a free Hobby plan with 2,000 completions and 50 slow premium requests. The Pro plan at $20/mo gives you unlimited completions and 500 fast premium requests." },
      { q: "Is Cursor better than GitHub Copilot?", a: "Cursor generally offers better autocomplete quality and more powerful agent capabilities (it can write, run, and debug code autonomously). Copilot is better for enterprise compliance and GitHub integration." },
      { q: "What AI models does Cursor use?", a: "Cursor Pro gives access to Claude Opus 4, Claude Sonnet 4.6, GPT-4o, GPT-4.1, and Gemini 2.5 Pro — you choose which model to use for each task." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Midjourney
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "midjourney",
    name: "Midjourney",
    provider: "Midjourney",
    category: "Image",
    tagline: "The gold standard for AI art",
    description: "Midjourney pricing for 2026 — Basic ($10/mo), Standard ($30/mo), Pro ($60/mo), and Mega ($120/mo). GPU hours, fast vs relax mode explained.",
    freeTier: false,
    subscriptionTiers: [
      { name: "Basic", price: "$10/mo", features: ["~200 images/month (fast GPU)", "3 concurrent jobs", "Web & Discord access", "Commercial usage rights"] },
      { name: "Standard", price: "$30/mo", features: ["15 fast GPU hours/month", "Unlimited relaxed generations", "Stealth mode (private images)", "3 concurrent fast jobs"] },
      { name: "Pro", price: "$60/mo", features: ["30 fast GPU hours/month", "Stealth mode", "12 concurrent fast jobs", "Priority queue"] },
      { name: "Mega", price: "$120/mo", features: ["60 fast GPU hours/month", "Stealth mode", "12 concurrent fast jobs", "Highest priority queue"] },
    ],
    apiPricing: [],
    realWorldCosts: [
      { task: "Single image (fast GPU)", tokens: "N/A", cost: "~$0.05 (Basic) — $0.033 (Standard)" },
      { task: "Full social media month (100 images)", tokens: "N/A", cost: "$10 (Basic plan)" },
      { task: "Brand identity project (500 images)", tokens: "N/A", cost: "$30–$60 (Standard or Pro)" },
      { task: "Daily content creator (300 images/month)", tokens: "N/A", cost: "$30 (Standard, using relax mode)" },
    ],
    cheaperAlternatives: ["stable-diffusion", "dalle"],
    verdict: "Midjourney produces the highest-quality artistic images of any AI tool. Standard at $30/mo is the sweet spot — unlimited relax mode images plus 15 hours of fast GPU time.",
    bestFor: "Artists, designers, content creators, marketing teams, concept art",
    pricingUrl: "https://midjourney.com/account",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Does Midjourney have a free trial?", a: "Midjourney removed its free trial in 2023. You must subscribe starting at $10/month. Some Discord servers offer shared access, but this violates Midjourney's terms of service." },
      { q: "What's the difference between fast and relax mode?", a: "Fast mode uses priority GPU time (limited by plan). Relax mode is unlimited but slower (typically 0–10 minute waits). Standard and above plans include unlimited relax mode." },
      { q: "Does Midjourney give commercial rights?", a: "Yes — all paid plans include commercial usage rights. Free trials do NOT include commercial rights." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // DALL-E 3 / OpenAI Images
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "dalle",
    name: "DALL-E 3",
    provider: "OpenAI",
    category: "Image",
    tagline: "Best for text-accurate image generation",
    description: "DALL-E 3 pricing for 2026 — included in ChatGPT Plus, and API pricing per image. Compare cost per image vs Midjourney, Stable Diffusion, and Flux.",
    freeTier: true,
    freeTierNote: "Limited image generation included in ChatGPT free tier",
    subscriptionTiers: [
      { name: "ChatGPT Free", price: "Free", features: ["Limited DALL-E 3 images/day", "Through ChatGPT interface only"] },
      { name: "ChatGPT Plus", price: "$20/mo", features: ["50 DALL-E 3 images/day", "Higher resolution", "Inpainting & editing"] },
    ],
    apiPricing: [
      { modelName: "DALL-E 3 Standard 1024×1024", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.040 per image" },
      { modelName: "DALL-E 3 HD 1024×1024", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.080 per image" },
      { modelName: "DALL-E 3 Standard 1024×1792", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.080 per image" },
      { modelName: "DALL-E 3 HD 1024×1792", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.120 per image" },
    ],
    realWorldCosts: [
      { task: "Single standard image (API)", tokens: "N/A", cost: "$0.040" },
      { task: "100 product images (API)", tokens: "N/A", cost: "$4.00 (Standard) — $8.00 (HD)" },
      { task: "Social media month via ChatGPT Plus", tokens: "N/A", cost: "$20/mo for 1,500 images/month" },
    ],
    cheaperAlternatives: ["stable-diffusion", "midjourney"],
    verdict: "DALL-E 3 excels at text-in-images and following complex instructions precisely. At $0.04/image via API it's affordable for product photography and marketing. For artistic quality, Midjourney leads.",
    bestFor: "Text-in-image, product mockups, marketing assets, ChatGPT users",
    pricingUrl: "https://openai.com/pricing#image-models",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "How much does DALL-E 3 cost per image?", a: "DALL-E 3 costs $0.040 per standard image and $0.080 per HD image via the API. Through ChatGPT Plus ($20/mo) you get up to 50 images per day." },
      { q: "Is DALL-E 3 better than Midjourney?", a: "DALL-E 3 is better at following complex text prompts and generating text within images. Midjourney produces superior artistic quality and photorealism for most use cases." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ElevenLabs
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    provider: "ElevenLabs",
    category: "Audio",
    tagline: "The best AI voice cloning platform",
    description: "ElevenLabs pricing for 2026 — Free, Starter ($5/mo), Creator ($22/mo), Pro ($99/mo), and API pricing per character. The most realistic AI voice generation available.",
    freeTier: true,
    freeTierNote: "10,000 characters/month (~10 minutes of audio), 3 custom voices",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["10,000 characters/month", "3 custom voices", "All pre-made voices", "44kHz audio"] },
      { name: "Starter", price: "$5/mo", features: ["30,000 characters/month", "10 custom voices", "Commercial license", "API access"] },
      { name: "Creator", price: "$22/mo", features: ["100,000 characters/month", "30 custom voices", "Professional cloning", "Dubbing studio"] },
      { name: "Pro", price: "$99/mo", features: ["500,000 characters/month", "160 custom voices", "Highest quality audio", "Priority processing"] },
      { name: "Scale", price: "$330/mo", features: ["2,000,000 characters/month", "660 custom voices", "Enterprise SLAs"] },
    ],
    apiPricing: [
      { modelName: "Eleven Multilingual v2", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.30 per 1,000 characters (~$0.0003/char)" },
      { modelName: "Eleven Turbo v2", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.18 per 1,000 characters — fastest model" },
      { modelName: "Eleven Flash v2", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "$0.08 per 1,000 characters — cheapest" },
    ],
    realWorldCosts: [
      { task: "1-minute podcast narration (~1,000 chars)", tokens: "~1,000 chars", cost: "$0.30 (Multilingual) — $0.08 (Flash)" },
      { task: "10-minute audiobook chapter (~10,000 chars)", tokens: "~10,000 chars", cost: "$3.00 (Multilingual) — $0.80 (Flash)" },
      { task: "Full audiobook (100,000 chars)", tokens: "100,000 chars", cost: "$30.00 (Multilingual) — $22 (Creator plan)" },
      { task: "YouTube video narration (5 min, daily)", tokens: "~150,000 chars/month", cost: "$45/mo (API) vs $22/mo (Creator plan)" },
    ],
    cheaperAlternatives: ["openai-tts", "murf"],
    verdict: "ElevenLabs is the gold standard for realistic AI voice. Creator at $22/mo is the best value for content creators. The Flash model via API is cheapest for high-volume applications.",
    bestFor: "Podcast narration, audiobooks, YouTube creators, voice cloning, dubbing",
    pricingUrl: "https://elevenlabs.io/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is ElevenLabs free?", a: "Yes — ElevenLabs has a free plan with 10,000 characters/month (roughly 10 minutes of audio). This is enough for testing but not for regular content creation." },
      { q: "How much does ElevenLabs cost per minute of audio?", a: "At the Multilingual v2 rate, 1 minute of narration (roughly 900 characters) costs approximately $0.27 via API. The Flash model reduces this to $0.07 per minute." },
      { q: "Can I clone my own voice with ElevenLabs?", a: "Yes — Starter plan ($5/mo) and above include voice cloning. Professional Voice Cloning (best quality) requires the Creator plan ($22/mo) or above." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Perplexity
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "perplexity",
    name: "Perplexity",
    provider: "Perplexity AI",
    category: "Search",
    tagline: "AI search engine with cited sources",
    description: "Perplexity AI pricing for 2026 — free tier vs Pro ($20/mo). Compare Perplexity's search features, model access, and API pricing vs ChatGPT and Gemini.",
    freeTier: true,
    freeTierNote: "Unlimited standard searches, 5 Pro searches/day",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["Unlimited standard searches", "5 Pro searches/day (GPT-4o, Claude Sonnet)", "Focus modes", "File uploads (3/day)"] },
      { name: "Pro", price: "$20/mo", features: ["600+ Pro AI searches/day", "GPT-4o, Claude Opus 4, Gemini 2.5 Pro", "Unlimited file uploads", "Spaces (team research)", "API access ($5 credit/month)"] },
    ],
    apiPricing: [
      { modelName: "Sonar (online, small)", inputPer1M: 1.00, outputPer1M: 1.00, contextWindow: "127K tokens", notes: "$5 per 1,000 searches for web-grounded queries" },
      { modelName: "Sonar (online, large)", inputPer1M: 1.00, outputPer1M: 5.00, contextWindow: "127K tokens", notes: "Best quality web search" },
      { modelName: "Sonar Reasoning", inputPer1M: 1.00, outputPer1M: 5.00, contextWindow: "127K tokens", notes: "Adds reasoning step before answer" },
    ],
    realWorldCosts: [
      { task: "Market research session (20 searches)", tokens: "N/A", cost: "Free (within daily limit)" },
      { task: "Deep research project (200 searches)", tokens: "N/A", cost: "$20/mo Pro (unlimited deep research)" },
      { task: "API: 1,000 web-grounded searches", tokens: "N/A", cost: "$5.00 (Sonar small)" },
    ],
    cheaperAlternatives: [],
    verdict: "Perplexity Pro at $20/mo is excellent for researchers and knowledge workers who need cited, real-time web answers. The free tier is generous for casual use.",
    bestFor: "Research, fact-checking, real-time information, academic work",
    pricingUrl: "https://perplexity.ai/pro",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Perplexity free?", a: "Yes — Perplexity is free with unlimited standard searches and 5 Pro searches/day (which use frontier models like GPT-4o). No credit card required." },
      { q: "Is Perplexity Pro worth $20/month?", a: "For researchers and knowledge workers, yes. You get 600+ Pro searches/day with access to Claude Opus 4 and Gemini 2.5 Pro, plus $5/month in API credits." },
      { q: "How is Perplexity different from ChatGPT?", a: "Perplexity cites its sources and always searches the web. ChatGPT can search the web but doesn't always do so by default. Perplexity is better for real-time research; ChatGPT is better for creative and coding tasks." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AWS Bedrock
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "aws-bedrock",
    name: "AWS Bedrock",
    provider: "Amazon Web Services",
    category: "Cloud",
    tagline: "Run any AI model inside your AWS account",
    description: "AWS Bedrock pricing for 2026 — on-demand token pricing for Claude, Llama, Mistral, and Amazon Titan models. No upfront costs, pay-per-token.",
    freeTier: true,
    freeTierNote: "AWS Free Tier includes limited Bedrock usage for new accounts",
    subscriptionTiers: [],
    apiPricing: [
      { modelName: "Claude Sonnet 4.6 (via Bedrock)", inputPer1M: 3.00, outputPer1M: 15.00, contextWindow: "200K tokens", notes: "Same as direct Anthropic API pricing" },
      { modelName: "Claude Haiku 4.5 (via Bedrock)", inputPer1M: 0.80, outputPer1M: 4.00, contextWindow: "200K tokens", notes: "Cheapest Claude on Bedrock" },
      { modelName: "Llama 3.3 70B (via Bedrock)", inputPer1M: 0.72, outputPer1M: 0.72, contextWindow: "128K tokens", notes: "Cost-effective open model" },
      { modelName: "Mistral Large 2 (via Bedrock)", inputPer1M: 2.00, outputPer1M: 6.00, contextWindow: "128K tokens", notes: "European model on AWS infrastructure" },
      { modelName: "Amazon Nova Pro", inputPer1M: 0.80, outputPer1M: 3.20, contextWindow: "300K tokens", notes: "Amazon's own frontier model" },
      { modelName: "Amazon Nova Lite", inputPer1M: 0.06, outputPer1M: 0.24, contextWindow: "300K tokens", notes: "Cheapest capable model on Bedrock" },
    ],
    realWorldCosts: [
      { task: "Write a 1,000-word blog post (Nova Lite)", tokens: "~2,500 tokens", cost: "$0.0002" },
      { task: "Enterprise document processing (1M docs)", tokens: "~500 tokens each", cost: "$30 (Nova Lite) — $400 (Claude Haiku)" },
      { task: "Customer support chatbot (1M messages/mo)", tokens: "~300 tokens each", cost: "$18 (Nova Lite) — $240 (Claude Haiku)" },
    ],
    cheaperAlternatives: ["gemini", "deepseek"],
    verdict: "AWS Bedrock is the best choice for enterprises already on AWS who need model flexibility, data residency, and compliance (SOC 2, HIPAA, FedRAMP). Amazon Nova Lite is one of the cheapest capable models available.",
    bestFor: "Enterprises on AWS, regulated industries (healthcare, finance), multi-model applications",
    pricingUrl: "https://aws.amazon.com/bedrock/pricing/",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Does AWS Bedrock support Claude?", a: "Yes — AWS Bedrock provides access to all Claude models (Opus 4, Sonnet 4.6, Haiku 4.5) at the same pricing as Anthropic's direct API, but within your AWS account for compliance and data control." },
      { q: "Is AWS Bedrock HIPAA compliant?", a: "Yes — AWS Bedrock is HIPAA eligible. AWS can sign a BAA (Business Associate Agreement) for healthcare applications." },
      { q: "What is Amazon Nova?", a: "Amazon Nova is AWS's own family of AI models. Nova Lite costs $0.06/$0.24 per 1M tokens — making it one of the cheapest capable models available, cheaper than Gemini 1.5 Flash-8B." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Suno
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "suno",
    name: "Suno",
    provider: "Suno AI",
    category: "Audio",
    tagline: "Create full songs with AI in seconds",
    description: "Suno pricing for 2026 — Free (50 credits/day), Pro ($8/mo), Premier ($24/mo). Generate complete songs with lyrics, melody, and production.",
    freeTier: true,
    freeTierNote: "50 credits/day (~10 songs), non-commercial use only",
    subscriptionTiers: [
      { name: "Free", price: "Free", features: ["50 credits/day (~10 songs)", "Non-commercial use only", "Shared GPU queue"] },
      { name: "Pro", price: "$8/mo", features: ["2,500 credits/month (~500 songs)", "Commercial rights", "Priority generation", "10 concurrent jobs"] },
      { name: "Premier", price: "$24/mo", features: ["10,000 credits/month (~2,000 songs)", "Commercial rights", "Highest priority", "Unlimited concurrent jobs"] },
    ],
    apiPricing: [],
    realWorldCosts: [
      { task: "Single song (2–3 minutes)", tokens: "~10 credits", cost: "Free (daily) or $0.003 (Pro)" },
      { task: "Album (12 songs)", tokens: "~120 credits", cost: "$0.04 (Pro)" },
      { task: "Podcast intro/outro pack (20 jingles)", tokens: "~200 credits", cost: "$0.06 (Pro)" },
    ],
    cheaperAlternatives: ["udio"],
    verdict: "Suno Pro at $8/mo is extraordinary value — 500 songs/month with commercial rights. The best AI music tool for content creators who need background music, jingles, and full tracks.",
    bestFor: "Content creators, YouTubers, podcast producers, game developers, marketing",
    pricingUrl: "https://suno.com/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "Is Suno free?", a: "Yes — Suno's free plan gives 50 credits/day (roughly 10 songs). The free tier is non-commercial, so you can't use the music in monetised content without upgrading." },
      { q: "Does Suno give commercial rights?", a: "Commercial rights start with the Pro plan at $8/month. The free tier is for personal and non-commercial use only." },
      { q: "How long does Suno take to generate a song?", a: "Suno generates a 2–3 minute song in 10–30 seconds on the Pro plan (priority queue). Free users may wait 1–5 minutes during peak times." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // Runway Gen-3
  // ═══════════════════════════════════════════════════════════════
  {
    slug: "runway",
    name: "Runway Gen-3",
    provider: "Runway",
    category: "Video",
    tagline: "Hollywood-grade AI video generation",
    description: "Runway Gen-3 Alpha pricing for 2026 — Basic (free), Standard ($15/mo), Pro ($35/mo), Unlimited ($95/mo). Credits per second of video generated.",
    freeTier: true,
    freeTierNote: "125 one-time credits (~25 seconds of video at standard quality)",
    subscriptionTiers: [
      { name: "Basic", price: "Free", features: ["125 one-time credits", "720p resolution", "Watermarked videos"] },
      { name: "Standard", price: "$15/mo", features: ["625 credits/month (~125s video)", "1080p resolution", "No watermark", "5s–10s clips"] },
      { name: "Pro", price: "$35/mo", features: ["2,250 credits/month (~450s video)", "4K upscale", "Advanced camera controls", "Priority generation"] },
      { name: "Unlimited", price: "$95/mo", features: ["2,250 fast credits + unlimited relaxed", "All Pro features", "Custom AI training"] },
    ],
    apiPricing: [
      { modelName: "Gen-3 Alpha (5s)", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "~50 credits per 5-second clip = ~$0.50 at standard rate" },
      { modelName: "Gen-3 Alpha Turbo (5s)", inputPer1M: null, outputPer1M: null, contextWindow: "N/A", notes: "~25 credits per 5-second clip — faster but slightly lower quality" },
    ],
    realWorldCosts: [
      { task: "5-second video clip (Gen-3 Alpha)", tokens: "50 credits", cost: "$0.48 (Pro plan rate)" },
      { task: "30-second short film", tokens: "300 credits", cost: "$2.88 (Pro) — $7.20 (Standard)" },
      { task: "YouTube intro (15 seconds)", tokens: "150 credits", cost: "$1.44 (Pro)" },
      { task: "Monthly social content (5 clips/day)", tokens: "~7,500 credits", cost: "$95/mo (Unlimited)" },
    ],
    cheaperAlternatives: ["pika", "sora"],
    verdict: "Runway Pro at $35/mo is the best value for serious video creators. The Unlimited plan at $95/mo suits daily content creators. Sora has higher ceiling quality but is more expensive per second.",
    bestFor: "Filmmakers, YouTubers, advertising agencies, social media content",
    pricingUrl: "https://runwayml.com/pricing",
    lastUpdated: LAST_UPDATED,
    faqs: [
      { q: "How much does Runway cost per video?", a: "A 5-second Gen-3 Alpha clip uses roughly 50 credits. On the Pro plan ($35/mo), you get 2,250 credits — that's ~45 five-second clips, or about 3.75 minutes of video per month." },
      { q: "Is Runway free?", a: "Runway has a Basic plan with 125 one-time starter credits (about 25 seconds of video at standard quality). After that you need a paid plan." },
      { q: "Is Runway better than Sora?", a: "Runway Gen-3 Alpha is more affordable and accessible. Sora (via ChatGPT Pro at $200/mo) produces higher-quality video especially for longer clips. Runway is the better choice for most creators." },
    ],
  },

];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPricingPage(slug: string): PricingPage | undefined {
  return pricingPages.find((p) => p.slug === slug);
}

export function getPricingSlugs(): string[] {
  return pricingPages.map((p) => p.slug);
}

export const PRICING_CATEGORIES = [
  { label: "LLMs",          emoji: "🤖", slugs: ["chatgpt", "claude", "gemini", "deepseek", "mistral"] },
  { label: "Coding Tools",  emoji: "💻", slugs: ["github-copilot", "cursor"] },
  { label: "Image AI",      emoji: "🎨", slugs: ["midjourney", "dalle"] },
  { label: "Audio & Voice", emoji: "🔊", slugs: ["elevenlabs", "suno"] },
  { label: "Video AI",      emoji: "🎬", slugs: ["runway"] },
  { label: "Cloud AI",      emoji: "☁️", slugs: ["aws-bedrock"] },
  { label: "AI Search",     emoji: "🔍", slugs: ["perplexity"] },
] as const;
