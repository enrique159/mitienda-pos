// @ts-nocheck
const { contextBridge, ipcRenderer, shell } = require('electron')
/* DATABASE */
const databaseListeners = require('./app/utils/database/databaseListeners.cjs')
/* CONFIGURATION */
const configurationListeners = require('./app/modules/configuration/configurationListeners.cjs')
/* COMPANY */
const companyListeners = require('./app/modules/company/companyListeners.cjs')
/* SELLERS */
const sellersListeners = require('./app/modules/sellers/sellersListeners.cjs')
/* PRODUCTS */
const productsListeners = require('./app/modules/products/productsListeners.cjs')
/* DISCOUNTS */
const discountsListeners = require('./app/modules/discounts/discountsListeners.cjs')
/* CATEGORIES */
const categoriesListeners = require('./app/modules/categories/categoriesListeners.cjs')
/* BRANCHES */
const branchesListeners = require('./app/modules/branches/branchesListeners.cjs')
/* CASH REGISTERS */
const cashRegistersListeners = require('./app/modules/cash_registers/cashRegistersListeners.cjs')
/* CASH REGISTER AUDITS */
const cashRegisterAuditsListeners = require('./app/modules/cash_register_audits/cashRegisterAuditsListeners.cjs')
/* SALES */
const salesListeners = require('./app/modules/sales/salesListeners.cjs')
/* TAXES */
const taxesListeners = require('./app/modules/taxes/taxesListeners.cjs')
/* CUSTOMERS */
const customersListeners = require('./app/modules/customers/customersListeners.cjs')
/* CASH MOVEMENTS */
const cashMovementsListeners = require('./app/modules/cash_movements/cashMovementsListeners.cjs')
/* PROVIDERS */
const providersListeners = require('./app/modules/providers/providersListeners.cjs')
/* PURCHASE ORDERS */
const purchaseOrdersListeners = require('./app/modules/purchase_orders/purchaseOrdersListeners.cjs')
/* AI MODELS */
const aiModelsListeners = require('./app/modules/ai_models/aiModelsListeners.cjs')
/* PRINTER */
const printerListeners = require('./app/utils/printer/printerListeners.cjs')

const api = {
  ...databaseListeners,
  ...configurationListeners,
  ...companyListeners,
  ...sellersListeners,
  ...productsListeners,
  ...discountsListeners,
  ...categoriesListeners,
  ...branchesListeners,
  ...cashRegistersListeners,
  ...cashRegisterAuditsListeners,
  ...salesListeners,
  ...taxesListeners,
  ...customersListeners,
  ...cashMovementsListeners,
  ...providersListeners,
  ...purchaseOrdersListeners,
  ...aiModelsListeners,
  ...printerListeners,
  // Extras
  closeApp: () => ipcRenderer.send('close_app'),
  restartApp: () => ipcRenderer.send('restart_app'),
  openExternalLink: (url) => shell.openExternal(url),
  // System events
  onSystemSuspend: (callback) => {
    ipcRenderer.on('system-suspend', () => callback())
  },
  onSystemResume: (callback) => {
    ipcRenderer.on('system-resume', () => callback())
  },
}

ipcRenderer.setMaxListeners(100)

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('electron', api)

export {}
