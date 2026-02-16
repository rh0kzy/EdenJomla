import prisma from '../db/client';

export class WarehouseRepository {
  async getAll() {
    return prisma.warehouse.findMany({
      include: {
        _count: {
          select: { stocks: true }
        }
      }
    });
  }

  async getById(id: number) {
    return prisma.warehouse.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            reference: {
              include: {
                parfum: true,
                fournisseur: true
              }
            }
          }
        }
      }
    });
  }

  async create(data: { nom: string; adresse?: string }) {
    return prisma.warehouse.create({ data });
  }

  async update(id: number, data: { nom?: string; adresse?: string }) {
    return prisma.warehouse.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return prisma.warehouse.delete({
      where: { id }
    });
  }
}