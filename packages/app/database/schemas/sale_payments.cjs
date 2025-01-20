const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('sale_payments', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_sale').notNullable().references('sales.id') // Relación con la venta
    table.enu('payment_method', ['cash', 'card', 'transfer', 'other']).notNullable() // Método de pago
    table.integer('amount').notNullable() // Cantidad pagada con este método (en centavos)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación del pago
    table.timestamp('synced_at') // Fecha de sincronización con un servidor externo
  }).then(() => {
    console.log("Table 'sale_payments' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}