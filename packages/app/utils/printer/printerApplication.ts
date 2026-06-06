import { ipcMain } from 'electron'
import * as printer from './printer.js'
import SaleTicketBuilder from './tickets/SaleTicketBuilder.js'
import TestTicketBuilder from './tickets/TestTicketBuilder.js'
import CloseCashRegisterReportTicketBuilder from './tickets/CloseCashRegisterReportTicketBuilder.js'
import CloseCashRegisterTicketBuilder from './tickets/CloseCashRegisterTicketBuilder.js'

ipcMain.on('get_printers', async (event) => {
  const list = await printer.getPrinters()
  event.reply('get_printers', list)
})

ipcMain.on('print_test_ticket', async (event, printerName) => {
  const builder = new TestTicketBuilder()
  if (!printerName) {
    const response = await printer.printTicketToPDF(builder)
    event.reply('print_test_ticket', response)
    return
  }
  const response = await printer.printTicket(printerName, builder)
  event.reply('print_test_ticket', response)
})

ipcMain.on('print_sale_ticket', async (event, printerName, payload) => {
  const builder = new SaleTicketBuilder(payload)
  if (!printerName) {
    const response = await printer.printTicketToPDF(builder)
    event.reply('print_sale_ticket', response)
    return
  }
  const response = await printer.printTicket(printerName, builder)
  event.reply('print_sale_ticket', response)
})

ipcMain.on(
  'print_close_cash_register_ticket',
  async (event, printerName, payload) => {
    const builder = new CloseCashRegisterTicketBuilder(payload)
    if (!printerName) {
      const response = await printer.printTicketToPDF(builder)
      event.reply('print_close_cash_register_ticket', response)
      return
    }
    const response = await printer.printTicket(printerName, builder)
    event.reply('print_close_cash_register_ticket', response)
  }
)

ipcMain.on(
  'print_close_cash_register_report_ticket',
  async (event, payload) => {
    const builder = new CloseCashRegisterReportTicketBuilder(payload)
    const response = await printer.printDocumentToPDF(builder)
    event.reply('print_close_cash_register_report_ticket', response)
  }
)

