import { ClientRepository } from '../repositories/ClientRepository';
import { ApiResponse, Client } from '../../src/shared/types';

export class ClientService {
  private repo = new ClientRepository();

  async getAll(): Promise<ApiResponse<Client[]>> {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async create(data: Omit<Client, 'id'>): Promise<ApiResponse<Client>> {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async update(id: number, data: Partial<Client>): Promise<ApiResponse<Client>> {
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
