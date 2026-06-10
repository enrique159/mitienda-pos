import InventoryModule from './InventoryModule.vue'
import InventoriesView from './views/InventoriesView.vue'
import CreateInventoryView from './views/CreateInventoryView.vue'
import InventoryDetailView from './views/InventoryDetailView.vue'

export const InventoryRoutes = [
  {
    path: '/main/inventory',
    name: 'Inventory',
    redirect: { name: 'InventoriesView' },
    component: InventoryModule,
    children: [
      {
        path: '',
        name: 'InventoriesView',
        component: InventoriesView,
      },
      {
        path: 'create',
        name: 'CreateInventoryView',
        component: CreateInventoryView,
      },
      {
        path: 'details/:id',
        name: 'InventoryDetailView',
        component: InventoryDetailView,
      },
    ],
  },
]
