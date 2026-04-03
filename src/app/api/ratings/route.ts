import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const toolId = req.nextUrl.searchParams.get("toolId");
  if (!toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 });
  }

  const [ratings, aggregate] = await Promise.all([
    prisma.toolRating.findMany({
      where: { toolId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        rating: true,
        review: true,
        createdAt: true,
        user: { select: { name: true, avatar: true } },
      },
    }),
    prisma.toolRating.aggregate({
      where: { toolId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return NextResponse.json({
    ratings,
    average: aggregate._avg.rating
      ? Math.round(aggregate._avg.rating * 10) / 10
      : null,
    count: aggregate._count.rating,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to rate" }, { status: 401 });
  }

  const body = await req.json();
  const { toolId, toolName, rating, review } = body;

  if (!toolId || !toolName || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const userId = session.user.id as string;

  const existing = await prisma.toolRating.upsert({
    where: { toolId_userId: { toolId, userId } },
    update: { rating, review: review || null, updatedAt: new Date() },
    create: { toolId, toolName, userId, rating, review: review || null },
  });

  return NextResponse.json(existing);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toolId = req.nextUrl.searchParams.get("toolId");
  if (!toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 });
  }

  const userId = session.user.id as string;
  await prisma.toolRating.deleteMany({ where: { toolId, userId } });

  return NextResponse.json({ success: true });
}
