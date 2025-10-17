import { Response, PurchaseOrder, CreatePurchaseOrderPayload } from '@/api/interfaces'
import { CreatePurchaseOrderItem, PurchaseOrderItem, PurchaseOrderStatus } from '../interfaces/purchase_orders'

export const getPurchaseOrders = async (callback: any): Promise<Response<PurchaseOrder[]>> => window.electron.getPurchaseOrders(callback)
export const createPurchaseOrder = async (data: CreatePurchaseOrderPayload, callback: any) => window.electron.createPurchaseOrder(data, callback)
export const updatePurchaseOrder = async (data: { id: string, purchaseOrder: Partial<PurchaseOrder>}, callback: any) => window.electron.updatePurchaseOrder(data, callback)
export const updatePurchaseOrderItem = async (data: { id: string, purchaseOrderItem: Partial<PurchaseOrderItem> }, callback: any) => window.electron.updatePurchaseOrderItem(data, callback)
export const updatePurchaseOrderItems = async (items: Array<Partial<PurchaseOrderItem>>, callback: any) => window.electron.updatePurchaseOrderItems(items, callback)
export const updatePurchaseOrderStatus = async (data: { id: string, status: PurchaseOrderStatus }, callback: any) => window.electron.updatePurchaseOrderStatus(data, callback)
export const updatePurchaseOrderDraftItems = async (data: { purchaseOrderId: string, items: Array<CreatePurchaseOrderItem> }, callback: any) => window.electron.updatePurchaseOrderDraftItems(data, callback)
export const deletePurchaseOrder = async (id: string, callback: any) => window.electron.deletePurchaseOrder(id, callback)
