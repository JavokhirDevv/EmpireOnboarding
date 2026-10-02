// prisma/schema.prisma (Postgres) is the single source of truth. Local dev runs
// SQLite, which needs its own schema file — this derives it so the two can
// never drift. Run via `npm run db:sqlite-schema` (the db:* scripts do it for you).
import { readFile, writeFile } from "node:fs/promises";

const SOURCE = "prisma/schema.prisma";
const TARGET = "prisma/schema.sqlite.prisma";

const source = await readFile(SOURCE, "utf8");

if (!/provider\s*=\s*"postgresql"/.test(source)) {
  throw new Error(`${SOURCE} is expected to declare provider = "postgresql"`);
}

const sqlite = source
  .replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"')
  .replace(
    /^\/\/ Prisma schema.*$/m,
    "// GENERATED FILE — do not edit. Run `npm run db:sqlite-schema` after changing schema.prisma.\n// Local-development mirror of prisma/schema.prisma, with the SQLite provider."
  );

await writeFile(TARGET, sqlite);
console.log(`Wrote ${TARGET} from ${SOURCE}`);
