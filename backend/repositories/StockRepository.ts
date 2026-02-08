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
        }
      }
    });
  }

  async updateQuantity(referenceId: number, delta: number) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });

    if (!stock) {
      return prisma.stock.create({
        data: {
          parfumReferenceId: referenceId,
          quantite: delta
        }
      });
    }

    return prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        quantite: stock.quantite + delta
      }
    });
  }

  async setQuantity(referenceId: number, quantity: number) {
    return prisma.stock.upsert({
      where: { parfumReferenceId: referenceId },
      update: { quantite: quantity },
      create: {
        parfumReferenceId: referenceId,
        quantite: quantity
      }
    });
  }
}
