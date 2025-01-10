const { v4: uuidv4 } = require('uuid')
const { products } = require('./products_seed.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Configuration
  await knex('configuration').del()
  await knex('configuration').insert({ configured: true, mode: 'offline', enable_sync: false })
  // User
  await knex('users').del()
  await knex('users').insert({
    id: 'd4e5f6a7-8c3b-11ec-a8a3-0242ac120003',
    name: 'Enrique Marin Hirales',
    email: 'enrique.marin.h@hotmail.com',
    password: '123456',
    account_type: 'business',
  })
  // Company
  await knex('company').del()
  await knex('company').insert({
    id: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120002', // UUID generado
    id_user: 'd4e5f6a7-8c3b-11ec-a8a3-0242ac120003', // ID del usuario relacionado
    trade_name: 'Mi Tiendita', // Nombre comercial
    legal_name: 'Mi Tiendita S.A. de C.V.', // Razón social
    tax_id: 'MITI840101XYZ', // RFC
    email: 'contacto@mitiendita.com', // Correo electrónico
    phone: '555-123-4567', // Teléfono
    fiscal_address: 'Calle Principal #123, Centro', // Dirección fiscal
    postal_code: 12345, // Código Postal
    neighborhood: 'Centro', // Colonia
    municipality: 'La Paz', // Municipio
    state: 'Baja California Sur', // Estado
    country: 'México', // País
    business_type: 'convenience_store', // Tipo de negocio
    business_description: 'Una tienda de abarrotes local con productos básicos.', // Descripción
  })

  // Branch
  await knex('branches').del()
  await knex('branches').insert({
    id: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120004', // UUID generado
    id_company: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120002', // ID de la empresa relacionada
    branch_name: 'Sucursal Principal', // Nombre de la sucursal
    branch_alias: 'Principal', // Alias de la sucursal
    is_main: true, // Es la sucursal principal
    pin_enabled: true, // Habilitar PIN
    pin: '1234', // PIN
    logo: 'https://via.placeholder.com/150', // URL del logo
    ticket_config: {
      // Configuración del ticket
      header: 'Mi Tiendita',
      footer: 'Gracias por su compra',
    },
  })

  // Sellers
  await knex('sellers').del()
  await knex('sellers').insert({
    id: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120005', // UUID generado
    id_company: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120002', // ID de la empresa relacionada
    name: 'Juan Perez', // Nombre
    pin: '1234', // PIN
    permissions: 123456789, // Permisos
    status: 'active', // Estatus
  })

  // Branches Sellers
  await knex('branches_sellers').del()
  await knex('branches_sellers').insert({
    id: uuidv4(), // UUID generado
    id_branch: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120004', // ID de la sucursal relacionada
    id_seller: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120005', // ID del vendedor relacionado
  })

  // Products
  await knex('products').del()
  await knex('products').insert(products)
}
