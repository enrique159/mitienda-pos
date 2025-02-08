const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('taxes', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').references('company.id').notNullable()
    table.string('code')
    table.string('name')
    table.enu('type', ['tasa', 'cuota', 'exento']).notNullable().defaultTo('tasa')
    table.integer('value').defaultTo(null)
    table.boolean('transferred').defaultTo(false)
    table.boolean('withheld').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'taxes' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}