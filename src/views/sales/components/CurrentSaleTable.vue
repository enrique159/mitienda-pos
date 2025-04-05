<template>
  <div ref="tableContainerRef" class="overflow-x-auto overflow-y-visible" @click.self="clearSelectedProduct">
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
          v-for="item in currentCartProductsWithDiscount"
          :key="item.id"
          class="cursor-pointer"
          :class="[ selectedProduct && selectedProduct.id === item.id ? 'bg-brand-blue text-white' : 'hover:bg-gray-100' ]"
          @click="selectProduct(item)"
        >
          <td>{{ item.barcode }}</td>
          <td>{{ item.name }}</td>
          <td>
            {{ item.description }}
            <br>
            <span class="text-red-400 font-medium">
              {{ item.valid_discounts?.map(d => d.description).join(', ') }}
            </span>
          </td>
          <td>{{ formatCurrency(item.selling_price) }}</td>
          <td>
            <div class="dropdown">
              <div tabindex="0" role="button" class="btn btn-xs pl-3 rounded-badge" @click.stop="() => {}">
                {{ getShortQuantity(item.quantity) }} {{ getAbbreviationUnitMeasurement(item.unit_measurement) }}
                <icon-dots-vertical class="w-4 h-4" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow">
                <li @click.stop="editProductQuantity(item)">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Cambiar cantidad
                  </a>
                </li>
                <li @click.stop="emits('remove-product-from-cart', item.id)">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Remover
                  </a>
                </li>
              </ul>
            </div>
          </td>
          <td v-if="item.valid_discounts?.length">
            <div class="flex flex-col">
              <span class="text-red-400 font-medium line-through">
                {{ formatCurrency(getTotalIncomeFromProduct(item.selling_price, item.quantity)) }}
              </span>
              <span class="font-semibold">
                {{ formatCurrency(item.subtotal) }}
              </span>
            </div>
          </td>
          <td v-else class="font-semibold">
            {{ formatCurrency(getTotalIncomeFromProduct(item.selling_price, item.quantity)) }}
          </td>
          <td>{{ item.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { ProductCart } from '@/api/interfaces'
import { getAbbreviationUnitMeasurement } from '@/utils/UnitMeasurements'
import { ref, watch } from 'vue'

const emits = defineEmits(['on:select-product', 'remove-product-from-cart', 'show-edit-quantity-modal'])

const { formatCurrency } = useCurrency()
const { currentCart, currentCartProductsWithDiscount } = useProduct()

const getTotalIncomeFromProduct = (price: number, quantity: number) => {
  return price * quantity
}

const getShortQuantity = (quantity: number) => Number.isInteger(quantity) ? quantity : quantity.toFixed(2)

const selectedProduct = ref<ProductCart | null>(null)

const selectProduct = (product: ProductCart) => {
  selectedProduct.value = product
  emits('on:select-product', product)
}

const unselectProduct = () => {
  selectedProduct.value = null
}

const clearSelectedProduct = () => {
  selectedProduct.value = null
  emits('on:select-product', null)
}

const editProductQuantity = (product: ProductCart) => {
  selectProduct(product)
  emits('show-edit-quantity-modal')
}

// CHANGES IN CURRENT CART SCROLL TO BOTTOM
const tableContainerRef = ref()

const scrollToBottom = () => {
  tableContainerRef.value.scrollTop = tableContainerRef.value.scrollHeight
}

watch(currentCart.value, () => {
  scrollToBottom()
})

defineExpose({
  unselectProduct,
})
</script>

<style scoped></style>
