const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

exports.getBranchInfo = async function () {
  return await knex('branches').select().first()
    .then((branch) => {
      if (!branch) {
        logger.error({ type: 'GET BRANCH INFO', message: 'No se encontró la sucursal' })
        return response(false, 'Sucursal no encontrada', null)
      }
      branch = {
        ...branch,
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

exports.setBranchLogo = async function (image) {
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