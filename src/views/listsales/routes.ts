import ListSalesModule from './ListSalesModule.vue'
import ListSalesView from './views/ListSalesView.vue'
import CashRegisterMovementsViews from './views/CashRegisterMovementsViews.vue'

export const ListSalesRoutes = [
  {
    path: '/main/listsales',
    name: 'ListSales',
    component: ListSalesModule,
    children: [
      {
        path: '',
        name: 'ListSalesView',
        component: ListSalesView,
      },
      {
        path: 'movements',
        name: 'CashRegisterMovementsViews',
        component: CashRegisterMovementsViews,
      },
    ],
  },
]