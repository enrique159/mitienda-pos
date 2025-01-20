const { ipcMain } = require('electron')
const salesRepository = require('./salesRepository.cjs')
const { response, logger } = require('../../helpers/index.cjs')


ipcMain.on('create_sale', async (event, payload) => {
  const { sale, details, payments } = payload
  let responseValue = null
  try {
    const response = await salesRepository.createSale(sale)
    responseValue = response
    if (response.success) {
      const idSale = response.response.id
      for (const detail of details) {
        detail.id_sale = idSale
        await salesRepository.createSaleDetail(detail)
      }
      for (const payment of payments) {
        payment.id_sale = idSale
        await salesRepository.createSalePayment(payment)
      }
    }
  } catch (error) {
    logger.error({ type: 'CREATE SALE ERROR', message: `${error}`, data: error })
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
