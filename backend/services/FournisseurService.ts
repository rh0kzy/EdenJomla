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
}
