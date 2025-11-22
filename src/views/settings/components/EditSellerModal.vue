<template>
  <dialog
    class="modal"
    ref="editSellerDialogRef"
    @keydown.escape="closeEditSellerModal"
  >
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">Editar usuario / vendedor</h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeEditSellerModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

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
            placeholder="Ej. Alfonso Quintero"
            class="input input-bordered w-full"
            @keydown="validateOnlyNumbersLettersAndSpaces"
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

        <!-- STATUS -->
        <div class="form-control">
          <label class="label cursor-pointer w-fit">
            <input
              type="checkbox"
              class="toggle checked:text-success"
              :checked="formData.status === 'active'"
              @change="
                formData.status =
                  formData.status !== 'active' ? 'active' : 'inactive'
              "
            />
            <div class="flex flex-col items-start ml-2">
              <span class="font-light text-sm text-black-2 mr-2">Estado</span>
              <span class="font-semibold text-black-1 mr-2">{{
                formData.status === 'active' ? 'Activo' : 'Inactivo'
              }}</span>
            </div>
          </label>
        </div>

        <!-- BUTTONS -->
        <div class="flex justify-between space-x-4">
          <base-button
            class="flex items-center gap-x-2 text-brand-pink font-medium"
            type="button"
            @click="deleteSeller"
          >
            <IconTrash size="18" />
            Eliminar
          </base-button>
          <div class="flex space-x-2">
            <base-button type="button" @click="closeEditSellerModal">
              Cancelar
            </base-button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>
    </div>
    <snack-bar
      v-model="snack.show"
      :message="snack.message"
      :type="snack.type"
    />
  </dialog>
</template>

<script lang="ts" setup>
import { helpers, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Response, Seller, SellerStatus, UpdateSeller } from '@/api/interfaces'
import { deleteSellerById, updateSeller } from '@/api/electron'
import { ref, reactive, computed, watch } from 'vue'
import {
  validateOnlyNumbersLettersAndSpaces,
  validateOnlyNumbers,
} from '@/utils/InputValidators'
import { IconEye, IconEyeOff, IconTrash } from '@tabler/icons-vue'
import { toast } from '@/composables/useToast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  seller: {
    type: Object as () => Seller | null,
    default: () => null,
  },
})
const emit = defineEmits(['update:modelValue', 'update:table'])
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openEditSellerModal()
  }
})

const editSellerDialogRef = ref()

const showPin = ref(false)
const formData = reactive({
  id: '',
  name: '',
  pin: '',
  status: 'active',
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

const resetFormData = () => {
  formData.id = ''
  formData.name = ''
  formData.pin = ''
}

const closeEditSellerModal = () => {
  resetFormData()
  show.value = false
  editSellerDialogRef.value.close()
}

const openEditSellerModal = () => {
  formData.id = props.seller?.id || ''
  formData.name = props.seller?.name || ''
  formData.pin = props.seller?.pin || ''
  formData.status = props.seller?.status || 'active'
  editSellerDialogRef.value.showModal()
}

const snack = reactive({
  show: false,
  message: '',
  type: 'info',
})

const handleSubmit = async () => {
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
    pin: formData.pin,
    status: formData.status as SellerStatus,
  }
  updateSeller(payload, (response: Response<Seller>) => {
    if (!response.success) {
      snack.type = 'error'
      snack.message = response.message
      snack.show = true
      return
    }
    toast.success(response.message)
    emit('update:table')
    closeEditSellerModal()
  })
}

const deleteSeller = () => {
  if (!confirm('¿Estás seguro de eliminar este vendedor?')) {
    return
  }
  deleteSellerById(formData.id, (response: Response<Seller>) => {
    if (!response.success) {
      snack.type = 'error'
      snack.message = response.message
      snack.show = true
      return
    }
    toast.success(response.message)
    emit('update:table')
    closeEditSellerModal()
  })
}
</script>
