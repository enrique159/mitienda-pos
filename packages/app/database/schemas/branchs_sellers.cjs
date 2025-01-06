const { logger } = require('../../helpers/index.cjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('branchs_sellers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_branch').references('branchs.id').notNullable()
    table.uuid('id_seller').references('sellers.id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  }).then(() => {
    console.log("Table 'branchs_sellers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}