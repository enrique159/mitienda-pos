import { RouteRecordRaw } from "vue-router"
import { AuthRoutes } from "@/views/auth/routes"
import { SettingsRoutes } from "@/views/settings/routes"
import { CashRegisterRoutes } from "@/views/cashregister/routes"
import { ClientsRoutes } from "@/views/clients/routes"
import { InventoryRoutes } from "@/views/inventory/routes"
import { ListSalesRoutes } from "@/views/listsales/routes"
import { ProductsRoutes } from "@/views/products/routes"
import { ReportsRoutes } from "@/views/reports/routes"

// import NotFoundView from "@/views/NotFoundView.vue"
import MainModule from "@/views/MainModule.vue"
import HomeView from "@/views/HomeView.vue"
import SalesView from "@/views/sales/SalesView.vue"
import OpenCashRegisterView from "@/views/cashregister/OpenCashRegisterView.vue"
import NotFoundView from "@/views/NotFoundView.vue"
// import CreateDocumentView from "@/views/documents/CreateDocumentView.vue"
// import AreasView from "@/views/areas/AreasView.vue"
// import CalendarView from "@/views/calendar/CalendarView.vue"
// import ActorsView from "@/views/actors/ActorsView.vue"
// import SettingsView from "@/views/settings/SettingsView.vue"
// import SignInView from "@/views/auth/SignInView.vue"
// import SetupView from "@/views/auth/SetupView.vue"
// import MainView from "@/views/MainView.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/auth/signin-as-user",
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
    ],
  },
  ...AuthRoutes,


  // // 404
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: NotFoundView,
  },
]

export default routes