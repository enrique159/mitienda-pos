<template>
  <dialog id="dialogAttachProductsDiscounts" ref="dialogAttachProductsDiscountsRef" class="modal" @keydown.escape="closeAttachProductsDiscountsModal">
    <div class="modal-box min-w-[90%] h-full max-h-[90vh]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Asignar productos al descuento
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeAttachProductsDiscountsModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="main-container">
        <div class="grid grid-cols-12 gap-8">
          <!-- LEFT COLUMN -->
          <div class="col-span-7 max-h-[calc(100vh-248px)] flex flex-col gap-4">
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

            <div class="grid grid-cols-3 gap-4 overflow-y-auto h-fit">
              <div v-for="product in filteredProducts" :key="product.id" class="flex flex-col gap-2">
                <div class="flex justify-between items-end min-h-24 gap-1 w-full px-4 py-3 rounded-xl border border-white-2 hover:bg-white-1">
                  <div class="h-full">
                    <p class="text-xs text-black-3">
                      {{ product.barcode }}
                    </p>
                    <p class="text-sm font-bold leading-4 mb-1">
                      {{ product.name }}
                    </p>

                    <p class="text-sm text-black-3 font-bold">
                      {{ formatCurrency(product.selling_price) }} / {{ getAbbreviationUnitMeasurement(product.unit_measurement) }}
                    </p>
                  </div>
                  <button class="btn btn-sm btn-circle bg-brand-orange text-white hover:bg-brand-pink" @click="attachProduct(product.id)">
                    <IconPlus />
                  </button>
                </div>
              </div>
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
                  class="flex justify-between items-center gap-2 w-full px-4 py-3 rounded-xl border border-brand-blue shadow-card"
                >
                  <div>
                    <p class="text-xs text-black-3">
                      {{ product.barcode }}
                    </p>
                    <span class="font-bold">{{ product.name }}</span>
                  </div>
                  <button class="btn btn-sm btn-circle bg-error text-white" @click="removeProduct(product.id)">
                    <IconMinus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="flex justify-end space-x-4">
          <base-button type="button" @click="closeAttachProductsDiscountsModal">
            Cancelar
          </base-button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
            @click="saveProductsDiscount"
          >
            Guardar
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
import { getAbbreviationUnitMeasurement } from '@/utils/UnitMeasurements'
import { attachProductsToDiscount, getDiscountProducts } from '@/api/electron'
import { Category, Discount, Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'

const { availableCategories, products } = useProduct()
const { formatCurrency } = useCurrency()

const discountId = ref('')
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

const openAttachProductsDiscountsModal = (discount: Discount) => {
  discountId.value = discount.id
  dialogAttachProductsDiscountsRef.value.showModal()
  getDiscountProducts(discountId.value, (response: Response<{ id_product: string }[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    selectedProducts.value = response.response.map((product) => product.id_product)
  })
}

const closeAttachProductsDiscountsModal = () => {
  dialogAttachProductsDiscountsRef.value.close()
  discountId.value = ''
  selectedProducts.value = []
}

// ADD PRODUCTS TO DISCOUNT
const attachProduct = (productId: string) => {
  selectedProducts.value.push(productId)
}

const removeProduct = (productId: string) => {
  selectedProducts.value = selectedProducts.value.filter((id) => id !== productId)
}

const saveProductsDiscount = () => {
  const productsIds = selectedProducts.value.map((productId) => productId.toString())
  attachProductsToDiscount(discountId.value, productsIds, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Descuento asociado a productos exitosamente')
    closeAttachProductsDiscountsModal()
  })
}

defineExpose({
  openAttachProductsDiscountsModal,
})
</script>

<style scoped>
.main-container {
  height: calc(100% - 48px);
  display: grid;
  grid-template-rows: 1fr 2.5rem;
  row-gap: 1rem;
}
</style>