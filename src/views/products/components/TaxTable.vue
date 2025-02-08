<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Código</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Importe</th>
          <th>Traslado</th>
          <th>Retención</th>
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr v-for="(tax, i) in taxes" :key="`tax-row-${tax.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ tax.code }}</td>
          <td>{{ tax.name }}</td>
          <td>{{ tax.type.toUpperCase() }}</td>
          <td>{{ tax.type === 'tasa' ? tax.value + '%' : tax.type === 'cuota' ? formatCurrencySimple(tax.value!) : '-' }}</td>
          <td>{{ tax.transferred ? 'Sí' : 'No' }}</td>
          <td>{{ tax.withheld ? 'Sí' : 'No' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { IconDotsVertical, IconTrash } from '@tabler/icons-vue'
import { useCurrency } from '@/composables/useCurrency'
import { useTax } from '@/composables/useTax'

const { formatCurrencySimple } = useCurrency()
const { taxes } = useTax()
</script>
