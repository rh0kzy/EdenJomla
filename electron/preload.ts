import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  parfums: {
    getAll: () => ipcRenderer.invoke('parfum:getAll'),
    create: (data: any) => ipcRenderer.invoke('parfum:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('parfum:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('parfum:delete', id),
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
  }
});
