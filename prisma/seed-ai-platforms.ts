import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(process.cwd(), "data");

  // Read comparison data
  const compPath = path.join(dataDir, "comparisons", "ai-platforms.json");
  const compRaw = fs.readFileSync(compPath, "utf-8");
  const compData = JSON.parse(compRaw);

  // Upsert the category
  const category = await prisma.category.upsert({
    where: { slug: "ai-platforms" },
    update: {
      name: "AI Providers",
      description:
        "Compare top 20 AI providers - models portfolio, pricing, use cases, features, and enterprise capabilities.",
      icon: "layers",
      featured: true,
    },
    create: {
      name: "AI Providers",
      slug: "ai-platforms",
      description:
        "Compare top 20 AI providers - models portfolio, pricing, use cases, features, and enterprise capabilities.",
      icon: "layers",
      featured: true,
      order: 0,
    },
  });

  console.log(`Category upserted: ${category.name} (${category.id})`);

  // Prepare comparison payload
  const dataPayload = JSON.stringify({
    columns: compData.columns,
    groups: compData.groups,
  });

  // Upsert the comparison
  const comparison = await prisma.comparison.upsert({
    where: { categoryId: category.id },
    update: {
      title: compData.title,
      description: compData.description,
      data: dataPayload,
      lastUpdated: new Date(compData.lastUpdated),
    },
    create: {
      categoryId: category.id,
      title: compData.title,
      description: compData.description,
      data: dataPayload,
      lastUpdated: new Date(compData.lastUpdated),
    },
  });

  console.log(`Comparison upserted: ${comparison.title}`);
  console.log(`  - ${compData.columns.length} providers`);
  console.log(`  - ${compData.groups.length} comparison groups`);
  console.log(
    `  - Groups: ${compData.groups.map((g: { name: string }) => g.name).join(", ")}`
  );
  console.log(`\nDone! AI Platforms data seeded to Neon.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
