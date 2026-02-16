import prisma from '../db/client';
import { Fournisseur } from '../../src/shared/types';

export class FournisseurRepository {
  async getAll() {
    return prisma.fournisseur.findMany({
      include: {
        contacts: true,
        documents: true,
        purchaseOrders: {
          orderBy: { createdAt: 'desc' }
        },
      }
    });
  }

  async getById(id: number) {
    return prisma.fournisseur.findUnique({
      where: { id },
      include: {
        contacts: true,
        documents: true,
        purchaseOrders: {
          orderBy: { createdAt: 'desc' }
        },
      }
    });
  }

  async create(data: any) {
    return prisma.fournisseur.create({
      data,
      include: {
        contacts: true,
        documents: true,
      }
    });
  }

  async update(id: number, data: any) {
    return prisma.fournisseur.update({
      where: { id },
      data,
      include: {
        contacts: true,
        documents: true,
      }
    });
  }

  // Contact management
  async addContact(fournisseurId: number, data: any) {
    return prisma.supplierContact.create({
      data: {
        ...data,
        fournisseurId,
      }
    });
  }

  async deleteContact(id: number) {
    return prisma.supplierContact.delete({
      where: { id }
    });
  }

  // Document management
  async addDocument(fournisseurId: number, data: any) {
    return prisma.supplierDocument.create({
      data: {
        ...data,
        fournisseurId,
      }
    });
  }

  async deleteDocument(id: number) {
    return prisma.supplierDocument.delete({
      where: { id }
    });
  }


  async delete(id: number) {
    return prisma.fournisseur.delete({
      where: { id },
    });
  }

  async getPricesByProduct(productId: number) {
    return prisma.fournisseur.findMany({
      where: {
        references: {
          some: {
            parfumId: productId,
          },
        },
      },
      select: {
        id: true,
        nom: true,
        references: {
          where: {
            parfumId: productId,
          },
          select: {
            prixUnitaire: true,
          },
        },
      },
    });
  }
}
