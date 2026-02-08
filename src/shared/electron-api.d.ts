import { ApiResponse, Parfum, Fournisseur, Client, ParfumReference, Stock } from './shared/types';

export interface IElectronAPI {
  parfums: {
    getAll: () => Promise<ApiResponse<Parfum[]>>;
    create: (data: Omit<Parfum, 'id'>) => Promise<ApiResponse<Parfum>>;
    update: (id: number, data: Partial<Parfum>) => Promise<ApiResponse<Parfum>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
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
    updateQuantity: (referenceId: number, delta: number) => Promise<ApiResponse<Stock>>;
    setQuantity: (referenceId: number, quantity: number) => Promise<ApiResponse<Stock>>;
  };
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
