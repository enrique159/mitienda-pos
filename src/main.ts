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
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Global Components
import BaseButton from './components/buttons/BaseButton.vue'
import DeleteButton from './components/buttons/DeleteButton.vue'
import PinInput from './components/inputs/PinInput.vue'
import CurrencyInput from './components/inputs/CurrencyInput.vue'
import CustomKbd from './components/CustomKbd.vue'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 5000,
  position: 'top-right',
} as ToastContainerOptions)

app.component('BaseButton', BaseButton)
app.component('DeleteButton', DeleteButton)
app.component('PinInput', PinInput)
app.component('CurrencyInput', CurrencyInput)
app.component('CustomKbd', CustomKbd)

app.mount('#app')
