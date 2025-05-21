const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.getCompany = async function () {
  return await knex('company').select().first()
    .then((company) => {
      return response(true, 'Empresa encontrada', company || {})
    })
    .catch((err) => {
      logger.error({ type: 'GET COMPANY ERROR', message: err })
      return response(false, 'Error al obtener la información de la empresa', err)
    })
}
