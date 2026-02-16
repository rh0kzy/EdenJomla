"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  parfums: {
    getAll: () => electron.ipcRenderer.invoke("parfum:getAll"),
    create: (data) => electron.ipcRenderer.invoke("parfum:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("parfum:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("parfum:delete", id),
    getHistory: (parfumId) => electron.ipcRenderer.invoke("parfum:getHistory", parfumId),
    duplicate: (id, data) => electron.ipcRenderer.invoke("parfum:duplicate", { id, data }),
    getByBarcode: (barcode) => electron.ipcRenderer.invoke("parfum:getByBarcode", barcode),
    getByCategory: (categoryId) => electron.ipcRenderer.invoke("parfum:getByCategory", categoryId),
    getByTag: (tagId) => electron.ipcRenderer.invoke("parfum:getByTag", tagId)
  },
  categories: {
    getAll: () => electron.ipcRenderer.invoke("category:getAll"),
    create: (data) => electron.ipcRenderer.invoke("category:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("category:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("category:delete", id)
  },
  tags: {
    getAll: () => electron.ipcRenderer.invoke("tag:getAll"),
    create: (data) => electron.ipcRenderer.invoke("tag:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("tag:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("tag:delete", id),
    getForParfum: (parfumId) => electron.ipcRenderer.invoke("tag:getForParfum", parfumId),
    setForParfum: (parfumId, tagIds) => electron.ipcRenderer.invoke("tag:setForParfum", { parfumId, tagIds })
  },
  fournisseurs: {
    getAll: () => electron.ipcRenderer.invoke("fournisseur:getAll"),
    create: (data) => electron.ipcRenderer.invoke("fournisseur:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("fournisseur:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("fournisseur:delete", id)
  },
  clients: {
    getAll: () => electron.ipcRenderer.invoke("client:getAll"),
    create: (data) => electron.ipcRenderer.invoke("client:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("client:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("client:delete", id)
  },
  references: {
    getAll: () => electron.ipcRenderer.invoke("reference:getAll"),
    create: (data) => electron.ipcRenderer.invoke("reference:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("reference:update", { id, data }),
    delete: (id) => electron.ipcRenderer.invoke("reference:delete", id)
  },
  stock: {
    getAll: () => electron.ipcRenderer.invoke("stock:getAll"),
    updateQuantity: (referenceId, delta) => electron.ipcRenderer.invoke("stock:updateQuantity", { referenceId, delta }),
    setQuantity: (referenceId, quantity) => electron.ipcRenderer.invoke("stock:setQuantity", { referenceId, quantity })
  },
  uploadImage: (formData) => electron.ipcRenderer.invoke("upload:image", formData)
});
