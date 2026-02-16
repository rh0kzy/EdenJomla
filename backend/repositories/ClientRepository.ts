import prisma from '../db/client';
import { Client } from '../../src/shared/types';

export class ClientRepository {
  async getAll() {
    return prisma.client.findMany({
      include: {
        adresses: true,
        salesOrders: true,
      }
    });
  }

  async getById(id: number) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        adresses: true,
        salesOrders: true,
      }
    });
  }

  async create(data: Omit<Client, 'id' | 'points'>) {
    return prisma.client.create({
      data: {
        ...data,
        points: 0,
      },
      include: {
        adresses: true,
        salesOrders: true,
      }
    });
  }

  async update(id: number, data: Partial<Client>) {
    return prisma.client.update({
      where: { id },
      data,
      include: {
        adresses: true,
        salesOrders: true,
      }
    });
  }



  async delete(id: number) {
    return prisma.client.delete({
      where: { id },
    });
  }
}
