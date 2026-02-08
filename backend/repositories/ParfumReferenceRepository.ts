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
        parfumId: data.parfumId,
        fournisseurId: data.fournisseurId,
      },
    });
  }

  async delete(id: number) {
    // Note: Depends on cascade delete in DB or manual cleanup
    return prisma.parfumReference.delete({
      where: { id },
    });
  }
}
