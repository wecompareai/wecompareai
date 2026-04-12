import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export const maxDuration = 60;

const MAX_SLOTS = 5;

type ModelResult =
  | { status: "ok"; text: string; model: string; latencyMs: number }
  | { status: "error"; error: string }
  | { status: "no_key" };

type ModelWithProvider = {
  id: string;
  slug: string;
  modelId: string;
  provider: {
    name: string;
    apiKeyEnv: string | null;
    encryptedApiKey: string | null;
    apiFormat: string;
    apiBaseUrl: string | null;
  };
};

function openAiTokenParam(modelId: string, maxTokens: number): Record<string, number> {
  const usesCompletion = /^(o\d|gpt-5)/i.test(modelId);
  return usesCompletion ? { max_completion_tokens: maxTokens } : { max_tokens: maxTokens };
}

function resolveApiKey(provider: ModelWithProvider["provider"]): string | undefined {
  // 1. Env var takes priority
  if (provider.apiKeyEnv) {
    const envKey = process.env[provider.apiKeyEnv];
    if (envKey) return envKey;
  }
  // 2. Fall back to encrypted key stored in DB
  if (provider.encryptedApiKey) {
    try {
      return decrypt(provider.encryptedApiKey);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function callModel(model: ModelWithProvider, prompt: string): Promise<ModelResult> {
  const start = Date.now();
  const apiKey = resolveApiKey(model.provider);
  if (!apiKey) return { status: "no_key" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    switch (model.provider.apiFormat) {
      case "openai": {
        const baseUrl = model.provider.apiBaseUrl || "https://api.openai.com/v1";
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model.modelId,
            ...openAiTokenParam(model.modelId, 1024),
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `${model.provider.name} ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? model.modelId,
          latencyMs: Date.now() - start,
        };
      }

      case "anthropic": {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: model.modelId,
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `Anthropic ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.content?.[0]?.text ?? "",
          model: data.model ?? model.modelId,
          latencyMs: Date.now() - start,
        };
      }

      case "gemini": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model.modelId}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 1024 },
            }),
            signal: controller.signal,
          }
        );
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `Gemini ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
          model: model.modelId,
          latencyMs: Date.now() - start,
        };
      }

      default:
        return { status: "error", error: `Unsupported API format: ${model.provider.apiFormat}` };
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      return { status: "error", error: "Request timed out after 30 seconds" };
    }
    return { status: "error", error: String(e) };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.trim().length < 1) {
    return NextResponse.json({ error: "A non-empty prompt is required." }, { status: 400 });
  }

  // Support both slot-based { slots: [{slotId, modelSlug}] } and legacy { models: string[] }
  const isSlotBased = Array.isArray(body.slots) && body.slots.length > 0;
  const slots: { slotId: string; modelSlug: string }[] = isSlotBased
    ? body.slots
    : (body.models ?? []).map((slug: string) => ({ slotId: slug, modelSlug: slug }));

  if (slots.length === 0 || slots.length > MAX_SLOTS) {
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

  if (dbModels.length === 0) {
    return NextResponse.json({ error: "No active models found for the given selection." }, { status: 400 });
  }

  const modelMap = new Map(dbModels.map((m) => [m.slug, m]));

  const settled = await Promise.allSettled(
    slots.map((s) => {
      const m = modelMap.get(s.modelSlug);
      if (!m) return Promise.resolve({ status: "error" as const, error: "Model not found or inactive" });
      return callModel(m, prompt);
    })
  );

  const results: Record<string, ModelResult> = {};
  settled.forEach((outcome, i) => {
    const slotId = slots[i].slotId;
    results[slotId] = outcome.status === "fulfilled"
      ? outcome.value
      : { status: "error", error: String(outcome.reason) };
  });

  // Fire-and-forget logging
  const promptTruncated = prompt.slice(0, 3000);
  void Promise.allSettled(
    slots.map((s, i) => {
      const m = modelMap.get(s.modelSlug);
      if (!m) return Promise.resolve();
      const outcome = settled[i];
      const result = outcome.status === "fulfilled" ? outcome.value : null;
      const latencyMs = result && "latencyMs" in result ? result.latencyMs : undefined;
      const status = result?.status ?? "error";
      const errorMessage = result && "error" in result ? result.error : outcome.status === "rejected" ? String(outcome.reason) : null;
      return prisma.apiRequestLog.create({
        data: {
          userId: null,
          feature: "prompt-battle",
          promptTruncated,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          costUsd: 0,
          providerName: m.provider.name,
          modelName: m.name,
          modelSlug: m.slug,
          modelDbId: m.id,
          latencyMs: latencyMs ?? null,
          status,
          errorMessage: errorMessage ?? null,
        },
      });
    })
  );

  return NextResponse.json({ results });
}
