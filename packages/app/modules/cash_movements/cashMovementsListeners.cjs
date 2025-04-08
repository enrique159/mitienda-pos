const { ipcRenderer } = require('electron')

exports.createCashMovement = function (data, callback) {
  ipcRenderer.removeAllListeners('create_cash_movement')
  ipcRenderer.on('create_cash_movement', (_, response) => callback(response))
  ipcRenderer.send('create_cash_movement', data)
}