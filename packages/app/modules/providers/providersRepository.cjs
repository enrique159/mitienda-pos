const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

function normalizeProvider(provider) {
  // Aquí puedes agregar normalización si hay campos booleanos o arrays
  return provider
}

exports.getProviders = async function () {
  return await knex('providers').select('*')
    .then((providers) => {
      if (!providers.length) {
        logger.error({ type: 'GET PROVIDERS', message: 'No se encontraron proveedores' })
        return response(true, 'Proveedores no encontrados', [])
      }
      return response(true, 'Proveedores encontrados', providers.map(normalizeProvider))
    })
    .catch((err) => {
      logger.error({ type: 'GET PROVIDERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los proveedores', err)
    })
}

exports.getProviderById = async function (id) {
  return await knex('providers')
    .where({ id })
    .first()
    .then((provider) => {
      if (!provider) {
        logger.error({ type: 'GET PROVIDER', message: 'Proveedor no encontrado' })
        return response(false, 'Proveedor no encontrado', null)
      }
      return response(true, 'Proveedor encontrado', normalizeProvider(provider))
    })
    .catch((err) => {
      logger.error({ type: 'GET PROVIDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer el proveedor', err)
    })
}

exports.createProvider = async function (provider) {
  // Aquí puedes agregar validaciones adicionales si lo necesitas
  return await knex('providers')
    .insert(provider)
    .returning('*')
    .then((provider) => {
      logger.info({ type: 'CREATE PROVIDER', message: 'Proveedor creado exitosamente', data: provider })
      return response(true, 'Proveedor creado exitosamente', provider)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE PROVIDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el proveedor', err)
    })
}

exports.updateProvider = async function (data) {
  const dataToUpdate = {
    ...data,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  return await knex('providers')
    .where({ id: data.id })
    .update(dataToUpdate)
    .returning('*')
    .then((provider) => {
      logger.info({ type: 'UPDATE PROVIDER', message: 'Proveedor actualizado exitosamente', data: provider })
      return response(true, 'Proveedor actualizado exitosamente', provider)
    })
    .catch((err) => {
      logger.error({ type: 'UPDATE PROVIDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el proveedor', err)
    })
}

exports.deleteProvider = async function (id) {
  return await knex('providers')
    .where({ id })
    .del()
    .then((result) => {
      logger.info({ type: 'DELETE PROVIDER', message: 'Proveedor eliminado exitosamente', data: result })
      return response(true, 'Proveedor eliminado exitosamente', result)
    })
    .catch((err) => {
      logger.error({ type: 'DELETE PROVIDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar el proveedor', err)
    })
}
