<template>
  <dialog id="dialogCreateProvider" ref="dialogCreateProviderRef" class="modal" @keydown.escape="closeCreateProviderModal">
    <div class="modal-box min-w-[700px] h-fit overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Crear proveedor
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCreateProviderModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <form @submit.prevent="handleSumbitCreate" class="w-full grid grid-cols-2 gap-x-4 gap-y-2">
        <!-- Nombre -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Nombre</span>
          </div>
          <input
            id="name"
            type="text"
            v-model="formData.name"
            placeholder="Ej. MiTienda"
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.name.$errors" :key="`error-name-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- Tax ID -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">RFC</span>
          </div>
          <input
            id="tax_id"
            type="text"
            v-model="formData.tax_id"
            placeholder="Ej. XXXX1122334X5"
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.tax_id.$errors" :key="`error-tax_id-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- Contact name -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Nombre de contacto</span>
          </div>
          <input
            id="contact_name"
            type="text"
            v-model="formData.contact_name"
            placeholder="Ej. José Eduardo Pérez"
            class="input input-bordered w-full"
          >
        </label>

        <!-- Email -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Email</span>
          </div>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            placeholder="Ej. juan.perez@email.com"
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.email.$errors" :key="`error-email-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- Phone -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Teléfono</span>
          </div>
          <input
            id="phone"
            type="tel"
            v-model="formData.phone"
            placeholder="Ej. 555555555"
            @keypress="validateOnlyNumbers"
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.phone.$errors" :key="`error-phone-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- Website -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Sitio web</span>
          </div>
          <input
            id="website"
            type="url"
            v-model="formData.website"
            placeholder="Ej. https://www.mitienda.com"
            class="input input-bordered w-full"
          >
        </label>

        <!-- Address -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Dirección</span>
          </div>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="Ej. Calle 123, Colonia 12345, Ciudad, Estado"
          />
        </label>

        <!-- Notes -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Notas</span>
          </div>
          <textarea
            id="notes"
            v-model="formData.notes"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="Ej. Notas adicionales"
          />
        </label>

        <!-- BUTTONS -->
        <div class="col-span-2 flex justify-end space-x-4">
          <base-button type="button" @click="closeCreateProviderModal">
            Cancelar
          </base-button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, email, minLength } from '@vuelidate/validators'
import { createProvider } from '@/api/electron'
import { ref, reactive, computed, watch } from 'vue'
import { useBranch } from '@/composables/useBranch'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { CreateProvider, Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'

const { branch } = useBranch()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openCreateProviderModal()
  }
})

// DIALOG
const dialogCreateProviderRef = ref()

const openCreateProviderModal = () => {
  dialogCreateProviderRef.value.showModal()
}

const closeCreateProviderModal = () => {
  emit('update:modelValue', false)
  dialogCreateProviderRef.value.close()
  vCreate$.value.$reset()
  clearFormData()
}

const clearFormData = () => {
  formData.name = ''
  formData.contact_name = ''
  formData.email = ''
  formData.phone = ''
  formData.address = ''
  formData.website = ''
  formData.tax_id = ''
  formData.notes = ''
}

// CREATE CATEGORY
const formData = reactive({
  id_company: branch.value.id_company,
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  tax_id: '',
  notes: '',
})

const rules = {
  name: { required: helpers.withMessage('El nombre es requerido', required) },
  email: { email: helpers.withMessage('El correo electrónico no es válido', email) },
  phone: { minLength: helpers.withMessage('El número de teléfono debe tener al menos 10 caracteres', minLength(10)) },
  tax_id: { minLength: helpers.withMessage('El RFC debe tener al menos 12 caracteres', minLength(12)) },
}

const vCreate$ = useVuelidate(rules, formData)

const handleSumbitCreate = async () => {
  const isFormValid = await vCreate$.value.$validate()
  if (!isFormValid) return

  const newProvider: CreateProvider = {
    id_company: branch.value.id_company,
    name: formData.name,
    contact_name: formData.contact_name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    website: formData.website,
    tax_id: formData.tax_id,
    notes: formData.notes,
  }
  createProvider(newProvider, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    closeCreateProviderModal()
    toast.success('Proveedor creado exitosamente')
  })
}

defineExpose({
  openCreateProviderModal,
  closeCreateProviderModal,
})
</script>