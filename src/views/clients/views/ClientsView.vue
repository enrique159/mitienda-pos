<template>
  <div class="overflow-hidden">
    <header class="w-full h-fit px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Clientes
      </h1>

      <div class="flex items-center gap-4">
        <label class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2">
          <input v-model="search" type="text" class="grow" placeholder="Buscar cliente..">
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <div class="overflow-auto h-table">
      <table class="table table-sm bg-white rounded-none">
        <!-- head -->
        <thead>
          <tr>
            <th class="w-12" />
            <th class="w-48">
              Nombre
            </th>
            <th>RFC</th>
            <th class="w-48">
              Correo electrónico
            </th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Fecha creación</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, i) in filteredCustomers" :key="`customer-${customer.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
            <td>
              <span class="text-sm text-black-3">{{ i + 1 }}</span>
            </td>
            <td class="whitespace-nowrap max-w-[12rem] overflow-hidden overflow-ellipsis">
              {{ customer.name }}
            </td>
            <td>{{ customer.rfc }}</td>
            <td class="max-w-[12rem] overflow-hidden overflow-ellipsis">
              {{ customer.email }}
            </td>
            <td class="whitespace-nowrap">
              {{ formatPhone(customer.phone) }}
            </td>
            <td>
              <div
                class="badge font-medium border-none"
                :class="[customer.status === 'active' ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
              >
                {{ customer.status === 'active' ? 'activo' : 'inactivo' }}
              </div>
            </td>
            <td>{{ formatDatetimeShort(customer.created_at) }}</td>
            <td>
              <div class="dropdown dropdown-left">
                <div
                  tabindex="0"
                  role="button"
                  class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center cursor-pointer"
                >
                  <icon-dots-vertical class="w-4 h-4" />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li @click.stop="openEditCustomerModal(customer)">
                    <a>
                      <icon-edit class="w-4 h-4" />
                      Editar cliente
                    </a>
                  </li>
                  <li @click.stop="deleteCustomerHandler(customer.id)">
                    <a class="text-brand-pink">
                      <icon-trash class="w-4 h-4" />
                      Eliminar cliente
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog id="dialogEditCustomer" ref="dialogEditCustomerRef" class="modal" @keydown.escape="closeEditCustomerModal">
    <div class="modal-box min-w-[780px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Editar cliente
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeEditCustomerModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 py-8">
        <form @submit.prevent="handleSubmit" class="w-full space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="name" class="block mb-2 pl-1 text-sm font-medium text-black-2 required">Nombre completo</label>
              <input
                id="name"
                v-model="customerToEdit.name"
                type="text"
                placeholder="Ej. Juan Pérez"
                class="w-full p-2 border rounded-md"
              >
              <div v-for="(error, index) in v$.name.$errors" :key="`error-name-${index}`">
                <span class="text-brand-pink text-sm">{{ error.$message }}</span>
              </div>
            </div>

            <div>
              <label for="rfc" class="block mb-2 pl-1 text-sm font-medium text-black-2">RFC</label>
              <input
                id="rfc"
                v-model="customerToEdit.rfc"
                maxlength="13"
                type="text"
                placeholder="Ej. XXXX1122334X5"
                class="w-full p-2 border rounded-md"
              >
              <div v-for="(error, index) in v$.rfc.$errors" :key="`error-rfc-${index}`">
                <span class="text-brand-pink text-sm">{{ error.$message }}</span>
              </div>
            </div>

            <div>
              <label for="email" class="block mb-2 pl-1 text-sm font-medium text-black-2">Email</label>
              <input
                id="email"
                v-model="customerToEdit.email"
                type="text"
                placeholder="Ej. juan.perez@email.com"
                class="w-full p-2 border rounded-md"
              >
              <div v-for="(error, index) in v$.email.$errors" :key="`error-email-${index}`">
                <span class="text-brand-pink text-sm">{{ error.$message }}</span>
              </div>
            </div>

            <div>
              <label for="phone" class="block mb-2 pl-1 text-sm font-medium text-black-2">Teléfono</label>
              <input
                id="phone"
                v-model="customerToEdit.phone"
                type="tel"
                maxlength="10"
                placeholder="Ej. 555555555"
                @keypress="validateOnlyNumbers"
                class="w-full p-2 border rounded-md"
              >
              <div v-for="(error, index) in v$.phone.$errors" :key="`error-phone-${index}`">
                <span class="text-brand-pink text-sm">{{ error.$message }}</span>
              </div>
            </div>

            <div class="col-span-2">
              <label for="address" class="block mb-2 pl-1 text-sm font-medium text-black-2">Dirección</label>
              <textarea
                id="address"
                v-model="customerToEdit.address"
                rows="3"
                class="w-full p-2 border rounded-md"
                placeholder="Ej. Calle 123, Colonia 12345, Ciudad, Estado"
              />
              <div v-for="(error, index) in v$.address.$errors" :key="`error-address-${index}`">
                <span class="text-brand-pink text-sm">{{ error.$message }}</span>
              </div>
            </div>

            <div class="form-control col-span-2">
              <label class="label cursor-pointer w-fit">
                <input
                  type="checkbox"
                  class="toggle checked:text-success"
                  :checked="customerToEdit.status === 'active'"
                  @change="toggleStatus"
                >
                <div class="flex flex-col items-start ml-2">
                  <span class="font-semibold text-black-1 mr-2">Activo</span>
                  <span class="text-sm text-black-2">
                    El producto se vende en la tienda
                  </span>
                  <span v-if="customerToEdit.status !== 'active'" class="text-black-3 text-sm">
                    *Si el cliente está inactivo, no se le podrá asignar ventas a crédito.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <base-button
              type="button"
              @click="closeEditCustomerModal"
            >
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
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { IconDotsVertical, IconEdit, IconTrash, IconSearch } from '@tabler/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { minLength, required, helpers, email } from '@vuelidate/validators'
import { useDate } from '@/composables/useDate'
import { getCustomers, deleteCustomer, updateCustomer } from '@/api/electron'
import { formatPhone } from '@/utils/Phone'
import { Customer, Response } from '@/api/interfaces'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { useCustomer } from '@/composables/useCustomer'
import { toast } from 'vue3-toastify'
import { reactive, ref } from 'vue'
import { computed } from 'vue'

const { formatDatetimeShort } = useDate()

const { customers, setCustomers } = useCustomer()

const getAllCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    return toast.error(response.message)
  }
  setCustomers(response.response)
}

getAllCustomers()

// Search
const search = ref('')

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    return customer.name.toLowerCase().includes(search.value.toLowerCase())
  })
})

const deleteCustomerHandler = async (customerId: string) => {
  deleteCustomer(customerId, (response: Response<any>) => {
    if (!response.success) {
      return toast.error(response.message)
    }
    toast.success('Cliente eliminado exitosamente')
    getAllCustomers()
  })
}

// Edit Customer
const showEditCustomerModal = ref(false)
const dialogEditCustomerRef = ref()
const selectedCustomer = ref<Customer | null>(null)
const customerToEdit = reactive({
  name: '',
  rfc: '',
  email: '',
  phone: '',
  address: '',
  status: '',
})

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('El campo es requerido', required),
      minLength: helpers.withMessage(`Este campo requiere al menos 3 caracteres`, minLength(3)),
    },
    rfc: { minLength: helpers.withMessage(`Este campo requiere al menos 12 caracteres`, minLength(12)) },
    email: { email: helpers.withMessage('El correo electrónico no es válido', email) },
    phone: { minLength: helpers.withMessage(`Este campo requiere al menos 10 caracteres`, minLength(10)) },
    address: { minLength: helpers.withMessage(`Este campo requiere al menos 10 caracteres`, minLength(10)) },
  }
})

const v$ = useVuelidate(rules, customerToEdit)

const openEditCustomerModal = (customer: Customer) => {
  showEditCustomerModal.value = true
  dialogEditCustomerRef.value.showModal()
  setCustomerValues(customer)
}

const closeEditCustomerModal = () => {
  showEditCustomerModal.value = false
  dialogEditCustomerRef.value.close()
  selectedCustomer.value = null
}

const setCustomerValues = (customer: Customer) => {
  selectedCustomer.value = customer
  customerToEdit.name = customer.name
  customerToEdit.rfc = customer?.rfc ?? ''
  customerToEdit.email = customer.email ?? ''
  customerToEdit.phone = customer.phone ?? ''
  customerToEdit.address = customer.address ?? ''
  customerToEdit.status = customer.status
}

const toggleStatus = () => {
  customerToEdit.status = customerToEdit.status === 'active' ? 'inactive' : 'active'
}

const handleSubmit = async () => {
  try {
    if (!selectedCustomer.value) {
      toast.warn('Seleccione un cliente para editar')
      return
    }
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
      toast.warn('Formulario no válido, revise los errores')
      return
    }
    const updatedCustomer: Customer = {
      ...selectedCustomer.value,
      name: customerToEdit.name,
      email: customerToEdit.email,
      phone: customerToEdit.phone,
      address: customerToEdit.address,
      status: customerToEdit.status === 'active' ? 'active' : 'inactive',
    }
    updateCustomer(updatedCustomer, (response: Response<any>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      closeEditCustomerModal()
      toast.success('Cliente actualizado exitosamente')
      getAllCustomers()
    })
  } catch (error) {
    console.error('Error updating customer:', error)
  }
}
</script>

<style lang="scss" scoped></style>
