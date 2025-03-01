const { ipcRenderer } = require('electron')

exports.getActiveDiscounts = () => ipcRenderer.sendSync('get_active_discounts')
exports.getDiscounts = function (callback) {
  ipcRenderer.removeAllListeners('get_discounts')
  ipcRenderer.on('get_discounts', (_, response) => callback(response))
  ipcRenderer.send('get_discounts')
}

exports.createDiscount = function (discount, callback) {
  ipcRenderer.removeAllListeners('create_discount')
  ipcRenderer.on('create_discount', (_, response) => callback(response))
  ipcRenderer.send('create_discount', discount)
}

exports.updateDiscount = function (discount, callback) {
  ipcRenderer.removeAllListeners('update_discount')
  ipcRenderer.on('update_discount', (_, response) => callback(response))
  ipcRenderer.send('update_discount', discount)
}

exports.deleteDiscount = function (discountId, callback) {
  ipcRenderer.removeAllListeners('delete_discount')
  ipcRenderer.on('delete_discount', (_, response) => callback(response))
  ipcRenderer.send('delete_discount', discountId)
}

exports.createDiscountProduct = function (discountId, productsId, callback) {
  ipcRenderer.removeAllListeners('create_discount_product')
  ipcRenderer.on('create_discount_product', (_, response) => callback(response))
  ipcRenderer.send('create_discount_product', discountId, productsId)
}