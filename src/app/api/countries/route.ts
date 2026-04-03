import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "countries.json");

function readCountries() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeCountries(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const countries = readCountries();
  return NextResponse.json(countries);
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
  const { country, flag, providerName, model, description, features } = body;

  if (!country?.trim() || !flag?.trim() || !providerName?.trim() || !model?.trim()) {
    return NextResponse.json(
      { error: "Country, flag, provider name, and model are required" },
      { status: 400 }
    );
  }

  const countries = readCountries();

  const featureList: string[] = (features as string)
    .split(",")
    .map((f: string) => f.trim())
    .filter(Boolean);

  const newProvider = {
    name: providerName.trim(),
    model: model.trim(),
    description: description?.trim() || "",
    features: featureList,
  };

  // Check if country already exists — append provider to it
  const existing = countries.find(
    (c: { country: string }) =>
      c.country.toLowerCase() === country.trim().toLowerCase()
  );

  if (existing) {
    existing.providers.push(newProvider);
  } else {
    countries.push({
      country: country.trim(),
      flag: flag.trim(),
      providers: [newProvider],
    });
  }

  writeCountries(countries);
  return NextResponse.json({ success: true }, { status: 201 });
}
