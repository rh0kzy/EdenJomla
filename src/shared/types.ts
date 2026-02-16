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
}
