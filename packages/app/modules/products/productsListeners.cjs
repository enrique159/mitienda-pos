const { ipcRenderer } = require('electron')

exports.createProduct = function (product, callback) {
  ipcRenderer.removeAllListeners('create_product')
  ipcRenderer.on('create_product', (_, response) => callback(response))
  ipcRenderer.send('create_product', product)
}

exports.deleteProduct = function (productId, callback) {
  ipcRenderer.removeAllListeners('delete_product')
  ipcRenderer.on('delete_product', (_, response) => callback(response))
  ipcRenderer.send('delete_product', productId)
}

exports.getProducts = function (callback) {
  ipcRenderer.removeAllListeners('get_products')
  ipcRenderer.on('get_products', (_, response) => callback(response))
  ipcRenderer.send('get_products')
}

exports.getActiveProducts = function (callback) {
  ipcRenderer.removeAllListeners('get_active_products')
  ipcRenderer.on('get_active_products', (_, response) => callback(response))
  ipcRenderer.send('get_active_products')
}

exports.getProductsByCategory = function (category, callback) {
  ipcRenderer.removeAllListeners('get_products_by_category')
  ipcRenderer.on('get_products_by_category', (_, response) => callback(response))
  ipcRenderer.send('get_products_by_category', category)
}