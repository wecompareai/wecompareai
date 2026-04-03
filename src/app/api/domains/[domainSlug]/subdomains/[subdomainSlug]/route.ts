import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

async function findSubdomain(domainSlug: string, subdomainSlug: string) {
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    select: { id: true },
  });
  if (!domain) return null;

  return prisma.subdomain.findUnique({
    where: { domainId_slug: { domainId: domain.id, slug: subdomainSlug } },
  });
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ domainSlug: string; subdomainSlug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug, subdomainSlug } = await params;
  const subdomain = await findSubdomain(domainSlug, subdomainSlug);
  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const updated = await prisma.subdomain.update({
    where: { id: subdomain.id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ domainSlug: string; subdomainSlug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug, subdomainSlug } = await params;
  const subdomain = await findSubdomain(domainSlug, subdomainSlug);
  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain not found" },
      { status: 404 }
    );
  }

  await prisma.subdomain.delete({ where: { id: subdomain.id } });
  return NextResponse.json({ success: true });
}
