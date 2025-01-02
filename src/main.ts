import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import './styles/style.css'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window { electron: any; }
}

// Toastify
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
