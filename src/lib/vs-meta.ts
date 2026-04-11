/**
 * VS_META — rich per-tool metadata used by the programmatic VS page generator.
 * Keys match ToolScore.id values in scores.ts.
 */
export interface VsToolMeta {
  pricing: string;
  tagline: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  href?: string;
}

export const VS_META: Record<string, VsToolMeta> = {
  // ── LLMs ──
  "gpt-4o": {
    pricing: "Free · Plus $20/mo · Team $30/user/mo",
    tagline: "Best all-round AI assistant",
    pros: ["Largest plugin & integration ecosystem", "Built-in DALL-E 3 image generation", "Best consumer UX and onboarding"],
    cons: ["API costs higher than rivals at scale", "Writing quality slightly below Claude", "Can be verbose and repetitive"],
    bestFor: "General use, integrations, image generation, non-technical users",
    href: "https://chat.openai.com",
  },
  "claude-opus-4": {
    pricing: "Free tier · Pro $20/mo · API from $3/M tokens",
    tagline: "Best reasoning and writing quality",
    pros: ["Best writing quality and nuance of any AI", "200K context window for long documents", "Most honest about its own limitations"],
    cons: ["No built-in image generation", "Fewer native integrations than ChatGPT", "Free tier more limited"],
    bestFor: "Writing, analysis, long documents, complex reasoning",
    href: "https://claude.ai",
  },
  "gemini-2-5-pro": {
    pricing: "Free · Gemini Advanced $19.99/mo (1M context)",
    tagline: "Best Google Workspace AI assistant",
    pros: ["Deep Google Docs/Sheets/Drive integration", "1M token context window", "Strong multimodal (image + audio) support"],
    cons: ["Less accurate than Claude on reasoning tasks", "Privacy concerns for Google ecosystem use", "Advanced plan required for best model"],
    bestFor: "Google Workspace teams, long-document processing, multimodal tasks",
    href: "https://gemini.google.com",
  },
  "deepseek-v3": {
    pricing: "API: $0.27/M input tokens · $1.10/M output tokens",
    tagline: "Best value LLM — exceptional performance per dollar",
    pros: ["10× cheaper than GPT-4o at API level", "Strong coding and math performance", "Open-weights version available"],
    cons: ["Data sovereignty concerns for sensitive data", "Reliability lower than US-based providers", "Interface less polished than ChatGPT"],
    bestFor: "High-volume API use, cost-sensitive applications, coding tasks",
    href: "https://www.deepseek.com",
  },
  "mistral-large": {
    pricing: "API: €0.003/1K tokens · La Plateforme subscription",
    tagline: "Best European GDPR-compliant LLM",
    pros: ["EU-based — strong GDPR compliance", "Competitive performance vs GPT-4", "Available self-hosted via open weights"],
    cons: ["Smaller ecosystem than OpenAI/Google", "Fewer enterprise features", "Weaker on non-European languages"],
    bestFor: "European companies, GDPR-sensitive use cases, multilingual tasks",
    href: "https://mistral.ai",
  },
  "llama-3-1-405b": {
    pricing: "Free (self-hosted) · Cloud inference from $0.003/1K tokens",
    tagline: "Best open-source LLM — free to run",
    pros: ["Fully open-source weights — self-host for free", "No data sent to third parties", "Competitive with GPT-4 class models"],
    cons: ["Requires GPU infrastructure to run", "No official support or SLA", "Harder to set up than hosted solutions"],
    bestFor: "Privacy-first deployments, open-source enthusiasts, budget-conscious teams with infrastructure",
    href: "https://llama.meta.com",
  },
  "claude-sonnet-4-6": {
    pricing: "API: $3/M input · $15/M output · Pro $20/mo",
    tagline: "Best price-performance LLM in 2026",
    pros: ["Outperforms GPT-4o at significantly lower API cost", "Excellent coding and agentic task performance", "Fast response times for production use"],
    cons: ["Less brand recognition than GPT-4o for end-users", "Fewer third-party integrations vs ChatGPT", "Pro plan still required for consumer access"],
    bestFor: "API-first products, coding assistants, cost-optimised production applications",
    href: "https://claude.ai",
  },
  "gemini-2-5-flash": {
    pricing: "API: $0.075/M input · $0.30/M output (ultra-cheap)",
    tagline: "Best value LLM — ultra-fast and cheap",
    pros: ["Cheapest capable LLM available", "Sub-second latency for real-time apps", "Strong at structured extraction and classification"],
    cons: ["Lower reasoning quality than Gemini Pro", "Less suited for complex multi-step tasks", "Google dependency for infrastructure"],
    bestFor: "High-volume classification, chatbots, real-time applications, cost optimisation",
    href: "https://ai.google.dev",
  },
  "gpt-4-1-mini": {
    pricing: "API: $0.40/M input · $1.60/M output",
    tagline: "Best budget OpenAI model",
    pros: ["Near GPT-4o quality at fraction of the API cost", "Fastest OpenAI model for production", "Full OpenAI ecosystem compatibility"],
    cons: ["Lower reasoning ceiling than GPT-4o or o1", "Still more expensive than Gemini Flash", "Not suitable for advanced reasoning tasks"],
    bestFor: "Bulk API use, chatbots, content generation at scale, OpenAI ecosystem teams",
    href: "https://platform.openai.com",
  },
  "gpt-4-1": {
    pricing: "API: $2/M input · $8/M output · Plus $20/mo",
    tagline: "OpenAI's best coding model",
    pros: ["Best coding performance in the GPT family", "Strong instruction following for agentic use", "Full OpenAI tool ecosystem"],
    cons: ["More expensive than Claude Sonnet at API level", "Less creative than Claude for writing tasks", "Context window smaller than Gemini Pro"],
    bestFor: "Software development, agentic workflows, enterprise OpenAI integrations",
    href: "https://platform.openai.com",
  },
  "mistral-large-2": {
    pricing: "API: €0.002/1K tokens · La Plateforme plans",
    tagline: "Best European sovereign AI for enterprises",
    pros: ["EU-hosted — full GDPR and AI Act compliance", "Strong multilingual capabilities (32+ languages)", "Better coding than Mistral Large 1"],
    cons: ["Smaller model ecosystem than OpenAI", "Limited third-party integrations", "Lags GPT-4o on complex reasoning"],
    bestFor: "European enterprises, multilingual applications, GDPR-compliant AI deployments",
    href: "https://mistral.ai",
  },
  "grok-3": {
    pricing: "Included in X Premium+ $16/mo · API via xAI",
    tagline: "Best real-time AI with live X/Twitter data",
    pros: ["Real-time access to X/Twitter and web data", "Strong reasoning with DeepSearch mode", "Unfiltered and direct responses"],
    cons: ["Requires X Premium+ subscription for consumer access", "Smaller ecosystem than OpenAI or Google", "Less consistent than Claude on long-form tasks"],
    bestFor: "Real-time information, social media monitoring, uncensored research",
    href: "https://x.ai",
  },
  "o1": {
    pricing: "API: $15/M input · $60/M output · Pro plan",
    tagline: "Best AI for hard reasoning and math",
    pros: ["Best multi-step mathematical reasoning available", "Excels at PhD-level problem solving", "Think-before-answer approach reduces errors"],
    cons: ["Much slower than standard GPT models", "Very expensive for routine use", "Not suitable for conversational or creative tasks"],
    bestFor: "Complex math, scientific reasoning, hard coding challenges, research problems",
    href: "https://platform.openai.com",
  },
  "o3-mini": {
    pricing: "API: $1.10/M input · $4.40/M output",
    tagline: "Affordable reasoning model for coding",
    pros: ["o1-level reasoning at much lower cost", "Fast enough for production coding use", "Strong software engineering benchmark scores"],
    cons: ["Less capable than o1 on hardest tasks", "Limited context vs other OpenAI models", "Not ideal for creative or conversational use"],
    bestFor: "Production coding, automated testing, cost-effective reasoning tasks",
    href: "https://platform.openai.com",
  },
  "command-r-plus": {
    pricing: "API: $3/M input · $15/M output · Cohere platform",
    tagline: "Best enterprise RAG model",
    pros: ["Purpose-built for retrieval augmented generation (RAG)", "Strong at grounded, citation-based answers", "Enterprise SLAs and data privacy options"],
    cons: ["Not as versatile as GPT-4o for general tasks", "Smaller developer community", "Less creative than Claude for writing"],
    bestFor: "Enterprise RAG, document Q&A, citation-heavy research tools",
    href: "https://cohere.com",
  },
  "phi-4": {
    pricing: "Free (open-source) · Azure AI: standard compute pricing",
    tagline: "Best small model for on-device AI",
    pros: ["Runs on consumer hardware (14B params)", "Impressive quality for its tiny size", "Microsoft backing with Azure integration"],
    cons: ["Much lower quality ceiling than large models", "Not suitable for complex reasoning", "Limited ecosystem vs GPT family"],
    bestFor: "Edge deployment, on-device AI, privacy-first small-scale applications",
    href: "https://azure.microsoft.com/en-us/products/phi",
  },
  "qwen-2-5": {
    pricing: "API via Alibaba Cloud · Open-weights free",
    tagline: "Best multilingual open model from China",
    pros: ["Excellent Chinese and Asian language support", "Open-weights — self-host for free", "Strong coding benchmarks for its size"],
    cons: ["Data governance concerns for Western enterprises", "Less English writing quality than Claude/GPT", "Smaller Western ecosystem and tooling"],
    bestFor: "Asian language tasks, multilingual apps, cost-sensitive developers outside enterprise",
    href: "https://qwenlm.github.io",
  },
  "llama-3-3-70b": {
    pricing: "Free (self-hosted) · Cloud inference ~$0.001/1K tokens",
    tagline: "Best open-source model for local deployment",
    pros: ["Runs efficiently on a single A100 GPU", "Near GPT-4o quality at no API cost", "Huge community and fine-tuning ecosystem"],
    cons: ["Still requires GPU to run at useful speed", "Weaker than 405B on hardest tasks", "Setup complexity vs hosted solutions"],
    bestFor: "Teams with GPU infrastructure, privacy-critical deployments, open-source stacks",
    href: "https://llama.meta.com",
  },

  // ── Coding Tools ──
  "github-copilot": {
    pricing: "Individual $10/mo · Business $19/user/mo",
    tagline: "Best IDE-integrated coding assistant",
    pros: ["Native VS Code, JetBrains, Neovim integration", "GitHub context awareness for PRs and issues", "Most widely adopted — largest community resources"],
    cons: ["Less capable than Cursor for full codebase tasks", "No standalone editor — requires existing IDE", "Some completions are off for newer frameworks"],
    bestFor: "Developers in existing IDE setups, GitHub-native teams, beginner-friendly AI coding",
    href: "https://github.com/features/copilot",
  },
  "cursor": {
    pricing: "Free (limited) · Pro $20/mo · Business $40/user/mo",
    tagline: "Best AI-native code editor",
    pros: ["Full codebase context for multi-file changes", "Composer for large-scale refactors", "Best-in-class autocomplete + chat in one editor"],
    cons: ["Monthly subscription on top of model costs", "VS Code fork — some extensions incompatible", "Steeper learning curve than Copilot"],
    bestFor: "Professional developers doing complex refactors, AI-first workflows",
    href: "https://cursor.com",
  },
  "claude-code": {
    pricing: "Pro $20/mo + API usage · Max $100/mo unlimited",
    tagline: "Best terminal AI for engineering tasks",
    pros: ["Full codebase understanding via file system access", "Best for large refactors and multi-file changes", "Agentic — runs terminal commands autonomously"],
    cons: ["CLI-first — no visual editor", "API costs can escalate on large repos", "Requires Claude Pro subscription"],
    bestFor: "Senior engineers, complex refactors, CI/CD automation, agentic coding workflows",
    href: "https://claude.ai/code",
  },
  "windsurf": {
    pricing: "Free (limited) · Pro $15/mo · Teams $35/user/mo",
    tagline: "Best value AI code editor",
    pros: ["Lower price than Cursor Pro", "Built-in Cascade agentic mode", "Clean interface with strong autocomplete"],
    cons: ["Smaller ecosystem than Cursor", "Less mature than Cursor for complex tasks", "Fewer advanced features than Claude Code for agentic use"],
    bestFor: "Budget-conscious devs, Cursor alternative seekers, mid-complexity coding tasks",
    href: "https://codeium.com/windsurf",
  },
  "tabnine": {
    pricing: "Free · Pro $12/mo · Enterprise custom",
    tagline: "Best privacy-first code completion",
    pros: ["On-premise deployment option — full data privacy", "Works without sending code to cloud", "Strong IDE compatibility across all major editors"],
    cons: ["Weaker on complex agentic tasks vs Cursor/Copilot", "Less context-aware than modern AI editors", "No chat interface on free tier"],
    bestFor: "Enterprise teams with data privacy requirements, on-prem deployments",
    href: "https://tabnine.com",
  },
  "replit": {
    pricing: "Free · Core $25/mo · Teams $40/user/mo",
    tagline: "Best AI coding environment for beginners",
    pros: ["Full cloud IDE + deployment in one platform", "Ghostwriter AI integrated throughout", "Best for rapid prototyping and sharing"],
    cons: ["Less powerful than Cursor for complex projects", "Performance limited vs local IDE", "Monthly cost high vs dedicated AI coding tools"],
    bestFor: "Beginners, rapid prototyping, educational use, cloud-first development",
    href: "https://replit.com",
  },
  "codeium": {
    pricing: "Free (unlimited) · Teams $12/user/mo",
    tagline: "Best free code completion tool",
    pros: ["Completely free for individual developers", "Strong across 70+ programming languages", "Fast and low-latency completions"],
    cons: ["Less powerful chat than Cursor or Copilot", "Fewer enterprise features than GitHub Copilot Business", "Smaller community than Copilot"],
    bestFor: "Individual devs wanting free AI coding, teams with tight budgets",
    href: "https://codeium.com",
  },

  // ── Image Generation ──
  "midjourney": {
    pricing: "Basic $10/mo · Standard $30/mo · Pro $60/mo",
    tagline: "Best creative image quality available",
    pros: ["Unmatched artistic quality and creative range", "Huge style and prompt community", "Consistent high-quality output across styles"],
    cons: ["Discord-only interface (no standalone web app)", "Training data copyright uncertainty", "No free tier"],
    bestFor: "Creative professionals, marketing visuals, concept art, artistic content",
    href: "https://midjourney.com",
  },
  "dall-e-3": {
    pricing: "Included in ChatGPT Plus $20/mo · API: $0.04/image",
    tagline: "Most accessible AI image generator",
    pros: ["Included with ChatGPT Plus — no extra cost", "Best prompt adherence of any consumer generator", "Safe and family-friendly by default"],
    cons: ["Less artistic range than Midjourney", "Slower than Stable Diffusion local", "Less control over style vs Midjourney"],
    bestFor: "ChatGPT Plus users, business-safe illustrations, prompt-accurate images",
    href: "https://openai.com/dall-e-3",
  },
  "stable-diffusion": {
    pricing: "Free (self-hosted) · DreamStudio API credits",
    tagline: "Best open-source image generator",
    pros: ["Completely free to run locally", "Unlimited generation — no restrictions", "Massive model and LoRA ecosystem"],
    cons: ["Requires GPU for fast generation", "Complex setup vs hosted solutions", "Requires prompt engineering knowledge"],
    bestFor: "Developers, researchers, power users, privacy-first generation",
    href: "https://stability.ai",
  },
  "ideogram": {
    pricing: "Free (25 credits/mo) · Basic $8/mo · Plus $20/mo",
    tagline: "Best AI image generator for text in images",
    pros: ["Best-in-class text rendering inside images", "Strong for typography, logos, and branded content", "Affordable pricing tiers"],
    cons: ["Less artistic range than Midjourney", "Weaker for photorealism vs DALL-E 3", "Smaller community than Midjourney"],
    bestFor: "Marketers needing text in images, logo concepts, branded content creation",
    href: "https://ideogram.ai",
  },
  "adobe-firefly": {
    pricing: "Free (25 credits/mo) · Included in Creative Cloud",
    tagline: "Best commercially safe AI image generator",
    pros: ["Trained on licensed stock — zero copyright risk", "Native Photoshop, Illustrator, Express integration", "Adobe IP indemnity for generated content"],
    cons: ["Less creative range than Midjourney", "Quality ceiling lower for photorealism", "Slow credit replenishment on free tier"],
    bestFor: "Brands, agencies, anyone requiring commercial copyright safety",
    href: "https://firefly.adobe.com",
  },
  "flux-1-1-pro": {
    pricing: "Via Replicate from $0.003/image · Free if self-hosted",
    tagline: "Best new open-source image model",
    pros: ["Near-Midjourney photorealism quality", "Open-source weights — self-host for free", "API access via Replicate, fal.ai, Together AI"],
    cons: ["No native web UI — requires third-party platform", "Less community resources than Midjourney", "Quality varies by hosting platform"],
    bestFor: "Developers wanting API access, open-source workflows, photorealistic image generation",
    href: "https://replicate.com/black-forest-labs/flux-1.1-pro",
  },
  "leonardo-ai": {
    pricing: "Free (150 credits/day) · Apprentice $12/mo · Artisan $30/mo",
    tagline: "Best AI image platform for game assets",
    pros: ["Purpose-built for game assets and concept art", "Strong character consistency via Character Reference", "Large asset and model library"],
    cons: ["Less versatile for photography and realism", "Credit system limits high-volume generation", "Weaker than Midjourney for marketing visuals"],
    bestFor: "Game developers, concept artists, character design, fantasy/sci-fi content",
    href: "https://leonardo.ai",
  },
  "playground-ai": {
    pricing: "Free (500 images/day) · Pro $15/mo",
    tagline: "Best free AI image generator",
    pros: ["Most generous free tier — 500 images/day", "Web-based — no setup required", "Good for photorealistic and artistic styles"],
    cons: ["Lower quality ceiling than Midjourney Pro", "Watermarks on free plan", "Fewer style controls than advanced tools"],
    bestFor: "Individuals wanting high free limits, casual creators, social media content",
    href: "https://playground.com",
  },

  // ── Audio / Voice ──
  "elevenlabs": {
    pricing: "Free (10K chars/mo) · Starter $5/mo · Creator $22/mo",
    tagline: "Best voice cloning and TTS quality",
    pros: ["Most realistic voice cloning available", "29 languages with native-quality output", "Voice design and sound effects generation"],
    cons: ["Expensive for high-volume use", "Ethical concerns around voice cloning misuse", "Lower-tier plans have usage limits"],
    bestFor: "Audiobooks, podcasting, content localisation, professional voiceover",
    href: "https://elevenlabs.io",
  },
  "openai-tts": {
    pricing: "API: $15/M characters (TTS-1) · $30/M (TTS-1-HD)",
    tagline: "Best value TTS for scale",
    pros: ["Fast generation — suitable for real-time apps", "6 built-in high-quality voices", "Simple API with OpenAI ecosystem compatibility"],
    cons: ["No voice cloning", "Limited voice customisation", "Fewer languages than ElevenLabs"],
    bestFor: "Developers building voice apps, chatbot voice output, high-volume TTS at scale",
    href: "https://platform.openai.com/docs/guides/text-to-speech",
  },
  "murf": {
    pricing: "Free (10 min/mo) · Basic $19/mo · Pro $26/mo",
    tagline: "Best business-focused TTS studio",
    pros: ["120+ voices across 20+ languages", "Built-in video + voiceover editor", "Collaborative team workspace"],
    cons: ["More expensive than ElevenLabs for similar features", "Less realistic cloning than ElevenLabs", "Desktop-heavy workflow"],
    bestFor: "Business presentations, e-learning, corporate training videos",
    href: "https://murf.ai",
  },
  "playht": {
    pricing: "Free (12,500 chars/mo) · Creator $31.2/mo · Pro $49/mo",
    tagline: "Best voice cloning with API access",
    pros: ["Ultra-realistic 2.0 voice cloning", "Publisher API for real-time text-to-speech", "800+ voices in 140+ languages"],
    cons: ["Higher price than ElevenLabs at comparable tiers", "Less established community", "UI less polished than ElevenLabs"],
    bestFor: "Developers needing real-time TTS API, podcasters, multilingual content creators",
    href: "https://play.ht",
  },
  "speechify": {
    pricing: "Free (listening only) · Premium $139/year",
    tagline: "Best text-to-speech for reading and learning",
    pros: ["Best for consuming long-form content at speed", "Chrome extension for any webpage", "AI-powered summaries alongside audio"],
    cons: ["Primarily a listener tool — not a creator tool", "Expensive annual plan", "Limited voice customisation vs ElevenLabs"],
    bestFor: "Students, busy professionals consuming content, accessibility use cases",
    href: "https://speechify.com",
  },

  // ── Video Generation ──
  "sora": {
    pricing: "Included in ChatGPT Pro $200/mo",
    tagline: "Best cinematic AI video quality",
    pros: ["Best physical realism and subject consistency", "Up to 20-second 1080p clips", "Included in ChatGPT Pro plan"],
    cons: ["Requires $200/mo ChatGPT Pro subscription", "Limited camera and motion controls", "No video-to-video editing"],
    bestFor: "Cinematic narrative videos, high-quality marketing content, ChatGPT Pro subscribers",
    href: "https://sora.com",
  },
  "runway-gen3": {
    pricing: "Standard $15/mo · Pro $35/mo · Unlimited $95/mo",
    tagline: "Industry standard for AI video professionals",
    pros: ["Advanced camera control and motion brush", "Video-to-video editing and style transfer", "Best production workflow ecosystem"],
    cons: ["Quality slightly below Sora on photorealism", "10-second clip limit per generation", "Premium plan required for serious use"],
    bestFor: "Creative agencies, VFX professionals, production teams needing full control",
    href: "https://runwayml.com",
  },
  "pika": {
    pricing: "Free (150 credits) · Basic $8/mo · Standard $28/mo",
    tagline: "Best value AI video for social content",
    pros: ["Most accessible and easiest to use", "Generous free tier", "Great for short social media clips"],
    cons: ["Lower quality than Runway or Sora", "Limited to short clips", "Less professional for commercial production"],
    bestFor: "Social media creators, marketers, anyone starting with AI video",
    href: "https://pika.art",
  },
  "kling": {
    pricing: "Free tier · Standard $8/mo · Pro $28/mo",
    tagline: "Best Chinese AI video model",
    pros: ["Excellent motion quality at competitive price", "Longer clip lengths than most competitors", "Strong at human subject consistency"],
    cons: ["China-based — data governance concerns", "Less community support than Runway", "UI less polished than Western tools"],
    bestFor: "Cost-conscious video creators, longer clip needs, Asia-Pacific teams",
    href: "https://klingai.com",
  },
  "luma-dream-machine": {
    pricing: "Free (30 credits/mo) · Standard $29.99/mo · Pro $99.99/mo",
    tagline: "Best accessible cinematic AI video",
    pros: ["Very realistic motion and physics", "Web-based — no setup required", "Camera control and keyframe support"],
    cons: ["Expensive Pro tier for high volume", "Shorter clips than Sora", "Less style control than Runway"],
    bestFor: "Creative professionals wanting photorealistic video without Sora's $200 barrier",
    href: "https://lumalabs.ai/dream-machine",
  },
  "hailuo": {
    pricing: "Free tier available · Subscription plans",
    tagline: "Best free AI video generator",
    pros: ["Generous free tier for testing", "Good quality at zero cost", "Fast generation speed"],
    cons: ["Data governance concerns (China-based)", "Less control than Runway or Kling", "Limited support and documentation"],
    bestFor: "Budget video creation, testing AI video without cost commitment",
    href: "https://hailuoai.com",
  },

  // ── Cloud AI Platforms ──
  "aws-bedrock": {
    pricing: "Pay-per-token (varies by model) · No base fee",
    tagline: "Best enterprise AI for AWS teams",
    pros: ["Access to 30+ foundation models in one API", "AWS security, compliance, and SLA guarantees", "VPC isolation for sensitive data"],
    cons: ["Complex pricing — hard to estimate costs", "AWS ecosystem lock-in", "Higher setup friction than direct model APIs"],
    bestFor: "AWS-native enterprises, regulated industries, teams needing model flexibility",
    href: "https://aws.amazon.com/bedrock",
  },
  "azure-openai": {
    pricing: "GPT-4o: $5/M input · $15/M output + Azure compute",
    tagline: "Best enterprise platform for OpenAI models",
    pros: ["Enterprise SLAs with GPT-4o and o-series models", "Microsoft 365 and Teams integration", "SOC 2, HIPAA, and FedRAMP compliance"],
    cons: ["More expensive than direct OpenAI API", "Microsoft ecosystem dependency", "Slower model updates vs direct OpenAI"],
    bestFor: "Microsoft/Azure enterprises, regulated industries, M365-integrated AI workflows",
    href: "https://azure.microsoft.com/en-us/products/ai-services/openai-service",
  },
  "vertex-ai": {
    pricing: "Pay-per-use (varies by model) · Google Cloud pricing",
    tagline: "Best enterprise AI for Google Cloud teams",
    pros: ["Native Gemini access with Google Cloud SLAs", "MLOps tools: Model Garden, Pipelines, Feature Store", "Strong for custom model training and deployment"],
    cons: ["Google Cloud dependency", "More complex than direct Gemini API", "Pricing harder to predict than flat subscriptions"],
    bestFor: "Google Cloud teams, custom model training, MLOps-heavy organisations",
    href: "https://cloud.google.com/vertex-ai",
  },

  // ── Search / Research ──
  "perplexity": {
    pricing: "Free (unlimited basic) · Pro $20/mo",
    tagline: "Best AI search with cited answers",
    pros: ["Real-time web search with verified citations", "Pro Search for multi-step deep research", "Academic and news database access on Pro"],
    cons: ["Data used to improve the product", "Pro Search limited on free tier", "Less creative than LLMs for writing tasks"],
    bestFor: "Research, fact-checking, academic work, professional research with sources",
    href: "https://perplexity.ai",
  },
  "youcom": {
    pricing: "Free (unlimited) · Pro $20/mo",
    tagline: "Best privacy-first AI search",
    pros: ["Privacy-first — no user tracking by default", "Free unlimited AI search with citations", "Code mode for developer-focused queries"],
    cons: ["Citation quality below Perplexity Pro", "Academic access less comprehensive", "AI model quality varies across modes"],
    bestFor: "Privacy-conscious users, developers, free Perplexity alternative",
    href: "https://you.com",
  },

  // ── Music Generation ──
  "suno": {
    pricing: "Free (50 credits/day) · Pro $8/mo · Premier $24/mo",
    tagline: "Best AI music generator — full songs with vocals",
    pros: ["Generate complete songs with lyrics and vocals", "Most accessible — no music knowledge needed", "Fast generation — full song in under 30 seconds"],
    cons: ["Limited control over instruments and arrangement", "Commercial rights require paid plan", "Less professional than Udio for fine-tuned control"],
    bestFor: "Content creators, social media, background music, anyone without music training",
    href: "https://suno.com",
  },
  "udio": {
    pricing: "Free (1200 credits/mo) · Standard $10/mo · Pro $30/mo",
    tagline: "Best AI music with professional quality control",
    pros: ["More control over musical style and structure", "Higher audio quality ceiling than Suno", "Inpainting — edit specific sections of a song"],
    cons: ["Steeper learning curve than Suno", "Smaller community and fewer tutorials", "Free tier uses lower quality models"],
    bestFor: "Musicians, producers wanting AI assistance, professional-quality AI music",
    href: "https://udio.com",
  },
};

/**
 * Get meta for a tool, with sensible fallbacks for tools not explicitly listed.
 */
export function getVsMeta(toolId: string, fallback?: { verdict: string; name: string; provider: string }): VsToolMeta {
  if (VS_META[toolId]) return VS_META[toolId];
  return {
    pricing: "See website for current pricing",
    tagline: fallback?.verdict?.split(".")[0] ?? `${fallback?.name ?? "This tool"} AI platform`,
    pros: ["Strong performance on key benchmarks", "Active development and regular updates", "Growing ecosystem and community"],
    cons: ["May have less documentation than larger platforms", "Ecosystem still growing", "Evaluate for your specific use case"],
    bestFor: `${fallback?.provider ?? ""} ecosystem users and teams looking for ${fallback?.name ?? "AI"} capabilities`,
  };
}
