import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

async function findComparison(
  domainSlug: string,
  subdomainSlug: string,
  comparisonSlug: string
) {
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    select: { id: true },
  });
  if (!domain) return null;

  const subdomain = await prisma.subdomain.findUnique({
    where: { domainId_slug: { domainId: domain.id, slug: subdomainSlug } },
    select: { id: true },
  });
  if (!subdomain) return null;

  return prisma.domainComparison.findUnique({
    where: {
      subdomainId_slug: { subdomainId: subdomain.id, slug: comparisonSlug },
    },
  });
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      domainSlug: string;
      subdomainSlug: string;
      comparisonSlug: string;
    }>;
  }
) {
  const { domainSlug, subdomainSlug, comparisonSlug } = await params;
  const comparison = await findComparison(
    domainSlug,
    subdomainSlug,
    comparisonSlug
  );

  if (!comparison) {
    return NextResponse.json(
      { error: "Comparison not found" },
      { status: 404 }
    );
  }

  const { columns, groups } = JSON.parse(comparison.data);
  return NextResponse.json({
    id: comparison.slug,
    title: comparison.title,
    description: comparison.description,
    lastUpdated: comparison.lastUpdated.toISOString().split("T")[0],
    columns,
    groups,
  });
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      domainSlug: string;
      subdomainSlug: string;
      comparisonSlug: string;
    }>;
  }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug, subdomainSlug, comparisonSlug } = await params;
  const comparison = await findComparison(
    domainSlug,
    subdomainSlug,
    comparisonSlug
  );

  if (!comparison) {
    return NextResponse.json(
      { error: "Comparison not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const dataPayload = JSON.stringify({
    columns: body.columns,
    groups: body.groups,
  });

  await prisma.domainComparison.update({
    where: { id: comparison.id },
    data: {
      title: body.title,
      description: body.description,
      data: dataPayload,
      lastUpdated: new Date(body.lastUpdated),
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      domainSlug: string;
      subdomainSlug: string;
      comparisonSlug: string;
    }>;
  }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domainSlug, subdomainSlug, comparisonSlug } = await params;
  const comparison = await findComparison(
    domainSlug,
    subdomainSlug,
    comparisonSlug
  );

  if (!comparison) {
    return NextResponse.json(
      { error: "Comparison not found" },
      { status: 404 }
    );
  }

  await prisma.domainComparison.delete({ where: { id: comparison.id } });
  return NextResponse.json({ success: true });
}
