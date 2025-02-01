const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

exports.getCustomers = async function () {
  return await knex('customers')
    .select()
    .orderBy('created_at', 'desc')
    .then((customers) => {
      return response(true, 'Clientes encontrados', customers)
    })
    .catch((err) => {
      logger.error({ type: 'GET CUSTOMERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los clientes', err)
    })
}

exports.createCustomer = async function (customer) {
  return await knex('customers').insert(customer)
    .then((customer) => {
      logger.info({ type: 'CREATE CUSTOMER', message: `Cliente creado`, data: customer })
      return response(true, 'Cliente creado', customer)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE CUSTOMER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el cliente', err)
    })
}

exports.updateCustomer = async function (customer) {
  const dataToUpdate = {
    ...customer,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  return await knex('customers')
    .where('id', customer.id)
    .update(dataToUpdate)
    .then((customer) => {
      logger.info({ type: 'UPDATE CUSTOMER', message: `Cliente actualizado`, data: customer })
      return response(true, 'Cliente actualizado', customer)
    })
    .catch((err) => {
      logger.error({ type: 'UPDATE CUSTOMER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el cliente', err)
    })
}

exports.deleteCustomer = async function (customerId) {
  return await knex('customers').where('id', customerId).del()
    .then((customer) => {
      logger.info({ type: 'DELETE CUSTOMER', message: `Cliente eliminado`, data: customer })
      return response(true, 'Cliente eliminado', customer)
    })
    .catch((err) => {
      logger.error({ type: 'DELETE CUSTOMER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar el cliente', err)
    })
}