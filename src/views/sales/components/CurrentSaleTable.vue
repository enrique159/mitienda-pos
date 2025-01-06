<template>
  <div class="overflow-x-auto overflow-y-visible">
    <table class="table bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th>Código de barra</th>
          <th>Producto</th>
          <th>Descripción</th>
          <th>Precio de venta</th>
          <th>Cantidad</th>
          <th>Importe</th>
          <th>Existencia</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr
          v-for="item in currentCart"
          :key="item.id"
          class="cursor-pointer"
          :class="[ selectedProduct && selectedProduct.id === item.id ? 'bg-brand-blue text-white' : 'hover:bg-gray-100' ]"
          @click="selectProduct(item)"
        >
          <td>{{ item.barcode }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ formatCurrency(item.selling_price) }}</td>
          <td>{{ item.quantity }}</td>
          <td class="font-semibold">{{ formatCurrency(getTotalIncomeFromProduct(item.selling_price, item.quantity)) }}</td>
          <td>{{ item.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '@/composables/useProduct';
import { useCurrency } from '@/composables/useCurrency';
import { ProductCart } from '@/api/interfaces';
import { ref } from 'vue';

const emits = defineEmits(['on:select-product']);

const { formatCurrency, formatWithoutSymbol } = useCurrency();
const { currentCart, removeProductFromCart } = useProduct();

const getTotalIncomeFromProduct = (price: number, quantity: number) => {
  return price * quantity;
};

const selectedProduct = ref<ProductCart | null>(null);

const selectProduct = (product: ProductCart) => {
  selectedProduct.value = product;
  emits('on:select-product', product);
};

const unselectProduct = () => {
  selectedProduct.value = null;
};

defineExpose({
  unselectProduct,
});
</script>

<style scoped></style>
