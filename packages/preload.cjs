const { contextBridge, ipcRenderer } = require('electron')
const { startSession, getSellers, closeSession } = require('./app/modules/sellers/sellersListeners.cjs')
const { createProduct, deleteProduct, getActiveProducts, getProductsByCategory } = require('./app/modules/products/productsListeners.cjs')
const { getActiveDiscounts, getDiscounts, createDiscount, updateDiscount, deleteDiscount, getDiscountProducts, createDiscountProduct } = require('./app/modules/discounts/discountsListeners.cjs')
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./app/modules/categories/categoriesListeners.cjs')
const { getBranchInfo } = require('./app/modules/branches/branchesListeners.cjs')
const { getCashRegisterActive, createCashRegister, getCurrentCashRegisterState } = require('./app/modules/cash_registers/cashRegistersListeners.cjs')
const { createSale, getSales, generateSaleFolio } = require('./app/modules/sales/salesListeners.cjs')
const { getTaxes, createTax, deleteTax } = require('./app/modules/taxes/taxesListeners.cjs')
const { getConfiguration, getVersion } = require('./app/modules/configuration/configurationListeners.cjs')
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('./app/modules/customers/customersListeners.cjs')

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

contextBridge.exposeInMainWorld('electron', {
  // Sellers
  getSellers,
  startSession,
  closeSession,
  // Products
  createProduct,
  deleteProduct,
  getActiveProducts,
  getProductsByCategory,
  // Discounts
  getActiveDiscounts,
  getDiscounts,
  createDiscount,
  getDiscountProducts,
  createDiscountProduct,
  updateDiscount,
  deleteDiscount,
  // Taxes
  getTaxes,
  createTax,
  deleteTax,
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
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
  createCustomer,
  updateCustomer,
  deleteCustomer,
  // Extras
  closeApp: () => ipcRenderer.send('close_app'),
  restartApp: () => ipcRenderer.send('restart_app'),
  // System events
  onSystemSuspend: (callback) => {
    ipcRenderer.on('system-suspend', () => callback())
  },
  onSystemResume: (callback) => {
    ipcRenderer.on('system-resume', () => callback())
  },
})