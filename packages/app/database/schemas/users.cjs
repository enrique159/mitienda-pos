/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.string('name')
    table.string('pin')
    table.bigInteger('permissions')
    table.enu('status', ['active', 'inactive']).defaultTo('active')
    table.dateTime('created_at').defaultTo(knex.fn.now())
    table.dateTime('updated_at').defaultTo(knex.fn.now())
  }).then(() => {
    console.log("Table 'users' created.")
  }).catch((err) => {
    console.error(err)
  })
}