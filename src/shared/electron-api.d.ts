import { ApiResponse, Parfum, Fournisseur, Client, ParfumReference, Stock, StockMovement, Warehouse, Category, Tag } from './shared/types';

export interface IElectronAPI {
  parfums: {
    getAll: () => Promise<ApiResponse<Parfum[]>>;
    create: (data: Omit<Parfum, 'id'>) => Promise<ApiResponse<Parfum>>;
    update: (id: number, data: Partial<Parfum>) => Promise<ApiResponse<Parfum>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
    getHistory: (parfumId: number) => Promise<ApiResponse<any[]>>;
    duplicate: (id: number, data?: Partial<Parfum>) => Promise<ApiResponse<Parfum>>;
    getByBarcode: (barcode: string) => Promise<ApiResponse<Parfum | null>>;
    getByCategory: (categoryId: number) => Promise<ApiResponse<Parfum[]>>;
    getByTag: (tagId: number) => Promise<ApiResponse<Parfum[]>>;
  };
  categories: {
    getAll: () => Promise<ApiResponse<Category[]>>;
    create: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<Category>>;
    update: (id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<ApiResponse<Category>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  tags: {
    getAll: () => Promise<ApiResponse<Tag[]>>;
    create: (data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<Tag>>;
    update: (id: number, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<ApiResponse<Tag>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
    getForParfum: (parfumId: number) => Promise<ApiResponse<Tag[]>>;
    setForParfum: (parfumId: number, tagIds: number[]) => Promise<ApiResponse<void>>;
  };
  fournisseurs: {
    getAll: () => Promise<ApiResponse<Fournisseur[]>>;
    create: (data: Omit<Fournisseur, 'id'>) => Promise<ApiResponse<Fournisseur>>;
    update: (id: number, data: Partial<Fournisseur>) => Promise<ApiResponse<Fournisseur>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  clients: {
    getAll: () => Promise<ApiResponse<Client[]>>;
    create: (data: Omit<Client, 'id'>) => Promise<ApiResponse<Client>>;
    update: (id: number, data: Partial<Client>) => Promise<ApiResponse<Client>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  references: {
    getAll: () => Promise<ApiResponse<ParfumReference[]>>;
    create: (data: Omit<ParfumReference, 'id'>) => Promise<ApiResponse<ParfumReference>>;
    update: (id: number, data: Partial<ParfumReference>) => Promise<ApiResponse<ParfumReference>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  stock: {
    getAll: () => Promise<ApiResponse<Stock[]>>;
    getById: (id: number) => Promise<ApiResponse<Stock>>;
    updateQuantity: (referenceId: number, delta: number, user?: string, reason?: string) => Promise<ApiResponse<Stock>>;
    setQuantity: (referenceId: number, quantity: number, user?: string, reason?: string) => Promise<ApiResponse<Stock>>;
    updateDetails: (referenceId: number, data: { seuilMin?: number; seuilMax?: number; emplacement?: string; lot?: string; datePeremption?: Date; warehouseId?: number }) => Promise<ApiResponse<Stock>>;
    reserve: (referenceId: number, quantity: number, user?: string) => Promise<ApiResponse<Stock>>;
    cancelReservation: (referenceId: number, quantity: number, user?: string) => Promise<ApiResponse<Stock>>;
    getMovements: (stockId: number, limit?: number) => Promise<ApiResponse<StockMovement[]>>;
    getLowAlerts: () => Promise<ApiResponse<Stock[]>>;
    getHighAlerts: () => Promise<ApiResponse<Stock[]>>;
    getExpiring: (days?: number) => Promise<ApiResponse<Stock[]>>;
    predictRupture: (referenceId: number) => Promise<ApiResponse<{ daysUntilRupture: number; confidence: number }>>;
  };
  warehouses: {
    getAll: () => Promise<ApiResponse<Warehouse[]>>;
    getById: (id: number) => Promise<ApiResponse<Warehouse>>;
    create: (data: { nom: string; adresse?: string }) => Promise<ApiResponse<Warehouse>>;
    update: (id: number, data: { nom?: string; adresse?: string }) => Promise<ApiResponse<Warehouse>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  inventory: {
    getAll: () => Promise<ApiResponse<Inventory[]>>;
    getById: (id: number) => Promise<ApiResponse<Inventory>>;
    create: (data: { nom: string; description?: string; warehouseId?: number; user?: string }) => Promise<ApiResponse<Inventory>>;
    start: (id: number, user?: string) => Promise<ApiResponse<Inventory>>;
    complete: (id: number, user?: string) => Promise<ApiResponse<Inventory>>;
    cancel: (id: number, user?: string) => Promise<ApiResponse<Inventory>>;
    updateLine: (inventoryId: number, stockId: number, countedQty: number, notes?: string, user?: string) => Promise<ApiResponse<InventoryLine>>;
    getReport: (id: number) => Promise<ApiResponse<any>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
    findByBarcode: (barcode: string) => Promise<ApiResponse<any>>;
  };
  uploadImage: (formData: FormData) => Promise<ApiResponse<{ filename: string; path: string }>>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
