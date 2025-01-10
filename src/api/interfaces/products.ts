export interface Product {
  id: string;
  id_company: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  category: string;
  unit_measurement: UnitMeasurement;
  stock: number;
  stock_minimum: number;
  purchase_price: number;
  selling_price: number;
  tax_rate: number;
  discount_rate: number;
  is_active: boolean;
  has_expiration_date: boolean;
  expiration_date?: Date;
  is_composite: boolean;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  synced_at?: Date;
}

export enum UnitMeasurement {
  PIECE = 'piece',
  KG = 'kg',
  G = 'g',
  LITER = 'liter',
  ML = 'ml',
  BOX = 'box',
  OTHER = 'other',
}

export type Unit = 'u' | 'kg' | 'g' | 'L' | 'ml' | 'caja' | 'otro';

export interface ProductCart extends Product {
  quantity: number
}

export interface Category {
  category: string;
}