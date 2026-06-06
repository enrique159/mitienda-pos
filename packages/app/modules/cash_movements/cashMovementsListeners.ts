// @ts-nocheck
const { ipcRenderer } = require('electron')

exports.createCashMovement = function (data, callback) {
  ipcRenderer.removeAllListeners('create_cash_movement')
  ipcRenderer.on('create_cash_movement', (_, response) => callback(response))
  ipcRenderer.send('create_cash_movement', data)
}

exports.getMovementsInTurn = function (cashRegisterId, callback) {
  ipcRenderer.removeAllListeners('get_movements_in_turn')
  ipcRenderer.on('get_movements_in_turn', (_, response) => callback(response))
  ipcRenderer.send('get_movements_in_turn', cashRegisterId)
}

export {}
