import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const maxDuration = 120; // Allow up to 2 minutes for all API calls

interface AIResult {
  content: string;
  model: string;
  error?: string;
}

interface ResearchResponse {
  prompt: string;
  responses: {
    chatgpt: AIResult;
    anthropic: AIResult;
    gemini: AIResult;
  };
  comparisons: {
    chatgpt: AIResult;
    anthropic: AIResult;
    gemini: AIResult;
  };
}

async function callChatGPT(prompt: string): Promise<AIResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-your-")) {
    return { content: "", model: "gpt-4o-mini", error: "OpenAI API key not configured" };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { content: "", model: "gpt-4o-mini", error: `OpenAI error: ${res.status} - ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content ?? "",
      model: data.model ?? "gpt-4o-mini",
    };
  } catch (e) {
    return { content: "", model: "gpt-4o-mini", error: String(e) };
  }
}

async function callAnthropic(prompt: string): Promise<AIResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { content: "", model: "claude-sonnet-4-6", error: "Anthropic API key not configured" };
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { content: "", model: "claude-sonnet-4-6", error: `Anthropic error: ${res.status} - ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    return {
      content: data.content?.[0]?.text ?? "",
      model: data.model ?? "claude-sonnet-4-6",
    };
  } catch (e) {
    return { content: "", model: "claude-sonnet-4-6", error: String(e) };
  }
}

async function callGemini(prompt: string): Promise<AIResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return { content: "", model: "gemini-1.5-flash", error: "Gemini API key not configured" };
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048 },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      return { content: "", model: "gemini-1.5-flash", error: `Gemini error: ${res.status} - ${err.slice(0, 200)}` };
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { content: text, model: "gemini-1.5-flash" };
  } catch (e) {
    return { content: "", model: "gemini-1.5-flash", error: String(e) };
  }
}

function buildComparisonPrompt(
  originalPrompt: string,
  chatgptResponse: string,
  anthropicResponse: string,
  geminiResponse: string
): string {
  return `You are an expert AI analyst. A user asked the following question and received responses from three different AI systems.
Please provide a thorough comparison of all three responses.

ORIGINAL QUESTION:
${originalPrompt}

---
CHATGPT RESPONSE:
${chatgptResponse || "(No response / error)"}

---
CLAUDE (ANTHROPIC) RESPONSE:
${anthropicResponse || "(No response / error)"}

---
GEMINI (GOOGLE) RESPONSE:
${geminiResponse || "(No response / error)"}

---
YOUR TASK:
Compare these three responses across the following dimensions:
1. **Accuracy & Completeness** - Which response is most accurate and complete?
2. **Clarity & Structure** - Which is easiest to understand and best organized?
3. **Depth of Insight** - Which goes deepest or provides the most valuable perspective?
4. **Unique Points** - What does each response mention that the others miss?
5. **Overall Recommendation** - Which response would you recommend and why?

Be objective and specific in your comparison.`;
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

  const prompt = body.prompt.trim();

  // Phase 1: Call all 3 AIs in parallel with the user's prompt
  const [chatgptRes, anthropicRes, geminiRes] = await Promise.all([
    callChatGPT(prompt),
    callAnthropic(prompt),
    callGemini(prompt),
  ]);

  // Phase 2: Build comparison prompt and send to all 3 AIs in parallel
  const comparisonPrompt = buildComparisonPrompt(
    prompt,
    chatgptRes.content,
    anthropicRes.content,
    geminiRes.content
  );

  const [chatgptComp, anthropicComp, geminiComp] = await Promise.all([
    callChatGPT(comparisonPrompt),
    callAnthropic(comparisonPrompt),
    callGemini(comparisonPrompt),
  ]);

  const result: ResearchResponse = {
    prompt,
    responses: {
      chatgpt: chatgptRes,
      anthropic: anthropicRes,
      gemini: geminiRes,
    },
    comparisons: {
      chatgpt: chatgptComp,
      anthropic: anthropicComp,
      gemini: geminiComp,
    },
  };

  return NextResponse.json(result);
}
