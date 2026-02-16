import { InventoryRepository } from '../repositories/InventoryRepository';
import prisma from '../db/client';
import { ApiResponse, Inventory, InventoryLine } from '../../src/shared/types';

export class InventoryService {
  private repo = new InventoryRepository();

  async getAll(): Promise<ApiResponse<Inventory[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getById(id: number): Promise<ApiResponse<Inventory>> {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async create(data: {
    nom: string;
    description?: string;
    warehouseId?: number;
    user?: string;
  }): Promise<ApiResponse<Inventory>> {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async startInventory(id: number, user?: string): Promise<ApiResponse<Inventory>> {
    try {
      const result = await this.repo.startInventory(id, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async completeInventory(id: number, user?: string): Promise<ApiResponse<Inventory>> {
    try {
      const result = await this.repo.completeInventory(id, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async cancelInventory(id: number, user?: string): Promise<ApiResponse<Inventory>> {
    try {
      const result = await this.repo.cancelInventory(id, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateLine(inventoryId: number, stockId: number, countedQty: number, notes?: string, user?: string): Promise<ApiResponse<InventoryLine>> {
    try {
      const result = await this.repo.updateLine(inventoryId, stockId, countedQty, notes, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getInventoryReport(id: number): Promise<ApiResponse<any>> {
    try {
      const result = await this.repo.getInventoryReport(id);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      await this.repo.delete(id);
      return { success: true, data: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Barcode scanning helper - find stock by barcode
  async findStockByBarcode(barcode: string): Promise<ApiResponse<any>> {
    try {
      const stock = await prisma.stock.findFirst({
        where: {
          reference: {
            parfum: {
              barcode: barcode
            }
          }
        },
        include: {
          reference: {
            include: {
              parfum: true,
              fournisseur: true
            }
          }
        }
      });

      if (!stock) {
        return { success: false, error: 'Produit non trouvé pour ce code-barres' };
      }

      return { success: true, data: stock };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}