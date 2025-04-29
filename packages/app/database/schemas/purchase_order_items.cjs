const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('purchase_order_items', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_purchase_order').notNullable().references('purchase_orders.id')
    table.uuid('id_product').notNullable().references('products.id')
    table.integer('quantity_ordered').notNullable()
    table.integer('quantity_received').defaultTo(0).notNullable()
    table.string('incidence').defaultTo('')
    table.text('note')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'purchase_order_items' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
