import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: {
    run: "npx tsx prisma/seed.ts",
  },
});
