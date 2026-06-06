const fs = require('fs')
const net = require('net')
const path = require('path')
const { spawn } = require('child_process')

const root = path.resolve(__dirname, '..')
const packagesDir = path.join(root, 'packages')
const electronPath = require('electron')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const watchedExtensions = new Set(['.ts', '.json'])

let electronProcess = null
let restarting = false
let restartTimer = null
let watchers = []

const log = (message) => {
  console.log(`[electron-watch] ${message}`)
}

const run = (command, args) => new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })

  child.on('exit', (code) => {
    if (code === 0) {
      resolve()
      return
    }
    reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
  })
})

const waitForPort = (port, host = '127.0.0.1') => new Promise((resolve) => {
  const tryConnect = () => {
    const socket = net.createConnection({ port, host }, () => {
      socket.end()
      resolve()
    })

    socket.on('error', () => {
      socket.destroy()
      setTimeout(tryConnect, 250)
    })
  }

  tryConnect()
})

const stopElectron = () => new Promise((resolve) => {
  if (!electronProcess || electronProcess.killed) {
    resolve()
    return
  }

  const child = electronProcess
  electronProcess = null
  child.once('exit', () => resolve())
  child.kill()

  setTimeout(() => {
    if (!child.killed) child.kill('SIGKILL')
    resolve()
  }, 3000)
})

const startElectron = () => {
  electronProcess = spawn(electronPath, ['.'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })

  electronProcess.on('exit', (code) => {
    if (electronProcess) {
      log(`Electron exited with code ${code}`)
      electronProcess = null
    }
  })
}

const buildAndRestart = async () => {
  if (restarting) return
  restarting = true

  try {
    log('Building packages TypeScript...')
    await stopElectron()
    await run(npmCommand, ['run', 'packages:build'])
    log('Starting Electron...')
    startElectron()
  } catch (error) {
    log(error.message)
  } finally {
    restarting = false
  }
}

const scheduleRestart = (filePath) => {
  clearTimeout(restartTimer)
  restartTimer = setTimeout(() => {
    log(`Change detected: ${path.relative(root, filePath)}`)
    buildAndRestart()
  }, 150)
}

const getDirectories = (dir) => {
  const dirs = [dir]
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'node_modules') continue
    dirs.push(...getDirectories(path.join(dir, entry.name)))
  }
  return dirs
}

const watchPackages = () => {
  watchers.forEach((watcher) => watcher.close())
  watchers = getDirectories(packagesDir).map((dir) => fs.watch(dir, (event, filename) => {
    if (!filename) return
    const filePath = path.join(dir, filename.toString())
    if (!watchedExtensions.has(path.extname(filePath))) return
    scheduleRestart(filePath)
  }))
}

const shutdown = async () => {
  watchers.forEach((watcher) => watcher.close())
  await stopElectron()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

async function main() {
  log('Waiting for Vite on port 5173...')
  await waitForPort(5173)
  watchPackages()
  await buildAndRestart()
}

main().catch((error) => {
  log(error.message)
  process.exit(1)
})
