import { ParfumRepository } from '../repositories/ParfumRepository';
import { ApiResponse, Parfum } from '../../src/shared/types';

export class ParfumService {
  private repo = new ParfumRepository();

  async getAllParfums(): Promise<ApiResponse<Parfum[]>> {
    try {
      const parfums = await this.repo.getAll();
      return { success: true, data: parfums };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createParfum(data: Omit<Parfum, 'id'>): Promise<ApiResponse<Parfum>> {
    try {
      if (!data.nom || !data.marque) {
        return { success: false, error: 'Nom et marque sont obligatoires' };
      }
      const parfum = await this.repo.create(data);
      return { success: true, data: parfum };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateParfum(id: number, data: Partial<Parfum>): Promise<ApiResponse<Parfum>> {
    try {
      const parfum = await this.repo.update(id, data);
      return { success: true, data: parfum };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteParfum(id: number): Promise<ApiResponse<void>> {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getParfumHistory(parfumId: number): Promise<ApiResponse<any[]>> {
    try {
      const history = await this.repo.getHistory(parfumId);
      return { success: true, data: history };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async duplicateParfum(id: number, newData?: Partial<Parfum>): Promise<ApiResponse<Parfum>> {
    try {
      const parfum = await this.repo.duplicate(id, newData);
      return { success: true, data: parfum };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getParfumByBarcode(barcode: string): Promise<ApiResponse<Parfum | null>> {
    try {
      const parfum = await this.repo.getByBarcode(barcode);
      return { success: true, data: parfum };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getParfumsByCategory(categoryId: number): Promise<ApiResponse<Parfum[]>> {
    try {
      const parfums = await this.repo.getByCategory(categoryId);
      return { success: true, data: parfums };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getParfumsByTag(tagId: number): Promise<ApiResponse<Parfum[]>> {
    try {
      const parfums = await this.repo.getByTag(tagId);
      return { success: true, data: parfums as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Note: Marketing/Promotion features should be moved to ParfumReference logic
  async applyPromotion(id: number, _discountPercentage: number): Promise<ApiResponse<number>> {
    return { success: false, error: 'Promotion feature needs to be updated for reference-based pricing' };
  }

  async calculateProfitMargin(_id: number, _costPrice: number): Promise<ApiResponse<number>> {
    return { success: false, error: 'Calculated margin feature needs update' };
  }

  async convertPriceToDZD(_id: number, _exchangeRate: number): Promise<ApiResponse<number>> {
    return { success: false, error: 'DZD conversion feature needs update' };
  }
}
