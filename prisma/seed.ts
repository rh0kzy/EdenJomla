import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding data...")

  await prisma.stock.deleteMany()
  await prisma.parfumReference.deleteMany()
  await prisma.parfum.deleteMany()
  await prisma.fournisseur.deleteMany()
  await prisma.client.deleteMany()

  const f1 = await prisma.fournisseur.create({
    data: { nom: "Givaudan", telephone: "+41 44 824 24 24", email: "contact@givaudan.com" }
  })
  const f2 = await prisma.fournisseur.create({
    data: { nom: "Firmenich", telephone: "+41 22 717 91 11", email: "info@firmenich.com" }
  })

  const p1 = await prisma.parfum.create({
    data: { nom: "Bleu de Chanel", marque: "Chanel", description: "Vibrant and woody fragrance" }
  })
  const p2 = await prisma.parfum.create({
    data: { nom: "Sauvage", marque: "Dior", description: "Radically fresh, raw and noble" }
  })

  await prisma.parfumReference.create({
    data: {
      parfumId: p1.id,
      fournisseurId: f1.id,
      referenceCode: "BC-GIV-001",
      unite: "KILOGRAMME",
      prixUnitaire: 1200,
      stock: { create: { quantite: 10 } }
    }
  })

  await prisma.parfumReference.create({
    data: {
      parfumId: p1.id,
      fournisseurId: f2.id,
      referenceCode: "BC-FIR-002",
      unite: "KILOGRAMME",
      prixUnitaire: 1150,
      stock: { create: { quantite: 5 } }
    }
  })

  await prisma.parfumReference.create({
    data: {
      parfumId: p2.id,
      fournisseurId: f1.id,
      referenceCode: "SD-GIV-010",
      unite: "GRAMME",
      prixUnitaire: 1.5,
      stock: { create: { quantite: 500 } }
    }
  })

  await prisma.client.create({ data: { nom: "Jean Dupont", telephone: "0612345678" } })
  await prisma.client.create({ data: { nom: "Marie Durand", telephone: "0789456123" } })

  console.log("Seeding finished.")
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
