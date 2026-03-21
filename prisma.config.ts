// Prisma 7 config file — used by the Prisma CLI (generate, migrate, etc.)
// Runtime connection is handled in lib/prisma.ts via @prisma/adapter-pg.
import "dotenv/config";
import { defineConfig,env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema", 
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {

    url: env("DIRECT_URL") ?? "",
  },
});
