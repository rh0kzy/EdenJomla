-- AlterTable
ALTER TABLE "Parfum" ADD COLUMN "certifications" TEXT;
ALTER TABLE "Parfum" ADD COLUMN "msdsUrl" TEXT;
ALTER TABLE "Parfum" ADD COLUMN "techSheetUrl" TEXT;

-- RedefineIndex
DROP INDEX "PriceTier_parfumReference_idx";
CREATE INDEX "PriceTier_parfumReferenceId_minQty_maxQty_idx" ON "PriceTier"("parfumReferenceId", "minQty", "maxQty");
