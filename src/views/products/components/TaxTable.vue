<template>
  <div class="overflow-x-auto h-full">
    <table class="table bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Importe</th>
          <th class="w-12" />
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr v-for="tax in taxes" :key="`tax-row-${tax.id}`">
          <td>{{ tax.code }}</td>
          <td>{{ tax.name }}</td>
          <td>{{ tax.type.toUpperCase() }}</td>
          <td>{{ tax.type === 'tasa' ? tax.percentage + '%' : formatCurrencySimple(tax.import!) }}</td>
          <td>
            <div class="dropdown dropdown-left">
              <div
                tabindex="0"
                role="button"
                class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center"
              >
                <icon-dots-vertical class="w-4 h-4" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow"
              >
                <li @click.stop="deleteTaxHandler(tax.id)">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Eliminar impuesto
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
import { IconDotsVertical, IconTrash } from '@tabler/icons-vue'
import { useCurrency } from '@/composables/useCurrency'
import { useTax } from '@/composables/useTax'
import { deleteTax, getTaxes } from '@/api/electron'
import { Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'

const { formatCurrencySimple } = useCurrency()
const { taxes, setTaxes } = useTax()

const deleteTaxHandler = async (taxId: string) => {
  deleteTax(taxId, (response: Response<void>) => {
    if (!response.success) {
      return toast.error(response.message)
    }
    toast.success('Impuesto eliminado exitosamente')
    getAllTaxes()
  })
}

const getAllTaxes = async () => {
  const response = await getTaxes()
  if (!response.success) {
    return toast.error(response.message)
  }
  setTaxes(response.response)
}
</script>