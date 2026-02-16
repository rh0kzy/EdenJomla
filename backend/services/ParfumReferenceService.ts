import { ParfumReferenceRepository } from '../repositories/ParfumReferenceRepository';
import { ApiResponse, ParfumReference } from '../../src/shared/types';

export class ParfumReferenceService {
  private repo = new ParfumReferenceRepository();

  async getAll(): Promise<ApiResponse<ParfumReference[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async create(data: Omit<ParfumReference, 'id'>): Promise<ApiResponse<ParfumReference>> {
    try {
      const existing = await this.repo.getByCode(data.referenceCode);
      if (existing) {
        return { success: false, error: 'Ce code de référence existe déjà' };
      }
      const result = await this.repo.create(data);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async update(id: number, data: Partial<ParfumReference>): Promise<ApiResponse<ParfumReference>> {
    try {
      if (data.referenceCode) {
        const existing = await this.repo.getByCode(data.referenceCode);
        if (existing && existing.id !== id) {
          return { success: false, error: 'Ce code de référence existe déjà' };
        }
      }
      const result = await this.repo.update(id, data);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async importReferences(data: any[]): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.repo.bulkCreateOrUpdate(data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updatePrice(id: number, newPrice: number, reason?: string, changedBy?: string): Promise<ApiResponse<ParfumReference>> {
    try {
      const result = await this.repo.updatePrice(id, newPrice, reason, changedBy);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setPricePer100g(id: number, prixPar100g: number): Promise<ApiResponse<ParfumReference>> {
    try {
      const result = await this.repo.setPricePer100g(id, prixPar100g);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getPriceHistory(referenceId: number, limit?: number): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.repo.getPriceHistory(referenceId, limit);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getPriceTiers(referenceId: number): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.repo.getPriceTiers(referenceId);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getOrderHistory(referenceId: number): Promise<ApiResponse<any>> {
    try {
      const result = await this.repo.getOrderHistory(referenceId);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setPriceTiers(referenceId: number, tiers: { minQty: number; maxQty?: number | null; price: number }[]): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.repo.setPriceTiers(referenceId, tiers);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
