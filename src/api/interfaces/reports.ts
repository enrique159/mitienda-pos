export type ReportPaymentMethod = '' | 'cash' | 'card' | 'transfer' | 'other'

export interface ReportFilters {
  startDate?: string
  endDate?: string
  id_branch?: string
  id_seller?: string
  id_customer?: string
  payment_method?: ReportPaymentMethod
  id_category?: string
  id_product?: string
  search?: string
}

export interface ReportCatalogOption {
  id: string
  name: string
  id_category?: string
}

export interface ReportSummary {
  totalSales: number
  estimatedProfit: number
  averageTicket: number
  salesCount: number
  cancelledSales: number
  creditSales: number
  cashInRegister: number
  cashDifference: number
}

export interface SalesByDayReport {
  date: string
  total: number
  count: number
}

export interface PaymentMethodReport {
  method: string
  total: number
}

export interface ProductReportRow {
  id_product: string
  product_name: string
  category_name: string
  provider_name: string
  quantity: number
  total: number
  profit: number
}

export interface CategoryReportRow {
  id_category?: string
  category_name: string
  quantity: number
  total: number
  profit: number
}

export interface SalesReportRow {
  id: string
  folio: string
  customer_name: string
  seller_name: string
  branch_name: string
  total: number
  amount_paid: number
  balance_due: number
  status: string
  on_trust: boolean
  created_at: string
}

export interface CreditReportRow {
  id: string
  folio: string
  customer_name: string
  seller_name: string
  total: number
  amount_paid: number
  balance_due: number
  due_date?: string
  status: string
  created_at: string
}

export interface InventoryReportRow {
  id: string
  name: string
  sku: string
  stock: number | null
  stock_minimum: number | null
  unlimited_stock: boolean
  selling_price: number
  purchase_price: number
  category_name: string
  provider_name: string
}

export interface CashReportRow {
  id: string
  record_type: 'audit' | 'movement'
  movement_type?: 'income' | 'withdraw'
  created_at: string
  amount?: number
  reason?: string
  description?: string
  seller_name?: string
  total_amount?: number
  balance?: number
  difference?: number
  closure?: string
}

export interface PurchaseReportRow {
  id: string
  status: string
  ordered_at?: string
  received_at?: string
  created_at: string
  provider_name: string
  seller_name: string
  ordered_quantity: number
  received_quantity: number
}

export interface InventoryAuditReportRow {
  id: string
  status: string
  date?: string
  started_at?: string
  ended_at?: string
  created_at: string
  supervisor_name?: string
  items_count: number
  counted_quantity: number
  registered_quantity: number
}

export interface ReportsPayload {
  summary: ReportSummary
  charts: {
    salesByDay: SalesByDayReport[]
    paymentMethods: PaymentMethodReport[]
    topProducts: ProductReportRow[]
    salesByCategory: CategoryReportRow[]
  }
  tables: {
    sales: SalesReportRow[]
    products: ProductReportRow[]
    cash: CashReportRow[]
    credits: CreditReportRow[]
    inventory: InventoryReportRow[]
    inventoryAudits: InventoryAuditReportRow[]
    purchases: PurchaseReportRow[]
  }
  catalogs: {
    branches: ReportCatalogOption[]
    sellers: ReportCatalogOption[]
    customers: ReportCatalogOption[]
    categories: ReportCatalogOption[]
    products: ReportCatalogOption[]
    providers: ReportCatalogOption[]
  }
}
