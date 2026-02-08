import { create } from 'zustand';
import { Parfum, Fournisseur, Client, ParfumReference, Stock } from '../../../src/shared/types';

interface DataState {
  parfums: Parfum[];
  fournisseurs: Fournisseur[];
  clients: Client[];
  references: ParfumReference[];
  stock: Stock[];
  loading: boolean;
  error: string | null;

  fetchParfums: () => Promise<void>;
  fetchFournisseurs: () => Promise<void>;
  fetchClients: () => Promise<void>;
  fetchReferences: () => Promise<void>;
  fetchStock: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  parfums: [],
  fournisseurs: [],
  clients: [],
  references: [],
  stock: [],
  loading: false,
  error: null,

  fetchParfums: async () => {
    set({ loading: true });
    const res = await window.api.parfums.getAll();
    if (res.success) set({ parfums: res.data, loading: false });
    else set({ error: res.error, loading: false });
  },

  fetchFournisseurs: async () => {
    set({ loading: true });
    const res = await window.api.fournisseurs.getAll();
    if (res.success) set({ fournisseurs: res.data, loading: false });
    else set({ error: res.error, loading: false });
  },

  fetchClients: async () => {
    set({ loading: true });
    const res = await window.api.clients.getAll();
    if (res.success) set({ clients: res.data, loading: false });
    else set({ error: res.error, loading: false });
  },

  fetchReferences: async () => {
    set({ loading: true });
    const res = await window.api.references.getAll();
    if (res.success) set({ references: res.data, loading: false });
    else set({ error: res.error, loading: false });
  },

  fetchStock: async () => {
    set({ loading: true });
    const res = await window.api.stock.getAll();
    if (res.success) set({ stock: res.data, loading: false });
    else set({ error: res.error, loading: false });
  },
}));
