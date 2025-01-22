<template>
  <div class="overflow-x-auto">
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

    <table class="table bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th>Nombre</th>
          <th>RFC</th>
          <th>Correo electrónico</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Estado</th>
          <th>Fecha creación</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="customer in filteredCustomers" :key="`customer-${customer.id}`">
          <td>{{ customer.name }}</td>
          <td>{{ customer.rfc }}</td>
          <td>{{ customer.email }}</td>
          <td class="break-keep">
            {{ customer.phone }}
          </td>
          <td class="break-keep">
            {{ customer.address }}
          </td>
          <td>
            <div class="badge badge-outline font-medium" :class="[ customer.status === 'active' ? 'text-success' : 'text-black-3' ]">
              {{ customer.status }}
            </div>
          </td>
          <td>{{ formatDatetimeShort(customer.created_at) }}</td>
          <td>
            <div class="dropdown dropdown-left">
              <div tabindex="0" role="button" class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center">
                <icon-dots-vertical class="w-4 h-4" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow">
                <li @click.stop="">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Editar cliente
                  </a>
                </li>
                <li @click.stop="">
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
</template>

<script setup lang="ts">
import { IconDotsVertical, IconEdit, IconTrash, IconSearch } from '@tabler/icons-vue'
import { useDate } from '@/composables/useDate'
import { getCustomers } from '@/api/electron'
import { Customer } from '@/api/interfaces'
import { toast } from 'vue3-toastify'
import { ref } from 'vue'
import { computed } from 'vue'

const { formatDatetimeShort } = useDate()

const customers = ref<Customer[]>([])

const getAllCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    return toast.error(response.message)
  }
  customers.value = response.response
}

getAllCustomers()

// Search
const search = ref('')

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    return customer.name.toLowerCase().includes(search.value.toLowerCase())
  })
})
</script>

<style lang="scss" scoped></style>
