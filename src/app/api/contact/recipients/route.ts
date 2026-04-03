import { NextRequest, NextResponse } from "next/server";
import { getAllRecipients } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipients = await getAllRecipients();
  return NextResponse.json(recipients);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const recipient = await prisma.contactRecipient.create({
    data: { name: name.trim(), email: email.trim().toLowerCase() },
  });

  return NextResponse.json(recipient, { status: 201 });
}
