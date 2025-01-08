const { ipcRenderer } = require('electron')

exports.getActiveProducts = function (callback) {
  ipcRenderer.removeAllListeners('get_active_products')
  ipcRenderer.on('get_active_products', (_, response) => callback(response))
  ipcRenderer.send('get_active_products')
}

exports.getProductCategories = function (callback) {
  ipcRenderer.removeAllListeners('get_product_categories')
  ipcRenderer.on('get_product_categories', (_, response) => callback(response))
  ipcRenderer.send('get_product_categories')
}

exports.getProductsByCategory = function (category, callback) {
  ipcRenderer.removeAllListeners('get_products_by_category')
  ipcRenderer.on('get_products_by_category', (_, response) => callback(response))
  ipcRenderer.send('get_products_by_category', category)
}