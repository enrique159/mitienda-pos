import ClientsModule from './ClientsModule.vue'
import ClientsView from './views/ClientsView.vue'
import CreateClientView from './views/CreateClientView.vue'

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
    ],
  },
]
