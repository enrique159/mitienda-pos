<template>
  <dialog id="dialogAttachProductsDiscounts" ref="dialogAttachProductsDiscountsRef" class="modal" @keydown.escape="closeCreateDiscountModal">
    <div class="modal-box min-w-[90%] h-full max-h-[90vh]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Asignar productos al descuento
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCreateDiscountModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="main-container">
        <div class="grid grid-cols-12 gap-8 h-full overflow-y-hidden">
          <!-- LEFT COLUMN -->
          <div class="col-span-7 h-full flex flex-col gap-4 relative">
            <div class="flex items-center justify-between gap-2 h-[50px]">
              <label class="input bg-white-1 input-bordered flex items-center gap-2 w-1/2">
                <input
                  ref="inputSearchRef"
                  type="text"
                  class="grow"
                  placeholder="Buscar artículo"
                  v-model="search"
                >
                <IconSearch class="w-4 h-4 text-gray-400" />
              </label>
              <select class="select select-bordered bg-white-1 w-1/2" v-model="categorySelected">
                <option :value="null">
                  Todos
                </option>
                <option v-for="category in availableCategories" :key="`category-button-${category.id}`" :value="category">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="overflow-y-scroll h-full max-h-[60vh]">
              <table class="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Agregar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in filteredProducts" :key="product.id" class="hover">
                    <td>{{ product.barcode }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ formatCurrency(product.selling_price) }}</td>
                    <td>
                      <button class="btn btn-sm bg-brand-orange text-white hover:bg-brand-pink" @click="attachProduct(product.id)">
                        <IconPlus />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- RIGHT COLUMN -->
          <div class="col-span-5 h-full">
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold">
                  Productos seleccionados
                </h3>
              </div>
              <div class="flex flex-col gap-2">
                <div
                  v-for="product in selectedProductsFiltered"
                  :key="`products-selected-card-${product.id}`"
                  class="flex justify-between items-center gap-2 w-full px-4 py-3 rounded-xl border border-white-2 shadow-card"
                >
                  <div>
                    <p class="text-xs text-black-3">
                      {{ product.barcode }}
                    </p>
                    <span class="text-sm font-bold">{{ product.name }}</span>
                  </div>
                  <button class="btn btn-sm btn-circle bg-error text-red-700" @click="removeProduct(product.id)">
                    <IconMinus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="bg-white-1 p-4 rounded-xl border border-white-2 shadow-card">
          <button>
            sdasda
          </button>
        </section>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { IconSearch, IconPlus, IconMinus } from '@tabler/icons-vue'
import { Category } from '@/api/interfaces'

const { availableCategories, products } = useProduct()
const { formatCurrency } = useCurrency()

const dialogAttachProductsDiscountsRef = ref()
const search = ref('')
const categorySelected = ref<Category | null>(null)
const selectedProducts = ref<string[]>([])

const filteredProducts = computed(() => {
  let filtered = products.value

  if (categorySelected.value) {
    filtered = filtered.filter((product) => product?.id_category === categorySelected.value?.id)
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchLower) ||
      product.barcode?.toLowerCase().includes(searchLower)
    )
  }

  if (filtered.length > 0) return filtered.filter((product) => !selectedProducts.value.includes(product.id))

  return []
})

const selectedProductsFiltered = computed(() => {
  return products.value.filter((product) => selectedProducts.value.includes(product.id))
})

const openAttachProductsDiscountsModal = () => {
  dialogAttachProductsDiscountsRef.value.showModal()
}

const closeCreateDiscountModal = () => {
  dialogAttachProductsDiscountsRef.value.close()
}

// ADD PRODUCTS TO DISCOUNT
const attachProduct = (productId: string) => {
  selectedProducts.value.push(productId)
}

const removeProduct = (productId: string) => {
  selectedProducts.value = selectedProducts.value.filter((id) => id !== productId)
}

defineExpose({
  openAttachProductsDiscountsModal,
})
</script>

<style scoped>
.main-container {
  height: calc(100% - 48px);
  display: grid;
  grid-template-rows: 1fr 60px;
  row-gap: 1rem;
}
</style>