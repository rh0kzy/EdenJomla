import prisma from '../db/client';

export class StockRepository {
  async getAll() {
    return prisma.stock.findMany({
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true,
          }
        },
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Last 10 movements
        }
      }
    });
  }

  async getById(id: number) {
    return prisma.stock.findUnique({
      where: { id },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true,
          }
        },
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async updateQuantity(referenceId: number, delta: number, user?: string, reason?: string) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });

    if (!stock) {
      const newStock = await prisma.stock.create({
        data: {
          parfumReferenceId: referenceId,
          quantite: delta
        }
      });
      await this.createMovement(newStock.id, delta > 0 ? 'IN' : 'OUT', delta, user, reason);
      return newStock;
    }

    const newQuantity = stock.quantite + delta;
    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        quantite: newQuantity
      }
    });

    await this.createMovement(stock.id, delta > 0 ? 'IN' : 'OUT', delta, user, reason);
    return updatedStock;
  }

  async setQuantity(referenceId: number, quantity: number, user?: string, reason?: string) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });

    let delta = quantity;
    if (stock) {
      delta = quantity - stock.quantite;
    }

    const updatedStock = await prisma.stock.upsert({
      where: { parfumReferenceId: referenceId },
      update: { quantite: quantity },
      create: {
        parfumReferenceId: referenceId,
        quantite: quantity
      }
    });

    if (stock) {
      await this.createMovement(stock.id, 'ADJUSTMENT', delta, user, reason);
    } else {
      await this.createMovement(updatedStock.id, 'IN', quantity, user, reason);
    }

    return updatedStock;
  }

  async updateStockDetails(referenceId: number, data: {
    seuilMin?: number;
    seuilMax?: number;
    emplacement?: string;
    lot?: string;
    datePeremption?: Date;
    warehouseId?: number;
  }) {
    return prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data
    });
  }

  async reserveStock(referenceId: number, quantity: number, user?: string) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });

    if (!stock || stock.quantite - stock.reserved < quantity) {
      throw new Error('Insufficient stock for reservation');
    }

    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        reserved: stock.reserved + quantity
      }
    });

    await this.createMovement(stock.id, 'RESERVATION', quantity, user, 'Stock reservation');
    return updatedStock;
  }

  async cancelReservation(referenceId: number, quantity: number, user?: string) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });

    if (!stock || stock.reserved < quantity) {
      throw new Error('Invalid reservation quantity');
    }

    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        reserved: stock.reserved - quantity
      }
    });

    await this.createMovement(stock.id, 'CANCEL_RESERVATION', -quantity, user, 'Cancel reservation');
    return updatedStock;
  }

  async getMovements(stockId: number, limit?: number) {
    return prisma.stockMovement.findMany({
      where: { stockId },
      orderBy: { createdAt: 'desc' },
      take: limit || 50
    });
  }

  async getLowStockAlerts() {
    return prisma.stock.findMany({
      where: {
        AND: [
          { seuilMin: { not: null } },
          { quantite: { lte: prisma.stock.fields.seuilMin } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }

  async getHighStockAlerts() {
    return prisma.stock.findMany({
      where: {
        AND: [
          { seuilMax: { not: null } },
          { quantite: { gte: prisma.stock.fields.seuilMax } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }

  async getExpiringStock(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.stock.findMany({
      where: {
        AND: [
          { datePeremption: { not: null } },
          { datePeremption: { lte: futureDate } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }

  private async createMovement(stockId: number, type: string, quantity: number, user?: string, reason?: string) {
    return prisma.stockMovement.create({
      data: {
        stockId,
        type,
        quantity,
        user,
        reason
      }
    });
  }
}
