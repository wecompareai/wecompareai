import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns providers that have at least one API key available (env var OR encrypted in DB),
// along with their active models + pricing. Keys are never returned.
export async function GET() {
  const providers = await prisma.aIProvider.findMany({
    where: { isActive: true },
    orderBy: [{ tier: "asc" }, { order: "asc" }],
    include: {
      models: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          modelId: true,
          initial: true,
          colorClass: true,
          borderClass: true,
          gradientClass: true,
          inputPricePer1M: true,
          outputPricePer1M: true,
        },
      },
    },
  });

  // Filter to only providers that have a key available and at least one model
  const available = providers
    .filter((p) => {
      const hasEnvKey = !!(p.apiKeyEnv && process.env[p.apiKeyEnv]);
      const hasDbKey = !!p.encryptedApiKey;
      return (hasEnvKey || hasDbKey) && p.models.length > 0;
    })
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      tier: p.tier,
      apiFormat: p.apiFormat,
      models: p.models,
    }));

  return NextResponse.json(available);
}
