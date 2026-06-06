import { ipcRenderer } from 'electron'

/*
  ** ******** OBTENER TODAS LAS ÓRDENES DE COMPRA ********
*/
export function getPurchaseOrders(callback) {
  ipcRenderer.removeAllListeners('get_purchase_orders')
  ipcRenderer.on('get_purchase_orders', (_, response) => callback(response))
  ipcRenderer.send('get_purchase_orders')
}

/*
  ** ******** CREAR UNA ORDEN DE COMPRA CON SUS ITEMS ********
*/
export function createPurchaseOrder(data, callback) {
  ipcRenderer.removeAllListeners('create_purchase_order')
  ipcRenderer.on('create_purchase_order', (_, response) => callback(response))
  ipcRenderer.send('create_purchase_order', data)
}

/*
  ** ******** ACTUALIZAR UNA ORDEN DE COMPRA ********
*/
export function updatePurchaseOrder(data, callback) {
  ipcRenderer.removeAllListeners('update_purchase_order')
  ipcRenderer.on('update_purchase_order', (_, response) => callback(response))
  ipcRenderer.send('update_purchase_order', data)
}

/*
  ** ******** ACTUALIZAR EL ESTADO DE ORDEN DE COMPRA ********
*/
export function updatePurchaseOrderStatus(data, callback) {
  ipcRenderer.removeAllListeners('update_purchase_order_status')
  ipcRenderer.on('update_purchase_order_status', (_, response) => callback(response))
  ipcRenderer.send('update_purchase_order_status', data)
}

/*
  ** ******** ACTUALIZAR UN ITEM DE ORDEN DE COMPRA ********
*/
export function updatePurchaseOrderItem(data, callback) {
  ipcRenderer.removeAllListeners('update_purchase_order_item')
  ipcRenderer.on('update_purchase_order_item', (_, response) => callback(response))
  ipcRenderer.send('update_purchase_order_item', data)
}

/*
  ** ******** ACTUALIZAR TODOS LOS ITEMS DE UNA ORDEN DE COMPRA ********
*/
export function updatePurchaseOrderItems(data, callback) {
  ipcRenderer.removeAllListeners('update_purchase_order_items')
  ipcRenderer.on('update_purchase_order_items', (_, response) => callback(response))
  ipcRenderer.send('update_purchase_order_items', data)
}

/*
  ** ******** ACTUALIZAR ITEMS DE UNA ORDEN DE COMPRA EN DRAFT ********
*/
export function updatePurchaseOrderDraftItems(data, callback) {
  ipcRenderer.removeAllListeners('update_purchase_order_draft_items')
  ipcRenderer.on('update_purchase_order_draft_items', (_, response) => callback(response))
  ipcRenderer.send('update_purchase_order_draft_items', data)
}

/*
  ** ******** ELIMINAR UNA ORDEN DE COMPRA ********
*/
export function deletePurchaseOrder(id, callback) {
  ipcRenderer.removeAllListeners('delete_purchase_order')
  ipcRenderer.on('delete_purchase_order', (_, response) => callback(response))
  ipcRenderer.send('delete_purchase_order', id)
}

