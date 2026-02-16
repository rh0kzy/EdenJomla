import prisma from '../db/client';

export class InventoryRepository {
  async getAll() {
    return prisma.inventory.findMany({
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: number) {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
              include: {
                reference: {
                  include: {
                    parfum: true,
                    fournisseur: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async create(data: {
    nom: string;
    description?: string;
    warehouseId?: number;
    user?: string;
  }) {
    // Create inventory with all current stock items
    const whereClause: any = {};
    if (data.warehouseId) {
      whereClause.warehouseId = data.warehouseId;
    }

    const stocks = await prisma.stock.findMany({
      where: whereClause,
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });

    const inventory = await prisma.inventory.create({
      data: {
        nom: data.nom,
        description: data.description,
        warehouseId: data.warehouseId,
        user: data.user,
        lines: {
          create: stocks.map(stock => ({
            stockId: stock.id,
            expectedQty: stock.quantite
          }))
        }
      },
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
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
        }
      }
    });

    return inventory;
  }

  async startInventory(id: number, user?: string) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        user
      }
    });
  }

  async completeInventory(id: number, user?: string) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        user
      }
    });
  }

  async cancelInventory(id: number, user?: string) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        user
      }
    });
  }

  async updateLine(inventoryId: number, stockId: number, countedQty: number, notes?: string, user?: string) {
    const line = await prisma.inventoryLine.findUnique({
      where: {
        inventoryId_stockId: {
          inventoryId,
          stockId
        }
      }
    });

    if (!line) {
      throw new Error('Inventory line not found');
    }

    const difference = countedQty - line.expectedQty;

    return prisma.inventoryLine.update({
      where: {
        inventoryId_stockId: {
          inventoryId,
          stockId
        }
      },
      data: {
        countedQty,
        difference,
        notes,
        scannedAt: new Date()
      }
    });
  }

  async getInventoryReport(id: number) {
    const inventory = await this.getById(id);
    if (!inventory) return null;

    const totalItems = inventory.lines.length;
    const countedItems = inventory.lines.filter((line: any) => line.countedQty !== null).length;
    const discrepancies = inventory.lines.filter((line: any) => line.difference !== 0 && line.difference !== null);

    const totalExpectedValue = inventory.lines.reduce((sum: number, line: any) => sum + (line.expectedQty * line.stock!.reference.prixUnitaire), 0);
    const totalCountedValue = inventory.lines.reduce((sum: number, line: any) => sum + ((line.countedQty || 0) * line.stock!.reference.prixUnitaire), 0);

    return {
      ...inventory,
      summary: {
        totalItems,
        countedItems,
        completionPercentage: totalItems > 0 ? (countedItems / totalItems) * 100 : 0,
        discrepanciesCount: discrepancies.length,
        totalExpectedValue,
        totalCountedValue,
        valueDifference: totalCountedValue - totalExpectedValue
      }
    };
  }

  async delete(id: number) {
    // Delete inventory lines first due to cascade
    await prisma.inventoryLine.deleteMany({
      where: { inventoryId: id }
    });

    return prisma.inventory.delete({
      where: { id }
    });
  }
}