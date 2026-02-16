import { ipcMain } from 'electron';
import { ParfumService } from '../services/ParfumService';
import { FournisseurService } from '../services/FournisseurService';
import { ClientService } from '../services/ClientService';
import { ParfumReferenceService } from '../services/ParfumReferenceService';
import { StockService } from '../services/StockService';
import { WarehouseService } from '../services/WarehouseService';
import { InventoryService } from '../services/InventoryService';
import { CategoryService } from '../services/CategoryService';
import { TagService } from '../services/TagService';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export function registerIpcHandlers() {
  const parfumService = new ParfumService();
  const fournisseurService = new FournisseurService();
  const clientService = new ClientService();
  const referenceService = new ParfumReferenceService();
  const stockService = new StockService();
  const warehouseService = new WarehouseService();
  const inventoryService = new InventoryService();
  const categoryService = new CategoryService();
  const tagService = new TagService();

  // Parfum Handlers
  ipcMain.handle('parfum:getAll', () => parfumService.getAllParfums());
  ipcMain.handle('parfum:create', (_, data) => parfumService.createParfum(data));
  ipcMain.handle('parfum:update', (_, { id, data }) => parfumService.updateParfum(id, data));
  ipcMain.handle('parfum:delete', (_, id) => parfumService.deleteParfum(id));
  ipcMain.handle('parfum:getHistory', (_, parfumId) => parfumService.getParfumHistory(parfumId));
  ipcMain.handle('parfum:duplicate', (_, { id, data }) => parfumService.duplicateParfum(id, data));
  ipcMain.handle('parfum:getByBarcode', (_, barcode) => parfumService.getParfumByBarcode(barcode));
  ipcMain.handle('parfum:getByCategory', (_, categoryId) => parfumService.getParfumsByCategory(categoryId));
  ipcMain.handle('parfum:getByTag', (_, tagId) => parfumService.getParfumsByTag(tagId));

  // Category Handlers
  ipcMain.handle('category:getAll', () => categoryService.getAllCategories());
  ipcMain.handle('category:create', (_, data) => categoryService.createCategory(data));
  ipcMain.handle('category:update', (_, { id, data }) => categoryService.updateCategory(id, data));
  ipcMain.handle('category:delete', (_, id) => categoryService.deleteCategory(id));

  // Tag Handlers
  ipcMain.handle('tag:getAll', () => tagService.getAllTags());
  ipcMain.handle('tag:create', (_, data) => tagService.createTag(data));
  ipcMain.handle('tag:update', (_, { id, data }) => tagService.updateTag(id, data));
  ipcMain.handle('tag:delete', (_, id) => tagService.deleteTag(id));
  ipcMain.handle('tag:getForParfum', (_, parfumId) => tagService.getTagsForParfum(parfumId));
  ipcMain.handle('tag:setForParfum', (_, { parfumId, tagIds }) => tagService.setTagsForParfum(parfumId, tagIds));

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
  ipcMain.handle('stock:getById', (_, id) => stockService.getById(id));
  ipcMain.handle('stock:updateQuantity', (_, { referenceId, delta, user, reason }) => stockService.updateQuantity(referenceId, delta, user, reason));
  ipcMain.handle('stock:setQuantity', (_, { referenceId, quantity, user, reason }) => stockService.setQuantity(referenceId, quantity, user, reason));
  ipcMain.handle('stock:updateDetails', (_, { referenceId, data }) => stockService.updateStockDetails(referenceId, data));
  ipcMain.handle('stock:reserve', (_, { referenceId, quantity, user }) => stockService.reserveStock(referenceId, quantity, user));
  ipcMain.handle('stock:cancelReservation', (_, { referenceId, quantity, user }) => stockService.cancelReservation(referenceId, quantity, user));
  ipcMain.handle('stock:getMovements', (_, { stockId, limit }) => stockService.getMovements(stockId, limit));
  ipcMain.handle('stock:getLowAlerts', () => stockService.getLowStockAlerts());
  ipcMain.handle('stock:getHighAlerts', () => stockService.getHighStockAlerts());
  ipcMain.handle('stock:getExpiring', (_, days) => stockService.getExpiringStock(days));
  ipcMain.handle('stock:predictRupture', (_, referenceId) => stockService.predictStockRupture(referenceId));

  // Warehouse Handlers
  ipcMain.handle('warehouse:getAll', () => warehouseService.getAll());
  ipcMain.handle('warehouse:getById', (_, id) => warehouseService.getById(id));
  ipcMain.handle('warehouse:create', (_, data) => warehouseService.create(data));
  ipcMain.handle('warehouse:update', (_, { id, data }) => warehouseService.update(id, data));
  ipcMain.handle('warehouse:delete', (_, id) => warehouseService.delete(id));

  // Inventory Handlers
  ipcMain.handle('inventory:getAll', () => inventoryService.getAll());
  ipcMain.handle('inventory:getById', (_, id) => inventoryService.getById(id));
  ipcMain.handle('inventory:create', (_, data) => inventoryService.create(data));
  ipcMain.handle('inventory:start', (_, { id, user }) => inventoryService.startInventory(id, user));
  ipcMain.handle('inventory:complete', (_, { id, user }) => inventoryService.completeInventory(id, user));
  ipcMain.handle('inventory:cancel', (_, { id, user }) => inventoryService.cancelInventory(id, user));
  ipcMain.handle('inventory:updateLine', (_, { inventoryId, stockId, countedQty, notes, user }) =>
    inventoryService.updateLine(inventoryId, stockId, countedQty, notes, user));
  ipcMain.handle('inventory:getReport', (_, id) => inventoryService.getInventoryReport(id));
  ipcMain.handle('inventory:delete', (_, id) => inventoryService.delete(id));
  ipcMain.handle('inventory:findByBarcode', (_, barcode) => inventoryService.findStockByBarcode(barcode));

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
