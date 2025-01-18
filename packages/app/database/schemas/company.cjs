const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('company', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_user').references('users.id').notNullable() // Usuario
    table.string('trade_name').notNullable() // Nombre comercial
    table.string('legal_name').notNullable() // Razón social
    table.string('tax_id').notNullable() // RFC
    table.string('email').notNullable() // Correo electrónico
    table.string('phone').notNullable() // Teléfono
    table.string('fiscal_address').notNullable() // Dirección fiscal
    table.integer('postal_code').notNullable() // Código Postal
    table.string('neighborhood').notNullable() // Colonia
    table.string('municipality').notNullable() // Municipio
    table.string('state').notNullable() // Estado
    table.string('country').defaultTo('México').notNullable() // País
    table
      .enu('business_type', [
        'convenience_store',
        'clothing_store',
        'hardware_store',
        'pharmacy',
        'restaurant',
        'electronics_store',
        'bookstore',
        'grocery_store',
        'bakery',
        'other',
      ])
      .defaultTo('convenience_store')
      .notNullable() // Tipo de negocio
    table.string('business_description') // Descripción del negocio
    table.string('default_currency').defaultTo('MXN').notNullable() // Moneda predeterminada
    table.integer('default_tax').defaultTo(16).notNullable() // Impuesto predeterminado
    table.string('voucher_type').defaultTo('Ingreso').notNullable() // Tipo de ticket fiscal
    table.string('default_payment_method').defaultTo('PUE').notNullable() // Método de pago SAT
    table.string('default_payment_form').defaultTo('01').notNullable() // Forma de pago SAT
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at') // Fecha de sincronización
  }).then(() => {
    console.log("Table 'configuration' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}