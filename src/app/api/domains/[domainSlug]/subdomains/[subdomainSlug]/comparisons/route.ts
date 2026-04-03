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
    select: { id: true },
  });
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: { params: Promise<{ domainSlug: string; subdomainSlug: string }> }
) {
  const { domainSlug, subdomainSlug } = await params;
  const subdomain = await findSubdomain(domainSlug, subdomainSlug);
  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain not found" },
      { status: 404 }
    );
  }

  const comparisons = await prisma.domainComparison.findMany({
    where: { subdomainId: subdomain.id },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      lastUpdated: true,
    },
  });

  return NextResponse.json(comparisons);
}

export async function POST(
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
  const { title, description } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const comparison = await prisma.domainComparison.create({
    data: {
      subdomainId: subdomain.id,
      title: title.trim(),
      slug,
      description: description?.trim() || "",
      data: JSON.stringify({ columns: [], groups: [] }),
      lastUpdated: new Date(),
    },
  });

  return NextResponse.json(comparison, { status: 201 });
}
