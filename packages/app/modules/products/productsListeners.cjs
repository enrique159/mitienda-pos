const { ipcRenderer } = require('electron')

exports.getActiveProducts = function (callback) {
  ipcRenderer.removeAllListeners('get_active_products')
  ipcRenderer.on('get_active_products', (_, response) => callback(response))
  ipcRenderer.send('get_active_products')
}