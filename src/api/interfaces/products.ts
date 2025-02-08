export interface Product {
  id: string;
  id_company: string;
  id_category: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  category: string;
  unit_measurement: UnitMeasurement;
  is_bulk: boolean;
  unlimited_stock: boolean;
  stock: number;
  stock_minimum: number;
  purchase_price: number;
  selling_price: number;
  taxes: ProductTax[];
  is_active: boolean;
  has_expiration_date: boolean;
  expiration_date?: Date;
  requires_quantity?: boolean;
  is_composite: boolean;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  synced_at?: Date;
}

export interface ProductTax {
  code: string;
  name: string;
  type: string;
  value: number | null;
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
  subtotal: number
}

export interface CreateProduct {
  id_company: string;
  id_category: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  unit_measurement: UnitMeasurement;
  is_bulk: boolean;
  unlimited_stock: boolean;
  stock: number | null;
  stock_minimum: number | null;
  purchase_price: number;
  selling_price: number;
  taxes: ProductTax[];
  is_active: boolean;
  has_expiration_date: boolean;
  expiration_date?: Date;
  requires_quantity?: boolean;
  is_composite: boolean;
}