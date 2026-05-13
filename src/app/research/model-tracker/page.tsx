"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "release" | "pricing" | "deprecation" | "api";
type Impact = "high" | "medium" | "low";

type TimelineEvent = {
  date: string;
  type: EventType;
  model: string;
  vendor: string;
  title: string;
  description: string;
  impact: Impact;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENTS: TimelineEvent[] = [
  // ─── 2026 ────────────────────────────────────────────────────────────────
  {
    date: "April 23, 2026",
    type: "release",
    model: "GPT-5.5",
    vendor: "OpenAI",
    title: "GPT-5.5 Released — Newest Flagship",
    description: "OpenAI introduces GPT-5.5 as its latest flagship model, succeeding GPT-5. Continues the iterative cadence on the GPT-5 line with reasoning, coding, and agentic improvements.",
    impact: "high",
  },
  {
    date: "April 16, 2026",
    type: "release",
    model: "Claude Opus 4.7",
    vendor: "Anthropic",
    title: "Claude Opus 4.7 — Generally Available",
    description: "Anthropic ships Opus 4.7 GA with major gains in advanced software engineering and long-running agent workflows. Continues the rapid 4.x cadence following Opus 4.5 (Nov 2025) and Sonnet 4.6 (Feb 2026).",
    impact: "high",
  },
  {
    date: "April 15, 2026",
    type: "release",
    model: "Gemini 3.1 Flash TTS",
    vendor: "Google",
    title: "Gemini 3.1 Flash TTS Released",
    description: "New expressive text-to-speech model in the Gemini 3.1 line. Pairs with Flash Live for full real-time conversational voice pipelines.",
    impact: "medium",
  },
  {
    date: "March 26, 2026",
    type: "release",
    model: "Gemini 3.1 Flash Live",
    vendor: "Google",
    title: "Gemini 3.1 Flash Live Released (Preview)",
    description: "Low-latency voice and conversational model in preview. Google's answer to OpenAI's Realtime API for building voice agents at the multimodal edge.",
    impact: "medium",
  },
  {
    date: "March 3, 2026",
    type: "release",
    model: "Gemini 3.1 Flash-Lite",
    vendor: "Google",
    title: "Gemini 3.1 Flash-Lite Released (Preview)",
    description: "Fastest and most cost-efficient model in the Gemini 3.1 series. Targets high-volume, low-cost workloads where Pro and Flash are overkill.",
    impact: "medium",
  },
  {
    date: "February 17, 2026",
    type: "release",
    model: "Claude Sonnet 4.6",
    vendor: "Anthropic",
    title: "Claude Sonnet 4.6 — 1M-Token Context (Beta)",
    description: "First Sonnet with a 1M-token context window (beta). Major upgrades across coding, long-context reasoning, and agent planning. Brings Sonnet to parity with Gemini and GPT-4.1 on long-context capacity.",
    impact: "high",
  },

  // ─── Late 2025 ───────────────────────────────────────────────────────────
  {
    date: "November 24, 2025",
    type: "release",
    model: "Claude Opus 4.5",
    vendor: "Anthropic",
    title: "Claude Opus 4.5 Released",
    description: "Mid-generation Opus refresh between Claude 4 (May 2025) and the 4.6 line that followed. Iterative improvements to coding, reasoning, and agent reliability.",
    impact: "high",
  },
  {
    date: "November 18, 2025",
    type: "release",
    model: "Gemini 3",
    vendor: "Google",
    title: "Gemini 3 Released — New Generation",
    description: "Google's third-generation Gemini flagship. Ends the 2.5 era and sets the stage for the 3.1 family that followed in early 2026.",
    impact: "high",
  },

  // ─── Mid-2025 ────────────────────────────────────────────────────────────
  {
    date: "August 7, 2025",
    type: "release",
    model: "GPT-5",
    vendor: "OpenAI",
    title: "GPT-5 Released — Next-Gen Flagship",
    description: "OpenAI launches GPT-5, the long-awaited successor to the GPT-4 generation. Replaces the o-series as the primary frontier model in ChatGPT and ushers in a new pricing and capabilities tier.",
    impact: "high",
  },
  {
    date: "June 17, 2025",
    type: "release",
    model: "Gemini 2.5 family",
    vendor: "Google",
    title: "Gemini 2.5 Pro & Flash GA + 2.5 Flash-Lite Preview",
    description: "Google promotes Gemini 2.5 Pro and Flash to general availability and introduces 2.5 Flash-Lite in preview — the cheapest, fastest model in the 2.5 line. Solidifies the 2.5 generation across the full price/performance spectrum.",
    impact: "high",
  },
  {
    date: "June 10, 2025",
    type: "release",
    model: "o3-pro",
    vendor: "OpenAI",
    title: "OpenAI o3-pro Released",
    description: "Longer-thinking, more reliable version of o3 — sits above o3 in compute, latency, and price. Aimed at deep reasoning tasks where accuracy matters more than speed or cost.",
    impact: "high",
  },
  {
    date: "May 22, 2025",
    type: "release",
    model: "Claude Opus 4 & Sonnet 4",
    vendor: "Anthropic",
    title: "Claude 4 Generation Launched",
    description: "Anthropic releases Claude Opus 4 and Sonnet 4. New top-tier coding performance (Opus 4 leads SWE-bench Verified). Hybrid reasoning (instant + extended thinking) and improved tool use. Opus 4 priced at $15/$75 per million tokens; Sonnet 4 at $3/$15.",
    impact: "high",
  },
  {
    date: "May 20, 2025",
    type: "release",
    model: "Gemini 2.5 family",
    vendor: "Google",
    title: "Google I/O — Gemini 2.5 Updates, Deep Think, Veo 3, Imagen 4",
    description: "Google announces Gemini 2.5 Pro and Flash improvements with the new Deep Think reasoning mode. Veo 3 (video) and Imagen 4 (image) also launch. General availability for 2.5 Pro & Flash followed on June 17, 2025.",
    impact: "high",
  },
  {
    date: "April 16, 2025",
    type: "release",
    model: "o3 & o4-mini",
    vendor: "OpenAI",
    title: "OpenAI o3 and o4-mini Released",
    description: "Full o3 launches in ChatGPT (replacing o1) alongside o4-mini, a more affordable reasoning model. Both support tool use during thinking — browsing, code execution, image input — for true agentic reasoning loops.",
    impact: "high",
  },
  {
    date: "April 14, 2025",
    type: "release",
    model: "GPT-4.1 family",
    vendor: "OpenAI",
    title: "GPT-4.1, GPT-4.1 mini & nano Released (API only)",
    description: "OpenAI ships GPT-4.1 family via API with 1M-token context windows. SWE-bench Verified at 54.6%. Replaces GPT-4o on the API for new builds. GPT-4.1 nano is OpenAI's first sub-$0.10/M input model.",
    impact: "high",
  },
  {
    date: "April 5, 2025",
    type: "release",
    model: "Llama 4",
    vendor: "Meta",
    title: "Llama 4 Scout & Maverick Released (Open Weights)",
    description: "Meta launches Llama 4 with MoE architecture and native multimodality. Scout (109B total / 17B active, 10M context) and Maverick (400B total / 17B active). Behemoth (2T) announced as still training. Largest leap in open-weight model design to date.",
    impact: "high",
  },
  {
    date: "March 25, 2025",
    type: "release",
    model: "Gemini 2.5 Pro (Exp)",
    vendor: "Google",
    title: "Gemini 2.5 Pro Experimental Released",
    description: "Google's first 'thinking' model in the Gemini line. Topped most leaderboards at launch (LMArena, AIME, GPQA, SWE-bench). 1M-token context, free in AI Studio during experimental phase.",
    impact: "high",
  },
  {
    date: "March 25, 2025",
    type: "release",
    model: "GPT-4o (image gen)",
    vendor: "OpenAI",
    title: "Native Image Generation in GPT-4o",
    description: "OpenAI replaces DALL-E 3 with native image generation inside GPT-4o for ChatGPT users. Major quality jump in text rendering and instruction following. The viral 'Ghibli-style' wave broke ChatGPT sign-ups records.",
    impact: "high",
  },
  {
    date: "February 27, 2025",
    type: "release",
    model: "GPT-4.5 (Orion)",
    vendor: "OpenAI",
    title: "GPT-4.5 (Orion) Preview Released",
    description: "OpenAI's largest pre-trained model. Conversational, lower-hallucination, but expensive ($75/$150 per million tokens) and not a reasoning model. Marked the end of the pure-scaling generation; deprecated in API shortly after.",
    impact: "high",
  },
  {
    date: "February 24, 2025",
    type: "release",
    model: "Claude 3.7 Sonnet",
    vendor: "Anthropic",
    title: "Claude 3.7 Sonnet — First Hybrid Reasoning Model",
    description: "First model to combine instant and extended-thinking modes in one. Visible chain-of-thought reasoning, 200k context, leading SWE-bench score at launch. Same $3/$15 pricing as Sonnet 3.5.",
    impact: "high",
  },
  {
    date: "February 17, 2025",
    type: "release",
    model: "Grok 3",
    vendor: "xAI",
    title: "Grok 3 Released",
    description: "xAI ships Grok 3 with a 'Think' reasoning mode and DeepSearch. Briefly topped LMArena at launch. Strongest demonstration yet that the Colossus training cluster can produce frontier-class models.",
    impact: "medium",
  },
  {
    date: "February 5, 2025",
    type: "release",
    model: "Gemini 2.0 family",
    vendor: "Google",
    title: "Gemini 2.0 Flash GA, 2.0 Pro Experimental & 2.0 Flash-Lite Preview",
    description: "Google brings Gemini 2.0 Flash to general availability ($0.10/M input, $0.40/M output), ships Gemini 2.0 Pro Experimental — Google's then-most-capable model with 2M-token context — and introduces Flash-Lite in preview as the cheapest tier in the 2.0 line.",
    impact: "high",
  },
  {
    date: "February 2, 2025",
    type: "release",
    model: "Deep Research",
    vendor: "OpenAI",
    title: "Deep Research Released in ChatGPT Pro",
    description: "Multi-step research agent built on the o3 lineage. Browses, synthesizes, and writes long-form reports with citations. First widely-available agentic ChatGPT feature.",
    impact: "high",
  },
  {
    date: "January 31, 2025",
    type: "release",
    model: "o3-mini",
    vendor: "OpenAI",
    title: "o3-mini Released — Reasoning Goes Free",
    description: "Cost-efficient reasoning model with low/medium/high effort levels. First time a reasoning-class OpenAI model was available on the free tier of ChatGPT. Outperforms o1 on math, code, and science at a fraction of the cost.",
    impact: "high",
  },
  {
    date: "January 23, 2025",
    type: "release",
    model: "Operator",
    vendor: "OpenAI",
    title: "Operator (Computer-Use Agent) Released",
    description: "OpenAI's first browser-based agent. Navigates web pages, fills forms, books reservations. Released in research preview for ChatGPT Pro ($200/mo). First mainstream agentic computer-use product.",
    impact: "medium",
  },
  {
    date: "January 21, 2025",
    type: "api",
    model: "Infrastructure",
    vendor: "OpenAI / Oracle / SoftBank",
    title: "Stargate Project Announced — $500B AI Infrastructure",
    description: "Joint venture to invest up to $500B over four years building US AI datacenters. Largest single AI infrastructure commitment to date. Signals continued scaling bet despite efficiency gains from China.",
    impact: "high",
  },
  {
    date: "January 20, 2025",
    type: "release",
    model: "DeepSeek R1",
    vendor: "DeepSeek",
    title: "DeepSeek R1 Released — Open-Weight Reasoning",
    description: "Open-weight reasoning model matching OpenAI o1 at ~$0.55/M input. Triggered a global rethink of training economics — NVIDIA stock dropped ~17% the following week. Most-downloaded model on HuggingFace within days.",
    impact: "high",
  },

  // ─── 2024 ─────────────────────────────────────────────────────────────────
  {
    date: "December 26, 2024",
    type: "release",
    model: "DeepSeek V3",
    vendor: "DeepSeek",
    title: "DeepSeek V3 Released at $0.27/M Input",
    description: "671B-parameter MoE (37B active) trained for ~$5.5M. GPT-4o-class performance at $0.27/M input and $1.10/M output tokens. Catalyst for the early-2025 LLM price war.",
    impact: "high",
  },
  {
    date: "December 20, 2024",
    type: "release",
    model: "o3",
    vendor: "OpenAI",
    title: "OpenAI o3 Announced (Preview)",
    description: "OpenAI previews o3 with a record-breaking 87.5% on ARC-AGI semi-private set. Full model deferred to 2025; early-access program opened to safety researchers.",
    impact: "high",
  },
  {
    date: "December 11, 2024",
    type: "release",
    model: "Gemini 2.0 Flash Experimental",
    vendor: "Google",
    title: "Gemini 2.0 Flash Experimental Released",
    description: "Native multimodal output (text + image + audio), real-time streaming, and built-in tool use. First model in the Gemini 2.0 generation; later went GA in Feb 2025.",
    impact: "high",
  },
  {
    date: "December 9, 2024",
    type: "release",
    model: "Sora",
    vendor: "OpenAI",
    title: "Sora Released to ChatGPT Plus / Pro",
    description: "OpenAI's text-to-video model goes from year-long demo to product. 1080p, up to 20 seconds. Sora Turbo variant for Plus users; full Sora for Pro ($200/mo). Sparked Veo 2 response from Google within a week.",
    impact: "high",
  },
  {
    date: "December 6, 2024",
    type: "release",
    model: "Llama 3.3 70B",
    vendor: "Meta",
    title: "Llama 3.3 70B Released",
    description: "Meta ships Llama 3.3 70B with performance matching the 405B variant from earlier in the year — at a fraction of the inference cost. Demonstrates rapid efficiency gains in open-weight training.",
    impact: "high",
  },
  {
    date: "November 18, 2024",
    type: "release",
    model: "Pixtral Large",
    vendor: "Mistral AI",
    title: "Pixtral Large Released (124B Multimodal)",
    description: "Mistral's frontier multimodal open-weight model. 128k context, native image understanding. Released under Mistral Research License for non-commercial use.",
    impact: "medium",
  },
  {
    date: "November 4, 2024",
    type: "api",
    model: "Claude 3.5 Haiku",
    vendor: "Anthropic",
    title: "Claude 3.5 Haiku Available via API",
    description: "The Claude 3.5 Haiku API release (announced Oct 22). Matches the older Claude 3 Opus on many benchmarks at $0.80/$4 per million tokens. 200k context retained.",
    impact: "medium",
  },
  {
    date: "October 22, 2024",
    type: "release",
    model: "Claude 3.5 Haiku + Sonnet (new) + Computer Use",
    vendor: "Anthropic",
    title: "Claude 3.5 Haiku + Upgraded Sonnet + Computer Use Beta",
    description: "Triple announcement: Anthropic unveils Claude 3.5 Haiku (API release Nov 4), the upgraded Claude 3.5 Sonnet (immediate, with major SWE-bench gains), and the public beta of Computer Use — Claude controlling a desktop via screenshots and mouse/keyboard. First mainstream computer-use API.",
    impact: "high",
  },
  {
    date: "October 3, 2024",
    type: "release",
    model: "ChatGPT Canvas",
    vendor: "OpenAI",
    title: "Canvas Released in ChatGPT",
    description: "New side-by-side writing and coding workspace for ChatGPT. Inline edits, version history, targeted revisions. OpenAI's answer to Claude Artifacts.",
    impact: "medium",
  },
  {
    date: "October 1, 2024",
    type: "api",
    model: "Realtime API",
    vendor: "OpenAI",
    title: "OpenAI Realtime API Released",
    description: "Low-latency speech-to-speech API for voice agents. Eliminates the STT → LLM → TTS pipeline. Priced at $0.06/min input audio, $0.24/min output. Enabled the voice-agent product wave.",
    impact: "high",
  },
  {
    date: "September 25, 2024",
    type: "release",
    model: "Llama 3.2",
    vendor: "Meta",
    title: "Llama 3.2 Released — First Vision-Capable Open Llamas",
    description: "Meta ships 1B/3B text-only and 11B/90B vision-capable variants. 128k context. First open-source Llama with native image understanding.",
    impact: "high",
  },
  {
    date: "September 24, 2024",
    type: "release",
    model: "Advanced Voice Mode",
    vendor: "OpenAI",
    title: "ChatGPT Advanced Voice Mode (GA)",
    description: "After a delayed rollout, Advanced Voice Mode becomes generally available for ChatGPT Plus/Team users. Real-time, emotional, multilingual voice conversations powered by GPT-4o.",
    impact: "medium",
  },
  {
    date: "September 12, 2024",
    type: "release",
    model: "o1-preview & o1-mini",
    vendor: "OpenAI",
    title: "OpenAI o1 Released — First Reasoning Model",
    description: "OpenAI launches o1-preview and o1-mini — the first models trained to 'think before responding' via reinforcement learning on chain-of-thought. Tops AIME, GPQA, Codeforces. Opens the reasoning-model era.",
    impact: "high",
  },
  {
    date: "August 14, 2024",
    type: "api",
    model: "Claude API",
    vendor: "Anthropic",
    title: "Prompt Caching Released for Claude",
    description: "Anthropic ships prompt caching, slashing repeat-prompt costs by up to 90% and latency by ~85%. Game-changer for agentic / multi-turn workflows that re-send long system prompts.",
    impact: "high",
  },
  {
    date: "August 6, 2024",
    type: "api",
    model: "GPT-4o",
    vendor: "OpenAI",
    title: "Structured Outputs Becomes GA",
    description: "OpenAI ships JSON-schema constrained outputs with 100% schema adherence. Removes the need for retry-on-parse-error logic in production applications.",
    impact: "medium",
  },
  {
    date: "July 24, 2024",
    type: "release",
    model: "Mistral Large 2",
    vendor: "Mistral AI",
    title: "Mistral Large 2 Released",
    description: "123B-parameter model with 128k context and improved multilingual + coding capabilities. Released under Mistral Research License (free for non-commercial use). $2/$6 per million via API.",
    impact: "medium",
  },
  {
    date: "July 23, 2024",
    type: "release",
    model: "Llama 3.1",
    vendor: "Meta",
    title: "Llama 3.1 Released — Including 405B Flagship",
    description: "Meta releases Llama 3.1 in 8B, 70B, and 405B variants. The 405B is the largest open-weight model at the time and matches GPT-4o on MMLU. 128k context across all sizes.",
    impact: "high",
  },
  {
    date: "June 27, 2024",
    type: "api",
    model: "Gemini 1.5 Pro",
    vendor: "Google",
    title: "Gemini 1.5 Pro Context Window Reaches 2M Tokens",
    description: "Google expands Gemini 1.5 Pro's context window to 2 million tokens — the largest of any production LLM at the time. Enables full-codebase and full-book analysis in a single call.",
    impact: "high",
  },
  {
    date: "June 21, 2024",
    type: "release",
    model: "Claude 3.5 Sonnet (v1)",
    vendor: "Anthropic",
    title: "Claude 3.5 Sonnet — Initial Release",
    description: "First model in the Claude 3.5 generation. Topped LMArena coding for months. Introduced Artifacts UI. Reset the bar for mid-tier model quality at $3/$15 per million tokens.",
    impact: "high",
  },
  {
    date: "May 14, 2024",
    type: "release",
    model: "Gemini 1.5 Flash",
    vendor: "Google",
    title: "Gemini 1.5 Flash Released",
    description: "Google announces Gemini 1.5 Flash at Google I/O — its first fast/efficient model in the 1.5 series. 1M-token context, multimodal, optimized for high-volume API workloads. Set the template for the Pro/Flash/Lite tiering that followed.",
    impact: "high",
  },
  {
    date: "May 13, 2024",
    type: "release",
    model: "GPT-4o",
    vendor: "OpenAI",
    title: "GPT-4o Released — Omni-Modal Flagship",
    description: "OpenAI's flagship model unifying text, vision, and audio in one transformer. Half the price of GPT-4 Turbo ($5/$15). Sparked the voice-mode era and shipped to free-tier ChatGPT users.",
    impact: "high",
  },
  {
    date: "April 18, 2024",
    type: "release",
    model: "Llama 3",
    vendor: "Meta",
    title: "Llama 3 Released — 8B & 70B Open Weights",
    description: "Meta releases the first Llama 3 models in 8B and 70B sizes. First open-weight family to seriously compete with GPT-3.5 and Claude on benchmarks. Launched the open-weight resurgence of 2024.",
    impact: "high",
  },
  {
    date: "March 4, 2024",
    type: "release",
    model: "Claude 3 family",
    vendor: "Anthropic",
    title: "Claude 3 Family Released — Opus, Sonnet, Haiku",
    description: "Anthropic launches Claude 3 in three tiers: Opus (flagship), Sonnet (mid), Haiku (fast). 200K-token context. First Claude line to compete with GPT-4 across most benchmarks; established Anthropic as a true frontier-tier vendor.",
    impact: "high",
  },
  {
    date: "February 15, 2024",
    type: "release",
    model: "Gemini 1.5 Pro",
    vendor: "Google",
    title: "Gemini 1.5 Pro Released — 1M-Token Context",
    description: "Google announces Gemini 1.5 Pro with a 1M-token context window — the largest production context at the time. Native multimodal across text, image, audio, and video. Kicked off the long-context arms race.",
    impact: "high",
  },

  // ─── 2023 ────────────────────────────────────────────────────────────────
  {
    date: "December 6, 2023",
    type: "release",
    model: "Gemini 1.0",
    vendor: "Google",
    title: "Gemini 1.0 Released — Ultra, Pro, Nano",
    description: "Google launches the first Gemini generation in three sizes: Ultra (flagship), Pro (mid), Nano (on-device). First native multimodal model from Google. Replaced Bard branding and the PaLM 2 family as the flagship line.",
    impact: "high",
  },
  {
    date: "August 24, 2023",
    type: "release",
    model: "Code Llama",
    vendor: "Meta",
    title: "Code Llama Released — Open Code Model",
    description: "Meta releases Code Llama as a code-specialized Llama 2 variant in 7B, 13B, and 34B sizes. First major open-weight code model. Spawned a wave of derivatives (Python, Instruct, etc.) and established Meta in the developer-tool space.",
    impact: "medium",
  },
  {
    date: "July 18, 2023",
    type: "release",
    model: "Llama 2",
    vendor: "Meta",
    title: "Llama 2 Released — First Commercial-Use Open Weights",
    description: "Meta and Microsoft release Llama 2 in 7B, 13B, and 70B sizes with a commercial-use license — a major shift from Llama 1's research-only terms. Catalyst for the modern open-weight LLM ecosystem.",
    impact: "high",
  },
  {
    date: "July 11, 2023",
    type: "release",
    model: "Claude 2",
    vendor: "Anthropic",
    title: "Claude 2 Released — 100K Context & Public Beta",
    description: "Anthropic releases Claude 2 with a 100K-token context window — the longest available at the time. Public claude.ai beta access opens, bringing Anthropic into the consumer market beyond API partners.",
    impact: "high",
  },
  {
    date: "May 10, 2023",
    type: "release",
    model: "PaLM 2",
    vendor: "Google",
    title: "PaLM 2 Released at I/O 2023",
    description: "Google introduces PaLM 2 in Gecko, Otter, Bison, and Unicorn sizes. Powered Bard and ~25 Google products. Google's frontier model in the pre-Gemini era.",
    impact: "high",
  },
  {
    date: "March 14, 2023",
    type: "release",
    model: "GPT-4",
    vendor: "OpenAI",
    title: "GPT-4 Released — First Multimodal GPT",
    description: "OpenAI announces GPT-4 — a large multimodal model accepting text and image input. Major leap over GPT-3.5 on professional benchmarks (Bar Exam top 10%). Initially API-only and ChatGPT Plus exclusive.",
    impact: "high",
  },
  {
    date: "March 14, 2023",
    type: "release",
    model: "Claude (initial)",
    vendor: "Anthropic",
    title: "Claude Released — Anthropic Goes Public",
    description: "Anthropic publicly introduces Claude and Claude Instant. First non-OpenAI model with comparable conversational quality at launch. Initially API-only access for partners; consumer access (claude.ai) followed later.",
    impact: "medium",
  },

  // ─── 2022 ────────────────────────────────────────────────────────────────
  {
    date: "November 30, 2022",
    type: "release",
    model: "ChatGPT",
    vendor: "OpenAI",
    title: "ChatGPT Released — The Moment That Started It All",
    description: "OpenAI launches ChatGPT as a free research preview on top of GPT-3.5. Reached 1M users in 5 days, 100M in 2 months — the fastest-growing consumer product in history. Kicked off the modern AI era.",
    impact: "high",
  },

  // ─── 2021 ────────────────────────────────────────────────────────────────
  {
    date: "August 4, 2021",
    type: "release",
    model: "Jurassic-1",
    vendor: "AI21 Labs",
    title: "Jurassic-1 Released — Early Commercial LLM",
    description: "AI21 Labs launches AI21 Studio and Jurassic-1 (Jumbo: 178B) — first major commercial LLM API outside of OpenAI. Established the multi-vendor LLM market that exists today.",
    impact: "medium",
  },

  // ─── 2020 ────────────────────────────────────────────────────────────────
  {
    date: "May 28, 2020",
    type: "release",
    model: "GPT-3",
    vendor: "OpenAI",
    title: "GPT-3 Released — The Foundation of the LLM Era",
    description: "OpenAI publishes the GPT-3 paper — a 175B-parameter model showing emergent few-shot learning. Released as an API in June 2020, kicking off the commercial LLM market. Foundation of everything that followed.",
    impact: "high",
  },
];

// ─── Styling maps ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<EventType, { label: string; dot: string; badge: string; badgeText: string; border: string }> = {
  release:     { label: "Release",     dot: "bg-emerald-500", badge: "bg-emerald-500/10", badgeText: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
  pricing:     { label: "Pricing",     dot: "bg-blue-500",    badge: "bg-blue-500/10",    badgeText: "text-blue-600 dark:text-blue-400",       border: "border-l-blue-500"    },
  deprecation: { label: "Deprecated",  dot: "bg-rose-500",    badge: "bg-rose-500/10",    badgeText: "text-rose-600 dark:text-rose-400",       border: "border-l-rose-500"    },
  api:         { label: "API Change",  dot: "bg-violet-500",  badge: "bg-violet-500/10",  badgeText: "text-violet-600 dark:text-violet-400",   border: "border-l-violet-500"  },
};

const IMPACT_CONFIG: Record<Impact, { label: string; badge: string; text: string }> = {
  high:   { label: "High impact",   badge: "bg-amber-500/10",  text: "text-amber-600 dark:text-amber-400"  },
  medium: { label: "Medium impact", badge: "bg-slate-500/10",  text: "text-slate-600 dark:text-slate-400"  },
  low:    { label: "Low impact",    badge: "bg-zinc-500/10",   text: "text-zinc-600 dark:text-zinc-400"    },
};

const FILTER_TABS: { label: string; value: EventType | "all" }[] = [
  { label: "All",          value: "all"        },
  { label: "Releases",     value: "release"    },
  { label: "Pricing",      value: "pricing"    },
  { label: "Deprecations", value: "deprecation"},
  { label: "API Changes",  value: "api"        },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "April 2026";

const STATS = [
  { label: "Total events tracked", value: EVENTS.length.toString() },
  { label: "Releases",             value: EVENTS.filter((e) => e.type === "release").length.toString() },
  { label: "API changes",          value: EVENTS.filter((e) => e.type === "api").length.toString() },
  { label: "Curated through",      value: LAST_UPDATED },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function ModelTrackerPage() {
  const [activeFilter, setActiveFilter] = useState<EventType | "all">("all");

  const filtered = activeFilter === "all"
    ? EVENTS
    : EVENTS.filter((e) => e.type === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* ── Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            📡 Model Update Tracker
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          The AI changelog you wish existed. Every release, price change, and deprecation — in one place.
        </p>
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2 max-w-2xl">
          <span className="shrink-0">ℹ️</span>
          <span>
            Curated manually. Latest event tracked: <span className="font-medium text-foreground">April 23, 2026</span>.
            A live news-feed pipeline (RSS + AI summarization) is the planned next step to keep this page real-time without manual edits.
          </span>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4 space-y-1">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter events by type">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          const count = tab.value === "all"
            ? EVENTS.length
            : EVENTS.filter((e) => e.type === tab.value).length;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${isActive ? "opacity-70" : "opacity-50"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Timeline ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No events match this filter.</div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" aria-hidden="true" />

          <div className="space-y-6 pl-12">
            {filtered.map((event, index) => {
              const tc = TYPE_CONFIG[event.type];
              const ic = IMPACT_CONFIG[event.impact];
              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[2.35rem] top-4 w-3 h-3 rounded-full ring-2 ring-background ${tc.dot}`}
                    aria-hidden="true"
                  />

                  {/* Event card */}
                  <div className={`rounded-xl border border-border bg-card border-l-4 ${tc.border} p-5 space-y-3 hover:shadow-sm transition-shadow`}>

                    {/* Top row: date + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {event.date}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.badge} ${tc.badgeText}`}>
                        {tc.label}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ic.badge} ${ic.text}`}>
                        {ic.label}
                      </span>
                    </div>

                    {/* Title + vendor/model */}
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-foreground leading-snug">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {event.vendor} &mdash; {event.model}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {EVENTS.length} events. Curated through {LAST_UPDATED}.
        </p>
      </div>
    </div>
  );
}
