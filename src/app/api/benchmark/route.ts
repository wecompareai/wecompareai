import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export const maxDuration = 120;

const MAX_SLOTS = 5;

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

function openAiTokenParam(modelId: string, maxTokens: number): Record<string, number> {
  const usesCompletion = /^(o\d|gpt-5)/i.test(modelId);
  return usesCompletion ? { max_completion_tokens: maxTokens } : { max_tokens: maxTokens };
}

function resolveApiKey(provider: { apiKeyEnv: string | null; encryptedApiKey: string | null }): string | undefined {
  if (provider.apiKeyEnv) {
    const envKey = process.env[provider.apiKeyEnv];
    if (envKey) return envKey;
  }
  if (provider.encryptedApiKey) {
    try { return decrypt(provider.encryptedApiKey); } catch { return undefined; }
  }
  return undefined;
}

export interface BenchmarkResult {
  slotId: string;
  providerName: string;
  modelName: string;
  modelSlug: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  initial: string;
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

type DBModel = {
  id: string;
  slug: string;
  name: string;
  modelId: string;
  initial: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  provider: {
    name: string;
    apiKeyEnv: string | null;
    encryptedApiKey: string | null;
    apiFormat: string;
    apiBaseUrl: string | null;
  };
};

async function runBenchmark(slotId: string, model: DBModel, prompt: string): Promise<BenchmarkResult> {
  const base: Omit<BenchmarkResult, "responseTimeMs" | "inputTokens" | "outputTokens" | "totalTokens" | "costUsd" | "content" | "safetyFlag"> = {
    slotId,
    providerName: model.provider.name,
    modelName: model.name,
    modelSlug: model.slug,
    colorClass: model.colorClass,
    borderClass: model.borderClass,
    gradientClass: model.gradientClass,
    initial: model.initial,
  };

  const apiKey = resolveApiKey(model.provider);
  if (!apiKey) {
    return { ...base, responseTimeMs: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `No API key configured for ${model.provider.name}` };
  }

  const start = Date.now();

  try {
    let content = "";
    let inputTokens = 0;
    let outputTokens = 0;
    let safetyFlag = false;
    let safetyNote: string | undefined;

    switch (model.provider.apiFormat) {
      case "openai": {
        const baseUrl = model.provider.apiBaseUrl || "https://api.openai.com/v1";
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: model.modelId, ...openAiTokenParam(model.modelId, 1024), messages: [{ role: "user", content: prompt }] }),
        });
        const responseTimeMs = Date.now() - start;
        if (!res.ok) {
          const err = await res.text();
          return { ...base, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `${model.provider.name} ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        content = data.choices?.[0]?.message?.content ?? "";
        inputTokens = data.usage?.prompt_tokens ?? 0;
        outputTokens = data.usage?.completion_tokens ?? 0;
        const sf = detectSafetyFlag(content);
        safetyFlag = sf.flagged;
        safetyNote = sf.note;
        const costUsd = (inputTokens / 1_000_000) * model.inputPricePer1M + (outputTokens / 1_000_000) * model.outputPricePer1M;
        return { ...base, responseTimeMs, inputTokens, outputTokens, totalTokens: inputTokens + outputTokens, costUsd, content, safetyFlag, safetyNote };
      }

      case "anthropic": {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: model.modelId, ...openAiTokenParam(model.modelId, 1024), messages: [{ role: "user", content: prompt }] }),
        });
        const responseTimeMs = Date.now() - start;
        if (!res.ok) {
          const err = await res.text();
          return { ...base, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `Anthropic ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        content = data.content?.[0]?.text ?? "";
        inputTokens = data.usage?.input_tokens ?? 0;
        outputTokens = data.usage?.output_tokens ?? 0;
        const sf = detectSafetyFlag(content);
        safetyFlag = sf.flagged;
        safetyNote = sf.note;
        const costUsd = (inputTokens / 1_000_000) * model.inputPricePer1M + (outputTokens / 1_000_000) * model.outputPricePer1M;
        return { ...base, responseTimeMs, inputTokens, outputTokens, totalTokens: inputTokens + outputTokens, costUsd, content, safetyFlag, safetyNote };
      }

      case "gemini": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model.modelId}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1024 } }),
          }
        );
        const responseTimeMs = Date.now() - start;
        if (!res.ok) {
          const err = await res.text();
          return { ...base, responseTimeMs, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `Gemini ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
        outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
        const blocked = data.candidates?.[0]?.finishReason === "SAFETY";
        const safetyRatings = data.candidates?.[0]?.safetyRatings ?? [];
        const sf = detectSafetyFlag(content);
        safetyFlag = blocked || sf.flagged;
        safetyNote = blocked
          ? `Blocked by Gemini safety filter: ${safetyRatings.map((r: { category: string; probability: string }) => `${r.category}=${r.probability}`).join(", ")}`
          : sf.note;
        const costUsd = (inputTokens / 1_000_000) * model.inputPricePer1M + (outputTokens / 1_000_000) * model.outputPricePer1M;
        return { ...base, responseTimeMs, inputTokens, outputTokens, totalTokens: data.usageMetadata?.totalTokenCount ?? inputTokens + outputTokens, costUsd, content, safetyFlag, safetyNote };
      }

      default:
        return { ...base, responseTimeMs: Date.now() - start, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: `Unsupported API format: ${model.provider.apiFormat}` };
    }
  } catch (e) {
    return { ...base, responseTimeMs: Date.now() - start, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false, error: String(e) };
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

  const slots: { slotId: string; modelSlug: string }[] = body.slots ?? [];
  if (!Array.isArray(slots) || slots.length === 0 || slots.length > MAX_SLOTS) {
    return NextResponse.json({ error: `Select between 1 and ${MAX_SLOTS} model slots.` }, { status: 400 });
  }

  const prompt = body.prompt.trim();
  const modelSlugs = [...new Set(slots.map((s) => s.modelSlug))];

  const dbModels = await prisma.aIModel.findMany({
    where: { slug: { in: modelSlugs }, isActive: true },
    include: {
      provider: {
        select: { name: true, apiKeyEnv: true, encryptedApiKey: true, apiFormat: true, apiBaseUrl: true },
      },
    },
  });

  const modelMap = new Map(dbModels.map((m) => [m.slug, m]));

  const results = await Promise.all(
    slots.map((s) => {
      const m = modelMap.get(s.modelSlug);
      if (!m) {
        return Promise.resolve<BenchmarkResult>({
          slotId: s.slotId, providerName: "Unknown", modelName: s.modelSlug, modelSlug: s.modelSlug,
          colorClass: "bg-zinc-500/10 text-zinc-700", borderClass: "border-zinc-500/20", gradientClass: "from-zinc-500/10 to-zinc-500/5",
          initial: "?", responseTimeMs: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0, content: "", safetyFlag: false,
          error: "Model not found or inactive",
        });
      }
      return runBenchmark(s.slotId, m, prompt);
    })
  );

  // Fire-and-forget logging
  const promptTruncated = prompt.slice(0, 3000);
  void Promise.allSettled(
    results.map((r) => {
      const m = modelMap.get(r.modelSlug);
      return prisma.apiRequestLog.create({
        data: {
          userId: session.user.id,
          feature: "benchmark",
          promptTruncated,
          promptTokens: r.inputTokens,
          completionTokens: r.outputTokens,
          totalTokens: r.totalTokens,
          costUsd: r.costUsd,
          providerName: r.providerName,
          modelName: r.modelName,
          modelSlug: r.modelSlug,
          modelDbId: m?.id ?? null,
          latencyMs: r.responseTimeMs,
          status: r.error ? "error" : "ok",
          errorMessage: r.error ?? null,
        },
      });
    })
  );

  return NextResponse.json({ prompt, results });
}
