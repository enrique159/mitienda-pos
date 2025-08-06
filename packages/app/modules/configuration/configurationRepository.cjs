const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')
const configurationService = require('./configurationService.cjs')

exports.initialConfiguration = async function (payload) {
  const responseFetch = await configurationService.fetchInitialConfiguration(payload)

  if (!responseFetch.success) {
    return responseFetch
  }

  const configuration = {
    id: responseFetch.response.initialConfig.id,
    configured: true,
    token: responseFetch.response.token,
    mode: 'business',
    enable_sync: false,
    default_printer: null,
    last_sync: null,
  }

  return await exports.saveConfiguration(configuration)
}

exports.saveConfiguration = async function (payload) {
  try {
    await knex('configuration').insert(payload)
    return response(true, 'Configuración guardada', payload)
  } catch (err) {
    logger.error({ type: 'SAVE CONFIGURATION ERROR', message: err })
    return response(false, 'Error al guardar la configuración', err)
  }
}

exports.getConfiguration = async function () {
  return await knex('configuration').select().first()
    .then((configuration) => {
      if (!configuration) {
        return response(false, 'Configuración no encontrada', null)
      }
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

exports.setDefaultPrinter = async function (printerName) {
  return await knex('configuration').update({ default_printer: printerName || null })
    .then(() => {
      return response(true, 'Impresora por defecto actualizada')
    })
    .catch((err) => {
      logger.error({ type: 'SET DEFAULT PRINTER ERROR', message: err })
      return response(false, 'Error al actualizar la impresora por defecto', err)
    })
}