<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto space-y-4">
    <h6 class="text-2xl font-bold">
      Impresoras y tickets
    </h6>

    <section class="space-y-4">
      <div class="flex items-start justify-between mb-4 bg-white p-4 pr-8 rounded-xl">
        <div class="flex flex-col">
          <span class="text-black-2 font-semibold">
            Selecciona la impresora por defecto
          </span>

          <span class="text-sm text-black-3 mb-4">
            En el selector aparecerán todas las impresoras disponibles en tu computadora
          </span>

          <p v-if="selectedPrinter" class="text text-black-2">
            Impresora: <strong>{{ selectedPrinter.name }}</strong>
          </p>
          <span v-if="selectedPrinter" class="flex items-center gap-2 text-black-2">
            Estado:
            <IconCircleCheck v-if="selectedPrinter.statusText === 'Lista'" class="text-green-500" />
            <IconAlertCircle v-else class="text-brand-pink" />
            {{ selectedPrinter.statusText }}
          </span>

          <button
            class="btn bg-white-1 mt-4 w-fit"
            @click="handlePrintTicket"
          >
            <IconPrinter size="18" />
            Imprimir ticket de prueba
          </button>
        </div>

        <select v-if="!loadingPrinters" :value="selectedPrinterName" class="select select-bordered" @change="handleDefaultPrinterChange">
          <option disabled value="">
            Selecciona una impresora
          </option>
          <option v-for="printer in printers" :key="printer.name" :value="printer.name">
            {{ printer.name }}
          </option>
          <option disabled v-if="isEmptyPrinters">
            No hay impresoras disponibles
          </option>
          <option value="-" v-else>
            Ninguna
          </option>
        </select>

        <span v-else class="loading loading-spinner" />
      </div>
    </section>

    <div class="flex justify-end">
      <base-button
        button-type="secondary"
        class="flex items-center gap-2"
        :disabled="isDefaultPrinterSelected"
        @click="handleSaveChanges"
      >
        <IconDeviceDesktopDown size="18" />
        Guardar cambios
      </base-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle, IconCircleCheck, IconDeviceDesktopDown, IconPrinter } from '@tabler/icons-vue'
import { getPrinters, setDefaultPrinter, getConfiguration, printTestTicket } from '@/api/electron'
import { Printer } from '@/types/Printer'
import { Configuration, Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'
import { ref, computed, onMounted } from 'vue'
import { useConfiguration } from '@/composables/useConfiguration'

const { setConfiguration, configuration } = useConfiguration()

const printers = ref<Printer[]>([])
const selectedPrinter = ref<Printer | null>(null)
const selectedPrinterName = computed(() => {
  return selectedPrinter.value?.name || '-'
})

const isEmptyPrinters = computed(() => {
  return printers.value.length === 0
})

const isDefaultPrinterSelected = computed(() => {
  return selectedPrinter.value?.name === configuration.value?.default_printer
})

const loadingPrinters = ref(false)
const loadPrinters = async () => {
  loadingPrinters.value = true
  getPrinters((response: Response<Printer[]>) => {
    if (!response.success) {
      toast.error(response.message)
      loadingPrinters.value = false
      return
    }
    printers.value = response.response
    selectedPrinter.value = printers.value.find((printer) => printer.name === configuration.value?.default_printer) || null
    loadingPrinters.value = false
  })
}

const handleDefaultPrinterChange = (event: Event) => {
  const target = event.target as any
  selectedPrinter.value = printers.value.find((printer) => printer.name === target.value) || null
}

const handleSaveChanges = () => {
  setDefaultPrinter(selectedPrinter.value?.name || null, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    loadConfiguration()
  })
}

const handlePrintTicket = () => {
  printTestTicket(selectedPrinter.value?.name || '', (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
  })
}

const loadConfiguration = () => {
  getConfiguration((response: Response<Configuration>) => {
    if (response.success) {
      setConfiguration(response.response)
    }
  })
}

onMounted(() => {
  loadPrinters()
  loadConfiguration()
})
</script>

<style scoped>

</style>