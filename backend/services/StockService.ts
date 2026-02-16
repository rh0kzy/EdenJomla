import { StockRepository } from '../repositories/StockRepository';
import { ApiResponse, Stock, StockMovement } from '../../src/shared/types';

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

  async getById(id: number): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateQuantity(referenceId: number, delta: number, user?: string, reason?: string): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.updateQuantity(referenceId, delta, user, reason);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setQuantity(referenceId: number, quantity: number, user?: string, reason?: string): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.setQuantity(referenceId, quantity, user, reason);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateStockDetails(referenceId: number, data: {
    seuilMin?: number;
    seuilMax?: number;
    emplacement?: string;
    lot?: string;
    datePeremption?: Date;
    warehouseId?: number;
  }): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.updateStockDetails(referenceId, data);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async reserveStock(referenceId: number, quantity: number, user?: string): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.reserveStock(referenceId, quantity, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async cancelReservation(referenceId: number, quantity: number, user?: string): Promise<ApiResponse<Stock>> {
    try {
      const result = await this.repo.cancelReservation(referenceId, quantity, user);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getMovements(stockId: number, limit?: number): Promise<ApiResponse<StockMovement[]>> {
    try {
      const result = await this.repo.getMovements(stockId, limit);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getLowStockAlerts(): Promise<ApiResponse<Stock[]>> {
    try {
      const result = await this.repo.getLowStockAlerts();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getHighStockAlerts(): Promise<ApiResponse<Stock[]>> {
    try {
      const result = await this.repo.getHighStockAlerts();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExpiringStock(days?: number): Promise<ApiResponse<Stock[]>> {
    try {
      const result = await this.repo.getExpiringStock(days);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Basic IA prediction for stock rupture (simple linear regression based on last movements)
  async predictStockRupture(referenceId: number): Promise<ApiResponse<{ daysUntilRupture: number; confidence: number }>> {
    try {
      const stock = await this.repo.getById(referenceId);
      if (!stock) {
        return { success: false, error: 'Stock not found' };
      }

      const movements = stock.movements || [];
      if (!Array.isArray(movements) || movements.length < 2) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } }; // Not enough data
      }

      // Simple calculation: average daily consumption
      const outMovements = movements.filter((m: any) => m.type === 'OUT' && m.quantity < 0);
      if (outMovements.length === 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }

      const totalOut = outMovements.reduce((sum: number, m: any) => sum + Math.abs(m.quantity), 0);
      const daysSpan = Math.max(1, (new Date().getTime() - new Date(movements[0].createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const dailyConsumption = totalOut / daysSpan;

      if (dailyConsumption <= 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }

      const available = stock.quantite - (stock.reserved || 0); // Default reserved to 0 if undefined
      const daysUntilRupture = available / dailyConsumption;
      const confidence = Math.min(0.8, outMovements.length / 10); // Basic confidence based on data points

      return { success: true, data: { daysUntilRupture: Math.round(daysUntilRupture), confidence } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async calculateTieredPricing(basePrice: number, quantity: number): Promise<ApiResponse<number>> {
    try {
      let discount = 0;
      if (quantity >= 100) {
        discount = 0.2; // 20% discount for 100 or more
      } else if (quantity >= 50) {
        discount = 0.1; // 10% discount for 50 or more
      } else if (quantity >= 10) {
        discount = 0.05; // 5% discount for 10 or more
      }

      const finalPrice = basePrice * (1 - discount);
      return { success: true, data: finalPrice };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
