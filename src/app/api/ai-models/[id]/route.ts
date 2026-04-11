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
    const model = await prisma.aIModel.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.modelId !== undefined && { modelId: body.modelId }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.initial !== undefined && { initial: body.initial }),
        ...(body.colorClass !== undefined && { colorClass: body.colorClass }),
        ...(body.borderClass !== undefined && { borderClass: body.borderClass }),
        ...(body.gradientClass !== undefined && { gradientClass: body.gradientClass }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.providerId !== undefined && { providerId: body.providerId }),
      },
      include: { provider: true },
    });
    return NextResponse.json(model);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
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
    await prisma.aIModel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }
    throw error;
  }
}
