<template>
  <div class="absolute top-0 left-0 w-full h-full bg-white-1 grid place-items-center">
    <div class="w-2/3 max-w-screen-md h-[660px] flex flex-col justify-center bg-white rounded-[1rem] shadow-card p-8">
      <div class="w-full text-center mb-8">
        <IconCashRegister class="text-brand-orange mx-auto mb-4" :size="48" stroke-width="1.5" />
        <h4 class="text-black-1 font-bold text-xl">
          Hola {{ user.name }}
        </h4>
        <p class="text-black-3">
          Es momento de abrir caja
        </p>
      </div>

      <div class="flex flex-col w-fit mx-auto justify-center items-center">
        <p class="text-black-2 font-medium mb-1">
          Agregue el monto inicial de la caja
        </p>
        <div class="flex justify-between items-start mb-3">
          <currency-input
            ref="inputStartAmountRef"
            :value="startAmount"
            :show-currency="false"
            class-name="max-w-40"
            @add:value="editStartAmount"
            @backspace="backspaceStartAmount"
            @enter="saveNewQuantity"
          />
          <delete-button @on:click="deleteStartAmount" />
        </div>
        <pin-input @input="editStartAmount" @enter="saveNewQuantity" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCashRegister } from '@tabler/icons-vue'
import { openCashRegister } from '@/api/electron'
import { CashRegister, Response } from '@/api/interfaces'
import { useUser } from '@/composables/useUser'
import { useBranch } from '@/composables/useBranch'
import { useCashRegister } from '@/composables/useCashRegister'
import { toast } from 'vue3-toastify'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const { user } = useUser()
const { branch } = useBranch()
const { setCashRegister } = useCashRegister()
const router = useRouter()

const startAmount = ref<string>('')
const inputStartAmountRef = ref()

const editStartAmount = (value: string) => {
  startAmount.value += value
}

const backspaceStartAmount = () => {
  startAmount.value = startAmount.value.slice(0, -1)
}

const deleteStartAmount = () =>  startAmount.value = ''

const saveNewQuantity = () => {
  const params: Partial<CashRegister> = {
    id_branch: branch.value.id,
    id_company: branch.value.id_company,
    id_user_opening: user.value.id,
    opening_amount: Number(startAmount.value),
  }
  openCashRegister(params, (response: Response<CashRegister>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setCashRegister(response.response)
    router.push({ name: 'Sales' })
  })
}

onMounted(() => {
  inputStartAmountRef.value.focus()
})

</script>
