const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean, cleanAllTables } = require('../../helpers/index.cjs')
const configurationService = require('./configurationService.cjs')
const branchRepository = require('../branches/branchesRepository.cjs')

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

  const branch = responseFetch.response.initialConfig.branch
  const branchPayload = {
    id: branch.id,
    id_company: branch.idCompany,
    branch_name: branch.branchName,
    branch_alias: responseFetch.response.initialConfig.alias,
    is_main: branch.isMain,
    pin_enabled: responseFetch.response.initialConfig.pinEnabled,
    pin: responseFetch.response.initialConfig.pin,
    logo: branch.image,
    timezone: branch.timezone,
  }

  const trx = await knex.transaction()
  try {
    await cleanAllTables({ excludedTables: ['taxes'], trx })
    await exports.saveConfiguration(configuration, trx)
    await branchRepository.saveBranch(branchPayload, trx)
    await trx.commit()
    return response(true, 'Configuración guardada', { configuration, branch: branchPayload })
  } catch (err) {
    await trx.rollback()
    logger.error({ type: 'INITIAL CONFIGURATION ERROR', message: `${err}`, data: err })
    return response(false, 'Error en la configuración inicial', err.errors || err.message || err)
  }
}

exports.saveConfiguration = async function (payload, trx) {
  const queryBuilder = trx ? knex('configuration').transacting(trx) : knex('configuration')
  try {
    await queryBuilder.insert(payload)
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

exports.getToken = async function () {
  return await knex('configuration').select('token').first()
    .then((token) => {
      if (!token) {
        return response(false, 'Token no encontrado', null)
      }
      const authHeader = {
        Authorization: `Bearer ${token.token}`,
      }
      return response(true, 'Token encontrado', authHeader)
    })
    .catch((err) => {
      logger.error({ type: 'GET TOKEN ERROR', message: err })
      return response(false, 'Error al traer el token', err)
    })
}