import { ipcRenderer } from 'electron'

export function getInventories(status, callback) {
  ipcRenderer.removeAllListeners('get_inventories')
  ipcRenderer.on('get_inventories', (_, response) => callback(response))
  ipcRenderer.send('get_inventories', status)
}

export function getInventoryById(id, callback) {
  ipcRenderer.removeAllListeners('get_inventory_by_id')
  ipcRenderer.on('get_inventory_by_id', (_, response) => callback(response))
  ipcRenderer.send('get_inventory_by_id', id)
}

export function createInventory(inventory, callback) {
  ipcRenderer.removeAllListeners('create_inventory')
  ipcRenderer.on('create_inventory', (_, response) => callback(response))
  ipcRenderer.send('create_inventory', inventory)
}

export function startInventory(data, callback) {
  ipcRenderer.removeAllListeners('start_inventory')
  ipcRenderer.on('start_inventory', (_, response) => callback(response))
  ipcRenderer.send('start_inventory', data)
}

export function updateInventoryItems(data, callback) {
  ipcRenderer.removeAllListeners('update_inventory_items')
  ipcRenderer.on('update_inventory_items', (_, response) => callback(response))
  ipcRenderer.send('update_inventory_items', data)
}

export function approveInventory(data, callback) {
  ipcRenderer.removeAllListeners('approve_inventory')
  ipcRenderer.on('approve_inventory', (_, response) => callback(response))
  ipcRenderer.send('approve_inventory', data)
}

export function cancelInventory(id, callback) {
  ipcRenderer.removeAllListeners('cancel_inventory')
  ipcRenderer.on('cancel_inventory', (_, response) => callback(response))
  ipcRenderer.send('cancel_inventory', id)
}
