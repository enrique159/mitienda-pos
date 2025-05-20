export interface PurchaseOrder {
  id: string;
  id_company: string;
  id_branch: string;
  id_provider: string;
  id_seller: string;
  provider_name: string;
  seller_name: string;
  status: PurchaseOrderStatus;
  notes: string | null;
  ordered_at: string | null;
  received_at: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  id_purchase_order: string;
  id_product: string;
  quantity_ordered: number;
  quantity_received: number | null;
  incidence: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
}

export type CreatePurchaseOrder = Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'synced_at' | 'items' | 'provider_name' | 'seller_name'>
export type CreatePurchaseOrderItem = Omit<PurchaseOrderItem, 'id' | 'id_purchase_order' | 'created_at' | 'updated_at' | 'synced_at'>;
export interface CreatePurchaseOrderPayload {
  purchaseOrder: CreatePurchaseOrder;
  items: CreatePurchaseOrderItem[];
}


export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  HAS_ISSUES = 'has_issues',
}

export const PurchaseOrderItemIncidenceOptions = Object.freeze([
  { value: 'missing', label: 'Faltante' }, // No se recibió el producto
  { value: 'damaged', label: 'Dañado' }, // Producto roto o defectuoso
  { value: 'expired', label: 'Caducado' }, // Fecha de caducidad expirada (para alimentos/medicina)
  { value: 'wrong_product', label: 'Producto incorrecto' }, // Se recibió un producto diferente
  { value: 'extra', label: 'Producto extra' }, // Se recibió más de lo solicitado
  { value: 'partial', label: 'Entrega parcial' }, // Se recibió solo parte de la cantidad
  { value: 'wrong_quantity', label: 'Cantidad incorrecta' }, // Se recibió una cantidad diferente
  { value: 'packaging_issue', label: 'Problemas de empaque' }, // Embalaje dañado, mojado, etc.
  { value: 'other', label: 'Otro' }, // Para incidentes no contemplados
])