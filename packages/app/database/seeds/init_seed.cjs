const { v4: uuidv4 } = require('uuid')
const { products } = require('./products_seed.cjs')
const { categories } = require('./categories_seed.cjs')
const { taxes } = require('./taxes_seed.cjs')
const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  try {

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
      branch_alias: 'MITI', // Alias de la sucursal
      is_main: true, // Es la sucursal principal
      pin_enabled: true, // Habilitar PIN
      pin: '1234', // PIN
      logo: 'https://via.placeholder.com/150', // URL del logo
      ticket_config: {
        // Configuración del ticket
        header: 'Mi Tiendita',
        footer: 'Gracias por su compra',
      },
      timezone: 'America/Mazatlan', // Zona horaria
      pin_cancel_sale_required: true, // Requerir PIN para cancelar venta
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

    // Categories
    await knex('categories').del()
    await knex('categories').insert(categories)

    // Providers
    await knex('providers').del()
    await knex('providers').insert({
      id: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120020', // UUID generado
      id_company: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120002', // ID de la empresa relacionada
      name: 'Proveedor 1', // Nombre del proveedor
      contact_name: 'Contacto 1', // Nombre del contacto
      email: 'contacto1@mail.com', // Correo electrónico
      phone: '5551234567', // Teléfono
      address: 'Calle Principal #123, Centro', // Dirección
      website: 'https://www.proveedor1.com', // Website
      tax_id: 'PRO123456789', // RFC
      notes: 'Notas del proveedor', // Notas
    })

    // Products
    await knex('products').del()
    await knex('products').insert(products.map((product) => ({
      ...product,
      taxes: JSON.stringify(product.taxes),
    })))

    // Customers
    await knex('customers').del()
    await knex('customers').insert({
      id: uuidv4(), // UUID generado
      id_company: 'b2e1c1a4-8c3a-11ec-a8a3-0242ac120002', // ID de la empresa relacionada
      name: 'Jose Eduardo Ezpinosa', // Nombre
      rfc: 'EJIE840101123',
      email: 'jose@mail.com',
      phone: '5551234567',
      address: 'Calle Principal #123, Centro',
      has_credit: true,
      credit_limit: 1000,
      days_until_due: 20,
    })

    // Taxes
    await knex('taxes').del()
    await knex('taxes').insert(taxes)
  } catch (error) {
    console.error('Error seeding data:', error)
    logger.error({ type: 'DB SEEDS', message: `${error}`, error })
  }
}
