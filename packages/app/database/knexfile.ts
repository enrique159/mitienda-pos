import path from 'path'
import os from 'os'
import type { Knex } from 'knex'

export const config: Knex.Config = {
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

export default config
