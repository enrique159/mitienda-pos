import ReportsModule from './ReportsModule.vue'
import ReportsView from './views/ReportsView.vue'

export const ReportsRoutes = [
  {
    path: '/main/reports',
    name: 'Reports',
    component: ReportsModule,
    children: [
      {
        path: '',
        name: 'ReportsView',
        component: ReportsView,
      },
    ],
  },
]