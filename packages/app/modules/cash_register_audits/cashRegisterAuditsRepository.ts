import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger } from '../../helpers/index.js'

export async function createCashRegisterAudit(data) {
  data.cash_breakdown = data.cash_breakdown.length ? JSON.stringify(data.cash_breakdown) : null
  return await knex('cash_register_audits').insert(data).returning('*')
    .then((cashRegisterAudit) => {
      const cashRegisterAuditData = Array.isArray(cashRegisterAudit) ? cashRegisterAudit[0] : cashRegisterAudit
      return response(true, 'Cierre de caja registradora registrado', cashRegisterAuditData)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE CASH REGISTER AUDIT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al registrar el cierre de caja registradora', err)
    })
}

export async function getCashRegisterAudits() {
  return await knex('cash_register_audits')
    .select(
      'cash_register_audits.*',
      'cash_registers.opening_amount',
      'cash_registers.opening_date',
      'seller_opening.name as opening_user_name',
      'seller_closing.name as closing_user_name'
    )
    .leftJoin('cash_registers', 'cash_register_audits.id_cash_register', 'cash_registers.id')
    .leftJoin('sellers as seller_opening', 'cash_registers.id_user_opening', 'seller_opening.id')
    .leftJoin('sellers as seller_closing', 'cash_register_audits.id_user', 'seller_closing.id')
    .orderBy('cash_register_audits.created_at', 'desc')
    .then((cashRegisterAudits) => {
      const cashRegisterAuditsData = Array.isArray(cashRegisterAudits) ? cashRegisterAudits : [cashRegisterAudits]
      return response(true, 'Cierres de caja registradoras obtenidos', cashRegisterAuditsData)
    })
    .catch((err) => {
      logger.error({ type: 'GET CASH REGISTER AUDITS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los cierres de caja registradoras', err)
    })
}
