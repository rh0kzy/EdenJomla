import { PrismaClient } from '@prisma/client';
import { Tag } from '../../src/shared/types';

export class TagRepository {
  private prisma = new PrismaClient();

  async getAll(): Promise<Tag[]> {
    return await this.prisma.tag.findMany({
      orderBy: { nom: 'asc' }
    });
  }

  async getById(id: number): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
    return await this.prisma.tag.create({
      data
    });
  }

  async update(id: number, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tag.delete({
      where: { id }
    });
  }

  async getByName(nom: string): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: { nom }
    });
  }

  async getTagsForParfum(parfumId: number): Promise<Tag[]> {
    const parfumTags = await this.prisma.parfumTag.findMany({
      where: { parfumId },
      include: { tag: true }
    });
    return parfumTags.map(pt => pt.tag);
  }

  async setTagsForParfum(parfumId: number, tagIds: number[]): Promise<void> {
    // Remove existing tags
    await this.prisma.parfumTag.deleteMany({
      where: { parfumId }
    });

    // Add new tags
    if (tagIds.length > 0) {
      await this.prisma.parfumTag.createMany({
        data: tagIds.map(tagId => ({
          parfumId,
          tagId
        }))
      });
    }
  }
}