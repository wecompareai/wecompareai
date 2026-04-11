import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId") || undefined;
  const activeOnly = searchParams.get("activeOnly") !== "false";

  const models = await prisma.aIModel.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(providerId ? { providerId } : {}),
    },
    orderBy: [{ provider: { tier: "asc" } }, { provider: { order: "asc" } }, { order: "asc" }],
    include: { provider: true },
  });

  return NextResponse.json(models);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { providerId, name, modelId, description, initial, colorClass, borderClass, gradientClass, order } = body;

  if (!providerId || !name?.trim() || !modelId?.trim()) {
    return NextResponse.json({ error: "providerId, name, and modelId are required" }, { status: 400 });
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    const model = await prisma.aIModel.create({
      data: {
        providerId,
        name: name.trim(),
        slug,
        modelId: modelId.trim(),
        description: description?.trim() || null,
        initial: initial?.trim() || name.trim().charAt(0).toUpperCase(),
        colorClass: colorClass || "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400",
        borderClass: borderClass || "border-zinc-500/20",
        gradientClass: gradientClass || "from-zinc-500/10 to-zinc-500/5",
        order: order ?? 0,
        isActive: true,
      },
      include: { provider: true },
    });
    return NextResponse.json(model, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "A model with this name already exists" }, { status: 409 });
    }
    throw error;
  }
}
