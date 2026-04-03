import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string }> }
) {
  const { domainSlug } = await params;
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    include: {
      subdomains: {
        orderBy: { order: "asc" },
        include: { _count: { select: { comparisons: true } } },
      },
    },
  });

  if (!domain) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  return NextResponse.json(domain);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug } = await params;
  const body = await request.json();

  const domain = await prisma.domain.update({
    where: { slug: domainSlug },
    data: body,
  });

  return NextResponse.json(domain);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug } = await params;
  await prisma.domain.delete({ where: { slug: domainSlug } });
  return NextResponse.json({ success: true });
}
