import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface PerfumeData {
  id: string;
  reference: string;
  name: string;
  brand_id: string;
  brand_name: string;
  gender: string;
  description: string;
  price: string;
  image_url: string;
  is_available: string;
  created_at: string;
  updated_at: string;
}

async function importPerfumes() {
  try {
    console.log('🚀 Starting perfume import...');
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'perfumes_rows.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    console.log(`📊 Found ${lines.length - 1} perfumes to import`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = lines[i].split(',');
      
      // Create perfume object
      const perfume: any = {};
      headers.forEach((header, index) => {
        perfume[header.trim()] = values[index]?.trim() || '';
      });
      
      // Only import if we have valid data
      if (perfume.id && perfume.name) {
        try {
          // Store in Firebase under 'perfumes/{id}'
          const perfumeRef = ref(database, `perfumes/${perfume.id}`);
          await set(perfumeRef, {
            id: perfume.id,
            reference: perfume.reference,
            name: perfume.name,
            brandId: perfume.brand_id,
            brandName: perfume.brand_name,
            gender: perfume.gender,
            description: perfume.description,
            price: perfume.price,
            imageUrl: perfume.image_url,
            isAvailable: perfume.is_available === 'true',
            createdAt: perfume.created_at,
            updatedAt: perfume.updated_at,
          });
          
          successCount++;
          if (successCount % 50 === 0) {
            console.log(`✅ Imported ${successCount} perfumes...`);
          }
        } catch (error) {
          console.error(`❌ Error importing perfume ${perfume.id}:`, error);
          errorCount++;
        }
      }
    }
    
    console.log('\n🎉 Import complete!');
    console.log(`✅ Successfully imported: ${successCount} perfumes`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount}`);
    }
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

// Run the import
importPerfumes()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
