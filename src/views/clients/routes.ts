import ClientsModule from './ClientsModule.vue'
import ClientsView from './views/ClientsView.vue'

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
    ],
  },
]