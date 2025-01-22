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
const products = require('./schemas/products.cjs')
const cashRegisters = require('./schemas/cash_registers.cjs')
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
        products.createTable(knex),
        cashRegisters.createTable(knex),
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
