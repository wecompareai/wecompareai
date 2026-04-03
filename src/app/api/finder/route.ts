import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const maxDuration = 60;

export interface FinderAnswers {
  useCase: string;
  budget: string;
  teamSize: string;
  technicalSkill: string;
  deployment: string;
  priority: string;
}

export interface ToolRecommendation {
  name: string;
  reason: string;
  pricing: string;
  url: string;
}

export interface FinderResult {
  bestModel: ToolRecommendation;
  bestPlatform: ToolRecommendation;
  workflowTools: ToolRecommendation[];
  summary: string;
  warnings?: string[];
}

function buildPrompt(answers: FinderAnswers): string {
  return `You are an expert AI consultant helping someone find the perfect AI tools for their needs.

Based on these answers, recommend the best AI stack. Reply ONLY with valid JSON matching the schema below — no markdown, no explanation outside the JSON.

USER PROFILE:
- Use case: ${answers.useCase}
- Monthly budget: ${answers.budget}
- Team size: ${answers.teamSize}
- Technical skill level: ${answers.technicalSkill}
- Deployment preference: ${answers.deployment}
- Most important factor: ${answers.priority}

Respond with this exact JSON structure:
{
  "bestModel": {
    "name": "model name (e.g. GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1, Mistral)",
    "reason": "2-3 sentence explanation of why this model fits their needs",
    "pricing": "pricing info (e.g. Free tier available, $20/mo, $0.003/1K tokens)",
    "url": "official URL"
  },
  "bestPlatform": {
    "name": "platform name (e.g. ChatGPT Plus, Claude.ai, Google AI Studio, Cursor, GitHub Copilot)",
    "reason": "2-3 sentence explanation",
    "pricing": "pricing info",
    "url": "official URL"
  },
  "workflowTools": [
    {
      "name": "tool name",
      "reason": "1-2 sentence explanation",
      "pricing": "pricing info",
      "url": "official URL"
    },
    {
      "name": "tool name",
      "reason": "1-2 sentence explanation",
      "pricing": "pricing info",
      "url": "official URL"
    },
    {
      "name": "tool name",
      "reason": "1-2 sentence explanation",
      "pricing": "pricing info",
      "url": "official URL"
    }
  ],
  "summary": "2-3 sentence overall summary of their recommended AI stack and why it fits",
  "warnings": ["optional warning if budget is very low", "or if technical skill doesn't match deployment choice"]
}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.answers) return NextResponse.json({ error: "Missing answers" }, { status: 400 });

  const answers: FinderAnswers = body.answers;
  const required: (keyof FinderAnswers)[] = ["useCase", "budget", "teamSize", "technicalSkill", "deployment", "priority"];
  for (const key of required) {
    if (!answers[key]) return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildPrompt(answers) }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `AI error: ${err.slice(0, 200)}` }, { status: 500 });
  }

  const data = await res.json();
  const text: string = data.content?.[0]?.text ?? "";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return NextResponse.json({ error: "Failed to parse recommendation" }, { status: 500 });

  const result: FinderResult = JSON.parse(jsonMatch[0]);
  return NextResponse.json(result);
}
