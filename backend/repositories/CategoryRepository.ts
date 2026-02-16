import { PrismaClient } from '@prisma/client';
import { Category } from '../../src/shared/types';

export class CategoryRepository {
  private prisma = new PrismaClient();

  async getAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({
      orderBy: { nom: 'asc' }
    });
  }

  async getById(id: number): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return await this.prisma.category.create({
      data
    });
  }

  async update(id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
    return await this.prisma.category.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id }
    });
  }

  async getByName(nom: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { nom }
    });
  }
}