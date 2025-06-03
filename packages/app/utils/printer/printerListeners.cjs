const { ipcRenderer } = require('electron')

exports.getPrinters = function (callback) {
  ipcRenderer.removeAllListeners('get_printers')
  ipcRenderer.on('get_printers', (_, response) => callback(response))
  ipcRenderer.send('get_printers')
}

exports.printTicket = function (printerName, callback) {
  ipcRenderer.removeAllListeners('print_ticket')
  ipcRenderer.on('print_ticket', (_, response) => callback(response))
  ipcRenderer.send('print_ticket', printerName)
}
