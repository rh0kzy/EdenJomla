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
}
