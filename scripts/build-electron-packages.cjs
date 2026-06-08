const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const packagesDir = path.join(root, 'packages')
const buildDir = path.join(root, 'electron-build')

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const copyFile = (sourcePath) => {
  const relativePath = path.relative(packagesDir, sourcePath)
  const outputPath = path.join(buildDir, relativePath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.copyFileSync(sourcePath, outputPath)
}

fs.rmSync(buildDir, { recursive: true, force: true })

run(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.electron.json'])

copyFile(path.join(packagesDir, 'env.json'))
copyFile(path.join(packagesDir, 'package.json'))

console.log('Built Electron packages with tsc in electron-build/.')
