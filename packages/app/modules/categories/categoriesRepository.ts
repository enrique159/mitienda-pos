import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean } from '../../helpers/index.js'

export async function getCategories() {
  return await knex('categories').select()
    .then((categories) => {
      if (!categories.length) {
        logger.error({ type: 'GET CATEGORIES', message: 'No se encontraron categorias' })
        return response(false, 'Categorias no encontradas', [])
      }
      return response(true, 'Categorias encontradas', categories)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET CATEGORIES ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer las categorias', err)
    })
}

export async function createCategory(category) {
  return await knex('categories').insert(category)
    .then((category) => {
      logger.info({ type: 'CREATE CATEGORY', message: `Categoria creada`, data: category })
      return response(true, 'Categoria creada', category)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la categoria', err)
    })
}

export async function updateCategory(category) {
  const dataToUpdate = {
    ...category,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  return await knex('categories')
    .where('id', category.id)
    .update(dataToUpdate)
    .then((category) => {
      logger.info({ type: 'UPDATE CATEGORY', message: `Categoria actualizada`, data: category })
      return response(true, 'Categoria actualizada', category)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'UPDATE CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar la categoria', err)
    })
}

export async function deleteCategory(id) {
  return await knex('categories').where('id', id).del()
    .then((category) => {
      logger.info({ type: 'DELETE CATEGORY', message: `Categoria eliminada con éxito`, data: category })
      return response(true, 'Categoria eliminada', category)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'DELETE CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar la categoria', err)
    })
}
