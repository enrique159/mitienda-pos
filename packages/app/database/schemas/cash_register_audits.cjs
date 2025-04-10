const { logger } = require('../../helpers/index.cjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('cash_register_audits', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_cash_register').notNullable().references('cash_registers.id') // Relacion con la caja registradora
    table.uuid('id_user').notNullable().references('users.id') // Relacion con el usuario
    table.integer('cash_amount').notNullable().defaultTo(0) // Efectivo
    table.integer('card_amount').notNullable().defaultTo(0) // Tarjeta
    table.integer('transfer_amount').notNullable().defaultTo(0) // Transferencia
    table.integer('other_amount').notNullable().defaultTo(0) // Otro
    table.integer('income').notNullable().defaultTo(0) // Ingresos
    table.integer('withdraw').notNullable().defaultTo(0) // Retiros
    table.integer('total_amount').notNullable().defaultTo(0) // Total de la suma de dinero que hay pasado por caja
    table.integer('balance').notNullable().defaultTo(0) // Saldo final al corte de caja
    table.integer('difference').notNullable().defaultTo(0) // Diferencia entre el balance de caja y el total de efectivo que ha pasado por caja
    table.jsonb('cash_breakdown').defaultTo(null) // Desglose de efectivo: [{ "denomination": 20, "type": "coin", "quantity": 5 }, ...]
    table.integer('card_breakdown').defaultTo(0) // Desglose de tarjeta
    table.integer('count_sales').notNullable().defaultTo(0) // Cantidad de ventas
    table.integer('count_movements').notNullable().defaultTo(0) // Cantidad de movimientos
    table.enu('closure', ['partial', 'full']).notNullable() // Cierre parcial o completo
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'cash_register_audits' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}