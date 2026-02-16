import { ipcMain } from 'electron';
import { ParfumService } from '../services/ParfumService';
import { FournisseurService } from '../services/FournisseurService';
import { ClientService } from '../services/ClientService';
import { ParfumReferenceService } from '../services/ParfumReferenceService';
import { StockService } from '../services/StockService';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export function registerIpcHandlers() {
  const parfumService = new ParfumService();
  const fournisseurService = new FournisseurService();
  const clientService = new ClientService();
  const referenceService = new ParfumReferenceService();
  const stockService = new StockService();

  // Parfum Handlers
  ipcMain.handle('parfum:getAll', () => parfumService.getAllParfums());
  ipcMain.handle('parfum:create', (_, data) => parfumService.createParfum(data));
  ipcMain.handle('parfum:update', (_, { id, data }) => parfumService.updateParfum(id, data));
  ipcMain.handle('parfum:delete', (_, id) => parfumService.deleteParfum(id));

  // Fournisseur Handlers
  ipcMain.handle('fournisseur:getAll', () => fournisseurService.getAll());
  ipcMain.handle('fournisseur:create', (_, data) => fournisseurService.create(data));
  ipcMain.handle('fournisseur:update', (_, { id, data }) => fournisseurService.update(id, data));
  ipcMain.handle('fournisseur:delete', (_, id) => fournisseurService.delete(id));

  // Client Handlers
  ipcMain.handle('client:getAll', () => clientService.getAll());
  ipcMain.handle('client:create', (_, data) => clientService.create(data));
  ipcMain.handle('client:update', (_, { id, data }) => clientService.update(id, data));
  ipcMain.handle('client:delete', (_, id) => clientService.delete(id));

  // Reference Handlers
  ipcMain.handle('reference:getAll', () => referenceService.getAll());
  ipcMain.handle('reference:create', (_, data) => referenceService.create(data));
  ipcMain.handle('reference:update', (_, { id, data }) => referenceService.update(id, data));
  ipcMain.handle('reference:delete', (_, id) => referenceService.delete(id));

  // Stock Handlers
  ipcMain.handle('stock:getAll', () => stockService.getAll());
  ipcMain.handle('stock:updateQuantity', (_, { referenceId, delta }) => stockService.updateQuantity(referenceId, delta));
  ipcMain.handle('stock:setQuantity', (_, { referenceId, quantity }) => stockService.setQuantity(referenceId, quantity));

  // Image Upload Handler
  ipcMain.handle('upload:image', async (_, formData) => {
    try {
      const { image, type } = formData;
      
      if (!image || !type) {
        throw new Error('Image and type are required');
      }

      // Generate unique filename
      const fileExtension = path.extname(image.originalFilename || 'image.jpg');
      const filename = `${uuidv4()}${fileExtension}`;
      
      // Create directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'images', type);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save file
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      return {
        success: true,
        data: {
          filename,
          path: filePath
        }
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  });
}
