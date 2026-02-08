import prisma from '../db/client';
import { Client } from '../../src/shared/types';

export class ClientRepository {
  async getAll() {
    return prisma.client.findMany();
  }

  async getById(id: number) {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Client, 'id'>) {
    return prisma.client.create({
      data,
    });
  }

  async update(id: number, data: Partial<Client>) {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.client.delete({
      where: { id },
    });
  }
}
