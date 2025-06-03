const { ipcMain } = require('electron')
const printer = require('./printer.cjs')

ipcMain.on('get_printers', async (event) => {
  const list = await printer.getPrinters()
  event.reply('get_printers', list)
})

ipcMain.on('print_ticket', async (event, printerName) => {
  const response = await printer.printTicket(printerName)
  event.reply('print_ticket', response)
})
