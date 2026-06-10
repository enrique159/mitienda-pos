import { Inventory } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useInventoryStore = defineStore('inventory', () => {
  const inventories = ref<Inventory[]>([])
  const currentInventory = ref<Inventory | null>(null)

  const setInventories = (newInventories: Inventory[]) => {
    inventories.value = newInventories
  }

  const setCurrentInventory = (inventory: Inventory | null) => {
    currentInventory.value = inventory
  }

  return {
    inventories,
    currentInventory,
    setInventories,
    setCurrentInventory,
  }
})
