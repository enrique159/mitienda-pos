import { ipcRenderer } from 'electron'

export function createProduct(product, callback) {
  ipcRenderer.removeAllListeners('create_product')
  ipcRenderer.on('create_product', (_, response) => callback(response))
  ipcRenderer.send('create_product', product)
}

export function updateProduct(product, callback) {
  ipcRenderer.removeAllListeners('update_product')
  ipcRenderer.on('update_product', (_, response) => callback(response))
  ipcRenderer.send('update_product', product)
}

export function deleteProduct(productId, callback) {
  ipcRenderer.removeAllListeners('delete_product')
  ipcRenderer.on('delete_product', (_, response) => callback(response))
  ipcRenderer.send('delete_product', productId)
}

export function getProducts(callback) {
  ipcRenderer.removeAllListeners('get_products')
  ipcRenderer.on('get_products', (_, response) => callback(response))
  ipcRenderer.send('get_products')
}

export function getActiveProducts(callback) {
  ipcRenderer.removeAllListeners('get_active_products')
  ipcRenderer.on('get_active_products', (_, response) => callback(response))
  ipcRenderer.send('get_active_products')
}

export function getProductsByCategory(category, callback) {
  ipcRenderer.removeAllListeners('get_products_by_category')
  ipcRenderer.on('get_products_by_category', (_, response) => callback(response))
  ipcRenderer.send('get_products_by_category', category)
}
