import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export const maxDuration = 120;

export interface AIResult {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  error?: string;
}

export interface SlotResult {
  slotId: string;
  providerName: string;
  modelName: string;
  modelSlug: string;
  colorClass: string;
  borderClass: string;
  gradientClass: string;
  initial: string;
  response: AIResult;
  comparison: AIResult;
}

// Newer OpenAI models (o-series, GPT-5.x) use max_completion_tokens instead of max_tokens
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

function estimateCost(inputTokens: number, outputTokens: number, inputPricePer1M: number, outputPricePer1M: number): number {
  return (inputTokens / 1_000_000) * inputPricePer1M + (outputTokens / 1_000_000) * outputPricePer1M;
}

async function callModel(
  model: { modelId: string; inputPricePer1M: number; outputPricePer1M: number; provider: { name: string; apiKeyEnv: string | null; encryptedApiKey: string | null; apiFormat: string; apiBaseUrl: string | null } },
  prompt: string,
  maxTokens = 2048
): Promise<AIResult> {
  const apiKey = resolveApiKey(model.provider);
  if (!apiKey) return { content: "", model: model.modelId, error: `No API key configured for ${model.provider.name}` };

  try {
    switch (model.provider.apiFormat) {
      case "openai": {
        const baseUrl = model.provider.apiBaseUrl || "https://api.openai.com/v1";
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: model.modelId, ...openAiTokenParam(model.modelId, maxTokens), messages: [{ role: "user", content: prompt }] }),
        });
        if (!res.ok) {
          const err = await res.text();
          return { content: "", model: model.modelId, error: `${model.provider.name} ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        const inputTokens = data.usage?.prompt_tokens ?? 0;
        const outputTokens = data.usage?.completion_tokens ?? 0;
        return {
          content: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? model.modelId,
          inputTokens,
          outputTokens,
          costUsd: estimateCost(inputTokens, outputTokens, model.inputPricePer1M, model.outputPricePer1M),
        };
      }

      case "anthropic": {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: model.modelId, ...openAiTokenParam(model.modelId, maxTokens), messages: [{ role: "user", content: prompt }] }),
        });
        if (!res.ok) {
          const err = await res.text();
          return { content: "", model: model.modelId, error: `Anthropic ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        const inputTokens = data.usage?.input_tokens ?? 0;
        const outputTokens = data.usage?.output_tokens ?? 0;
        return {
          content: data.content?.[0]?.text ?? "",
          model: data.model ?? model.modelId,
          inputTokens,
          outputTokens,
          costUsd: estimateCost(inputTokens, outputTokens, model.inputPricePer1M, model.outputPricePer1M),
        };
      }

      case "gemini": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model.modelId}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens } }),
          }
        );
        if (!res.ok) {
          const err = await res.text();
          return { content: "", model: model.modelId, error: `Gemini ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        const inputTokens = data.usageMetadata?.promptTokenCount ?? 0;
        const outputTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
        return {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
          model: model.modelId,
          inputTokens,
          outputTokens,
          costUsd: estimateCost(inputTokens, outputTokens, model.inputPricePer1M, model.outputPricePer1M),
        };
      }

      default:
        return { content: "", model: model.modelId, error: `Unsupported API format: ${model.provider.apiFormat}` };
    }
  } catch (e) {
    return { content: "", model: model.modelId, error: String(e) };
  }
}

function buildComparisonPrompt(originalPrompt: string, responses: { name: string; content: string }[]): string {
  const responseBlocks = responses
    .map((r, i) => `--- RESPONSE ${i + 1} (${r.name}):\n${r.content || "(No response / error)"}`)
    .join("\n\n");

  return `You are an expert AI analyst. A user asked a question and received responses from ${responses.length} different AI models.

ORIGINAL QUESTION:
${originalPrompt}

${responseBlocks}

---
YOUR TASK:
Compare these ${responses.length} responses across:
1. **Accuracy & Completeness** — Which is most accurate and complete?
2. **Clarity & Structure** — Which is easiest to understand?
3. **Depth of Insight** — Which provides the most valuable perspective?
4. **Unique Points** — What does each response mention that others miss?
5. **Overall Recommendation** — Which would you recommend and why?

Be objective and specific.`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.trim().length < 5) {
    return NextResponse.json({ error: "Please provide a prompt of at least 5 characters." }, { status: 400 });
  }

  // selections: [{ slotId: string, modelSlug: string }]
  const selections: { slotId: string; modelSlug: string }[] = body.selections ?? [];
  if (!Array.isArray(selections) || selections.length === 0 || selections.length > 5) {
    return NextResponse.json({ error: "Select between 1 and 5 model slots." }, { status: 400 });
  }

  const prompt = body.prompt.trim();
  const includeComparison: boolean = body.includeComparison !== false;

  // Load all selected models from DB
  const slugs = selections.map((s) => s.modelSlug);
  const dbModels = await prisma.aIModel.findMany({
    where: { slug: { in: slugs }, isActive: true },
    include: {
      provider: {
        select: { name: true, apiKeyEnv: true, encryptedApiKey: true, apiFormat: true, apiBaseUrl: true },
      },
    },
  });

  const modelMap = new Map(dbModels.map((m) => [m.slug, m]));

  // Phase 1 — call all models in parallel
  const phase1 = await Promise.all(
    selections.map(async (sel) => {
      const m = modelMap.get(sel.modelSlug);
      if (!m) return { slotId: sel.slotId, result: { content: "", model: sel.modelSlug, error: "Model not found" } };
      return { slotId: sel.slotId, result: await callModel(m, prompt) };
    })
  );

  // Phase 2 — only if requested
  let phase2: { slotId: string; result: AIResult }[] = [];
  if (includeComparison) {
    const responseBlocks = phase1.map((p) => {
      const m = modelMap.get(selections.find((s) => s.slotId === p.slotId)!.modelSlug);
      return { name: m ? `${m.provider.name} / ${m.name}` : p.slotId, content: p.result.content };
    });
    const compPrompt = buildComparisonPrompt(prompt, responseBlocks);
    phase2 = await Promise.all(
      selections.map(async (sel) => {
        const m = modelMap.get(sel.modelSlug);
        if (!m) return { slotId: sel.slotId, result: { content: "", model: sel.modelSlug, error: "Model not found" } };
        return { slotId: sel.slotId, result: await callModel(m, compPrompt, 2048) };
      })
    );
  }

  // Build final results
  const slots: SlotResult[] = selections.map((sel) => {
    const m = modelMap.get(sel.modelSlug);
    const p1 = phase1.find((x) => x.slotId === sel.slotId)!;
    const p2 = phase2.find((x) => x.slotId === sel.slotId);
    return {
      slotId: sel.slotId,
      providerName: m?.provider.name ?? "Unknown",
      modelName: m?.name ?? sel.modelSlug,
      modelSlug: sel.modelSlug,
      colorClass: m?.colorClass ?? "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400",
      borderClass: m?.borderClass ?? "border-zinc-500/20",
      gradientClass: m?.gradientClass ?? "from-zinc-500/10 to-zinc-500/5",
      initial: m?.initial ?? "?",
      response: p1.result,
      comparison: p2?.result ?? { content: "", model: sel.modelSlug },
    };
  });

  const totalCost = slots.reduce((sum, s) => sum + (s.response.costUsd ?? 0) + (s.comparison.costUsd ?? 0), 0);

  // Fire-and-forget logging — never block the response
  const promptTruncated = prompt.slice(0, 3000);
  void Promise.allSettled(
    slots.map((slot) => {
      const m = modelMap.get(slot.modelSlug);
      const inputTokens = (slot.response.inputTokens ?? 0) + (slot.comparison.inputTokens ?? 0);
      const outputTokens = (slot.response.outputTokens ?? 0) + (slot.comparison.outputTokens ?? 0);
      const costUsd = (slot.response.costUsd ?? 0) + (slot.comparison.costUsd ?? 0);
      const hasError = !!(slot.response.error || slot.comparison.error);
      return prisma.apiRequestLog.create({
        data: {
          userId: session.user.id,
          feature: "compare",
          promptTruncated,
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens: inputTokens + outputTokens,
          costUsd,
          providerName: slot.providerName,
          modelName: slot.modelName,
          modelSlug: slot.modelSlug,
          modelDbId: m?.id ?? null,
          status: hasError ? "error" : "ok",
          errorMessage: slot.response.error ?? slot.comparison.error ?? null,
        },
      });
    })
  );

  return NextResponse.json({ prompt, slots, totalCostUsd: totalCost });
}
