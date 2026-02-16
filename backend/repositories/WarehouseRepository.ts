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
    // Check if warehouse has stocks
    const stockCount = await prisma.stock.count({
      where: { warehouseId: id }
    });

    if (stockCount > 0) {
      throw new Error('Cannot delete warehouse with existing stock');
    }

    return prisma.warehouse.delete({
      where: { id }
    });
  }
}