import { ipcMain } from 'electron'
import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import * as salesRepository from './salesRepository.js'
import * as productsRepository from '../products/productsRepository.js'
import { response as buildResponse, logger } from '../../helpers/index.js'


ipcMain.on('create_sale', async (event, payload) => {
  const { sale, details, payments } = payload
  let responseValue: any = null
  const trx = await knex.transaction()

  try {
    const saleResponse = await salesRepository.createSale(sale, trx)
    responseValue = saleResponse
    if (!saleResponse.success) {
      throw new Error(saleResponse.message)
    }

    const idSale = saleResponse.response.id
    for (const detail of details) {
      detail.id_sale = idSale

      const detailResponse = await salesRepository.createSaleDetail(detail, trx)
      if (!detailResponse.success) {
        throw new Error(detailResponse.message)
      }

      const stockResponse = await productsRepository.adjustStockProduct(detail.id_product, -detail.quantity, trx)
      if (!stockResponse.success) {
        throw new Error(stockResponse.message)
      }
    }

    for (const payment of payments) {
      payment.id_sale = idSale
      const paymentResponse = await salesRepository.createSalePayment(payment, trx)
      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message)
      }
    }

    await trx.commit()
  } catch (error) {
    await trx.rollback()
    logger.error({ type: 'CREATE SALE ERROR', message: `${error}`, data: error })
    responseValue = buildResponse(false, 'Error al crear la venta', null)
  }

  event.reply('create_sale', responseValue)
})

ipcMain.on('get_sales', async (event) => {
  const response = await salesRepository.getSales()
  event.reply('get_sales', response)
})

ipcMain.on('get_sales_in_turn', async (event, idCashRegister) => {
  const response = await salesRepository.getSalesInTurn(idCashRegister)
  event.reply('get_sales_in_turn', response)
})

ipcMain.on('generate_sale_folio', async (event) => {
  const response = await salesRepository.generateSaleFolio()
  event.returnValue = response
})
