<template>
  <div
    class="w-full h-full bg-brand-orange p-6 flex items-center justify-center"
  >
    <div class="flex items-center gap-2">
      <h4 class="text-2xl font-bold text-white">
        Configurando punto de venta
      </h4>
      <span v-if="isLoading" class="loading loading-spinner text-white" />
    </div>
    <button @click="syncronize">
      refetch
    </button>
  </div>
</template>

<script setup lang="ts">
import { getPosCompany } from '@/api/electron'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { Response } from '@/api/interfaces'

const isLoading = ref(false)
const syncronize = () => {
  isLoading.value = true
  getPosCompany((response: Response<any>) => {
    console.log(response)
    if (!response.success) {
      toast.error(response.message)
      return
    }
    isLoading.value = false
  })
}
onMounted(() => {
  syncronize()
})
</script>

<style lang="scss" scoped>

</style>