const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const buildDir = path.join(root, 'electron-build')

fs.rmSync(buildDir, { recursive: true, force: true })

console.log('Cleaned electron-build/.')
