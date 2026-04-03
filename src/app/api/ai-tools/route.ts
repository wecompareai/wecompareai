import { NextRequest, NextResponse } from "next/server";
import { getComparisonData, saveComparisonData } from "@/lib/data";
import { auth } from "@/lib/auth";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  if (!body || !body.companyName || !body.slug) {
    return NextResponse.json(
      { error: "Missing required fields: companyName and slug" },
      { status: 400 }
    );
  }

  const { companyName, slug } = body as { companyName: string; slug: string };

  if (typeof companyName !== "string" || companyName.trim().length < 2) {
    return NextResponse.json(
      { error: "Company name must be at least 2 characters" },
      { status: 400 }
    );
  }

  const data = await getComparisonData(slug);
  if (!data) {
    return NextResponse.json(
      { error: "Comparison not found" },
      { status: 404 }
    );
  }

  const colId = toSlug(companyName.trim());
  if (data.columns.some((c) => c.id === colId || c.name.toLowerCase() === companyName.trim().toLowerCase())) {
    return NextResponse.json(
      { error: "This platform already exists in the comparison" },
      { status: 409 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  // Build a concise feature list for the prompt
  const featureLines = data.groups.flatMap((g) =>
    g.rows.map((r) => {
      const samples = Object.entries(r.values)
        .slice(0, 3)
        .map(([id, val]) => {
          const col = data.columns.find((c) => c.id === id);
          return `${col?.name ?? id}=${JSON.stringify(val)}`;
        })
        .join(", ");
      return `[${g.name}] "${r.feature}" (examples: ${samples})`;
    })
  );

  const prompt = `You are an expert AI industry researcher. I need accurate comparison data for a new AI platform to add to our comparison table.

Platform to research: "${companyName.trim()}"

Below is every feature row that needs a value, with examples from existing platforms to show the value format (strings or booleans):

${featureLines.join("\n")}

Return ONLY a valid JSON object with this exact structure — no prose, no markdown, no code fences:
{
  "name": "<full product/platform name>",
  "provider": "<parent company name>",
  "url": "<official website or API console URL>",
  "values": {
    "<exact feature text>": <value matching the format shown in examples>
  }
}

Rules:
- Include EVERY feature listed above in "values" using the exact feature text as the key.
- Mirror the value type: if examples use true/false, use boolean; if they use strings, use a string.
- For unknown values use "N/A" (string) or false (boolean).
- Keep string values concise (under 60 chars).`;

  let parsed: {
    name: string;
    provider: string;
    url: string;
    values: Record<string, string | boolean | number>;
  };

  try {
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "AI service returned an error. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await aiResponse.json();
    const content: string = aiData.content?.[0]?.text ?? "";

    // Strip any markdown code fences if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in AI response");

    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("AI response parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse AI response. Please try again." },
      { status: 502 }
    );
  }

  // Build the new column
  const newColumn = {
    id: colId,
    name: (parsed.name || companyName.trim()).slice(0, 80),
    provider: (parsed.provider || companyName.trim()).slice(0, 80),
    logo: `/logos/${colId}.svg`,
    url: parsed.url || "",
  };

  // Merge values into each row
  const updatedGroups = data.groups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => ({
      ...row,
      values: {
        ...row.values,
        [colId]: parsed.values[row.feature] ?? "",
      },
    })),
  }));

  const updatedData = {
    ...data,
    columns: [...data.columns, newColumn],
    groups: updatedGroups,
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  await saveComparisonData(slug, updatedData);

  return NextResponse.json({ success: true, column: newColumn });
}
