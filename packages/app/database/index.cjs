const fs = require('fs')
const path = require('path')
const os = require('os')
const knex = require('knex')(require('./knexfile.cjs'))
const seeds = require('./seeds/init_seed.cjs')
// Importing schemas
const configuration = require('./schemas/configuration.cjs')
const users = require('./schemas/users.cjs')
const company = require('./schemas/company.cjs')
const branch = require('./schemas/branches.cjs')
const sellers = require('./schemas/sellers.cjs')
const branchs_sellers = require('./schemas/branches_sellers.cjs')
const products = require('./schemas/products.cjs')
const cashRegisters = require('./schemas/cash_registers.cjs')

const initDB = async() => {
  const destinationPath = path.join(os.homedir(), '.db')
  const dbPath = path.join(destinationPath, 'mitienda.sqlite')

  if (!fs.existsSync(dbPath)) {
    console.log('Database not found, creating a new one...')
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath)
    }
    fs.writeFileSync(dbPath, '')

    await configuration.createTable(knex)
    await users.createTable(knex)
    await company.createTable(knex)
    await branch.createTable(knex)
    await sellers.createTable(knex)
    await branches_sellers.createTable(knex)
    await products.createTable(knex)
    await cashRegisters.createTable(knex)

    console.log('Database created and initialized with tables.')

    /* INSERT DEFAULT USER */
    await seeds.seed(knex)
  } else {
    console.log('Database already exists.')
  }
}

module.exports = initDB
