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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface Fournisseur {
  id: number;
  nom: string;
  telephone?: string | null;
  email?: string | null;
}

export interface Client {
  id: number;
  nom: string;
  telephone?: string | null;
}

export interface ParfumHistory {
  id: number;
  parfumId: number;
  action: string;
  oldData?: string | null;
  newData?: string | null;
  changedBy: string;
  createdAt: string;
}

export interface Category {
  id: number;
  nom: string;
  description?: string | null;
  couleur?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: number;
  nom: string;
  couleur?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  parfum?: Parfum;
  fournisseur?: Fournisseur;
  stock?: Stock;
}

export interface Stock {
  id: number;
  parfumReferenceId: number;
  quantite: number;
  seuilMin?: number | null;
  seuilMax?: number | null;
  emplacement?: string | null;
  lot?: string | null;
  datePeremption?: string | null;
  reserved: number;
  warehouseId?: number | null;
  warehouse?: Warehouse | null;
  movements?: StockMovement[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  reason?: string | null;
  user?: string | null;
  createdAt: string;
  stock?: Stock;
}

export interface Warehouse {
  id: number;
  nom: string;
  adresse?: string | null;
  stocks?: Stock[];
}
