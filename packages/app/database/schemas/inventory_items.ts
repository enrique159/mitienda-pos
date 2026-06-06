import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('inventory_items', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary() // Llave primaria
    table.uuid('id_inventory').notNullable().references('iventories.id') // A que inventario pertenece
    table.uuid('id_product').notNullable().references('products.id') // A que producto pertenece
    table.integer('counted_quantity').notNullable()
    table.integer('registered_quantity').notNullable()
    table.string('incidence').notNullable()
    table.string('note').nullable().defaultTo('')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'inventory_items' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
