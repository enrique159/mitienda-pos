import { ipcMain } from 'electron'
import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import * as salesRepository from './salesRepository.js'
import * as productsRepository from '../products/productsRepository.js'
import { response as buildResponse, logger } from '../../helpers/index.js'

const CREDIT_PAYMENT_METHOD = 'credit'

const sumPayments = (payments: any[], predicate: (payment: any) => boolean) => (
  payments
    .filter(predicate)
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0)
)

const normalizeSaleCredit = async (sale: any, payments: any[], trx: any) => {
  const total = Number(sale.total) || 0
  const creditAmount = sumPayments(payments, (payment) => payment.payment_method === CREDIT_PAYMENT_METHOD)
  const receivedAmount = sumPayments(payments, (payment) => payment.payment_method !== CREDIT_PAYMENT_METHOD)
  const coveredAmount = receivedAmount + creditAmount

  if (coveredAmount < total) {
    throw new Error('La suma de pagos no cubre el total de la venta')
  }

  if (coveredAmount > total) {
    throw new Error('La suma de pagos no puede ser mayor al total de la venta')
  }

  if (creditAmount > 0 && !sale.id_customer) {
    throw new Error('La venta a credito requiere un cliente')
  }

  if (creditAmount > 0) {
    const customer = await knex('customers').transacting(trx).where('id', sale.id_customer).first()
    if (!customer?.has_credit) {
      throw new Error('El cliente no tiene credito habilitado')
    }

    const creditUsedRow = await knex('sales')
      .transacting(trx)
      .where('id_customer', sale.id_customer)
      .whereIn('status', ['pending', 'partially_paid'])
      .andWhere('on_trust', true)
      .sum({ used_credit: 'balance_due' })
      .first()

    const usedCredit = Number(creditUsedRow?.used_credit) || 0
    const availableCredit = Math.max(0, (Number(customer.credit_limit) || 0) - usedCredit)
    if (creditAmount > availableCredit) {
      throw new Error('El cliente no tiene credito disponible')
    }
  }

  sale.amount_paid = receivedAmount
  sale.balance_due = creditAmount
  sale.on_trust = creditAmount > 0
  sale.due_date = creditAmount > 0
    ? sale.due_date || new Date(new Date().setMonth(new Date().getMonth() + 1))
    : null

  if (creditAmount === 0) {
    sale.status = 'paid'
  } else if (receivedAmount === 0) {
    sale.status = 'pending'
  } else {
    sale.status = 'partially_paid'
  }
}


ipcMain.on('create_sale', async (event, payload) => {
  const { sale, details, payments } = payload
  let responseValue: any = null
  const trx = await knex.transaction()

  try {
    await normalizeSaleCredit(sale, payments, trx)

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
