import prisma from '../db/client';
import { Parfum, ParfumReference } from '../../src/shared/types';

export class ParfumRepository {
  async getAll() {
    return prisma.parfum.findMany({
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
    });
  }

  async getById(id: number) {
    return prisma.parfum.findUnique({
      where: { id },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
    });
  }

  async create(data: Omit<Parfum, 'id'>) {
    const parfum = await prisma.parfum.create({
      data: {
        nom: data.nom,
        marque: data.marque,
        description: data.description,
        image: data.image,
        notes: data.notes,
        barcode: data.barcode,
        categoryId: data.categoryId,
        createdBy: data.createdBy || 'system',
        updatedBy: data.updatedBy || 'system',
      },
    });

    // Log creation in history
    await prisma.parfumHistory.create({
      data: {
        parfumId: parfum.id,
        action: 'CREATE',
        newData: JSON.stringify(parfum),
        changedBy: data.createdBy || 'system',
      },
    });

    return parfum;
  }

  async update(id: number, data: Partial<Parfum>) {
    // Get current data for history
    const currentParfum = await prisma.parfum.findUnique({
      where: { id },
    });

    const updatedParfum = await prisma.parfum.update({
      where: { id },
      data: {
        ...data,
        updatedBy: data.updatedBy || 'system',
      },
    });

    // Log update in history if there were changes
    if (currentParfum && JSON.stringify(currentParfum) !== JSON.stringify(updatedParfum)) {
      await prisma.parfumHistory.create({
        data: {
          parfumId: id,
          action: 'UPDATE',
          oldData: JSON.stringify(currentParfum),
          newData: JSON.stringify(updatedParfum),
          changedBy: data.updatedBy || 'system',
        },
      });
    }

    return updatedParfum;
  }

  async delete(id: number) {
    // Get current data for history before deletion
    const currentParfum = await prisma.parfum.findUnique({
      where: { id },
    });

    const deletedParfum = await prisma.parfum.delete({
      where: { id },
    });

    // Log deletion in history
    if (currentParfum) {
      await prisma.parfumHistory.create({
        data: {
          parfumId: id,
          action: 'DELETE',
          oldData: JSON.stringify(currentParfum),
          changedBy: 'system', // Could be passed as parameter in future
        },
      });
    }

    return deletedParfum;
  }

  async getHistory(parfumId: number) {
    return prisma.parfumHistory.findMany({
      where: { parfumId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async duplicate(id: number, newData?: Partial<Parfum>) {
    const originalParfum = await prisma.parfum.findUnique({
      where: { id },
      include: { references: true },
    });

    if (!originalParfum) {
      throw new Error('Parfum not found');
    }

    // Create duplicate with modified name
    const duplicateData = {
      nom: `${originalParfum.nom} (Copie)`,
      marque: originalParfum.marque,
      description: originalParfum.description,
      image: originalParfum.image,
      notes: originalParfum.notes,
      barcode: originalParfum.barcode,
      categoryId: originalParfum.categoryId,
      ...newData,
    };

    return this.create(duplicateData);
  }

  async getByBarcode(barcode: string) {
    return prisma.parfum.findUnique({
      where: { barcode },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
    });
  }

  async getByCategory(categoryId: number) {
    return prisma.parfum.findMany({
      where: { categoryId },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
    });
  }

  async getByTag(tagId: number) {
    return prisma.parfum.findMany({
      where: {
        tags: {
          some: { tagId }
        }
      },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
    });
  }
}
