const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')
const packagesDir = path.join(root, 'packages')
const buildDir = path.join(root, 'electron-build')

const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  resolveJsonModule: true,
  sourceMap: false,
}

const getFiles = (dir) => {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getFiles(entryPath))
      continue
    }
    if (entry.isFile() && !entry.name.startsWith('.')) {
      files.push(entryPath)
    }
  }
  return files
}

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const copyJsonFile = (filePath) => {
  const relativePath = path.relative(packagesDir, filePath)
  const outputPath = path.join(buildDir, relativePath)
  ensureDir(path.dirname(outputPath))
  fs.copyFileSync(filePath, outputPath)
  return outputPath
}

const transpileFile = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions,
    fileName: filePath,
  })
  const relativePath = path.relative(packagesDir, filePath).replace(/\.ts$/, '.cjs')
  const outputPath = path.join(buildDir, relativePath)
  ensureDir(path.dirname(outputPath))
  fs.writeFileSync(outputPath, output.outputText)
  return outputPath
}

fs.rmSync(buildDir, { recursive: true, force: true })

const sourceFiles = getFiles(packagesDir)
const tsFiles = sourceFiles.filter((filePath) => filePath.endsWith('.ts') && !filePath.endsWith('.d.ts'))
const jsonFiles = sourceFiles.filter((filePath) => filePath.endsWith('.json'))

tsFiles.forEach(transpileFile)
jsonFiles.forEach(copyJsonFile)

console.log(`Built ${tsFiles.length} Electron package files in electron-build/.`)
