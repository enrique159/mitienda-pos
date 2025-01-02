import { createWebHashHistory, createRouter } from "vue-router"
// import { useAppStore } from "@/stores/appStore"

import routes from "./routes"

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   const { getUser } = useAppStore()
//   if (to.path === "/auth/signin" && getUser.id) {
//     next({ path: "/main" })
//   }
//   else if (to.meta.requiresAuth && !getUser.id) {
//     next({ path: "/" })
//   }
//   else {
//     next()
//   }
// })

export default router