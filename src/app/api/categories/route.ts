import { NextRequest, NextResponse } from "next/server";
import { getPaginatedCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "24"), 100);
  const search = searchParams.get("q") || "";

  const result = await getPaginatedCategories({ page, pageSize, search });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "contributor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description, icon, featured, order } = await request.json();

  if (!name || !description || !icon) {
    return NextResponse.json(
      { error: "name, description, and icon are required" },
      { status: 400 }
    );
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        featured: featured ?? false,
        order: order ?? 0,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }
    throw error;
  }
}
