import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

type ModelResult =
  | { status: "ok"; text: string; model: string; latencyMs: number }
  | { status: "error"; error: string }
  | { status: "no_key" };

async function callModel(modelId: string, prompt: string): Promise<ModelResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    switch (modelId) {
      case "gpt-4o": {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `OpenAI ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? "gpt-4o",
          latencyMs: Date.now() - start,
        };
      }

      case "claude-3-7-sonnet": {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-7-sonnet-20250219",
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
          model: data.model ?? "claude-3-7-sonnet",
          latencyMs: Date.now() - start,
        };
      }

      case "gemini-2.0-flash": {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return {
          status: "ok",
          text,
          model: "gemini-2.0-flash",
          latencyMs: Date.now() - start,
        };
      }

      case "llama-3.3-70b": {
        const apiKey = process.env.TOGETHER_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch("https://api.together.xyz/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `Together AI ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? "llama-3.3-70b",
          latencyMs: Date.now() - start,
        };
      }

      case "mistral-large": {
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `Mistral ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? "mistral-large",
          latencyMs: Date.now() - start,
        };
      }

      case "grok-2": {
        const apiKey = process.env.XAI_API_KEY;
        if (!apiKey) return { status: "no_key" };
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.text();
          return { status: "error", error: `xAI ${res.status}: ${err.slice(0, 200)}` };
        }
        const data = await res.json();
        return {
          status: "ok",
          text: data.choices?.[0]?.message?.content ?? "",
          model: data.model ?? "grok-2-latest",
          latencyMs: Date.now() - start,
        };
      }

      default:
        return { status: "error", error: `Unknown model: ${modelId}` };
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
  if (!Array.isArray(body.models) || body.models.length === 0) {
    return NextResponse.json({ error: "At least one model must be selected." }, { status: 400 });
  }

  const prompt = body.prompt.trim();
  const models: string[] = body.models;

  const settled = await Promise.allSettled(models.map((m) => callModel(m, prompt)));

  const results: Record<string, ModelResult> = {};
  settled.forEach((outcome, i) => {
    const modelId = models[i];
    if (outcome.status === "fulfilled") {
      results[modelId] = outcome.value;
    } else {
      results[modelId] = { status: "error", error: String(outcome.reason) };
    }
  });

  return NextResponse.json({ results });
}
