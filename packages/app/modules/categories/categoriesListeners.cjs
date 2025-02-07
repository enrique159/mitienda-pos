const { ipcRenderer } = require('electron')

exports.getCategories = function (callback) {
  ipcRenderer.removeAllListeners('get_categories')
  ipcRenderer.on('get_categories', (_, response) => callback(response))
  ipcRenderer.send('get_categories')
}

exports.createCategory = function (category, callback) {
  ipcRenderer.removeAllListeners('create_category')
  ipcRenderer.on('create_category', (_, response) => callback(response))
  ipcRenderer.send('create_category', category)
}

exports.updateCategory = function (category, callback) {
  ipcRenderer.removeAllListeners('update_category')
  ipcRenderer.on('update_category', (_, response) => callback(response))
  ipcRenderer.send('update_category', category)
}

exports.deleteCategory = function (id, callback) {
  ipcRenderer.removeAllListeners('delete_category')
  ipcRenderer.on('delete_category', (_, response) => callback(response))
  ipcRenderer.send('delete_category', id)
}