-- Migration: add pricing features (prixPar100g, PriceHistory, PriceTier)
BEGIN TRANSACTION;

ALTER TABLE "ParfumReference" ADD COLUMN "prixPar100g" REAL;

CREATE TABLE "PriceHistory" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "parfumReferenceId" INTEGER NOT NULL,
  "oldPrice" REAL NOT NULL,
  "newPrice" REAL NOT NULL,
  "reason" TEXT,
  "changedBy" TEXT NOT NULL DEFAULT 'system',
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY ("parfumReferenceId") REFERENCES "ParfumReference" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PriceTier" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "parfumReferenceId" INTEGER NOT NULL,
  "minQty" INTEGER NOT NULL,
  "maxQty" INTEGER,
  "price" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY ("parfumReferenceId") REFERENCES "ParfumReference" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "PriceTier_parfumReference_idx" ON "PriceTier" ("parfumReferenceId", "minQty", "maxQty");

COMMIT;
