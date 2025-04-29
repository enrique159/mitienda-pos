const fs = require('fs')
const path = require('path')
const os = require('os')
const knex = require('knex')(require('./knexfile.cjs'))
const seeds = require('./seeds/init_seed.cjs')
const { logger } = require('../helpers/index.cjs')
// Importing schemas
const configuration = require('./schemas/configuration.cjs')
const users = require('./schemas/users.cjs')
const company = require('./schemas/company.cjs')
const branch = require('./schemas/branches.cjs')
const sellers = require('./schemas/sellers.cjs')
const branches_sellers = require('./schemas/branches_sellers.cjs')
const providers = require('./schemas/providers.cjs')
const products = require('./schemas/products.cjs')
const discounts = require('./schemas/discounts.cjs')
const productsDiscounts = require('./schemas/products_discounts.cjs')
const purchaseOrders = require('./schemas/purchase_orders.cjs')
const purchaseOrderItems = require('./schemas/purchase_order_items.cjs')
const taxes = require('./schemas/taxes.cjs')
const categories = require('./schemas/categories.cjs')
const cashRegisters = require('./schemas/cash_registers.cjs')
const cashMovements = require('./schemas/cash_movements.cjs')
const cashRegisterAudits = require('./schemas/cash_register_audits.cjs')
const customers = require('./schemas/customers.cjs')
const sales = require('./schemas/sales.cjs')
const saleDetails = require('./schemas/sale_details.cjs')
const salePayments = require('./schemas/sale_payments.cjs')

const initDB = async() => {
  const destinationPath = path.join(os.homedir(), '.db')
  const dbPath = path.join(destinationPath, 'mitienda.sqlite')

  if (!fs.existsSync(dbPath)) {
    console.log('Database not found, creating a new one...')
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath)
    }
    fs.writeFileSync(dbPath, '')

    try {
      await Promise.all([
        configuration.createTable(knex),
        users.createTable(knex),
        company.createTable(knex),
        branch.createTable(knex),
        sellers.createTable(knex),
        branches_sellers.createTable(knex),
        categories.createTable(knex),
        providers.createTable(knex),
        products.createTable(knex),
        discounts.createTable(knex),
        productsDiscounts.createTable(knex),
        purchaseOrders.createTable(knex),
        purchaseOrderItems.createTable(knex),
        taxes.createTable(knex),
        cashRegisters.createTable(knex),
        cashMovements.createTable(knex),
        cashRegisterAudits.createTable(knex),
        customers.createTable(knex),
        sales.createTable(knex),
        saleDetails.createTable(knex),
        salePayments.createTable(knex),
      ])
    } catch (error) {
      logger.error({ type: 'DB', message: `${error}`, error })
      console.error('Error creating tables:', error)
      return
    }


    console.log('Database created and initialized with tables.')

    /* INSERT DEFAULT USER */
    await seeds.seed(knex)
  } else {
    console.log('Database already exists.')
  }
}

module.exports = initDB
