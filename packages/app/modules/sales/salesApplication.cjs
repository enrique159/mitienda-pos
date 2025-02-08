const { ipcMain } = require('electron')
const knex = require('knex')(require('../../database/knexfile.cjs'))
const salesRepository = require('./salesRepository.cjs')
const { response, logger } = require('../../helpers/index.cjs')


ipcMain.on('create_sale', async (event, payload) => {
  const { sale, details, payments } = payload
  let responseValue = null
  const trx = await knex.transaction()

  try {
    const response = await salesRepository.createSale(sale, trx)
    responseValue = response
    if (response.success) {
      const idSale = response.response.id
      for (const detail of details) {
        detail.id_sale = idSale
        await salesRepository.createSaleDetail(detail, trx)
      }
      for (const payment of payments) {
        payment.id_sale = idSale
        await salesRepository.createSalePayment(payment, trx)
      }
      await trx.commit()
    }
  } catch (error) {
    await trx.rollback()
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
