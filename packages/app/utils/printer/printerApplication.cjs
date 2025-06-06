const { ipcMain } = require('electron')
const printer = require('./printer.cjs')
const SaleTicketBuilder = require('./tickets/SaleTicketBuilder.cjs')
const TestTicketBuilder = require('./tickets/TestTicketBuilder.cjs')

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
