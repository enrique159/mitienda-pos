import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('cash_movements', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary() // ID único
    table.uuid('id_cash_register').notNullable().references('cash_registers.id') // Relación con la caja registradora
    table.uuid('id_seller').notNullable().references('sellers.id') // Relación con el vendedor
    table.integer('amount').notNullable() // Monto del movimiento
    table.enum('type', ['income', 'withdraw']).notNullable() // Tipo de movimiento (ingreso o retiro)
    table.string('reason').notNullable() // Razón del movimiento
    table.string('description') // Descripción del movimiento
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'cash_movements' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
