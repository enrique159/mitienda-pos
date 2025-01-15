const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

exports.getConfiguration = async function () {
  return await knex('configuration').select().first()
    .then((configuration) => {
      configuration = {
        ...configuration,
        configured: parseBoolean(configuration.configured),
        enable_sync: parseBoolean(configuration.enable_sync),
      }
      return response(true, 'Configuración encontrada', configuration)
    })
    .catch((err) => {
      logger.error({ type: 'GET CONFIGURATION ERROR', message: err })
      return response(false, 'Error al traer la configuración', err)
    })
}