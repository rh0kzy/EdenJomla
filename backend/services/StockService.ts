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
      if (movements.length < 2) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } }; // Not enough data
      }

      // Simple calculation: average daily consumption
      const outMovements = movements.filter(m => m.type === 'OUT' && m.quantity < 0);
      if (outMovements.length === 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }

      const totalOut = outMovements.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
      const daysSpan = Math.max(1, (new Date().getTime() - new Date(movements[0].createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const dailyConsumption = totalOut / daysSpan;

      if (dailyConsumption <= 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }

      const available = stock.quantite - stock.reserved;
      const daysUntilRupture = available / dailyConsumption;
      const confidence = Math.min(0.8, outMovements.length / 10); // Basic confidence based on data points

      return { success: true, data: { daysUntilRupture: Math.round(daysUntilRupture), confidence } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
