<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <div class="flex items-center gap-2 mb-4">
      <button class="btn btn-sm btn-ghost btn-circle" @click="$router.back()">
        <icon-arrow-left size="24" />
      </button>
      <h6 class="text-2xl font-bold">Editar proveedor</h6>
    </div>

    <div v-if="isLoadingProvider" class="flex items-center gap-2 text-black-2">
      <span class="loading loading-spinner loading-sm" />
      Cargando proveedor...
    </div>

    <form
      v-else-if="selectedProvider"
      @submit.prevent="handleSubmit"
      class="space-y-4"
    >
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

        <div class="form-control md:col-span-2">
          <label class="label cursor-pointer w-fit">
            <input
              type="checkbox"
              class="toggle checked:text-success"
              :checked="formData.status === 'active'"
              @change="toggleStatus"
            />
            <div class="flex flex-col items-start ml-2">
              <span class="font-semibold text-black-1 mr-2">
                {{ formData.status === 'active' ? 'Activo' : 'Inactivo' }}
              </span>
              <span class="text-sm text-black-2">
                Si el proveedor esta inactivo, no se podra usar al crear o
                editar productos.
              </span>
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="returnToProviders">
          Cancelar
        </base-button>
        <base-button
          type="submit"
          button-type="primary"
          :loading="isSavingProvider"
          loading-text="Guardando..."
        >
          Guardar
        </base-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { getProviderById, getProviders, updateProvider } from '@/api/electron'
import { Provider, Response } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'
import { useProvider } from '@/composables/useProvider'
import { toast } from '@/composables/useToast'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { IconArrowLeft } from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()
const { branch } = useBranch()
const { providers, setProviders } = useProvider()

const selectedProvider = ref<Provider | null>(null)
const isLoadingProvider = ref(false)
const isSavingProvider = ref(false)

const formData = reactive({
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  tax_id: '',
  notes: '',
  status: 'active' as Provider['status'],
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

const setFormData = (provider: Provider) => {
  selectedProvider.value = provider
  formData.name = provider.name
  formData.contact_name = provider.contact_name ?? ''
  formData.email = provider.email ?? ''
  formData.phone = provider.phone ?? ''
  formData.address = provider.address ?? ''
  formData.website = provider.website ?? ''
  formData.tax_id = provider.tax_id ?? ''
  formData.notes = provider.notes ?? ''
  formData.status = provider.status
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

const loadProvider = () => {
  const providerId = String(route.params.id || '')
  if (!providerId) {
    toast.error('Proveedor no encontrado')
    returnToProviders()
    return
  }

  const storeProvider = providers.value.find(
    (provider) => provider.id === providerId
  )
  if (storeProvider) {
    setFormData(storeProvider)
    return
  }

  isLoadingProvider.value = true
  getProviderById(providerId, (response: Response<Provider | null>) => {
    isLoadingProvider.value = false
    if (!response.success || !response.response) {
      toast.error(response.message || 'Proveedor no encontrado')
      returnToProviders()
      return
    }
    setFormData(response.response)
  })
}

const toggleStatus = () => {
  formData.status = formData.status === 'active' ? 'inactive' : 'active'
}

const handleSubmit = async () => {
  if (isSavingProvider.value) return
  if (!selectedProvider.value) {
    toast.warn('Seleccione un proveedor para editar')
    return
  }

  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  const editProvider: Provider = {
    ...selectedProvider.value,
    id_company: branch.value.id_company,
    name: formData.name,
    contact_name: formData.contact_name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    website: formData.website,
    tax_id: formData.tax_id,
    notes: formData.notes,
    status: formData.status,
  }

  isSavingProvider.value = true
  updateProvider(editProvider, (response: Response<any>) => {
    isSavingProvider.value = false
    if (!response.success) {
      toast.error(response.message)
      return
    }
    refreshProviders()
    toast.success('Proveedor editado exitosamente')
    returnToProviders()
  })
}

onMounted(loadProvider)
</script>
