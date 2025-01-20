const { ipcRenderer } = require('electron')

exports.getCashRegisterActive = () => ipcRenderer.sendSync('get_cash_register_active')

exports.createCashRegister = function (data, callback) {
  ipcRenderer.removeAllListeners('create_cash_register')
  ipcRenderer.on('create_cash_register', (_, response) => callback(response))
  ipcRenderer.send('create_cash_register', data)
}

exports.getCurrentCashRegisterState = () => ipcRenderer.sendSync('get_current_cash_register_state')