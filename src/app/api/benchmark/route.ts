import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const maxDuration = 120;

// Pricing per 1M tokens (USD) as of 2025
const PRICING = {
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "gemini-1.5-flash": { input: 0.075, output: 0.30 },
};

const SAFETY_PATTERNS = [
  /i (can't|cannot|am unable to|will not|won't) (help|assist|provide|generate|create)/i,
  /this (request|prompt|content) (violates|goes against|is against)/i,
  /i('m| am) not able to/i,
  /against (my|our) (guidelines|policy|policies|terms)/i,
  /harmful|dangerous content|not appropriate/i,
];

function detectSafetyFlag(content: string): { flagged: boolean; note?: string } {
  for (const pattern of SAFETY_PATTERNS) {
    if (pattern.test(content)) {
      return { flagged: true, note: "Response may contain a policy refusal or safety disclaimer." };
    }
  }
  return { flagged: false };
}

function calcCost(model: keyof typeof PRICING, inputTokens: number, outputTokens: number): number {
  const price = PRICING[model];
  if (!price) return 0;
  return (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
}

export interface BenchmarkResult {
  provider: string;
  model: string;
  responseTimeMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  content: string;
  safetyFlag: boolean;
  safetyNote?: string;
  error?: string;
}

async function benchmarkChatGPT(prompt: string): Promise<BenchmarkResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = "gpt-4o-mini";
  if (!apiKey || apiKey.startsWith("sk-your-")) {
    return { provider: "ChatGPT", model, responseTimeMs: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: "OpenAI API key not configured" };
  }
  const start = Date.now();
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 1024, messages: [{ role: "user", content: prompt }] }),
    });
    const responseTimeMs = Date.now() - start;
    if (!res.ok) {
      const err = await res.text();
      return { provider: "ChatGPT", model, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `OpenAI error ${res.status}: ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const inputTokens = data.usage?.prompt_tokens ?? 0;
    const outputTokens = data.usage?.completion_tokens ?? 0;
    const totalTokens = data.usage?.total_tokens ?? 0;
    const costUsd = calcCost(model, inputTokens, outputTokens);
    const safety = detectSafetyFlag(content);
    return { provider: "ChatGPT", model: data.model ?? model, responseTimeMs, inputTokens, outputTokens, totalTokens, costUsd, content, safetyFlag: safety.flagged, safetyNote: safety.note };
  } catch (e) {
    return { provider: "ChatGPT", model, responseTimeMs: Date.now() - start, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: String(e) };
  }
}

async function benchmarkAnthropic(prompt: string): Promise<BenchmarkResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = "claude-sonnet-4-6";
  if (!apiKey) {
    return { provider: "Claude", model, responseTimeMs: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: "Anthropic API key not configured" };
  }
  const start = Date.now();
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 1024, messages: [{ role: "user", content: prompt }] }),
    });
    const responseTimeMs = Date.now() - start;
    if (!res.ok) {
      const err = await res.text();
      return { provider: "Claude", model, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `Anthropic error ${res.status}: ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    const content = data.content?.[0]?.text ?? "";
    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;
    const totalTokens = inputTokens + outputTokens;
    const costUsd = calcCost(model, inputTokens, outputTokens);
    const safety = detectSafetyFlag(content);
    return { provider: "Claude", model: data.model ?? model, responseTimeMs, inputTokens, outputTokens, totalTokens, costUsd, content, safetyFlag: safety.flagged, safetyNote: safety.note };
  } catch (e) {
    return { provider: "Claude", model, responseTimeMs: Date.now() - start, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: String(e) };
  }
}

async function benchmarkGemini(prompt: string): Promise<BenchmarkResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-1.5-flash";
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return { provider: "Gemini", model, responseTimeMs: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: "Gemini API key not configured" };
  }
  const start = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1024 } }),
      }
    );
    const responseTimeMs = Date.now() - start;
    if (!res.ok) {
      const err = await res.text();
      return { provider: "Gemini", model, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `Gemini error ${res.status}: ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
    const totalTokens = data.usageMetadata?.totalTokenCount ?? inputTokens + outputTokens;
    const costUsd = calcCost(model, inputTokens, outputTokens);

    // Gemini returns safety ratings per candidate
    const safetyRatings = data.candidates?.[0]?.safetyRatings ?? [];
    const blocked = data.candidates?.[0]?.finishReason === "SAFETY";
    const contentSafety = detectSafetyFlag(content);
    const safetyFlag = blocked || contentSafety.flagged;
    const safetyNote = blocked
      ? `Blocked by Gemini safety filter: ${safetyRatings.map((r: { category: string; probability: string }) => `${r.category}=${r.probability}`).join(", ")}`
      : contentSafety.note;

    return { provider: "Gemini", model, responseTimeMs, inputTokens, outputTokens, totalTokens, costUsd, content, safetyFlag, safetyNote };
  } catch (e) {
    return { provider: "Gemini", model, responseTimeMs: Date.now() - start, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: String(e) };
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.trim().length < 5) {
    return NextResponse.json({ error: "Please provide a prompt of at least 5 characters." }, { status: 400 });
  }

  const prompt = body.prompt.trim();

  // Run all 3 benchmarks in parallel
  const [chatgpt, claude, gemini] = await Promise.all([
    benchmarkChatGPT(prompt),
    benchmarkAnthropic(prompt),
    benchmarkGemini(prompt),
  ]);

  return NextResponse.json({ prompt, results: [chatgpt, claude, gemini] });
}
