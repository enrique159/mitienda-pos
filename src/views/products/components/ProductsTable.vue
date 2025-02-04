<template>
  <div class="overflow-auto h-custom">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Código de barra</th>
          <th>Producto</th>
          <th>Descripción</th>
          <th>Precio de venta</th>
          <th>Existencia</th>
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
          <td>{{ item.description }}</td>
          <td>{{ formatCurrency(item.selling_price) }}</td>
          <td>{{ item.stock }}</td>
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
const { products, setProducts } = useProduct()

const props = defineProps<{
  search: String
}>()

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    return product.name.toLowerCase().includes(props.search.toLowerCase())
  })
})

const deleteProductHandler = async (productId: string) => {
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

<style scoped>
.h-custom {
  height: calc(100% - 65px);
}
</style>
