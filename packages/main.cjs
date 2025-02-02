const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const env = require('./env.json')
const initDB = require('./app/database/index.cjs')
const dev = env.NODE_ENV === 'development'
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true,
      contextIsolation: true,
      nodeIntegrationInWorker: true,
    },
  })

  mainWindow.loadURL(
    dev
      ? 'http://localhost:8080'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  )
  if (dev) {
    // eslint-disable-next-line no-console
    console.log('[electron]: Opening DevTools')
    mainWindow.webContents.openDevTools()
  }
}


// if (dev) {
//   const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
//   app.whenReady().then(() => {
//     installExtension(VUEJS_DEVTOOLS)
//       .then((name) => console.log(`[electron]: Added Extension:  ${name}`))
//       .catch((err) => console.log('[electron]: An error occurred: ', err));
//   });
// }

app.whenReady().then(() => {
  initDB().then(() => {
    createWindow()
  })

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('close_app', () => {
  app.quit()
})

ipcMain.on('restart_app', () => {
  app.relaunch()
  app.quit()
})

ipcMain.on('get_version', (event) => {
  event.reply('get_version', app.getVersion())
})

require('./app/modules/sellers/sellersApplication.cjs')
require('./app/modules/products/productsApplication.cjs')
require('./app/modules/branches/branchesApplication.cjs')
require('./app/modules/cash_registers/cashRegistersApplication.cjs')
require('./app/modules/configuration/configurationApplication.cjs')
require('./app/modules/sales/salesApplication.cjs')
require('./app/modules/customers/customersApplication.cjs')
require('./app/modules/categories/categoriesApplication.cjs')
require('./app/modules/taxes/taxesApplication.cjs')