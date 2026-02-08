import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("📋 Import des données depuis Excel...");

  // Chemin vers le fichier Excel
  const excelPath = "C:\\Users\\PC\\Desktop\\Studies\\Eden\\EdenJomla\\Liste des parfumes.xlsx";

  try {
    // Lire le fichier Excel
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir en JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Trouvé ${data.length} parfums dans le fichier Excel`);
    
    // Afficher les colonnes disponibles
    if (data.length > 0) {
      console.log(`📋 Colonnes trouvées:`, Object.keys(data[0]));
      console.log(`📝 Exemple de première ligne:`, data[0]);
    }

    // Créer un fournisseur par défaut si nécessaire
    let fournisseur = await prisma.fournisseur.findFirst({
      where: { nom: "Fournisseur Principal" }
    });

    if (!fournisseur) {
      fournisseur = await prisma.fournisseur.create({
        data: {
          nom: "Fournisseur Principal",
          telephone: "0000000000",
          email: "contact@parfumdepot.dz"
        }
      });
      console.log("✅ Fournisseur créé");
    }

    let importCount = 0;
    let skipCount = 0;

    for (const row of data) {
      try {
        // Extraire les données selon les colonnes du fichier Excel
        const reference = String(row.Reference || row.reference || "");
        const id = parseInt(reference); // Utiliser la référence comme ID
        const nomDeParfum = row['Nom De Parfum'] || row.nom || row.Nom || "";
        const marque = row.Marque || row.marque || "";
        const sexe = row.sexe || row.Sexe || row.SEXE || "";

        if (!reference || !marque || !nomDeParfum || isNaN(id)) {
          console.log(`⚠️  Ligne ignorée - données manquantes ou ID invalide:`, { reference, nomDeParfum, marque, id });
          skipCount++;
          continue;
        }

        // Créer le nom complet du parfum
        const parfumNom = nomDeParfum;
        const description = sexe ? `Parfum ${sexe}` : "";

        // Vérifier si le parfum existe déjà
        let parfum = await prisma.parfum.findFirst({
          where: {
            nom: parfumNom,
            marque: marque
          }
        });

        if (!parfum) {
          const parfumData: any = {
            nom: parfumNom,
            marque: marque,
            description: description
          };
          
          // Utiliser l'ID du fichier Excel si disponible
          if (id !== null && id !== undefined && id !== "") {
            const numericId = parseInt(id);
            // Vérifier si l'ID existe déjà
            const existingParfum = await prisma.parfum.findUnique({
              where: { id: numericId }
            });
            if (existingParfum) {
              console.log(`⚠️  ID ${numericId} existe déjà pour parfum - ID ignoré`);
            } else {
              parfumData.id = numericId;
            }
          }
          
          parfum = await prisma.parfum.create({
            data: parfumData
          });
        }

        // Vérifier si la référence existe déjà
        const existingRef = await prisma.parfumReference.findUnique({
          where: { referenceCode: reference }
        });

        if (existingRef) {
          console.log(`⚠️  Référence ${reference} existe déjà - ignorée`);
          skipCount++;
          continue;
        }

        // Créer la référence avec prix 0 DZD
        const parfumRefData: any = {
          parfumId: parfum.id,
          fournisseurId: fournisseur.id,
          referenceCode: reference,
          unite: "KILOGRAMME",
          prixUnitaire: 0, // Prix pour 1kg = 0 DZD
          stock: {
            create: {
              quantite: 0 // Quantité = 0 kg
            }
          }
        };
        
        // Utiliser l'ID du fichier Excel pour la référence si disponible
        if (id !== null && id !== undefined && id !== "") {
          const numericId = parseInt(id);
          // Vérifier si l'ID existe déjà pour la référence
          const existingRef = await prisma.parfumReference.findUnique({
            where: { id: numericId }
          });
          if (existingRef) {
            console.log(`⚠️  ID ${numericId} existe déjà pour référence - ID ignoré`);
          } else {
            parfumRefData.id = numericId;
          }
        }

        const parfumRef = await prisma.parfumReference.create({
          data: parfumRefData
        });

        console.log(`✅ ${importCount + 1}. ${parfumNom} (Réf: ${reference}) - ${marque} - ${sexe} [ID: ${id}]`);
        importCount++;

      } catch (error: any) {
        console.error(`❌ Erreur lors de l'import de:`, row);
        console.error(error.message);
        skipCount++;
      }
    }

    console.log("\n📊 Résumé de l'import:");
    console.log(`   ✅ Parfums importés: ${importCount}`);
    console.log(`   ⚠️  Lignes ignorées: ${skipCount}`);
    console.log(`   📦 Total: ${data.length}`);
    console.log("\n💡 Notes:");
    console.log("   - IDs utilisés depuis la colonne 'Reference' du fichier Excel");
    console.log("   - Quantité: 0 kg pour tous les parfums");
    console.log("   - Prix pour 1kg: 0 DZD");
    console.log("   - Prix pour 100g: 0 DZD (calculé automatiquement)");

  } catch (error: any) {
    console.error("❌ Erreur lors de la lecture du fichier Excel:");
    console.error(error.message);
    
    if (error.code === 'ENOENT') {
      console.error("\n💡 Le fichier n'a pas été trouvé. Vérifiez le chemin:");
      console.error("   C:\\Users\\PC\\Desktop\\Studies\\Eden\\EdenJomla\\Liste des parfumes.xlsx");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
