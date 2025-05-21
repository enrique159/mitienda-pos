import SettingsModule from './SettingsModule.vue'
import GeneralSettingsView from './views/GeneralSettingsView.vue'
import SalesAndProductsSettingsView from './views/SalesAndProductsSettingsView.vue'
import AiModelsView from './views/AiModelsView.vue'

export const SettingsRoutes = [
  {
    path: '/main/settings',
    name: "Settings",
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
        path: '/main/settings/ai',
        name: 'AiModelsView',
        component: AiModelsView,
      },
    ],
  },
]