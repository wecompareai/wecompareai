import { NextRequest, NextResponse } from "next/server";
import { getSubmissions } from "@/lib/contact";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1");

  const data = await getSubmissions({ status, page });
  return NextResponse.json(data);
}
