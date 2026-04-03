import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "ai-features.json");

function readFeatures() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeFeatures(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readFeatures());
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, provider, url, pricing, pros, cons, features, image, video, audio, content, code, testing, database, reporting } = body;

  if (!name?.trim() || !provider?.trim()) {
    return NextResponse.json({ error: "Name and provider are required" }, { status: 400 });
  }

  const data = readFeatures();

  const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (data.tools.some((t: { id: string }) => t.id === id)) {
    return NextResponse.json({ error: "A tool with this name already exists" }, { status: 409 });
  }

  const newTool = {
    id,
    name: name.trim(),
    provider: provider.trim(),
    logo: `/logos/${provider.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`,
    url: url?.trim() || "",
    pricing: {
      free: pricing?.free ?? false,
      paid: pricing?.paid || "N/A",
      api: pricing?.api || "N/A",
    },
    pros: (pros as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
    cons: (cons as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
    features: {
      image: features?.image ?? false,
      video: features?.video ?? false,
      audio: features?.audio ?? false,
      content: features?.content ?? false,
      code: features?.code ?? false,
      testing: features?.testing ?? false,
      database: features?.database ?? false,
      reporting: features?.reporting ?? false,
    },
    image: {
      imageGeneration: image?.imageGeneration ?? false,
      imageUnderstanding: image?.imageUnderstanding ?? false,
      imageEditing: image?.imageEditing ?? false,
      maxResolution: image?.maxResolution || "N/A",
      styles: image?.styles || "N/A",
      inpainting: image?.inpainting ?? false,
      apiAccess: image?.apiAccess ?? false,
    },
    video: {
      videoGeneration: video?.videoGeneration ?? false,
      maxDuration: video?.maxDuration || "N/A",
      maxResolution: video?.maxResolution || "N/A",
      fps: video?.fps || "N/A",
      audioInVideo: video?.audioInVideo ?? false,
      apiAccess: video?.apiAccess ?? false,
    },
    audio: {
      textToSpeech: audio?.textToSpeech ?? false,
      speechToText: audio?.speechToText ?? false,
      musicGeneration: audio?.musicGeneration ?? false,
      voiceCloning: audio?.voiceCloning ?? false,
      audioQuality: audio?.audioQuality || "N/A",
      languages: audio?.languages || "N/A",
    },
    content: {
      longFormWriting: content?.longFormWriting ?? false,
      contextWindow: content?.contextWindow || "N/A",
      multilingual: content?.multilingual ?? false,
      ragSupport: content?.ragSupport ?? false,
      fileUpload: content?.fileUpload ?? false,
      webBrowsing: content?.webBrowsing ?? false,
    },
    code: {
      codeCompletion: code?.codeCompletion ?? false,
      debugging: code?.debugging ?? false,
      testGeneration: code?.testGeneration ?? false,
      multiLanguage: code?.multiLanguage ?? false,
      ideIntegration: code?.ideIntegration || "N/A",
      maxContext: code?.maxContext || "N/A",
    },
    testing: {
      testCaseGeneration: testing?.testCaseGeneration ?? false,
      testAutomation: testing?.testAutomation || "N/A",
      coverageAnalysis: testing?.coverageAnalysis ?? false,
      bugDetection: testing?.bugDetection ?? false,
      cicdIntegration: testing?.cicdIntegration || "N/A",
    },
    database: {
      sqlServer: database?.sqlServer ?? false,
      oracle: database?.oracle ?? false,
      postgresql: database?.postgresql ?? false,
      mysql: database?.mysql ?? false,
      mongodb: database?.mongodb ?? false,
      queryGeneration: database?.queryGeneration ?? false,
      schemaAnalysis: database?.schemaAnalysis ?? false,
    },
    reporting: {
      powerBI: reporting?.powerBI ?? false,
      crystalReports: reporting?.crystalReports ?? false,
      tableau: reporting?.tableau ?? false,
      qlikSense: reporting?.qlikSense ?? false,
      ssrs: reporting?.ssrs ?? false,
      looker: reporting?.looker ?? false,
    },
  };

  data.tools.push(newTool);

  // Add provider to list if new
  if (!data.providers.includes(provider.trim())) {
    data.providers.push(provider.trim());
  }

  data.lastUpdated = new Date().toISOString().split("T")[0];
  writeFeatures(data);

  return NextResponse.json({ success: true, tool: newTool }, { status: 201 });
}
