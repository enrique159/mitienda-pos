const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('sale_details', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_sale').notNullable().references('sales.id')
    table.uuid('id_product').notNullable().references('products.id')
    table.string('product_name').notNullable()
    table.integer('quantity').notNullable()
    table.integer('selling_price').notNullable()
    table.integer('tax_rate').notNullable()
    table.integer('discount').defaultTo(0)
    table.integer('total').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
  }).then(() => {
    console.log("Table 'sale_details' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}