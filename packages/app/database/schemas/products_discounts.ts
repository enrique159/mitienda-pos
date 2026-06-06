import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('products_discounts', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_product').references('products.id').notNullable()
    table.uuid('id_discount').references('discounts.id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  }).then(() => {
    console.log("Table 'products_discounts' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
