// import { toast as vueToast } from 'vue3-toastify'
import flashy from '@pablotheblink/flashyjs';

export const toast = {
  info: (message: string) => flashy.info(message),
  error: (message: string) => flashy.error(message),
  success: (message: string) => flashy.success(message),
  warn: (message: string) => flashy.warning(message),
}