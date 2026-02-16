import { WarehouseRepository } from '../repositories/WarehouseRepository';
import { ApiResponse, Warehouse } from '../../src/shared/types';

export class WarehouseService {
  private repo = new WarehouseRepository();

  async getAll(): Promise<ApiResponse<Warehouse[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getById(id: number): Promise<ApiResponse<Warehouse>> {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async create(data: { nom: string; adresse?: string }): Promise<ApiResponse<Warehouse>> {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result as any };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async update(id: number, data: { nom?: string; adresse?: string }): Promise<ApiResponse<Warehouse>> {
    try {
      const result = await this.repo.update(id, data);
      return { success: true, data: result as any };
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
}