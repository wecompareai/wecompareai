import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId      = searchParams.get("userId") || undefined;
  const providerName = searchParams.get("providerName") || undefined;
  const modelSlug   = searchParams.get("modelSlug") || undefined;
  const status      = searchParams.get("status") || undefined;
  const feature     = searchParams.get("feature") || undefined;
  const dateFrom    = searchParams.get("dateFrom") || undefined;
  const dateTo      = searchParams.get("dateTo") || undefined;
  const page        = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize    = 50;

  const where = {
    ...(userId === "__null__" ? { userId: null } : userId ? { userId } : {}),
    ...(providerName ? { providerName: { contains: providerName, mode: "insensitive" as const } } : {}),
    ...(modelSlug   ? { modelSlug }                                                 : {}),
    ...(status      ? { status }                                                    : {}),
    ...(feature     ? { feature }                                                   : {}),
    ...((dateFrom || dateTo) ? {
      createdAt: {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo   ? { lte: new Date(`${dateTo}T23:59:59.999Z`) } : {}),
      },
    } : {}),
  };

  const [logs, total, aggregates] = await Promise.all([
    prisma.apiRequestLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.apiRequestLog.count({ where }),
    prisma.apiRequestLog.aggregate({
      where,
      _sum: { costUsd: true, totalTokens: true, promptTokens: true, completionTokens: true },
      _count: { id: true },
    }),
  ]);

  // Enrich logs with user name/email
  const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean))] as string[];
  const users = userIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const enriched = logs.map((l) => ({
    ...l,
    user: l.userId ? (userMap.get(l.userId) ?? null) : null,
  }));

  return NextResponse.json({
    logs: enriched,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    aggregates: {
      totalCostUsd:        aggregates._sum.costUsd ?? 0,
      totalTokens:         aggregates._sum.totalTokens ?? 0,
      totalPromptTokens:   aggregates._sum.promptTokens ?? 0,
      totalCompletionTokens: aggregates._sum.completionTokens ?? 0,
      totalRequests:       aggregates._count.id,
    },
  });
}
