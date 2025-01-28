<template>
  <div class="overflow-x-auto">
    <table class="table bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th>Código de barra</th>
          <th>Producto</th>
          <th>Descripción</th>
          <th>Precio de venta</th>
          <th>Existencia</th>
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr v-for="item in filteredProducts" :key="`product-row-${item.id}`" class="cursor-pointer">
          <td>{{ item.barcode }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatCurrency(item.selling_price) }}</td>
          <td>{{ item.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency'
import { useProduct } from '@/composables/useProduct'
import { computed } from 'vue'

const { formatCurrency } = useCurrency()
const { products } = useProduct()

const props = defineProps<{
  search: String
}>()

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    return product.name.toLowerCase().includes(props.search.toLowerCase())
  })
})
</script>
