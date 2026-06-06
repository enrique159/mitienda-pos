import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('providers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id')
    table.string('name').notNullable()
    table.string('contact_name')
    table.string('email')
    table.string('phone')
    table.string('address')
    table.string('website')
    table.string('tax_id')
    table.text('notes')
    table.enu('status', ['active', 'inactive']).defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'providers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
