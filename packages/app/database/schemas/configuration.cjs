/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
    await knex.schema.createTable('configuration', (table) => {
      table.increments('id').primary()
      table.boolean('configurated').defaultTo(false)
    }).then(() => {
      console.log("Table 'configuration' created.")
    }).catch((err) => {
      console.error(err)
    })
  }