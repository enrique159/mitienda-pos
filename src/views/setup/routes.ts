import { RouteRecordRaw } from "vue-router"
import SetupModule from "./SetupModule.vue"
import SetupPart1 from "./views/SetupPart1.vue"

export const SetupRoutes: RouteRecordRaw[] = [
  {
    path: '/setup',
    name: 'Setup',
    redirect: '/setup/part1',
    component: SetupModule,
    children: [
      {
        path: 'part1',
        name: 'SetupPart1',
        component: SetupPart1,
      },
    ],
  },
]
