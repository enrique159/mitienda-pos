import SettingsModule from './SettingsModule.vue'
import GeneralSettingsView from './views/GeneralSettingsView.vue'

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
        component: GeneralSettingsView
      }
    ]
  }
]