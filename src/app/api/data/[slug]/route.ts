import { NextRequest, NextResponse } from "next/server";
import { getComparisonData, saveComparisonData, getCategories } from "@/lib/data";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  if (slug === "categories") {
    const categories = await getCategories();
    return NextResponse.json(categories);
  }

  const data = await getComparisonData(slug);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();

  try {
    if (slug === "categories") {
      return NextResponse.json(
        { error: "Use /api/categories for category management" },
        { status: 400 }
      );
    }

    await saveComparisonData(slug, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}
