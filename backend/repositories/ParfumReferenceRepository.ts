import prisma from '../db/client';
import { ParfumReference } from '../../src/shared/types';

export class ParfumReferenceRepository {
  async getAll() {
    return prisma.parfumReference.findMany({
      include: {
        parfum: true,
        fournisseur: true,
        stock: true,
      },
    });
  }

  async getById(id: number) {
    return prisma.parfumReference.findUnique({
      where: { id },
      include: {
        parfum: true,
        fournisseur: true,
        stock: true,
      },
    });
  }

  async getByCode(referenceCode: string) {
    return prisma.parfumReference.findUnique({
      where: { referenceCode },
    });
  }

  async create(data: Omit<ParfumReference, 'id'>) {
    return prisma.parfumReference.create({
      data: {
        referenceCode: data.referenceCode,
        unite: data.unite,
        prixUnitaire: data.prixUnitaire,
        prixPar100g: (data as any).prixPar100g,
        parfumId: data.parfumId,
        fournisseurId: data.fournisseurId,
        stock: {
          create: { quantite: 0 }
        }
      },
    });
  }

  async update(id: number, data: Partial<ParfumReference>) {
    return prisma.parfumReference.update({
      where: { id },
      data: {
        referenceCode: data.referenceCode,
        unite: data.unite,
        prixUnitaire: data.prixUnitaire,
        prixPar100g: (data as any).prixPar100g,
        parfumId: data.parfumId,
        fournisseurId: data.fournisseurId,
      },
    });
  }

  // Pricing methods
  async updatePrice(id: number, newPrice: number, reason?: string, changedBy = 'system') {
    return prisma.$transaction(async (tx) => {
      const current = await tx.parfumReference.findUnique({ where: { id } });
      if (!current) throw new Error('Reference not found');
      await tx.priceHistory.create({
        data: {
          parfumReferenceId: id,
          oldPrice: current.prixUnitaire,
          newPrice,
          reason,
          changedBy,
        },
      });
      return tx.parfumReference.update({ where: { id }, data: { prixUnitaire: newPrice } });
    });
  }

  async setPricePer100g(id: number, prixPar100g: number) {
    return prisma.parfumReference.update({ where: { id }, data: { prixPar100g } });
  }

  async getPriceHistory(referenceId: number, limit = 50) {
    return prisma.priceHistory.findMany({ where: { parfumReferenceId: referenceId }, orderBy: { createdAt: 'desc' }, take: limit });
  }

  async getPriceTiers(referenceId: number) {
    return prisma.priceTier.findMany({ where: { parfumReferenceId: referenceId }, orderBy: { minQty: 'asc' } });
  }

  async getOrderHistory(referenceId: number) {
    const purchaseItems = await prisma.purchaseOrderItem.findMany({
      where: { parfumReferenceId: referenceId },
      include: { purchaseOrder: { include: { fournisseur: true } } },
      orderBy: { purchaseOrder: { createdAt: 'desc' } }
    });

    const salesItems = await prisma.salesOrderItem.findMany({
      where: { parfumReferenceId: referenceId },
      include: { salesOrder: { include: { client: true } } },
      orderBy: { salesOrder: { createdAt: 'desc' } }
    });

    return {
      purchases: purchaseItems.map(item => ({
        id: item.id,
        orderId: item.purchaseOrderId,
        date: item.purchaseOrder.createdAt,
        type: 'PURCHASE',
        party: item.purchaseOrder.fournisseur.nom,
        quantity: item.quantite,
        price: item.prixUnitaire,
        status: item.purchaseOrder.status
      })),
      sales: salesItems.map(item => ({
        id: item.id,
        orderId: item.salesOrderId,
        date: item.salesOrder.createdAt,
        type: 'SALE',
        party: item.salesOrder.client.nom,
        quantity: item.quantite,
        price: item.prixUnitaire,
        status: item.salesOrder.status
      }))
    };
  }

  async bulkCreateOrUpdate(data: any[]) {
    return prisma.$transaction(async (tx) => {
      const results = [];
      for (const item of data) {
        const ref = await tx.parfumReference.upsert({
          where: { referenceCode: item.referenceCode },
          update: {
            unite: item.unite,
            prixUnitaire: item.prixUnitaire,
            prixPar100g: item.prixPar100g,
            parfumId: item.parfumId,
            fournisseurId: item.fournisseurId,
          },
          create: {
            referenceCode: item.referenceCode,
            unite: item.unite,
            prixUnitaire: item.prixUnitaire,
            prixPar100g: item.prixPar100g,
            parfumId: item.parfumId,
            fournisseurId: item.fournisseurId,
            stock: {
              create: { quantite: 0 }
            }
          }
        });
        results.push(ref);
      }
      return results;
    });
  }

  async setPriceTiers(referenceId: number, tiers: { minQty: number; maxQty?: number | null; price: number }[]) {
    return prisma.$transaction(async (tx) => {
      await tx.priceTier.deleteMany({ where: { parfumReferenceId: referenceId } });
      const created = await Promise.all(
        tiers.map((t) => tx.priceTier.create({ data: { parfumReferenceId: referenceId, minQty: t.minQty, maxQty: t.maxQty, price: t.price } }))
      );
      return created;
    });
  }

  async delete(id: number) {
    // Note: Depends on cascade delete in DB or manual cleanup
    return prisma.parfumReference.delete({
      where: { id },
    });
  }
}
