import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import * as branchesService from './branchesService.js'
import { response, logger, parseBoolean, parseObjectJson } from '../../helpers/index.js'

export async function getBranchesByEmail(email) {
  return await branchesService.fetchBranchesByEmail(email)
}

export async function saveBranch(branch, trx) {
  const queryBuilder = trx ? knex('branches').transacting(trx) : knex('branches')
  return await queryBuilder.insert(branch).returning('*')
    .then((branch) => {
      return response(true, 'Sucursal guardada', branch)
    })
    .catch((err) => {
      logger.error({ type: 'SAVE BRANCH ERROR', message: `${err}`, data: err })
      return response(false, 'Error al guardar la sucursal', err)
    })
}

export async function getBranchInfo() {
  return await knex('branches').select().first()
    .then((branch) => {
      if (!branch) {
        logger.error({ type: 'GET BRANCH INFO', message: 'No se encontró la sucursal' })
        return response(false, 'Sucursal no encontrada', null)
      }
      branch = {
        ...branch,
        ticket_config: parseObjectJson(branch.ticket_config),
        is_main: parseBoolean(branch.is_main),
        pin_enabled: parseBoolean(branch.pin_enabled),
        pin_cancel_sale_required: parseBoolean(branch.pin_cancel_sale_required),
      }
      return response(true, 'Sucursal encontrada', branch)
    })
    .catch((err) => {
      logger.error({ type: 'GET BRANCH INFO ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer la sucursal', err)
    })
}

export async function setBranchLogo(image) {
  const branch = await knex('branches').select().first()
  if (!branch) {
    logger.error({ type: 'SET BRANCH LOGO', message: 'No se encontró la sucursal' })
    return response(false, 'Sucursal no encontrada', null)
  }
  const dataToUpdate = {
    ...branch,
    logo: image,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  return await knex('branches').update(dataToUpdate)
    .returning('*')
    .then((branch) => {
      return response(true, 'Logo de sucursal actualizado', branch)
    })
    .catch((err) => {
      logger.error({ type: 'SET BRANCH LOGO ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el logo de la sucursal', err)
    })
}
