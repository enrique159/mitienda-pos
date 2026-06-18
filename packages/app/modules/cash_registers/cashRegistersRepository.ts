import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger } from '../../helpers/index.js'

/**
 * Crea una caja registradora
 */
export async function createCashRegister(data) {
  return await knex('cash_registers').insert(data).returning('*')
    .then((cashRegister) => {
      const cashRegisterData = Array.isArray(cashRegister) ? cashRegister[0] : cashRegister
      return response(true, 'Caja registradora creada', cashRegisterData)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE CASH REGISTER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la caja registradora', err)
    })
}

/**
 * Obtiene la caja registradora activa
 */
export async function getCashRegisterActive() {
  return await knex('cash_registers').select('cash_registers.*', 'open_sellers.name as open_user_name', 'close_sellers.name as close_user_name')
    .leftJoin('sellers as open_sellers', 'open_sellers.id', 'cash_registers.id_user_opening')
    .leftJoin('sellers as close_sellers', 'close_sellers.id', 'cash_registers.id_user_closing')
    .whereNull('closing_date')
    .orderBy('opening_date', 'desc')
    .limit(1)
    .then((cashRegister) => {
      if(Array.isArray(cashRegister) && cashRegister.length === 0) {
        return response(true, 'No se encontró caja registradora abierta', null)
      }
      return response(true, 'Caja registradora activa encontrada', Array.isArray(cashRegister) ? cashRegister[0] : cashRegister)
    })
    .catch((err) => {
      logger.error({ type: 'GET ACTIVE CASH REGISTER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer la caja registradora activa', err)
    })
}

/**
 * Obtiene el estado actual de la caja registradora
 */
export async function getCurrentCashRegisterState() {
  try {
    const cashRegister = await getCashRegisterActive()
    if (!cashRegister.success) {
      return response(false, 'Error al traer el estado actual de la caja registradora', null)
    }
    const salesSummary = await knex('sales')
      .select(
        knex.raw('COUNT(*) as total_sales'),
        knex.raw('SUM(total) as total_sales_amount')
      )
      .where('id_cash_register', cashRegister.response.id)

    const paymentsSummary = await knex('sale_payments')
      .select('payment_method', knex.raw('SUM(amount) as total'))
      .whereIn('id_sale', function() {
        this.select('id').from('sales').where('id_cash_register', cashRegister.response.id)
      })
      .groupBy('payment_method')

    const movementsSummary = await knex('cash_movements')
      .select('type', knex.raw('SUM(amount) as total'))
      .where('id_cash_register', cashRegister.response.id)
      .groupBy('type')

    const movementsCount = await knex('cash_movements')
      .select(knex.raw('COUNT(*) as total_movements'))
      .where('id_cash_register', cashRegister.response.id)

    const payments = paymentsSummary.reduce((acc, payment) => {
      acc[payment.payment_method] = Number(payment.total) || 0
      return acc
    }, { cash: 0, card: 0, transfer: 0, credit: 0, other: 0 })

    const totalAmountPaid = payments.cash + payments.card + payments.transfer + payments.other

    const summary = {
      opening_amount: cashRegister.response.opening_amount,
      total_sales: salesSummary[0].total_sales || 0,
      total_amount_paid: totalAmountPaid,
      total_sales_amount: salesSummary[0].total_sales_amount || 0,
      payments,
      movements: movementsSummary.reduce((acc, movement) => {
        acc[movement.type] = movement.total
        return acc
      }, { income: 0, withdraw: 0 }),
      total_movements: movementsCount[0].total_movements || 0,
    }

    return response(true, 'Estado actual de la caja registradora obtenido', summary)
  } catch(err) {
    console.log(err)
    logger.error({ type: 'GET CURRENT CASH REGISTER STATE ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer el estado actual de la caja registradora', err)
  }
}

/*
 * Cierre de caja registradora
 */
export async function closeCashRegister(data) {
  return await knex('cash_registers').where('id', data.id).update(data).returning('*')
    .then((cashRegister) => {
      const cashRegisterData = Array.isArray(cashRegister) ? cashRegister[0] : cashRegister
      return response(true, 'Caja registradora cerrada', cashRegisterData)
    })
    .catch((err) => {
      logger.error({ type: 'CLOSE CASH REGISTER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al cerrar la caja registradora', err)
    })
}
