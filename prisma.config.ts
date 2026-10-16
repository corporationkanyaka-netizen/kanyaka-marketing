import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI reads the LOCAL database by default (.env.development).
// Production commands are wrapped with `dotenv -e .env.production -- …` (see package.json),
// which sets DATABASE_URL first; dotenv never overrides a variable that is already set.
config({ path: ".env.development", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
