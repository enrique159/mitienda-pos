import ClientsModule from './ClientsModule.vue'
import ClientsView from './views/ClientsView.vue'
import CreateClientView from './views/CreateClientView.vue'
import CustomerCreditView from './views/CustomerCreditView.vue'
import UpdateClientView from './views/UpdateClientView.vue'

export const ClientsRoutes = [
  {
    path: '/main/clients',
    name: 'Clients',
    redirect: { name: 'ClientsView' },
    component: ClientsModule,
    children: [
      {
        path: '',
        name: 'ClientsView',
        component: ClientsView,
      },
      {
        path: 'create',
        name: 'CreateClientView',
        component: CreateClientView,
      },
      {
        path: ':id/edit',
        name: 'UpdateClientView',
        component: UpdateClientView,
      },
      {
        path: ':id/credit',
        name: 'CustomerCreditView',
        component: CustomerCreditView,
      },
    ],
  },
]
