const { v4: uuidv4 } = require('uuid')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Configuration
  await knex('configuration').del()
  await knex('configuration').insert({ configurated: false })
  // Users
  await knex('users').del()
  await knex('users').insert({
    name: 'admin',
    pin: '1234',
    permissions: 0,
    status: 'active'
  })
}
