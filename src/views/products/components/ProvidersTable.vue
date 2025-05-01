<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Nombre</th>
          <th>ID Fiscal</th>
          <th>Contacto</th>
          <th>Email</th>
          <th>Telefono</th>
          <th>Estado</th>
          <th class="w-12" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(provider, i) in filteredProviders" :key="`provider-row-${provider.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ provider.name }}</td>
          <td>{{ provider.tax_id }}</td>
          <td>{{ provider.contact_name }}</td>
          <td>{{ provider.email }}</td>
          <td>{{ formatPhone(provider.phone) }}</td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="[provider.status === 'active' ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
            >
              {{ provider.status === 'active' ? 'activo' : 'inactivo' }}
            </div>
          </td>
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
                <li @click.stop="openEditProviderModal(provider)">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Editar proveedor
                  </a>
                </li>
                <li @click.stop="deleteSelectedProvider(provider.id)">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Eliminar proveedor
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

<script lang="ts" setup>
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'
import { Provider, Response } from '@/api/interfaces'
import { getProviders } from '@/api/electron'
import { toast } from 'vue3-toastify'
import { useProvider } from '@/composables/useProvider'
import { formatPhone } from '@/utils/Phone'
import { deleteProvider } from '@/api/electron'
import { computed } from 'vue'

const { providers, setProviders } = useProvider()

const props = defineProps<{
  search: String
}>()

const emit = defineEmits(['edit-provider'])

const filteredProviders = computed(() => {
  return providers.value.filter((provider) => {
    return provider.name.toLowerCase().includes(props.search.toLowerCase())
  })
})

const getAllProviders = () => {
  getProviders((response: Response<Provider[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setProviders(response.response)
  })
}

getAllProviders()

const openEditProviderModal = (provider: Provider) => {
  emit('edit-provider', provider)
}

const deleteSelectedProvider = (id: string) => {
  deleteProvider(id, (response: Response<Provider>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Proveedor eliminado exitosamente')
    getAllProviders()
  })
}
</script>