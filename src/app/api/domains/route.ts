import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const domains = await prisma.domain.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { subdomains: true } },
    },
  });
  return NextResponse.json(domains);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const domain = await prisma.domain.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      icon: icon || "brain",
    },
  });

  return NextResponse.json(domain, { status: 201 });
}
