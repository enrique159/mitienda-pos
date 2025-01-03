const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.getConfiguration = async function () {
  return await knex('configuration').select().first()
    .then((configuration) => {
      return response(true, 'Configuración encontrada', configuration)
    })
    .catch((err) => {
      logger.error({ type: 'GET CONFIGURATION ERROR', message: err })
      return response(false, 'Error al traer la configuración', err)
    })
}

exports.updateConfiguration = async function (data) {
  return await knex('configuration').update(data).returning('*')
    .then((response) => {
      return response(true, 'Configuración actualizada', response[0])
    })
    .catch((err) => {
      logger.error({ type: 'UPDATE CONFIGURATION ERROR', message: err })
      return response(false, 'Error al actualizar la configuración', err)
    })
}

exports.createConfiguration = async function (data) {
  const configParams = {
    ruta_recursos: data.ruta_recursos,
    inicializado: true,
  }
  const configuration = await knex('configuration').select().first()
  if (!configuration) {
    return await knex('configuration').insert(configParams).returning('*')
      .then((configuration) => {
        return response(true, 'Configuración creada', configuration[0])
      })
      .catch((err) => {
        logger.error({ type: 'CREATE CONFIGURATION ERROR', message: err })
        return response(false, 'Error al crear la configuración', err)
      })
  } else {
    return await knex('configuration').update(configParams).where('id', configuration.id).returning('*')
      .then((configuration) => {
        return response(true, 'Configuración actualizada', configuration[0])
      })
      .catch((err) => {
        logger.error({ type: 'UPDATE CONFIGURATION ERROR', message: err })
        return response(false, 'Error al actualizar la configuración', err)
      })
  }
}