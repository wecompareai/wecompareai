import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

// POST — set or clear the API key for a provider
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { apiKey } = await request.json();

  // apiKey = null/empty means clear it
  const encryptedApiKey = apiKey?.trim() ? encrypt(apiKey.trim()) : null;

  try {
    await prisma.aIProvider.update({
      where: { id },
      data: { encryptedApiKey },
    });
    return NextResponse.json({ success: true, stored: !!encryptedApiKey });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    throw error;
  }
}
