const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

const normalizeCompany = (company) => {
  return {
    ...company,
    ai_enabled: parseBoolean(company.ai_enabled),
  }
}

exports.getCompany = async function () {
  return await knex('company').select().first()
    .then((company) => {
      return response(true, 'Empresa encontrada', normalizeCompany(company || {}))
    })
    .catch((err) => {
      logger.error({ type: 'GET COMPANY ERROR', message: err })
      return response(false, 'Error al obtener la información de la empresa', err)
    })
}
