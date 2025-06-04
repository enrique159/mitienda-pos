import OrdersModule from './OrdersModule.vue'
import OrdersView from './views/OrdersView.vue'
import CreateOrderView from './views/CreateOrderView.vue'
import OrderDetailsView from './views/OrderDetailsView.vue'
import EditDraftOrderView from './views/EditDraftOrderView.vue'

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
      {
        path: 'edit/:id',
        name: 'EditDraftOrderView',
        component: EditDraftOrderView,
      },
      {
        path: 'details/:id',
        name: 'OrderDetailsView',
        component: OrderDetailsView,
      },
    ],
  },
]
