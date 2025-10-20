import { RouteRecordRaw } from "vue-router"
import { AuthRoutes } from "@/views/auth/routes"
import { SetupRoutes } from "@/views/setup/routes"
import { SettingsRoutes } from "@/views/settings/routes"
import { CashRegisterRoutes } from "@/views/cashregister/routes"
import { ClientsRoutes } from "@/views/clients/routes"
import { InventoryRoutes } from "@/views/inventory/routes"
import { ListSalesRoutes } from "@/views/listsales/routes"
import { ProductsRoutes } from "@/views/products/routes"
import { ReportsRoutes } from "@/views/reports/routes"
import { OrdersRoutes } from "@/views/orders/routes"

import SplashScreenView from "@/views/SplashScreenView.vue"
import MainModule from "@/views/MainModule.vue"
import HomeView from "@/views/HomeView.vue"
import SalesView from "@/views/sales/SalesView.vue"
import OpenCashRegisterView from "@/views/cashregister/views/OpenCashRegisterView.vue"
import NotFoundView from "@/views/NotFoundView.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/splash-screen",
  },
  {
    path: "/splash-screen",
    name: "SplashScreen",
    component: SplashScreenView,
  },
  {
    path: "/main",
    name: "MainModule",
    redirect: "/main/sales",
    component: MainModule,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/main/home',
        name: "Home",
        component: HomeView,
      },
      {
        path: '/main/sales',
        name: "Sales",
        component: SalesView,
      },
      {
        path: '/main/open-cash-register',
        name: "OpenCashRegister",
        component: OpenCashRegisterView,
      },
      ...SettingsRoutes,
      ...CashRegisterRoutes,
      ...ClientsRoutes,
      ...InventoryRoutes,
      ...ListSalesRoutes,
      ...ProductsRoutes,
      ...ReportsRoutes,
      ...OrdersRoutes,
    ],
  },
  ...AuthRoutes,
  ...SetupRoutes,

  // // 404
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: NotFoundView,
  },
]

export default routes