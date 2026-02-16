import { TagRepository } from '../repositories/TagRepository';
import { ApiResponse, Tag } from '../../src/shared/types';

export class TagService {
  private repo = new TagRepository();

  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const tags = await this.repo.getAll();
      return { success: true, data: tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createTag(data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Tag>> {
    try {
      if (!data.nom) {
        return { success: false, error: 'Le nom du tag est obligatoire' };
      }

      // Check if tag already exists
      const existingTag = await this.repo.getByName(data.nom);
      if (existingTag) {
        return { success: false, error: 'Un tag avec ce nom existe déjà' };
      }

      const tag = await this.repo.create(data);
      return { success: true, data: tag };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateTag(id: number, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Tag>> {
    try {
      const tag = await this.repo.update(id, data);
      return { success: true, data: tag };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteTag(id: number): Promise<ApiResponse<void>> {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getTagsForParfum(parfumId: number): Promise<ApiResponse<Tag[]>> {
    try {
      const tags = await this.repo.getTagsForParfum(parfumId);
      return { success: true, data: tags };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async setTagsForParfum(parfumId: number, tagIds: number[]): Promise<ApiResponse<void>> {
    try {
      await this.repo.setTagsForParfum(parfumId, tagIds);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}