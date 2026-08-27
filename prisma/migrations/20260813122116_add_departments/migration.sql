-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'DISPATCH',
    "order" INTEGER NOT NULL DEFAULT 0,
    "estMinutes" INTEGER NOT NULL DEFAULT 10,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Module" ("category", "content", "createdAt", "estMinutes", "id", "order", "published", "slug", "summary", "title", "updatedAt") SELECT "category", "content", "createdAt", "estMinutes", "id", "order", "published", "slug", "summary", "title", "updatedAt" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
