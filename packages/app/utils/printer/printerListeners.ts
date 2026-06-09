import { ipcRenderer } from 'electron'

export function getPrinters(callback) {
  ipcRenderer.removeAllListeners('get_printers')
  ipcRenderer.on('get_printers', (_, response) => callback(response))
  ipcRenderer.send('get_printers')
}

export function printTestTicket(printerName, callback) {
  ipcRenderer.removeAllListeners('print_test_ticket')
  ipcRenderer.on('print_test_ticket', (_, response) => callback(response))
  ipcRenderer.send('print_test_ticket', printerName)
}

export function printSaleTicket(printerName, payload, callback) {
  ipcRenderer.removeAllListeners('print_sale_ticket')
  ipcRenderer.on('print_sale_ticket', (_, response) => callback(response))
  ipcRenderer.send('print_sale_ticket', printerName, payload)
}

export function printCloseCashRegisterTicket(
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

export function printCloseCashRegisterReportTicket(payload, callback) {
  ipcRenderer.removeAllListeners('print_close_cash_register_report_ticket')
  ipcRenderer.on('print_close_cash_register_report_ticket', (_, response) =>
    callback(response)
  )
  ipcRenderer.send('print_close_cash_register_report_ticket', payload)
}

export function printReportDocument(payload, callback) {
  ipcRenderer.removeAllListeners('print_report_document')
  ipcRenderer.on('print_report_document', (_, response) => callback(response))
  ipcRenderer.send('print_report_document', payload)
}
