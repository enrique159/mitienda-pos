const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')
exports.getCustomers = async function () {
  try {
    // 1. Obtener todos los clientes
    const customers = await knex('customers').select().orderBy('created_at', 'desc')

    // 2. Obtener suma de crédito usado por cliente (solo los que tienen crédito)
    const creditSums = await knex('sales')
      .select('id_customer')
      .sum({ used_credit: 'balance_due' })
      .whereIn('status', ['pending', 'partially_paid'])
      .andWhere('on_trust', true)
      .whereNotNull('id_customer')
      .groupBy('id_customer')

    // 3. Crear un mapa id_customer -> used_credit
    const creditMap = {}
    creditSums.forEach((row) => {
      creditMap[row.id_customer] = Number(row.used_credit) || 0
    })

    // 4. Agregar used_credit a cada cliente (solo si tiene crédito, si no, 0)
    const customersWithCredit = customers.map((c) => ({
      ...c,
      used_credit: c.has_credit ? (creditMap[c.id] || 0) : 0,
    }))

    return response(true, 'Clientes encontrados', customersWithCredit)
  } catch (err) {
    logger.error({ type: 'GET CUSTOMERS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer los clientes', err)
  }
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