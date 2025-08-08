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
    <progress class="progress w-56 text-white" :value="progressPercent" max="100" />
    <StepText
      :texts="syncSteps"
      :step="currentStep"
      text-class="text-white text-lg"
    />
  </div>
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'
import { clearDatabase, getPosCompany } from '@/api/electron'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { Response } from '@/api/interfaces'
import StepText from '@/components/StepText.vue'

const isLoading = ref(false)
const isError = ref(false)
const progressPercent = ref(0)
const currentStep = ref(1)

const syncSteps = [
  { step: 1, text: 'Guardando datos de la empresa' },
  { step: 2, text: 'Obteniendo usuarios vendedores' },
  { step: 3, text: 'Sincronización exitosa' },
]

const syncronize = async () => {
  isError.value = false
  isLoading.value = true
  // Limpiar base de datos excepto las siguientes tablas
  const excludedTables = ['taxes', 'configuration', 'branches']
  await clearDatabase({ excludedTables }, (response: Response<any>) => {
    console.log(response)
  })
  await syncCompany()

  // Simulate next steps
  currentStep.value = 2
  progressPercent.value = 50
  await new Promise((resolve) => setTimeout(resolve, 1500))

  currentStep.value = 3
  progressPercent.value = 100
}
onMounted(() => {
  syncronize()
})

const syncCompany = async () => {
  currentStep.value = 1
  progressPercent.value = 10
  await new Promise((resolve) => setTimeout(resolve, 1000))
  getPosCompany((response: Response<any>) => {
    if (!response.success) {
      isError.value = true
      toast.error(response.message)
    }
    isLoading.value = false
  })
}
</script>

<style lang="scss" scoped>

</style>