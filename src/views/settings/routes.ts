import SettingsModule from './SettingsModule.vue'
import GeneralSettingsView from './views/GeneralSettingsView.vue'
import SellersView from './views/SellersView.vue'
import CreateSellerView from './views/CreateSellerView.vue'
import UpdateSellerView from './views/UpdateSellerView.vue'
import SalesAndProductsSettingsView from './views/SalesAndProductsSettingsView.vue'
import AiModelsView from './views/AiModelsView.vue'
import PrintersAndTicketView from './views/PrintersAndTicketView.vue'

export const SettingsRoutes = [
  {
    path: '/main/settings',
    name: 'Settings',
    redirect: { name: 'GeneralSettings' },
    component: SettingsModule,
    children: [
      {
        path: '/main/settings/general',
        name: 'GeneralSettings',
        component: GeneralSettingsView,
      },
      {
        path: '/main/settings/sales-and-products',
        name: 'SalesAndProductsSettings',
        component: SalesAndProductsSettingsView,
      },
      {
        path: '/main/settings/sellers',
        name: 'SellersView',
        component: SellersView,
      },
      {
        path: '/main/settings/sellers/create',
        name: 'CreateSellerView',
        component: CreateSellerView,
      },
      {
        path: '/main/settings/sellers/update/:id',
        name: 'UpdateSellerView',
        component: UpdateSellerView,
      },
      {
        path: '/main/settings/printer',
        name: 'PrintersAndTicketView',
        component: PrintersAndTicketView,
      },
      {
        path: '/main/settings/ai',
        name: 'AiModelsView',
        component: AiModelsView,
      },
    ],
  },
]
