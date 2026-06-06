import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, cleanAllTables } from '../../helpers/index.js'
import * as configurationService from './configurationService.js'
import * as branchRepository from '../branches/branchesRepository.js'
import { downloadImage } from '../../utils/images/downloadImage.js'

export async function initialConfiguration(payload) {
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

  // Download branch image
  if (branch.image) {
    const imageResponse = await downloadImage(branch.image)
    branch.image = imageResponse.success ? imageResponse.response.filename : null
  }

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
    await saveConfiguration(configuration, trx)
    await branchRepository.saveBranch(branchPayload, trx)
    await trx.commit()
    return response(true, 'Configuración guardada', { configuration, branch: branchPayload })
  } catch (err) {
    await trx.rollback()
    logger.error({ type: 'INITIAL CONFIGURATION ERROR', message: `${err}`, data: err })
    return response(false, 'Error en la configuración inicial', err.errors || err.message || err)
  }
}

export async function initialSync() {
  return response(true, 'Sincronización inicial completada')
}

export async function saveConfiguration(payload, trx) {
  const queryBuilder = trx ? knex('configuration').transacting(trx) : knex('configuration')
  try {
    await queryBuilder.insert(payload)
    return response(true, 'Configuración guardada', payload)
  } catch (err) {
    logger.error({ type: 'SAVE CONFIGURATION ERROR', message: err })
    return response(false, 'Error al guardar la configuración', err)
  }
}

export async function getConfiguration() {
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

export async function setDefaultPrinter(printerName) {
  return await knex('configuration').update({ default_printer: printerName || null })
    .then(() => {
      return response(true, 'Impresora por defecto actualizada')
    })
    .catch((err) => {
      logger.error({ type: 'SET DEFAULT PRINTER ERROR', message: err })
      return response(false, 'Error al actualizar la impresora por defecto', err)
    })
}

export async function getToken() {
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
