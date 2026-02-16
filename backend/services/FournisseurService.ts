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

  async addContact(fournisseurId: number, data: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.repo.addContact(fournisseurId, data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteContact(id: number): Promise<ApiResponse<void>> {
    try {
      await this.repo.deleteContact(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async addDocument(fournisseurId: number, data: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.repo.addDocument(fournisseurId, data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteDocument(id: number): Promise<ApiResponse<void>> {
    try {
      await this.repo.deleteDocument(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateStats(fournisseurId: number): Promise<ApiResponse<void>> {
    try {
      const supplier = await this.repo.getById(fournisseurId);
      if (!supplier || !supplier.purchaseOrders) return { success: false, error: 'Supplier not found' };

      const receivedOrders = supplier.purchaseOrders.filter((o: any) => o.status === 'RECEIVED' && o.receivedAt);

      if (receivedOrders.length > 0) {
        // Calculate Avg Delivery Time
        const deliveryTimes = receivedOrders.map((o: any) => {
          const start = new Date(o.createdAt).getTime();
          const end = new Date(o.receivedAt).getTime();
          return (end - start) / (1000 * 60 * 60 * 24); // in days
        });
        const avgDeliveryTime = deliveryTimes.reduce((a: number, b: number) => a + b, 0) / deliveryTimes.length;

        // Calculate Reliability Rate (Pending logic: ratio of non-cancelled/on-time vs total)
        const totalOrders = supplier.purchaseOrders.length;
        const cancelledOrders = supplier.purchaseOrders.filter((o: any) => o.status === 'CANCELLED').length;
        const reliabilityRate = ((totalOrders - cancelledOrders) / totalOrders) * 100;

        await this.repo.update(fournisseurId, {
          avgDeliveryTime,
          reliabilityRate
        });
      }

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

