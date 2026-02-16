-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "couleur" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "couleur" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ParfumTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parfumId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "ParfumTag_parfumId_fkey" FOREIGN KEY ("parfumId") REFERENCES "Parfum" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ParfumTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parfum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "notes" TEXT,
    "barcode" TEXT,
    "categoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT DEFAULT 'system',
    "updatedBy" TEXT DEFAULT 'system',
    CONSTRAINT "Parfum_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Parfum" ("createdAt", "createdBy", "description", "id", "image", "marque", "nom", "notes", "updatedAt", "updatedBy") SELECT "createdAt", "createdBy", "description", "id", "image", "marque", "nom", "notes", "updatedAt", "updatedBy" FROM "Parfum";
DROP TABLE "Parfum";
ALTER TABLE "new_Parfum" RENAME TO "Parfum";
CREATE UNIQUE INDEX "Parfum_barcode_key" ON "Parfum"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_nom_key" ON "Category"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nom_key" ON "Tag"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "ParfumTag_parfumId_tagId_key" ON "ParfumTag"("parfumId", "tagId");
