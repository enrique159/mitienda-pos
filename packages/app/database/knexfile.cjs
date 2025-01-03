const path = require('path')
const os = require('os')
// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.join(os.homedir(), '.db/mitienda.sqlite'),
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
  useNullAsDefault: true,
}
