import { StockRepository } from '../repositories/StockRepository';
import { ApiResponse, Stock } from '../../src/shared/types';

export class StockService {
  private repo = new StockRepository();

  async getAll(): Promise<ApiResponse<Stock[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateQuantity(referenceId: number, delta: number): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.updateQuantity(referenceId, delta);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setQuantity(referenceId: number, quantity: number): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.setQuantity(referenceId, quantity);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
