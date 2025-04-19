const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.createCashRegisterAudit = async function (data) {
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