import { app, BrowserWindow, ipcMain, powerMonitor } from 'electron'
import path from 'path'
import * as env from './env.json'

type InitDatabase = () => Promise<void>

declare global {
  // eslint-disable-next-line no-var
  var mainWindow: BrowserWindow | undefined
}

import initDBModule from './app/database/index.js'

const initDB = initDBModule as InitDatabase
const dev = env.NODE_ENV === 'development'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      nodeIntegrationInWorker: true,
    },
  })

  mainWindow.loadURL(
    dev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  )
  if (dev) {
    console.log('[electron]: Opening DevTools')
    mainWindow.webContents.openDevTools()
  }

  global.mainWindow = mainWindow
}

app.whenReady().then(() => {
  initDB().then(() => {
    createWindow()
  })

  powerMonitor.on('suspend', () => {
    if (global.mainWindow) global.mainWindow.webContents.send('system-suspend')
  })

  powerMonitor.on('lock-screen', () => {
    if (global.mainWindow) global.mainWindow.webContents.send('system-suspend')
  })

  powerMonitor.on('unlock-screen', () => {
    if (global.mainWindow) global.mainWindow.webContents.send('system-resume')
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

import './app/utils/database/databaseApplication.js'
import './app/utils/printer/printerApplication.js'
import './app/modules/sellers/sellersApplication.js'
import './app/modules/products/productsApplication.js'
import './app/modules/discounts/discountsApplication.js'
import './app/modules/branches/branchesApplication.js'
import './app/modules/cash_registers/cashRegistersApplication.js'
import './app/modules/configuration/configurationApplication.js'
import './app/modules/sales/salesApplication.js'
import './app/modules/customers/customersApplication.js'
import './app/modules/categories/categoriesApplication.js'
import './app/modules/taxes/taxesApplication.js'
import './app/modules/cash_movements/cashMovementsApplication.js'
import './app/modules/cash_register_audits/cashRegisterAuditsApplication.js'
import './app/modules/providers/providersApplication.js'
import './app/modules/purchase_orders/purchaseOrdersApplication.js'
import './app/modules/company/companyApplication.js'
import './app/modules/ai_models/aiModelsApplication.js'
import './app/modules/reports/reportsApplication.js'
