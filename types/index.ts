export interface PerfumeItem {
  id: string;
  name: string;
  weight: number;
  weightUnit: 'g' | 'kg';
  pricePerUnit: number;
  totalPrice: number;
  createdAt: number;
}

export interface Facture {
  id: string;
  factureNumber: string;
  clientName: string;
  items: PerfumeItem[];
  totalAmount: number;
  createdAt: number;
  updatedAt: number;
}
