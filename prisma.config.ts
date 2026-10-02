import "dotenv/config";
import { defineConfig } from "prisma/config";

// The app runs on SQLite locally and Postgres in production. DATABASE_URL
// decides which: a `file:` URL means local SQLite, anything else is Postgres.
// Each provider gets its own schema file and its own migration history —
// SQLite and Postgres migration SQL are not interchangeable.
const isSqlite = (process.env["DATABASE_URL"] ?? "").startsWith("file:");

export default defineConfig({
  schema: isSqlite ? "prisma/schema.sqlite.prisma" : "prisma/schema.prisma",
  migrations: {
    path: isSqlite ? "prisma/migrations" : "prisma/migrations-postgres",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
