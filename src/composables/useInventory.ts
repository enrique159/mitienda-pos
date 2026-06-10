import { getInventories } from '@/api/electron'
import { Inventory, Response } from '@/api/interfaces'
import { useInventoryStore } from '@/stores/inventoryStore'
import { storeToRefs } from 'pinia'

export const useInventory = () => {
  const inventoryStore = useInventoryStore()
  const { inventories, currentInventory } = storeToRefs(inventoryStore)

  const setInventories = (newInventories: Inventory[]) => {
    inventoryStore.setInventories(newInventories)
  }

  const setCurrentInventory = (inventory: Inventory | null) => {
    inventoryStore.setCurrentInventory(inventory)
  }

  const refreshInventories = () => new Promise<Response<Inventory[]>>((resolve) => {
    getInventories('all', (response: Response<Inventory[]>) => {
      if (response.success) {
        setInventories(response.response)
      }
      resolve(response)
    })
  })

  return {
    inventories,
    currentInventory,
    setInventories,
    setCurrentInventory,
    refreshInventories,
  }
}
