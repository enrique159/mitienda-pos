const { ipcRenderer } = require('electron')


exports.createSale = function (data, callback) {
  ipcRenderer.removeAllListeners('create_sale')
  ipcRenderer.on('create_sale', (_, response) => callback(response))
  ipcRenderer.send('create_sale', data)
}

exports.getSales = function (callback) {
  ipcRenderer.removeAllListeners('get_sales')
  ipcRenderer.on('get_sales', (_, response) => callback(response))
  ipcRenderer.send('get_sales')
}

exports.generateSaleFolio = () => ipcRenderer.sendSync('generate_sale_folio')