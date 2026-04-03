import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(process.cwd(), "data");

  const categoriesRaw = fs.readFileSync(
    path.join(dataDir, "categories.json"),
    "utf-8"
  );
  const categories = JSON.parse(categoriesRaw);

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];

    const dbCategory = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        featured: true,
        order: i,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        featured: true,
        order: i,
      },
    });

    const compPath = path.join(dataDir, "comparisons", `${cat.slug}.json`);
    if (fs.existsSync(compPath)) {
      const compRaw = fs.readFileSync(compPath, "utf-8");
      const compData = JSON.parse(compRaw);

      const dataPayload = JSON.stringify({
        columns: compData.columns,
        groups: compData.groups,
      });

      await prisma.comparison.upsert({
        where: { categoryId: dbCategory.id },
        update: {
          title: compData.title,
          description: compData.description,
          data: dataPayload,
          lastUpdated: new Date(compData.lastUpdated),
        },
        create: {
          categoryId: dbCategory.id,
          title: compData.title,
          description: compData.description,
          data: dataPayload,
          lastUpdated: new Date(compData.lastUpdated),
        },
      });
    }

    console.log(`  Seeded: ${cat.name}`);
  }

  console.log(`\nDone! Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
