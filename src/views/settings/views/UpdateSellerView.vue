<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">Editar usuario / vendedor</h6>

    <div v-if="isLoadingSeller" class="flex items-center gap-2 text-black-2">
      <span class="loading loading-spinner loading-sm" />
      Cargando vendedor...
    </div>

    <form v-else @submit.prevent="handleSubmit" class="w-full space-y-4">
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-black-1 font-medium required">
            Nombre completo
          </span>
        </div>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="Ej. Alfonso Quintero"
          class="input input-bordered w-full"
          @keydown="validateOnlyNumbersLettersAndSpaces"
        />
        <input-errors :errors="v$.name.$errors" />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-black-1 font-medium required">
            PIN de acceso
          </span>
        </div>
        <div class="relative">
          <input
            id="pin"
            v-model="formData.pin"
            :type="showPin ? 'text' : 'password'"
            placeholder="Ej. 1234"
            class="input input-bordered w-full"
            @keydown="validateOnlyNumbers"
          />
          <action-button
            type="button"
            class="absolute right-2 top-2"
            @on:click="showPin = !showPin"
          >
            <IconEye v-if="showPin" size="18" />
            <IconEyeOff v-else size="18" />
          </action-button>
        </div>
        <input-errors :errors="v$.pin.$errors" />
      </label>

      <div class="form-control">
        <label class="label cursor-pointer w-fit">
          <input
            type="checkbox"
            class="toggle checked:text-success"
            :checked="formData.status === SellerStatus.ACTIVE"
            @change="toggleStatus"
          />
          <div class="flex flex-col items-start ml-2">
            <span class="font-light text-sm text-black-2 mr-2">Estado</span>
            <span class="font-semibold text-black-1 mr-2">
              {{ formData.status === SellerStatus.ACTIVE ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </label>
      </div>

      <div class="flex justify-between space-x-4">
        <base-button
          class="flex items-center gap-x-2 text-brand-pink font-medium"
          type="button"
          :loading="isDeletingSeller"
          loading-text="Eliminando..."
          @click="deleteSeller"
        >
          <IconTrash size="18" />
          Eliminar
        </base-button>
        <div class="flex space-x-2">
          <base-button type="button" @click="returnToSellers">
            Cancelar
          </base-button>
          <base-button
            type="submit"
            button-type="primary"
            :loading="isSavingSeller"
            loading-text="Guardando..."
          >
            Guardar
          </base-button>
        </div>
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
import { helpers, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Response, Seller, SellerStatus, UpdateSeller } from '@/api/interfaces'
import { deleteSellerById, getSellerById, updateSeller } from '@/api/electron'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  validateOnlyNumbersLettersAndSpaces,
  validateOnlyNumbers,
} from '@/utils/InputValidators'
import { IconEye, IconEyeOff, IconTrash } from '@tabler/icons-vue'
import { toast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()

const showPin = ref(false)
const isLoadingSeller = ref(false)
const isSavingSeller = ref(false)
const isDeletingSeller = ref(false)

const formData = reactive({
  id: '',
  name: '',
  pin: '',
  status: SellerStatus.ACTIVE,
})

const rules = computed(() => ({
  name: {
    required: helpers.withMessage('El campo es requerido', required),
    minLength: helpers.withMessage(
      'Este campo requiere al menos 6 caracteres',
      minLength(6)
    ),
  },
  pin: {
    required: helpers.withMessage('El campo es requerido', required),
    minLength: helpers.withMessage(
      'Este campo requiere al menos 4 caracteres',
      minLength(4)
    ),
  },
}))

const v$ = useVuelidate(rules, formData)

const snack = reactive({
  show: false,
  message: '',
  type: 'info',
})

const returnToSellers = () => {
  router.push({ name: 'SellersView' })
}

const toggleStatus = () => {
  formData.status =
    formData.status === SellerStatus.ACTIVE
      ? SellerStatus.INACTIVE
      : SellerStatus.ACTIVE
}

const loadSeller = () => {
  const sellerId = String(route.params.id || '')
  if (!sellerId) {
    toast.error('Vendedor no encontrado')
    returnToSellers()
    return
  }

  isLoadingSeller.value = true
  getSellerById(sellerId, (response: Response<Seller>) => {
    isLoadingSeller.value = false
    if (!response.success) {
      toast.error(response.message)
      returnToSellers()
      return
    }

    formData.id = response.response.id
    formData.name = response.response.name
    formData.pin = response.response.pin
    formData.status = response.response.status
  })
}

const handleSubmit = async () => {
  if (isSavingSeller.value) return
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) {
    snack.type = 'warning'
    snack.message = 'Formulario no válido, revise los errores'
    snack.show = true
    return
  }

  const payload: UpdateSeller = {
    id: formData.id,
    name: formData.name,
    pin: formData.pin.replace(/\D/g, ''),
    status: formData.status,
  }

  isSavingSeller.value = true
  updateSeller(payload, (response: Response<Seller>) => {
    isSavingSeller.value = false
    if (!response.success) {
      snack.type = 'error'
      snack.message = response.message
      snack.show = true
      return
    }

    toast.success(response.message)
    returnToSellers()
  })
}

const deleteSeller = () => {
  if (isDeletingSeller.value) return
  if (!confirm('¿Estás seguro de eliminar este vendedor?')) return

  isDeletingSeller.value = true
  deleteSellerById(formData.id, (response: Response<Seller>) => {
    isDeletingSeller.value = false
    if (!response.success) {
      snack.type = 'error'
      snack.message = response.message
      snack.show = true
      return
    }

    toast.success(response.message)
    returnToSellers()
  })
}

onMounted(loadSeller)
</script>
