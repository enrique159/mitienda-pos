<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">Crear nuevo usuario / vendedor</h6>

    <form @submit.prevent="handleSubmit" class="w-full space-y-4">
      <!-- NAME USER / SELLER -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-black-1 font-medium required"
            >Nombre completo</span
          >
        </div>
        <input
          id="name"
          type="text"
          v-model="formData.name"
          @keydown="validateOnlyNumbersLettersAndSpaces"
          placeholder="Ej. Alfonso Quintero"
          class="input input-bordered w-full"
        />
        <input-errors :errors="v$.name.$errors" />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-black-1 font-medium required"
            >PIN de acceso</span
          >
        </div>
        <div class="relative">
          <input
            id="pin"
            :type="showPin ? 'text' : 'password'"
            v-model="formData.pin"
            placeholder="Ej. 1234"
            class="input input-bordered w-full"
            @keydown="validateOnlyNumbers"
          />
          <action-button
            @on:click="showPin = !showPin"
            type="button"
            class="absolute right-2 top-2"
          >
            <IconEye size="18" v-if="showPin" />
            <IconEyeOff size="18" v-else />
          </action-button>
        </div>
        <input-errors :errors="v$.pin.$errors" />
      </label>

      <!-- BUTTONS -->
      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="router.back()">
          Cancelar
        </base-button>
        <base-button
          type="submit"
          button-type="primary"
          :loading="isCreatingSeller"
          loading-text="Guardando..."
        >
          Guardar
        </base-button>
      </div>
    </form>
    <snack-bar
      v-model="snack.show"
      :message="snack.message"
      :type="snack.type"
    />
  </div>
</template>

<script setup lang="ts">
import SnackBar from '@/components/SnackBar.vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, minLength, required } from '@vuelidate/validators'
import { ref, reactive, computed } from 'vue'
import { createSeller } from '@/api/electron'
import { CreateSeller, Response, Seller } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'
import { IconEye, IconEyeOff } from '@tabler/icons-vue'
import { toast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import {
  validateOnlyNumbersLettersAndSpaces,
  validateOnlyNumbers,
} from '@/utils/InputValidators'

const router = useRouter()
const { branch } = useBranch()

const showPin = ref(false)
const isCreatingSeller = ref(false)
const formData = reactive({
  name: '',
  pin: '',
})

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('El campo es requerido', required),
      minLength: helpers.withMessage(
        `Este campo requiere al menos 6 caracteres`,
        minLength(6)
      ),
    },
    pin: {
      required: helpers.withMessage('El campo es requerido', required),
      minLength: helpers.withMessage(
        `Este campo requiere al menos 4 caracteres`,
        minLength(4)
      ),
    },
  }
})

const v$ = useVuelidate(rules, formData)

const snack = reactive({
  show: false,
  message: '',
  type: 'info',
})

const handleSubmit = async () => {
  if (isCreatingSeller.value) return
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) {
    snack.type = 'warning'
    snack.message = 'Formulario no válido, revise los errores'
    snack.show = true
    return
  }

  const payload: CreateSeller = {
    id_company: branch.value.id_company,
    name: formData.name,
    pin: formData.pin.replace(/\D/g, ''),
    permissions: 0,
  }
  isCreatingSeller.value = true
  createSeller(payload, (response: Response<Seller>) => {
    isCreatingSeller.value = false
    if (!response.success) {
      snack.type = 'error'
      snack.message = response.message
      snack.show = true
      return
    }
    toast.success(response.message)
    router.push({ name: 'SellersView' })
  })
}
</script>

<style scoped></style>
