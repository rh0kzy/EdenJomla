import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  parfums: {
    getAll: () => ipcRenderer.invoke('parfum:getAll'),
    create: (data: any) => ipcRenderer.invoke('parfum:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('parfum:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('parfum:delete', id),
    getHistory: (parfumId: number) => ipcRenderer.invoke('parfum:getHistory', parfumId),
    duplicate: (id: number, data?: any) => ipcRenderer.invoke('parfum:duplicate', { id, data }),
    getByBarcode: (barcode: string) => ipcRenderer.invoke('parfum:getByBarcode', barcode),
    getByCategory: (categoryId: number) => ipcRenderer.invoke('parfum:getByCategory', categoryId),
    getByTag: (tagId: number) => ipcRenderer.invoke('parfum:getByTag', tagId),
  },
  categories: {
    getAll: () => ipcRenderer.invoke('category:getAll'),
    create: (data: any) => ipcRenderer.invoke('category:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('category:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('category:delete', id),
  },
  tags: {
    getAll: () => ipcRenderer.invoke('tag:getAll'),
    create: (data: any) => ipcRenderer.invoke('tag:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('tag:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('tag:delete', id),
    getForParfum: (parfumId: number) => ipcRenderer.invoke('tag:getForParfum', parfumId),
    setForParfum: (parfumId: number, tagIds: number[]) => ipcRenderer.invoke('tag:setForParfum', { parfumId, tagIds }),
  },
  fournisseurs: {
    getAll: () => ipcRenderer.invoke('fournisseur:getAll'),
    create: (data: any) => ipcRenderer.invoke('fournisseur:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('fournisseur:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('fournisseur:delete', id),
  },
  clients: {
    getAll: () => ipcRenderer.invoke('client:getAll'),
    create: (data: any) => ipcRenderer.invoke('client:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('client:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('client:delete', id),
  },
  references: {
    getAll: () => ipcRenderer.invoke('reference:getAll'),
    create: (data: any) => ipcRenderer.invoke('reference:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('reference:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('reference:delete', id),
  },
  stock: {
    getAll: () => ipcRenderer.invoke('stock:getAll'),
    updateQuantity: (referenceId: number, delta: number) => ipcRenderer.invoke('stock:updateQuantity', { referenceId, delta }),
    setQuantity: (referenceId: number, quantity: number) => ipcRenderer.invoke('stock:setQuantity', { referenceId, quantity }),
  },
  uploadImage: (formData: FormData) => ipcRenderer.invoke('upload:image', formData),
});
