import { contextBridge, ipcRenderer, shell } from 'electron'
import type { ElectronApi } from './app/shared/electronApi'
import * as providersListeners from './app/modules/providers/providersListeners'

import * as databaseListeners from './app/utils/database/databaseListeners.js'
import * as configurationListeners from './app/modules/configuration/configurationListeners.js'
import * as companyListeners from './app/modules/company/companyListeners.js'
import * as sellersListeners from './app/modules/sellers/sellersListeners.js'
import * as productsListeners from './app/modules/products/productsListeners.js'
import * as discountsListeners from './app/modules/discounts/discountsListeners.js'
import * as categoriesListeners from './app/modules/categories/categoriesListeners.js'
import * as branchesListeners from './app/modules/branches/branchesListeners.js'
import * as cashRegistersListeners from './app/modules/cash_registers/cashRegistersListeners.js'
import * as cashRegisterAuditsListeners from './app/modules/cash_register_audits/cashRegisterAuditsListeners.js'
import * as salesListeners from './app/modules/sales/salesListeners.js'
import * as taxesListeners from './app/modules/taxes/taxesListeners.js'
import * as customersListeners from './app/modules/customers/customersListeners.js'
import * as cashMovementsListeners from './app/modules/cash_movements/cashMovementsListeners.js'
import * as purchaseOrdersListeners from './app/modules/purchase_orders/purchaseOrdersListeners.js'
import * as aiModelsListeners from './app/modules/ai_models/aiModelsListeners.js'
import * as reportsListeners from './app/modules/reports/reportsListeners.js'
import * as printerListeners from './app/utils/printer/printerListeners.js'

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
  ...reportsListeners,
  ...printerListeners,
  closeApp: () => ipcRenderer.send('close_app'),
  restartApp: () => ipcRenderer.send('restart_app'),
  openExternalLink: (url: string) => shell.openExternal(url),
  onSystemSuspend: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('system-suspend', listener)
    return () => ipcRenderer.removeListener('system-suspend', listener)
  },
  onSystemResume: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('system-resume', listener)
    return () => ipcRenderer.removeListener('system-resume', listener)
  },
} as ElectronApi

ipcRenderer.setMaxListeners(100)

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text?: string) => {
    const element = document.getElementById(selector)
    if (element && text) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('electron', api)
