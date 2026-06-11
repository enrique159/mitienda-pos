<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">Editar cliente</h6>

    <div v-if="isLoadingCustomer" class="flex items-center gap-2 text-black-2">
      <span class="loading loading-spinner loading-sm" />
      Cargando cliente...
    </div>

    <form
      v-else-if="selectedCustomer"
      @submit.prevent="handleSubmit"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Ej. Juan Pérez"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.name.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">RFC</span>
          </div>
          <input
            id="rfc"
            v-model="formData.rfc"
            maxlength="13"
            type="text"
            placeholder="Ej. XXXX1122334X5"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.rfc.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Email</span>
          </div>
          <input
            id="email"
            v-model="formData.email"
            type="text"
            placeholder="Ej. juan.perez@email.com"
            class="input input-bordered w-full"
          />
          <input-errors :errors="v$.email.$errors" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Teléfono</span>
          </div>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            maxlength="10"
            placeholder="Ej. 555555555"
            class="input input-bordered w-full"
            @keypress="validateOnlyNumbers"
          />
          <input-errors :errors="v$.phone.$errors" />
        </label>

        <label class="form-control w-full md:col-span-2">
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
          <input-errors :errors="v$.address.$errors" />
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
              <span class="font-semibold text-black-1 mr-2">{{
                formData.status === 'active' ? 'Activo' : 'Inactivo'
              }}</span>
              <span class="text-sm text-black-2">
                Si el cliente está inactivo, no se podrá usar en ventas a
                crédito.
              </span>
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="returnToCustomers">
          Cancelar
        </base-button>
        <base-button
          type="submit"
          button-type="primary"
          :loading="isSavingCustomer"
          loading-text="Guardando..."
        >
          Guardar
        </base-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { Customer, Response, UpdateCustomer } from '@/api/interfaces'
import { getCustomers, updateCustomer } from '@/api/electron'
import { useCustomer } from '@/composables/useCustomer'
import { toast } from '@/composables/useToast'
import { validateOnlyNumbers } from '@/utils/InputValidators'

const route = useRoute()
const router = useRouter()
const { customers, setCustomers } = useCustomer()

const selectedCustomer = ref<Customer | null>(null)
const isLoadingCustomer = ref(false)
const isSavingCustomer = ref(false)

const formData = reactive({
  name: '',
  rfc: '',
  email: '',
  phone: '',
  address: '',
  status: 'active' as Customer['status'],
})

const rules = computed(() => ({
  name: {
    required: helpers.withMessage('El campo es requerido', required),
    minLength: helpers.withMessage(
      'Este campo requiere al menos 3 caracteres',
      minLength(3)
    ),
  },
  rfc: {
    minLength: helpers.withMessage(
      'Este campo requiere al menos 12 caracteres',
      minLength(12)
    ),
  },
  email: {
    email: helpers.withMessage('El correo electrónico no es válido', email),
  },
  phone: {
    minLength: helpers.withMessage(
      'Este campo requiere al menos 10 caracteres',
      minLength(10)
    ),
  },
  address: {
    minLength: helpers.withMessage(
      'Este campo requiere al menos 10 caracteres',
      minLength(10)
    ),
  },
}))

const v$ = useVuelidate(rules, formData)

const returnToCustomers = () => {
  router.push({ name: 'ClientsView' })
}

const refreshCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    toast.error(response.message)
    return []
  }
  setCustomers(response.response)
  return response.response
}

const setCustomerValues = (customer: Customer) => {
  selectedCustomer.value = customer
  formData.name = customer.name
  formData.rfc = customer.rfc ?? ''
  formData.email = customer.email ?? ''
  formData.phone = customer.phone ?? ''
  formData.address = customer.address ?? ''
  formData.status = customer.status
}

const loadCustomer = async () => {
  const customerId = String(route.params.id || '')
  if (!customerId) {
    toast.error('Cliente no encontrado')
    returnToCustomers()
    return
  }

  isLoadingCustomer.value = true
  const currentStoreCustomer = customers.value.find(
    (customer) => customer.id === customerId
  )
  if (currentStoreCustomer) {
    setCustomerValues(currentStoreCustomer)
    isLoadingCustomer.value = false
    return
  }

  const refreshedCustomers = await refreshCustomers()
  const refreshedCustomer = refreshedCustomers.find(
    (customer) => customer.id === customerId
  )
  isLoadingCustomer.value = false

  if (!refreshedCustomer) {
    toast.error('Cliente no encontrado')
    returnToCustomers()
    return
  }

  setCustomerValues(refreshedCustomer)
}

const toggleStatus = () => {
  formData.status = formData.status === 'active' ? 'inactive' : 'active'
}

const handleSubmit = async () => {
  if (isSavingCustomer.value) return
  if (!selectedCustomer.value) {
    toast.warn('Seleccione un cliente para editar')
    return
  }

  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) {
    toast.warn('Formulario no válido, revise los errores')
    return
  }

  const updatedCustomer: UpdateCustomer = {
    id: selectedCustomer.value.id,
    name: formData.name,
    rfc: formData.rfc,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    status: formData.status,
  }

  isSavingCustomer.value = true
  updateCustomer(updatedCustomer, async (response: Response<Customer>) => {
    isSavingCustomer.value = false
    if (!response.success) {
      toast.error(response.message)
      return
    }

    await refreshCustomers()
    toast.success('Cliente actualizado exitosamente')
    returnToCustomers()
  })
}

onMounted(loadCustomer)
</script>
