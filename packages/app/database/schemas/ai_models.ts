import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('ai_models', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id')
    table.string('name').notNullable() // Nombre del modelo
    table.string('model').notNullable() // Modelo específico de IA
    table.string('api_key').notNullable() // Clave de API
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable() // Estado del modelo
    table.boolean('default').defaultTo(false).notNullable() // Modelo por defecto
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'ai_models' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
