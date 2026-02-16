import { FournisseurRepository } from '../repositories/FournisseurRepository';
import { ApiResponse, Fournisseur } from '../../src/shared/types';

export class FournisseurService {
  private repo = new FournisseurRepository();

  async getAll(): Promise<ApiResponse<Fournisseur[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async create(data: Omit<Fournisseur, 'id'>): Promise<ApiResponse<Fournisseur>> {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async update(id: number, data: Partial<Fournisseur>): Promise<ApiResponse<Fournisseur>> {
    try {
      const result = await this.repo.update(id, data);
      return { success: true, data: result };
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

  async compareSupplierPrices(productId: number): Promise<ApiResponse<any[]>> {
    try {
      const prices = await this.repo.getPricesByProduct(productId);
      if (!prices || prices.length === 0) {
        return { success: false, error: 'No prices found for the product' };
      }

      const sortedPrices = prices.sort((a: any, b: any) => {
        const pA = a.references?.[0]?.prixUnitaire ?? Infinity;
        const pB = b.references?.[0]?.prixUnitaire ?? Infinity;
        return pA - pB;
      });
      return { success: true, data: sortedPrices };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
