const { ipcRenderer } = require('electron')

exports.getPrinters = function (callback) {
  ipcRenderer.removeAllListeners('get_printers')
  ipcRenderer.on('get_printers', (_, response) => callback(response))
  ipcRenderer.send('get_printers')
}

exports.printTestTicket = function (printerName, callback) {
  ipcRenderer.removeAllListeners('print_test_ticket')
  ipcRenderer.on('print_test_ticket', (_, response) => callback(response))
  ipcRenderer.send('print_test_ticket', printerName)
}

exports.printSaleTicket = function (printerName, payload, callback) {
  ipcRenderer.removeAllListeners('print_sale_ticket')
  ipcRenderer.on('print_sale_ticket', (_, response) => callback(response))
  ipcRenderer.send('print_sale_ticket', printerName, payload)
}
