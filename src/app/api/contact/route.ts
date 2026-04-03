import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getActiveRecipients } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fullName, email, mobile, description } = body;

  if (!fullName?.trim() || !email?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Full name, email, and description are required" },
      { status: 400 }
    );
  }

  // Save to DB
  await createSubmission({
    fullName: fullName.trim(),
    email: email.trim(),
    mobile: mobile?.trim() || undefined,
    description: description.trim(),
  });

  // Send email to active recipients
  try {
    const recipients = await getActiveRecipients();
    const emails = recipients.map((r) => r.email);
    if (emails.length > 0) {
      await sendContactEmail({
        to: emails,
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile?.trim(),
        description: description.trim(),
      });
    }
  } catch (err) {
    console.error("Failed to send contact email:", err);
    // Still return success — submission is saved
  }

  return NextResponse.json({ success: true });
}
