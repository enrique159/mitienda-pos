const { ipcRenderer } = require('electron')

exports.createCashRegisterAudit = function (data, callback) {
  ipcRenderer.removeAllListeners('create_cash_register_audit')
  ipcRenderer.on('create_cash_register_audit', (_, response) => callback(response))
  ipcRenderer.send('create_cash_register_audit', data)
}