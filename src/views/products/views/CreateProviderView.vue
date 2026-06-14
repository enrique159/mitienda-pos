<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm btn-ghost btn-circle" @click="$router.back()">
        <IconArrowLeft size="24" />
      </button>
      <h6 class="text-2xl font-bold">Crear proveedor</h6>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required"
              >Nombre</span
            >
          </div>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Ej. MiTienda"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.name.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">RFC</span>
          </div>
          <input
            id="tax_id"
            v-model="formData.tax_id"
            type="text"
            placeholder="Ej. XXXX1122334X5"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.tax_id.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium"
              >Nombre de contacto</span
            >
          </div>
          <input
            id="contact_name"
            v-model="formData.contact_name"
            type="text"
            placeholder="Ej. Jose Eduardo Perez"
            class="input input-bordered w-full"
          />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Email</span>
          </div>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Ej. juan.perez@email.com"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.email.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Telefono</span>
          </div>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="Ej. 5555555555"
            class="input input-bordered w-full"
            @keypress="validateOnlyNumbers"
          />
          <input-errors :errors="v$.phone.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Sitio web</span>
          </div>
          <input
            id="website"
            v-model="formData.website"
            type="url"
            placeholder="Ej. https://www.mitienda.com"
            class="input input-bordered w-full"
          />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Direccion</span>
          </div>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="Ej. Calle 123, Colonia 12345, Ciudad, Estado"
          />
        </label>

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
      </div>

      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="returnToProviders">
          Cancelar
        </base-button>
        <base-button
          type="submit"
          button-type="primary"
          :loading="isCreatingProvider"
          loading-text="Guardando..."
        >
          Guardar
        </base-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { createProvider, getProviders } from '@/api/electron'
import { CreateProvider, Provider, Response } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'
import { useProviderStore } from '@/stores/providerStore'
import { toast } from '@/composables/useToast'
import { validateOnlyNumbers } from '@/utils/InputValidators'

const router = useRouter()
const { branch } = useBranch()
const { setProviders } = useProviderStore()

const isCreatingProvider = ref(false)

const formData = reactive({
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
  email: {
    email: helpers.withMessage('El correo electronico no es valido', email),
  },
  phone: {
    minLength: helpers.withMessage(
      'El numero de telefono debe tener al menos 10 caracteres',
      minLength(10)
    ),
  },
  tax_id: {
    minLength: helpers.withMessage(
      'El RFC debe tener al menos 12 caracteres',
      minLength(12)
    ),
  },
}

const v$ = useVuelidate(rules, formData)

const returnToProviders = () => {
  router.push({ name: 'ProvidersView' })
}

const refreshProviders = () => {
  getProviders((response: Response<Provider[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setProviders(response.response)
  })
}

const handleSubmit = async () => {
  if (isCreatingProvider.value) return
  const isFormValid = await v$.value.$validate()
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

  isCreatingProvider.value = true
  createProvider(newProvider, (response: Response<any>) => {
    isCreatingProvider.value = false
    if (!response.success) {
      toast.error(response.message)
      return
    }
    refreshProviders()
    toast.success('Proveedor creado exitosamente')
    returnToProviders()
  })
}
</script>
