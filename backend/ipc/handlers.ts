import { ipcMain } from 'electron';
import { ParfumService } from '../services/ParfumService';
import { FournisseurService } from '../services/FournisseurService';
import { ClientService } from '../services/ClientService';
import { ParfumReferenceService } from '../services/ParfumReferenceService';
import { StockService } from '../services/StockService';

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
}
