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
    select: { id: true },
  });

  if (!domain) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  const subdomains = await prisma.subdomain.findMany({
    where: { domainId: domain.id },
    orderBy: { order: "asc" },
    include: { _count: { select: { comparisons: true } } },
  });

  return NextResponse.json(subdomains);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug } = await params;
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    select: { id: true },
  });

  if (!domain) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, description, icon } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const subdomain = await prisma.subdomain.create({
    data: {
      domainId: domain.id,
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      icon: icon || "brain",
    },
  });

  return NextResponse.json(subdomain, { status: 201 });
}
