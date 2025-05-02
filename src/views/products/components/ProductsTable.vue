<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Código de barra</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Precio de venta</th>
          <th>Existencia</th>
          <th>En venta</th>
          <th class="w-12" />
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr
          v-for="(item, i) in filteredProducts"
          :key="`product-row-${item.id}`"
          :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
        >
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ item.barcode }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>
            <p class="text-nowrap">
              {{ item.provider }}
            </p>
          </td>
          <td>{{ formatCurrency(item.selling_price) }}</td>
          <td :class="item.stock < item.stock_minimum ? 'text-brand-pink' : 'text-black-1'">
            {{ item.stock }}
          </td>
          <td>
            <div class="form-control">
              <label class="label cursor-pointer">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-success"
                  :checked="item.is_active"
                  @change="toggleActive(item.id)"
                >
              </label>
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
                <li @click.stop="deleteProductHandler(item.id)">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Eliminar producto
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
import { useProduct } from '@/composables/useProduct'
import { deleteProduct, getProducts } from '@/api/electron'
import { Product, Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'
import { computed } from 'vue'

const { formatCurrency } = useCurrency()
const { allProducts: products, setAllProducts: setProducts } = useProduct()

const props = defineProps<{
  search: String
}>()

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    return product.name.toLowerCase().includes(props.search.toLowerCase())
      || product.barcode?.toLowerCase().includes(props.search.toLowerCase())
      || product.sku.toLowerCase().includes(props.search.toLowerCase())
      || product.provider?.toLowerCase().includes(props.search.toLowerCase())
      || product.category?.toLowerCase().includes(props.search.toLowerCase())
  })
})

const toggleActive = async (productId: string) => {
  console.log(productId)
}

const deleteProductHandler = async (productId: string) => {
  // eslint-disable-next-line
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    return
  }
  deleteProduct(productId, (response: Response<void>) => {
    if (!response.success) {
      return toast.error(response.message)
    }
    toast.success('Producto eliminado exitosamente')
    getAllProducts()
  })
}

const getAllProducts = async () => {
  await getProducts((response: Response<Product[]>) => {
    if (!response.success) {
      return toast.error(response.message)
    }
    setProducts(response.response)
  })
}
</script>
