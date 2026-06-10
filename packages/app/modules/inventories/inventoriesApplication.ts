import { ipcMain } from 'electron'
import * as inventoriesRepository from './InventoriesRepository.js'

ipcMain.on('get_inventories', async (event, status) => {
  const response = await inventoriesRepository.getInventories(status)
  event.reply('get_inventories', response)
})

ipcMain.on('get_inventory_by_id', async (event, id) => {
  const response = await inventoriesRepository.getInventoryById(id)
  event.reply('get_inventory_by_id', response)
})

ipcMain.on('create_inventory', async (event, inventory) => {
  const response = await inventoriesRepository.createInventory(inventory)
  event.reply('create_inventory', response)
})

ipcMain.on('start_inventory', async (event, payload) => {
  const response = await inventoriesRepository.startInventory(payload.id, payload.sellerId)
  event.reply('start_inventory', response)
})

ipcMain.on('update_inventory_items', async (event, payload) => {
  const response = await inventoriesRepository.updateInventoryItems(payload.inventoryId, payload.items)
  event.reply('update_inventory_items', response)
})

ipcMain.on('approve_inventory', async (event, payload) => {
  const response = await inventoriesRepository.approveInventory(payload.id, payload.sellerId)
  event.reply('approve_inventory', response)
})

ipcMain.on('cancel_inventory', async (event, id) => {
  const response = await inventoriesRepository.cancelInventory(id)
  event.reply('cancel_inventory', response)
})
