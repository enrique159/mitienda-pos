const { ipcRenderer } = require('electron')

exports.getCategories = function (callback) {
  ipcRenderer.removeAllListeners('get_categories')
  ipcRenderer.on('get_categories', (_, response) => callback(response))
  ipcRenderer.send('get_categories')
}