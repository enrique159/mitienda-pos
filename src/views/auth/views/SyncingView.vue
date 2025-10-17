<template>
  <div
    class="w-full h-full bg-brand-orange p-6 flex flex-col items-center justify-center relative gap-2"
  >
    <button v-show="isError" @click="syncronize" class="btn w-[180px] bg-brand-black/10 border-none hover:bg-brand-black/20 rounded-full text-white mb-8 absolute top-8 left-[calc(50%-90px)] transition-none">
      <IconRefresh size="24" />
      <span>Reintentar</span>
    </button>
    <h4 class="text-2xl font-bold text-white mb-4">
      Configurando punto de venta
    </h4>
    <StepText
      :texts="syncSteps"
      :step="currentStep"
      text-class="text-white text-lg"
    />
    <progress-bar v-model="currentStep" color="bg-white" :max="syncSteps.length" />
  </div>
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'
import { clearDatabase, getPosCompany, getPosSellers } from '@/api/electron'
import { onMounted, ref } from 'vue'
import { toast } from '@/composables/useToast'
import { Response } from '@/api/interfaces'

const isLoading = ref(false)
const isError = ref(false)
const currentStep = ref(1)

const syncronize = async () => {
  isError.value = false
  isLoading.value = true
  for (const step of syncSteps) {
    if (isError.value) break
    if (step.action) {
      await step.action()
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  currentStep.value = 4
}

onMounted(() => {
  syncronize()
})

// 1. PrepareDatabase
const prepareDatabase = async () => {
  const excludedTables = ['taxes', 'configuration', 'branches']
  await clearDatabase({ excludedTables }, (response: Response<any>) => {
    if (!response.success) {
      isError.value = true
      toast.error(response.message)
    }
    isLoading.value = false
  })
}

// 2. Sync Company
const syncCompany = async () => {
  currentStep.value = 2
  await new Promise((resolve) => setTimeout(resolve, 1000))
  getPosCompany((response: Response<any>) => {
    if (!response.success) {
      isError.value = true
      toast.error(response.message)
    }
    isLoading.value = false
  })
}

// 3. Sync Sellers
const syncSellers = async () => {
  currentStep.value = 3
  await new Promise((resolve) => setTimeout(resolve, 1000))
  getPosSellers((response: Response<any>) => {
    if (!response.success) {
      isError.value = true
      toast.error(response.message)
    }
    isLoading.value = false
  })
}

const syncSteps = [
  { step: 1, text: 'Preparando base de datos', action: prepareDatabase },
  { step: 2, text: 'Guardando datos de la empresa', action: syncCompany },
  { step: 3, text: 'Obteniendo usuarios vendedores', action: syncSellers },
  { step: 4, text: 'Sincronización exitosa' },
]
</script>

<style lang="scss" scoped>

</style>