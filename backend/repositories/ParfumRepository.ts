import prisma from '../db/client';
import { Parfum, ParfumReference } from '../../src/shared/types';

export class ParfumRepository {
  async getAll() {
    return prisma.parfum.findMany({
      include: { references: true },
    });
  }

  async getById(id: number) {
    return prisma.parfum.findUnique({
      where: { id },
      include: { references: true },
    });
  }

  async create(data: Omit<Parfum, 'id'>) {
    return prisma.parfum.create({
      data: {
        nom: data.nom,
        marque: data.marque,
        description: data.description,
      },
    });
  }

  async update(id: number, data: Partial<Parfum>) {
    return prisma.parfum.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.parfum.delete({
      where: { id },
    });
  }
}
