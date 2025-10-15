<template>
  <div
    class="w-full h-full bg-brand-orange p-6 flex flex-col items-start gap-2"
  >
    <router-link
      :to="{ name: 'Login' }"
      role="button"
      class="btn btn-ghost btn-lg rounded-full text-white-1"
    >
      <IconArrowLeft />
      Regresar
    </router-link>

    <div class="w-full max-w-[1080px] h-[80%] grid grid-cols-2 mx-auto px-12">
      <!-- LEFT SIDE -->
      <div class="flex flex-col justify-center items-center">
        <div
          class="w-full max-w-[400px] h-full bg-brand-black/50 p-6 rounded-3xl relative"
        >
          <h6 class="text-2xl text-white-1 font-bold">
            Instalación local
            <span class="text-white-2 text-sm font-normal">(Gratis)</span>
          </h6>
          <p class="text-white-2 mb-4">
            Pensado para quienes tienen un solo local y requieren un punto de
            venta con funcionalidades básicas o que solo quieren probar el
            software.
          </p>
          <ul class="space-y-3 px-2">
            <li
              v-for="(feature, i) in localFeatures"
              :key="`feature-local-${i}`"
              class="flex items-center gap-1 text-white-1"
            >
              <IconCheck size="24" class="text-brand-blue" />
              {{ feature }}
            </li>
            <li class="flex items-center gap-1 text-white-1">
              <IconX size="24" class="text-red-500" />
              Sin respaldo en la nube
            </li>
            <li class="flex items-center gap-1 text-white-1">
              <IconX size="24" class="text-red-500" />
              Características limitadas
            </li>
            <li class="flex items-center gap-1 text-white-1">
              <IconX size="24" class="text-red-500" />
              Sin soporte técnico
            </li>
          </ul>

          <button
            class="absolute bottom-4 left-4 w-[calc(100%-2rem)] h-fit btn bg-white text-brand-black rounded-xl"
            @click="goToSetup()"
          >
            <IconArrowRight />
            Comienza ahora
          </button>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="flex flex-col justify-center items-center">
        <div
          class="w-full max-w-[400px] h-full bg-brand-white shadow-2xl p-6 rounded-3xl relative"
        >
          <h6 class="text-2xl font-bold flex items-center gap-2">
            Plan Business <IconAwardFilled class="text-yellow-500" />
          </h6>
          <p class="text-black font-medium mb-4">
            Ideal para negocios que requieren un punto de venta con
            funcionalidades avanzadas y manejo de varias sucursales.
          </p>
          <ul class="space-y-3 px-2">
            <li
              v-for="(feature, i) in features"
              :key="`feature-business-${i}`"
              class="flex items-center gap-1"
            >
              <IconCircleCheckFilled size="24" class="text-brand-blue" />
              {{ feature }}
            </li>
            <li class="flex items-center gap-1">
              <IconCirclePlus size="24" class="text-brand-blue" />
              <a href="#" class="hover:underline text-brand-blue" @click.prevent="openExternalLink('https://mitiendapos.mx')">Conoce más beneficios aquí</a>
            </li>
          </ul>

          <div class="absolute bottom-4 left-4 w-[calc(100%-2rem)] space-y-4">
            <div class="flex items-end gap-2 px-4">
              <div class="flex flex-col items-end">
                <span class="text-sm text-black-2">Desde</span>
                <h1 class="text-3xl font-bold leading-6">$300</h1>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-black-1 font-medium">MXN</span>
                <span class="text-sm text-black-1 font-medium leading-3">
                  / por sucursal al mes (IVA incluido)
                </span>
              </div>
            </div>
            <button
              class="w-full h-fit btn bg-black hover:bg-black btn-hover rounded-xl"
              @click="openExternalLink('https://mitiendapos.mx')"
            >
              <span class="text-gradient">Configurar plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowLeft,
  IconArrowRight,
  IconAwardFilled,
  IconCheck,
  IconCircleCheckFilled,
  IconCirclePlus,
  IconX,
} from '@tabler/icons-vue'
import { openExternalLink } from '@/api/electron'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSetup = () => {
  router.push({ name: 'SetupPart1' })
}

const localFeatures = [
  'Instalación en 1 computador',
  'Base de datos local en el equipo',
  'Hasta 200 productos máx.',
  'Hasta 2 usuarios máx.',
  'Reportes limitados',
]

const features = [
  'Sincronización en la nube en tiempo real',
  'Múltiples sucursales',
  'Usuarios ilimitados',
  'Panel de gestión web',
  'Gestión de inventarios',
  'Pedidos y traspasos en tiendas',
  'Soporte técnico 24/7',
]
</script>

<style scoped>
.text-gradient {
  background-image: linear-gradient(
    to right,
    rgb(122, 245, 245),
    rgb(255, 59, 144),
    rgb(237, 254, 50)
  );
  background-size: 200% 100%;
  background-position: 0% 0%;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  transition: background-position 0.6s ease;
}

.btn-hover:hover .text-gradient {
  background-position: 100% 0%;
}
</style>
