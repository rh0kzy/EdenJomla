-- CreateTable
CREATE TABLE "Parfum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ParfumReference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parfumId" INTEGER NOT NULL,
    "fournisseurId" INTEGER NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnitaire" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParfumReference_parfumId_fkey" FOREIGN KEY ("parfumId") REFERENCES "Parfum" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParfumReference_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parfumReferenceId" INTEGER NOT NULL,
    "quantite" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stock_parfumReferenceId_fkey" FOREIGN KEY ("parfumReferenceId") REFERENCES "ParfumReference" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ParfumReference_referenceCode_key" ON "ParfumReference"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_parfumReferenceId_key" ON "Stock"("parfumReferenceId");
