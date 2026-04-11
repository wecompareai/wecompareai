import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const provider = await prisma.aIProvider.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.tier !== undefined && { tier: body.tier }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.apiKeyEnv !== undefined && { apiKeyEnv: body.apiKeyEnv }),
        ...(body.apiFormat !== undefined && { apiFormat: body.apiFormat }),
        ...(body.apiBaseUrl !== undefined && { apiBaseUrl: body.apiBaseUrl }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json(provider);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.aIProvider.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    throw error;
  }
}
