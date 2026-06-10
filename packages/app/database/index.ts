import fs from 'fs'
import path from 'path'
import os from 'os'
import knexFactory from 'knex'
import knexConfig from './knexfile.js'
const knex = knexFactory(knexConfig)
import * as seeds from './seeds/init_seed.js'
import { logger } from '../helpers/index.js'
import * as env from '../../env.json'
// Importing schemas
import * as configuration from './schemas/configuration.js'
import * as users from './schemas/users.js'
import * as company from './schemas/company.js'
import * as branch from './schemas/branches.js'
import * as sellers from './schemas/sellers.js'
import * as branches_sellers from './schemas/branches_sellers.js'
import * as providers from './schemas/providers.js'
import * as products from './schemas/products.js'
import * as discounts from './schemas/discounts.js'
import * as productsDiscounts from './schemas/products_discounts.js'
import * as purchaseOrders from './schemas/purchase_orders.js'
import * as purchaseOrderItems from './schemas/purchase_order_items.js'
import * as taxes from './schemas/taxes.js'
import * as categories from './schemas/categories.js'
import * as cashRegisters from './schemas/cash_registers.js'
import * as cashMovements from './schemas/cash_movements.js'
import * as cashRegisterAudits from './schemas/cash_register_audits.js'
import * as customers from './schemas/customers.js'
import * as sales from './schemas/sales.js'
import * as saleDetails from './schemas/sale_details.js'
import * as salePayments from './schemas/sale_payments.js'
import * as aiModels from './schemas/ai_models.js'
import * as inventories from './schemas/inventories.js'
import * as inventoryItems from './schemas/inventory_items.js'

const dev = env.NODE_ENV === 'development'
const seed = env.SEED

const initDB = async () => {
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
        aiModels.createTable(knex),
        inventories.createTable(knex),
        inventoryItems.createTable(knex),
      ])
    } catch (error) {
      logger.error({ type: 'DB', message: `${error}`, error })
      console.error('Error creating tables:', error)
      return
    }

    console.log('Database created and initialized with tables.')

    /* INSERT DEFAULT USER */
    if (dev && seed) {
      await seeds.seed(knex)
    }
    await seeds.requiredSeed(knex)
  } else {
    console.log('Database already exists.')
  }
}

export default initDB
