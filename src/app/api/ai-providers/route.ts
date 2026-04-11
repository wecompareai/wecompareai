import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const withModels = searchParams.get("withModels") === "true";
  const tier = searchParams.get("tier") ? parseInt(searchParams.get("tier")!) : undefined;
  const activeOnly = searchParams.get("activeOnly") !== "false";

  const providers = await prisma.aIProvider.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(tier ? { tier } : {}),
    },
    orderBy: [{ tier: "asc" }, { order: "asc" }],
    include: withModels
      ? {
          models: {
            where: activeOnly ? { isActive: true } : {},
            orderBy: { order: "asc" },
          },
        }
      : undefined,
  });

  return NextResponse.json(providers);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, tier, description, website, logoUrl, apiKeyEnv, apiFormat, apiBaseUrl, order } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    const provider = await prisma.aIProvider.create({
      data: {
        name: name.trim(),
        slug,
        tier: tier ?? 1,
        description: description?.trim() || null,
        website: website?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        apiKeyEnv: apiKeyEnv?.trim() || null,
        apiFormat: apiFormat || "openai",
        apiBaseUrl: apiBaseUrl?.trim() || null,
        order: order ?? 0,
        isActive: true,
      },
    });
    return NextResponse.json(provider, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "A provider with this name already exists" }, { status: 409 });
    }
    throw error;
  }
}
