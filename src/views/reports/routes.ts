import ReportsModule from './ReportsModule.vue'
import GeneralReportView from './views/GeneralReportView.vue'
import SalesReportView from './views/SalesReportView.vue'
import ProductsReportView from './views/ProductsReportView.vue'
import CashReportView from './views/CashReportView.vue'
import CreditReportView from './views/CreditReportView.vue'
import InventoryReportView from './views/InventoryReportView.vue'
import PurchasesReportView from './views/PurchasesReportView.vue'
import ExportsReportView from './views/ExportsReportView.vue'

export const ReportsRoutes = [
  {
    path: '/main/reports',
    name: 'Reports',
    component: ReportsModule,
    children: [
      {
        path: '',
        name: 'GeneralReportView',
        component: GeneralReportView,
      },
      {
        path: 'sales',
        name: 'SalesReportView',
        component: SalesReportView,
      },
      {
        path: 'products',
        name: 'ProductsReportView',
        component: ProductsReportView,
      },
      {
        path: 'cash',
        name: 'CashReportView',
        component: CashReportView,
      },
      {
        path: 'credits',
        name: 'CreditReportView',
        component: CreditReportView,
      },
      {
        path: 'inventory',
        name: 'InventoryReportView',
        component: InventoryReportView,
      },
      {
        path: 'purchases',
        name: 'PurchasesReportView',
        component: PurchasesReportView,
      },
      {
        path: 'exports',
        name: 'ExportsReportView',
        component: ExportsReportView,
      },
    ],
  },
]
