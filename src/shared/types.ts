export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Unit = 'GRAMME' | 'KILOGRAMME';

export interface Parfum {
  id: number;
  nom: string;
  marque: string;
  description?: string | null;
  image?: string | null;
  notes?: string | null;
  barcode?: string | null;
  categoryId?: number | null;
  category?: Category | null;
  tags?: ParfumTag[];
  certifications?: string | null;
  msdsUrl?: string | null;
  techSheetUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface Fournisseur {
  id: number;
  nom: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  rating?: number | null;
  reliabilityRate?: number | null;
  avgDeliveryTime?: number | null;
  notes?: string | null;
  contacts?: SupplierContact[];
  documents?: SupplierDocument[];
  purchaseOrders?: PurchaseOrder[];
}

export interface SupplierContact {
  id: number;
  nom: string;
  fonction?: string | null;
  telephone?: string | null;
  email?: string | null;
  fournisseurId: number;
}

export interface SupplierDocument {
  id: number;
  nom: string;
  url: string;
  type?: string | null;
  fournisseurId: number;
  createdAt: Date;
}


export interface Client {
  id: number;
  nom: string;
  telephone?: string | null;
  email?: string | null;
  points: number;
  segment?: string | null;
  notes?: string | null;
  anniversaire?: Date | null;
  adresses?: Address[];
}

export interface Address {
  id: number;
  rue: string;
  ville: string;
  codePostal?: string | null;
  clientId: number;
  isDefault: boolean;
}


export interface ParfumHistory {
  id: number;
  parfumId: number;
  action: string;
  oldData?: string | null;
  newData?: string | null;
  changedBy: string;
  createdAt: Date;
}

export interface Category {
  id: number;
  nom: string;
  description?: string | null;
  couleur?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tag {
  id: number;
  nom: string;
  couleur?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParfumTag {
  id: number;
  parfumId: number;
  tagId: number;
  parfum?: Parfum;
  tag?: Tag;
}

export interface ParfumReference {
  id: number;
  parfumId: number;
  fournisseurId: number;
  referenceCode: string;
  unite: string;
  prixUnitaire: number;
  prixPar100g?: number | null;
  parfum?: Parfum;
  fournisseur?: Fournisseur;
  stock?: Stock;
}

export interface PriceHistory {
  id: number;
  parfumReferenceId: number;
  oldPrice: number;
  newPrice: number;
  reason?: string | null;
  changedBy: string;
  createdAt: Date;
}

export interface PriceTier {
  id: number;
  parfumReferenceId: number;
  minQty: number;
  maxQty?: number | null;
  price: number;
  createdAt?: Date;
}

export interface Stock {
  id: number;
  parfumReferenceId: number;
  quantite: number;
  seuilMin?: number | null;
  seuilMax?: number | null;
  emplacement?: string | null;
  lot?: string | null;
  datePeremption?: Date | null;
  reserved: number;
  warehouseId?: number | null;
  warehouse?: Warehouse | null;
  movements?: StockMovement[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockMovement {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  reason?: string | null;
  user?: string | null;
  createdAt: Date;
  stock?: Stock;
}

export interface Warehouse {
  id: number;
  nom: string;
  adresse?: string | null;
  stocks?: Stock[];
  inventories?: Inventory[];
}

export interface Inventory {
  id: number;
  nom: string;
  description?: string | null;
  warehouseId?: number | null;
  warehouse?: Warehouse | null;
  status: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
  user?: string | null;
  notes?: string | null;
  lines?: InventoryLine[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryLine {
  id: number;
  inventoryId: number;
  inventory?: Inventory;
  stockId: number;
  stock?: Stock;
  expectedQty: number;
  countedQty?: number | null;
  difference?: number | null;
  notes?: string | null;
  scannedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface PurchaseOrder {
  id: number;
  fournisseurId: number;
  fournisseur?: Fournisseur;
  status: string;
  totalAmount: number;
  receivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  parfumReferenceId: number;
  parfumReference?: ParfumReference;
  quantite: number;
  prixUnitaire: number;
}
