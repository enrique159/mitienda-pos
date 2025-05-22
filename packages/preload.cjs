const { contextBridge, ipcRenderer, shell } = require('electron')
const { getCompany } = require('./app/modules/company/companyListeners.cjs')
const { startSession, getSellers, closeSession } = require('./app/modules/sellers/sellersListeners.cjs')
const { createProduct, deleteProduct, getActiveProducts, getProducts, getProductsByCategory } = require('./app/modules/products/productsListeners.cjs')
const { getActiveDiscounts, getDiscounts, createDiscount, updateDiscount, deleteDiscount, getDiscountProducts, createDiscountProduct } = require('./app/modules/discounts/discountsListeners.cjs')
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./app/modules/categories/categoriesListeners.cjs')
const { getBranchInfo } = require('./app/modules/branches/branchesListeners.cjs')
const { getCashRegisterActive, createCashRegister, getCurrentCashRegisterState } = require('./app/modules/cash_registers/cashRegistersListeners.cjs')
const { createCashRegisterAudit } = require('./app/modules/cash_register_audits/cashRegisterAuditsListeners.cjs')
const { createSale, getSales, getSalesInTurn, generateSaleFolio } = require('./app/modules/sales/salesListeners.cjs')
const { getTaxes, createTax, deleteTax } = require('./app/modules/taxes/taxesListeners.cjs')
const { getConfiguration, getVersion } = require('./app/modules/configuration/configurationListeners.cjs')
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('./app/modules/customers/customersListeners.cjs')
const { createCashMovement } = require('./app/modules/cash_movements/cashMovementsListeners.cjs')
const { createProvider, updateProvider, deleteProvider, getProviders, getProviderById } = require('./app/modules/providers/providersListeners.cjs')
const { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, updatePurchaseOrderStatus, updatePurchaseOrderItem, updatePurchaseOrderItems, deletePurchaseOrder } = require('./app/modules/purchase_orders/purchaseOrdersListeners.cjs')
const { getAiModels, getAiModelById, createAiModel, updateAiModel, deleteAiModel, updateAiModelStatus, setDefaultAiModel } = require('./app/modules/ai_models/aiModelsListeners.cjs')

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
  // Company
  getCompany,
  // Sellers
  getSellers,
  startSession,
  closeSession,
  // Products
  createProduct,
  deleteProduct,
  getActiveProducts,
  getProducts,
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
  getSalesInTurn,
  generateSaleFolio,
  // Configuration
  getVersion,
  getConfiguration,
  // Customers
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  // Providers
  createProvider,
  updateProvider,
  deleteProvider,
  getProviders,
  getProviderById,
  // Cash Movements
  createCashMovement,
  // Cash Register Audits
  createCashRegisterAudit,
  // Purchase Orders
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderItem,
  updatePurchaseOrderItems,
  deletePurchaseOrder,
  updatePurchaseOrderStatus,
  // AI Models
  getAiModels,
  getAiModelById,
  createAiModel,
  updateAiModel,
  deleteAiModel,
  updateAiModelStatus,
  setDefaultAiModel,
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
})