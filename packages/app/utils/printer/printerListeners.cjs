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

exports.printCloseCashRegisterTicket = function (
  printerName,
  payload,
  callback
) {
  ipcRenderer.removeAllListeners('print_close_cash_register_ticket')
  ipcRenderer.on('print_close_cash_register_ticket', (_, response) =>
    callback(response)
  )
  ipcRenderer.send('print_close_cash_register_ticket', printerName, payload)
}

exports.printCloseCashRegisterReportTicket = function (payload, callback) {
  ipcRenderer.removeAllListeners('print_close_cash_register_report_ticket')
  ipcRenderer.on('print_close_cash_register_report_ticket', (_, response) =>
    callback(response)
  )
  ipcRenderer.send('print_close_cash_register_report_ticket', payload)
}
