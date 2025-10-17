<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto space-y-4 overflow-y-auto pb-[6rem]">
    <h6 class="text-2xl font-bold">
      Impresoras y tickets
    </h6>

    <section class="bg-white p-4 pr-8 rounded-xl space-y-4">
      <div class="flex items-center justify-between">
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
            <IconCircleCheck v-if="selectedPrinter.statusText === 'Lista'" class="text-green-500" size="18" />
            <IconAlertCircle v-else class="text-brand-pink" size="18" />
            {{ selectedPrinter.statusText }}
          </span>
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

      <div class="flex justify-between align-items">
        <base-button
          class="flex items-center gap-2"
          @click="handlePrintTicket"
        >
          <IconPrinter size="18" />
          Imprimir ticket de prueba
        </base-button>
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
    </section>

    <section class="bg-white p-4 pr-8 rounded-xl space-y-4">
      <h6 class="text-lg font-bold">
        Configuración de ticket de venta
      </h6>
      <form class="grid grid-cols-2 gap-x-4 gap-y-2" @submit.prevent="handleSubmitInfoTicket">
        <div class="col-span-2">
          <span class="text-black-2 font-semibold">
            Información para facturación
          </span>
          <p class="text-black-3 text-sm">
            Agrega la las instrucciones para que los clientes puedan facturar en la plataforma de facturación que utilices
          </p>
        </div>
        <!-- INVOICE INSTRUCTIONS -->
        <label class="form-control w-full col-span-2">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Instrucciones de la factura</span>
          </div>
          <input
            id="invoiceInstructions"
            type="text"
            v-model="formDataInfoTicket.invoiceInstructions"
            placeholder="Ej. Si requiere factura, escanee el código QR o ingrese a la siguiente página:"
            class="input input-bordered w-full"
          >
          <input-errors :errors="vInfoTicket$.invoiceInstructions.$errors" />
        </label>

        <!-- INVOICE URL -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">URL para facturar</span>
          </div>
          <input
            id="invoiceUrl"
            type="text"
            v-model="formDataInfoTicket.invoiceUrl"
            placeholder="Ej. https://facturacion.mitiendapos.mx/IDNegocio"
            class="input input-bordered w-full"
          >
        </label>

        <!-- QR CODE -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Código QR</span>
          </div>
          <input
            id="qrCode"
            type="text"
            v-model="formDataInfoTicket.qrCode"
            placeholder="Ej. https://facturacion.mitiendapos.mx/IDNegocio"
            class="input input-bordered w-full"
          >
        </label>

        <div class="col-span-2 mt-8">
          <span class="text-black-2 font-semibold">
            Pie de ticket
          </span>
          <p class="text-black-3 text-sm">
            Agrega el mensaje de agradecimiento que se mostrará en el pie del ticket
          </p>
        </div>

        <!-- THANK YOU MESSAGE -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Mensaje de agradecimiento</span>
          </div>
          <input
            id="thankYouMessage"
            type="text"
            v-model="formDataInfoTicket.thankYouMessage"
            placeholder="Ej. Muchas gracias por tu compra"
            class="input input-bordered w-full"
          >
        </label>

        <!-- BUSINESS URL -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Sitio web de la empresa</span>
          </div>
          <input
            id="businessUrl"
            type="text"
            v-model="formDataInfoTicket.businessUrl"
            placeholder="Ej. https://www.mitiendapos.mx"
            class="input input-bordered w-full"
          >
        </label>

        <!-- SUBMIT -->
        <div class="col-span-2 flex justify-end pt-4">
          <base-button
            type="submit"
            :disabled="areChangesInTicketInfo"
            class="flex items-center gap-2"
          >
            <IconDeviceDesktopDown size="18" />
            Guardar cambios
          </base-button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { IconAlertCircle, IconCircleCheck, IconDeviceDesktopDown, IconPrinter } from '@tabler/icons-vue'
import { getPrinters, setDefaultPrinter, getConfiguration, printTestTicket } from '@/api/electron'
import { Printer } from '@/types/Printer'
import { Configuration, Response } from '@/api/interfaces'
import { toast } from '@/composables/useToast'
import { ref, computed, onMounted, reactive } from 'vue'
import { useConfiguration } from '@/composables/useConfiguration'
import { useBranch } from '@/composables/useBranch'

const { setConfiguration, configuration } = useConfiguration()
const { branch } = useBranch()
const ticketInfo = branch.value.ticket_config

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

/* ***************** INFO TICKET ***************** */

const formDataInfoTicket = reactive({
  invoiceInstructions: '',
  invoiceUrl: '',
  qrCode: '',
  thankYouMessage: '',
  businessUrl: '',
})

const infoTicketRules = {
  invoiceInstructions: {
    required: helpers.withMessage('El campo es obligatorio', required),
  },
}

const vInfoTicket$ = useVuelidate(infoTicketRules, formDataInfoTicket)

const handleSubmitInfoTicket = async () => {
  const isFormValid = await vInfoTicket$.value.$validate()
  if (!isFormValid) {
    return toast.warn('Formulario no válido, revise los errores')
  }
}

// Al montar la vista se iguala la información de la sucursal a los inputs
const setInfoTicket = () => {
  formDataInfoTicket.invoiceInstructions = ticketInfo.invoice_info?.invoice_instructions || ''
  formDataInfoTicket.invoiceUrl = ticketInfo.invoice_info?.invoice_url || ''
  formDataInfoTicket.qrCode = ticketInfo.invoice_info?.qr_code || ''
  formDataInfoTicket.thankYouMessage = ticketInfo.footer_info?.thank_you_message || ''
  formDataInfoTicket.businessUrl = ticketInfo.footer_info?.business_url || ''
}

// Revisa si hay cambios diferentes de la información ya guardada de branch
const areChangesInTicketInfo = computed(() => {
  return formDataInfoTicket.invoiceInstructions !== ticketInfo.invoice_info?.invoice_instructions
    || formDataInfoTicket.invoiceUrl !== ticketInfo.invoice_info?.invoice_url
    || formDataInfoTicket.qrCode !== ticketInfo.invoice_info?.qr_code
    || formDataInfoTicket.thankYouMessage !== ticketInfo.footer_info?.thank_you_message
    || formDataInfoTicket.businessUrl !== ticketInfo.footer_info?.business_url
})

onMounted(() => {
  loadPrinters()
  loadConfiguration()
  setInfoTicket()
})
</script>

<style scoped>

</style>