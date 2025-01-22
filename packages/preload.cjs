const { contextBridge, ipcRenderer } = require('electron')
const { startSession, getSellers } = require('./app/modules/sellers/sellersListeners.cjs')
const { getActiveProducts, getProductCategories, getProductsByCategory } = require('./app/modules/products/productsListeners.cjs')
const { getBranchInfo } = require('./app/modules/branches/branchesListeners.cjs')
const { getCashRegisterActive, createCashRegister, getCurrentCashRegisterState } = require('./app/modules/cash_registers/cashRegistersListeners.cjs')
const { createSale, getSales, generateSaleFolio } = require('./app/modules/sales/salesListeners.cjs')
const { getConfiguration, updateConfiguration, createConfiguration, exportDatabase, importDatabase, getVersion } = require('./app/modules/configuration/configurationListeners.cjs')
const { getCustomers } = require('./app/modules/customers/customersListeners.cjs')
// const { signIn, signUp, changePassword } = require('./app/modules/auth/authListeners.cjs')
// const { getAreas, createArea, updateArea, deleteArea } = require('./app/modules/areas/areasListeners.cjs')
// const { getActivities, createActivity, deleteActivity } = require('./app/modules/activities/activitiesListeners.cjs')
// const { getActors, getActorByNombre, createActor, deleteActor } = require('./app/modules/actors/actorsListeners.cjs')
// const { createDocument, getDocuments, openDocument, deleteDocument } = require('./app/modules/documents/documentsListeners.cjs')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('electron', {
  // Sellers
  getSellers,
  startSession,
  // Products
  getActiveProducts,
  getProductCategories,
  getProductsByCategory,
  // Branches
  getBranchInfo,
  // Cash Registers
  getCashRegisterActive,
  createCashRegister,
  getCurrentCashRegisterState,
  // Sales
  createSale,
  getSales,
  generateSaleFolio,
  // Configuration
  getVersion,
  getConfiguration,
  // Customers
  getCustomers,
  closeApp: () => ipcRenderer.send('close_app'),
  restartApp: () => ipcRenderer.send('restart_app'),
})