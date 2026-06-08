const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const sqlite3Dir = path.dirname(require.resolve('sqlite3/package.json'))

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_ignore_scripts: 'false',
    },
    ...options,
  })

  if (result.error) {
    throw result.error
  }

  return result.status ?? 1
}

const prebuildStatus = run(
  process.execPath,
  [require.resolve('prebuild-install/bin'), '-r', 'napi'],
  { cwd: sqlite3Dir },
)

if (prebuildStatus === 0) {
  process.exit(0)
}

process.exit(run(
  process.execPath,
  [require.resolve('node-gyp/bin/node-gyp.js'), 'rebuild'],
  { cwd: sqlite3Dir },
))
