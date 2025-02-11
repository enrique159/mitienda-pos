import ListSalesModule from './ListSalesModule.vue'
import ListSalesView from './views/ListSalesView.vue'

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
    ],
  },
]