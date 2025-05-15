import OrdersModule from './OrdersModule.vue'
import OrdersView from './views/OrdersView.vue'
import CreateOrderView from './views/CreateOrderView.vue'

export const OrdersRoutes = [
  {
    path: '/main/orders',
    name: 'Orders',
    redirect: { name: 'OrdersView' },
    component: OrdersModule,
    children: [
      {
        path: '',
        name: 'OrdersView',
        component: OrdersView,
      },
      {
        path: 'create',
        name: 'CreateOrderView',
        component: CreateOrderView,
      },
    ],
  },
]
