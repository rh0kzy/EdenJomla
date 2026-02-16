import { CategoryRepository } from '../repositories/CategoryRepository';
import { ApiResponse, Category } from '../../src/shared/types';

export class CategoryService {
  private repo = new CategoryRepository();

  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await this.repo.getAll();
      return { success: true, data: categories };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> {
    try {
      if (!data.nom) {
        return { success: false, error: 'Le nom de la catégorie est obligatoire' };
      }

      // Check if category already exists
      const existingCategory = await this.repo.getByName(data.nom);
      if (existingCategory) {
        return { success: false, error: 'Une catégorie avec ce nom existe déjà' };
      }

      const category = await this.repo.create(data);
      return { success: true, data: category };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateCategory(id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Category>> {
    try {
      const category = await this.repo.update(id, data);
      return { success: true, data: category };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    try {
      // Check if category is used by parfums
      const parfumsInCategory = await this.repo.getById(id);
      if (parfumsInCategory) {
        // Note: In a real app, you'd check if parfums exist in this category
        // For now, we'll allow deletion and set categoryId to null in parfums
      }

      await this.repo.delete(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}