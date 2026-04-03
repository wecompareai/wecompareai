import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(process.cwd(), "data", "domains");

  // --- Seed Domains ---
  const domainsRaw = fs.readFileSync(
    path.join(dataDir, "domains.json"),
    "utf-8"
  );
  const domains: Array<{
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
  }> = JSON.parse(domainsRaw);

  const domainMap: Record<string, string> = {};

  for (const d of domains) {
    const dbDomain = await prisma.domain.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        description: d.description,
        icon: d.icon,
        order: d.order,
      },
      create: {
        name: d.name,
        slug: d.slug,
        description: d.description,
        icon: d.icon,
        order: d.order,
      },
    });
    domainMap[d.slug] = dbDomain.id;
    console.log(`  Domain: ${d.name}`);
  }

  // --- Seed Subdomains ---
  const subdomainsRaw = fs.readFileSync(
    path.join(dataDir, "subdomains.json"),
    "utf-8"
  );
  const subdomains: Array<{
    domainSlug: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
  }> = JSON.parse(subdomainsRaw);

  const subdomainMap: Record<string, string> = {};

  for (const s of subdomains) {
    const domainId = domainMap[s.domainSlug];
    if (!domainId) {
      console.error(`  Domain not found for subdomain: ${s.name} (${s.domainSlug})`);
      continue;
    }

    const dbSub = await prisma.subdomain.upsert({
      where: {
        domainId_slug: { domainId, slug: s.slug },
      },
      update: {
        name: s.name,
        description: s.description,
        icon: s.icon,
        order: s.order,
      },
      create: {
        domainId,
        name: s.name,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        order: s.order,
      },
    });
    subdomainMap[`${s.domainSlug}_${s.slug}`] = dbSub.id;
    console.log(`    Subdomain: ${s.name} (${s.domainSlug})`);
  }

  // --- Seed Comparisons ---
  const compDir = path.join(dataDir, "comparisons");
  const compFiles = fs.readdirSync(compDir).filter((f) => f.endsWith(".json"));

  let compCount = 0;
  for (const file of compFiles) {
    // filename format: {domainSlug}_{subdomainSlug}_{comparisonSlug}.json
    const parts = file.replace(".json", "").split("_");
    if (parts.length < 3) {
      console.error(`  Skipping invalid file: ${file}`);
      continue;
    }

    const domainSlug = parts[0];
    const subdomainSlug = parts[1];
    const comparisonSlug = parts.slice(2).join("-");
    const key = `${domainSlug}_${subdomainSlug}`;
    const subdomainId = subdomainMap[key];

    if (!subdomainId) {
      console.error(`  Subdomain not found for: ${key}`);
      continue;
    }

    const compRaw = fs.readFileSync(path.join(compDir, file), "utf-8");
    const compData = JSON.parse(compRaw);

    const dataPayload = JSON.stringify({
      columns: compData.columns,
      groups: compData.groups,
    });

    await prisma.domainComparison.upsert({
      where: {
        subdomainId_slug: { subdomainId, slug: comparisonSlug },
      },
      update: {
        title: compData.title,
        description: compData.description,
        data: dataPayload,
        lastUpdated: new Date(compData.lastUpdated),
      },
      create: {
        subdomainId,
        title: compData.title,
        slug: comparisonSlug,
        description: compData.description,
        data: dataPayload,
        lastUpdated: new Date(compData.lastUpdated),
      },
    });
    compCount++;
    console.log(`      Comparison: ${compData.title}`);
  }

  // --- Seed Contact Recipients ---
  const recipients = [
    { name: "Jigar", email: "jigaracharya@gmail.com" },
    { name: "Saugera", email: "saugera@gmail.com" },
  ];

  for (const r of recipients) {
    await prisma.contactRecipient.upsert({
      where: { email: r.email },
      update: { name: r.name, active: true },
      create: { name: r.name, email: r.email, active: true },
    });
    console.log(`  Recipient: ${r.email}`);
  }

  console.log(
    `\nDone! Seeded ${domains.length} domains, ${subdomains.length} subdomains, ${compCount} comparisons, ${recipients.length} recipients.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
