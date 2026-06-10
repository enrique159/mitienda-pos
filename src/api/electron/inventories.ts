import type { CreateInventory, Inventory, InventoryStatus, Response, UpdateInventoryItem } from '@/api/interfaces'

export const getInventories = async (
  status: InventoryStatus | 'all',
  callback: (response: Response<Inventory[]>) => void
) => window.electron.getInventories(status, callback)

export const getInventoryById = async (
  id: string,
  callback: (response: Response<Inventory | null>) => void
) => window.electron.getInventoryById(id, callback)

export const createInventory = async (
  inventory: CreateInventory,
  callback: (response: Response<{ id: string }>) => void
) => window.electron.createInventory(inventory, callback)

export const startInventory = async (
  data: { id: string, sellerId: string },
  callback: (response: Response<{ id: string }>) => void
) => window.electron.startInventory(data, callback)

export const updateInventoryItems = async (
  data: { inventoryId: string, items: UpdateInventoryItem[] },
  callback: (response: Response<{ id: string }>) => void
) => window.electron.updateInventoryItems(data, callback)

export const approveInventory = async (
  data: { id: string, sellerId: string },
  callback: (response: Response<{ id: string }>) => void
) => window.electron.approveInventory(data, callback)

export const cancelInventory = async (
  id: string,
  callback: (response: Response<{ id: string }>) => void
) => window.electron.cancelInventory(id, callback)
