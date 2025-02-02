const { ipcRenderer } = require('electron')

exports.getTaxes = () => ipcRenderer.sendSync('get_taxes')

exports.createTax = function (params, callback) {
  ipcRenderer.removeAllListeners('create_tax')
  ipcRenderer.on('create_tax', (_, response) => callback(response))
  ipcRenderer.send('create_tax', params)
}

exports.deleteTax = function (id, callback) {
  ipcRenderer.removeAllListeners('delete_tax')
  ipcRenderer.on('delete_tax', (_, response) => callback(response))
  ipcRenderer.send('delete_tax', id)
}