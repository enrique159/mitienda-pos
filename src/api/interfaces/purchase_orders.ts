export interface PurchaseOrder {
  id: string;
  id_company: string;
  id_branch: string;
  id_provider: string;
  id_seller: string;
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
  quantity_received: number;
  incidence: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
}

export type CreatePurchaseOrder = Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'synced_at' | 'items'> & {
  items: CreatePurchaseOrderItem[];
};

export type CreatePurchaseOrderItem = Omit<PurchaseOrderItem, 'id' | 'id_purchase_order' | 'created_at' | 'updated_at' | 'synced_at'>;

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}