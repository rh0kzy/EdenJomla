import prisma from '../db/client';
import { Fournisseur } from '../../src/shared/types';

export class FournisseurRepository {
  async getAll() {
    return prisma.fournisseur.findMany();
  }

  async getById(id: number) {
    return prisma.fournisseur.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Fournisseur, 'id'>) {
    return prisma.fournisseur.create({
      data,
    });
  }

  async update(id: number, data: Partial<Fournisseur>) {
    return prisma.fournisseur.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.fournisseur.delete({
      where: { id },
    });
  }
}
