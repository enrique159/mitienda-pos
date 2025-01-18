const { ipcMain } = require('electron')
const salesRepository = require('./salesRepository.cjs')
const { response } = require('../../helpers/index.cjs')


ipcMain.on('create_sale', async (event, payload) => {
  const { sale, details } = payload
  let responseValue = null
  try {
    const response = await salesRepository.createSale(sale)
    responseValue = response
    if (response.success) {
      for (const detail of details) {
        detail.id_sale = response.data[0]
        await salesRepository.createSaleDetail(detail)
      }
    }
  } catch (error) {
    responseValue = response(false, 'Error al crear la venta', null)
  }

  event.reply('create_sale', responseValue)
})

ipcMain.on('get_sales', async (event) => {
  const response = await salesRepository.getSales()
  event.reply('get_sales', response)
})

ipcMain.on('generate_sale_folio', async (event) => {
  const response = await salesRepository.generateSaleFolio()
  event.returnValue = response
})
