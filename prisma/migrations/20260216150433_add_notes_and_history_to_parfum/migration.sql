-- AlterTable
ALTER TABLE "Parfum" ADD COLUMN "createdBy" TEXT DEFAULT 'system';
ALTER TABLE "Parfum" ADD COLUMN "notes" TEXT;
ALTER TABLE "Parfum" ADD COLUMN "updatedBy" TEXT DEFAULT 'system';

-- CreateTable
CREATE TABLE "ParfumHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parfumId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "changedBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
