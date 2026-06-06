import { ipcRenderer } from 'electron'

export const getActiveDiscounts = () => ipcRenderer.sendSync('get_active_discounts')
export function getDiscounts(callback) {
  ipcRenderer.removeAllListeners('get_discounts')
  ipcRenderer.on('get_discounts', (_, response) => callback(response))
  ipcRenderer.send('get_discounts')
}

export function createDiscount(discount, callback) {
  ipcRenderer.removeAllListeners('create_discount')
  ipcRenderer.on('create_discount', (_, response) => callback(response))
  ipcRenderer.send('create_discount', discount)
}

export function updateDiscount(discount, callback) {
  ipcRenderer.removeAllListeners('update_discount')
  ipcRenderer.on('update_discount', (_, response) => callback(response))
  ipcRenderer.send('update_discount', discount)
}

export function deleteDiscount(discountId, callback) {
  ipcRenderer.removeAllListeners('delete_discount')
  ipcRenderer.on('delete_discount', (_, response) => callback(response))
  ipcRenderer.send('delete_discount', discountId)
}

export function getDiscountProducts(discountId, callback) {
  ipcRenderer.removeAllListeners('get_discount_products')
  ipcRenderer.on('get_discount_products', (_, response) => callback(response))
  ipcRenderer.send('get_discount_products', discountId)
}

export function createDiscountProduct(discountId, productsId, callback) {
  ipcRenderer.removeAllListeners('create_discount_product')
  ipcRenderer.on('create_discount_product', (_, response) => callback(response))
  ipcRenderer.send('create_discount_product', discountId, productsId)
}
