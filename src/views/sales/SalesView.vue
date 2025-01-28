<template>
  <div class="grid-sales h-full">
    <section class="w-full h-full pb-1 pt-2 px-4 bg-white flex items-center justify-between">
      <p class="text-xl font-semibold text-gray-800">
        Ticket No. {{ saleFolio }}
      </p>
      <button
        :disabled="isCurrentCartEmpty"
        class="bg-transparent px-3 py-1 flex items-center gap-2 text-brand-pink rounded-badge text-sm transition-all"
        :class="[ isCurrentCartEmpty ? 'cursor-not-allowed opacity-50' : 'hover:bg-white-1 active:bg-brand-pink/10 active:scale-95' ]"
        @click="openCancelSaleModal"
      >
        Cancelar venta
        <icon-cancel class="w-4 h-4" />
      </button>
    </section>
    <!-- SEARCH CODEBAR -->
    <section class="w-full flex items-center justify-between bg-white h-fit py-2 px-2 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <input
          v-model="search"
          type="text"
          ref="inputSearchRef"
          class="w-[260px] h-10 px-4 border border-gray-300 rounded-md focus:outline-2 outline-brand-pink"
          placeholder="Buscar por código o nombre"
          @keydown.enter="searchProduct"
        >
        <button
          class="base-btn"
          @click="searchProduct"
        >
          Agregar artículo
        </button>
        <button class="base-btn" @click="openSearchProductsModal">
          Buscar artículo
          <CustomKbd>F2</CustomKbd>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="base-btn" @click="openVerifyProductModal">
          Verificar artículo
          <CustomKbd>F3</CustomKbd>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="base-btn" @click="removeFromCart">
          Remover artículo
          <IconTrash class="w-4 h-4 text-brand-pink" />
        </button>
      </div>
    </section>
    <!-- CURRENT SALE TABLE -->
    <CurrentSaleTable
      ref="currentSaleTableRef"
      @on:select-product="selectProduct"
      @remove-product-from-cart="removeProductFromCart"
      @show-edit-quantity-modal="openEditQuantityModal"
    />

    <!-- PAYMENT SECTION -->
    <CurrentSalePayment />
  </div>

  <!-- DIALOG FOUND PRODUCTS -->
  <dialog id="dialogFoundProducts" ref="dialogFoundProductsRef" class="modal" @keydown.escape="showFoundProductsModal = false">
    <div class="modal-box">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Productos encontrados
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="showFoundProductsModal = false">
            <!-- if there is a button in form, it will close the modal -->
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <p class="font-medium text-black-3 mb-2">
        Seleccione el producto que desea agregar
      </p>
      <div class="grid grid-cols-1 gap-2 h-fit max-h-[440px] overflow-y-auto">
        <button
          v-for="(product, index) in foundProducts"
          :key="`product-found-button-${product.id}`"
          ref="selectProductButtonsRef"
          class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 hover:bg-white-2 cursor-pointer rounded-md"
          :class="{ 'focus:outline-2 outline-brand-orange' : focusedButtonIndex === index }"
          @click="addProductToCartAndCloseFoundModal(product)"
        >
          <div class="text-left">
            <p class="text-sm leading-4 text-black-3">
              {{ product.barcode }}
            </p>
            <p class="font-bold leading-6">
              {{ product.name }}
            </p>
          </div>
          <p class="text-sm">
            {{ formatCurrency(product.selling_price) }}
          </p>
        </button>
      </div>
    </div>
  </dialog>


  <!-- DIALOG SEARCH PRODUCT -->
  <dialog id="dialogSearchProducts" ref="dialogSearchProductsRef" class="modal" @keydown.escape="showSearchProductsModal = false">
    <div class="modal-box search-products-grid min-w-[800px] min-h-[600px] h-fit max-h-[700px]">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-bold">
          Buscar productos
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="showSearchProductsModal = false">
            <!-- if there is a button in form, it will close the modal -->
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <p class="font-medium mb-2 w-full text-center text-black-3">
        Categorías
      </p>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <button
          class="px-4 py-2 border rounded-md active:scale-95 transition-all text-sm"
          :class="[ !categorySelected ? 'bg-brand-pink text-white border-brand-pink' : 'border-white-2' ]"
          @click="handleChangeCategory(null)"
        >
          Todos
        </button>
        <button
          v-for="category in categories"
          :key="`category-button-${category.id}`"
          class="px-4 py-2 border rounded-md active:scale-95 transition-all text-sm"
          :class="[ category.id === categorySelected?.id ? 'bg-brand-pink text-white border-brand-pink' : 'border-white-2' ]"
          @click="handleChangeCategory(category)"
        >
          {{ category.name }}
        </button>
      </div>

      <label class="input bg-white-1 input-bordered flex items-center gap-2 mb-4">
        <input
          ref="inputSearchInProductsCategoryRef"
          type="text"
          class="grow"
          placeholder="Buscar artículo"
          v-model="searchInProductsCategory"
          @keydown.enter="productsByCategoryFiltered.length === 1 ? addProductToCartAndCloseSearchModal(productsByCategoryFiltered[0]) : null"
        >
        <IconSearch class="w-4 h-4 text-gray-400" />
      </label>

      <div class="grid grid-cols-1 place-content-start gap-2 overflow-y-auto">
        <button
          v-for="product in productsByCategoryFiltered"
          :key="`product-search-button-${product.id}`"
          class="flex items-center h-[4rem] justify-between px-4 py-3 bg-white border border-gray-200 hover:bg-white-2 cursor-pointer rounded-md"
          @click="addProductToCartAndCloseSearchModal(product)"
        >
          <div class="text-left">
            <p class="text-sm leading-4 text-black-3">
              {{ product.barcode }}
            </p>
            <p class="font-bold leading-6">
              {{ product.name }}
            </p>
          </div>
          <p class="text-sm">
            {{ formatCurrency(product.selling_price) }}
          </p>
        </button>
      </div>
    </div>
  </dialog>

  <!-- DIALOG ADD PRODUCT WITH QUANTITY -->
  <dialog id="dialogAddProductWithQuantity" ref="dialogAddProductWithQuantityRef" class="modal" @keydown.escape="closeAddProductWithQuantityModal">
    <div class="modal-box max-w-[480px]">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-bold">
          Ingrese la cantidad
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeAddProductWithQuantityModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center gap-2 pb-8 pt-2">
        <p class="text-center font-bold text-brand-black">
          <span class="font-normal text-sm text-black-3">Producto:</span> <br>
          {{ previewProductToAdd?.name }}
        </p>
        <div v-if="previewProductToAdd?.is_bulk" class="grid grid-cols-3 w-full mb-4 place-items-center">
          <!-- SALE PRICE -->
          <div class="flex flex-col col-span-1 text-center">
            <p class="text-sm text-black-3">
              Precio venta
            </p>
            <p class="font-bold text-brand-black">
              {{ previewProductToAdd && formatCurrency(previewProductToAdd?.selling_price) }}
            </p>
          </div>
          <!-- CHANGE QUANTITY TO IMPORT -->
          <div class="flex flex-col col-span-1 text-center">
            <button
              class="btn btn-sm rounded-full bg-white-1 hover:bg-white-2 text-s font-normal text-brand-black"
              @click="isImportOption = !isImportOption"
            >
              <icon-transfer class="w-4 h-4" />
              {{ !isImportOption ? 'cantidad' : 'importe' }}
            </button>
          </div>
          <!-- UNIT MEASUREMENT OR TOTAL IMPORT -->
          <div class="flex flex-col col-span-1 text-center">
            <p class="text-sm text-black-3">
              {{ !isImportOption ? 'Total de importe' : 'Cantidad producto' }}
            </p>
            <p class="font-bold text-green-600">
              {{ previewProductToAdd && (isImportOption
                ? `${productQuantityResultFromImportFormatted}`
                : formatCurrency(Number(addProductQuantity) * previewProductToAdd?.selling_price))
              }}
            </p>
          </div>
        </div>
        <div v-if="isImportOption" class="flex flex-col gap-4 items-center">
          <div class="flex justify-between items-start gap-2">
            <currency-input
              class-name="max-w-[140px]"
              :value="addProductQuantityImport"
              @add:value="editAddProductQuantityImport"
              @backspace="removeAddProductQuantityImport"
            />
            <delete-button @on:click="deleteAddProductQuantityImport" />
          </div>
          <pin-input dot-disabled @input="editAddProductQuantityImport" @enter="saveAddProductQuantityImport" />
        </div>
        <div v-else class="flex flex-col gap-4 items-center">
          <div class="flex justify-between items-start gap-2">
            <label class="input bg-white-1 input-bordered flex items-center max-w-36 gap-2">
              <input
                ref="inputAddProductQuantityRef"
                class="w-full"
                placeholder="Cantidad"
                @keydown="(event) => {
                  !previewProductToAdd?.is_bulk
                    ? validateOnlyNumbers(event)
                    : validateNumbersAndDots(event, addProductQuantity)
                }"
                @keyup.enter="saveAddProductQuantity"
                v-model="addProductQuantity"
              >
            </label>
            <delete-button @on:click="deleteAddProductQuantity" />
          </div>
          <pin-input :dot-disabled="!previewProductToAdd?.is_bulk" @input="editAddProductQuantity" @enter="saveAddProductQuantity" />
        </div>
      </div>
    </div>
  </dialog>

  <!-- DIALOG EDIT QUANTITY -->
  <dialog id="dialogEditQuantity" ref="dialogEditQuantityRef" class="modal" @keydown.escape="closeEditQuantityModal">
    <div class="modal-box max-w-[480px]">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-bold">
          Cambiar cantidad
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeEditQuantityModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center gap-2 pb-8 pt-2">
        <p class="text-center font-bold text-brand-black mb-2">
          <span class="font-normal text-sm text-black-3">Producto:</span> <br>
          {{ selectedProduct?.name }}
        </p>
        <div v-if="selectedProduct?.is_bulk" class="grid grid-cols-3 w-full mb-4 place-items-center">
          <!-- SALE PRICE -->
          <div class="flex flex-col col-span-1 text-center">
            <p class="text-sm text-black-3">
              Precio venta
            </p>
            <p class="font-bold text-brand-black">
              {{ selectedProduct && formatCurrency(selectedProduct?.selling_price) }}
            </p>
          </div>
          <!-- CHANGE QUANTITY TO IMPORT -->
          <div class="flex flex-col col-span-1 text-center">
            <button
              class="btn btn-sm rounded-full bg-white-1 hover:bg-white-2 text-s font-normal text-brand-black"
              @click="isImportOption = !isImportOption"
            >
              <icon-transfer class="w-4 h-4" />
              {{ !isImportOption ? 'cantidad' : 'importe' }}
            </button>
          </div>
          <!-- UNIT MEASUREMENT OR TOTAL IMPORT -->
          <div class="flex flex-col col-span-1 text-center">
            <p class="text-sm text-black-3">
              {{ !isImportOption ? 'Total de importe' : 'Cantidad producto' }}
            </p>
            <p class="font-bold text-green-600">
              {{ selectedProduct && (isImportOption
                ? `${productEditQuantityResultFromImportFormatted}`
                : productEditImport)
              }}
            </p>
          </div>
        </div>
        <div v-if="isImportOption" class="flex flex-col gap-4 items-center">
          <div class="flex justify-between items-start gap-2">
            <currency-input
              class-name="max-w-[140px]"
              :value="selectedProductImport"
              @add:value="editSelectedProductImport"
              @backspace="removeSelectedProductImport"
            />
            <delete-button @on:click="deleteSelectedProductImport" />
          </div>
          <pin-input @input="editSelectedProductImport" @enter="saveSelectedProductImport" />
        </div>
        <div v-else class="flex flex-col gap-4 items-center">
          <div class="flex justify-between items-start gap-2">
            <label class="input bg-white-1 input-bordered flex items-center max-w-36 gap-2">
              <input
                ref="inputEditQuantityRef"
                class="w-full"
                placeholder="Cantidad"
                @keydown="(event) => {
                  !selectedProduct?.is_bulk
                    ? validateOnlyNumbers(event)
                    : validateNumbersAndDots(event, newQuantity)
                }"
                @keyup.enter="saveNewQuantity"
                v-model="newQuantity"
              >
            </label>
            <delete-button @on:click="deleteQuantity" />
          </div>
          <pin-input :dot-disabled="!selectedProduct?.is_bulk" @input="editQuantity" @enter="saveNewQuantity" />
        </div>
      </div>
    </div>
  </dialog>

  <!-- DIALOG VERIFY PRODUCT -->
  <dialog id="dialogVerifyProduct" ref="dialogVerifyProductRef" class="modal" @keydown.escape="closeVerifyProductModal">
    <div class="modal-box max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          Verificar producto
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeVerifyProductModal">
            <!-- if there is a button in form, it will close the modal -->
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 py-2">
        <label class="input input-bordered flex items-center gap-2 w-full">
          <input
            ref="inputSearchVerifyProductRef"
            type="text"
            class="grow"
            placeholder="Buscar por código de barra o nombre"
            v-model="searchVerifyProduct"
            @keydown.enter="searchProductToVerify"
          >
          <IconSearch class="w-4 h-4 text-gray-400" />
        </label>

        <div v-if="verifyProductSuccess" class="border border-white-3 p-4 rounded-lg w-full h-fit min-h-[260px] grid grid-cols-2 gap-x-2 gap-y-8 place-content-start">
          <div v-for="(info, index) in getVerifyProductArrayInfo" :key="`verify-product-info-${index}`">
            <p class="text-sm text-black-3">
              {{ info.title }}
            </p>
            <p class="font-bold text-black-2">
              {{ info.value }}
            </p>
          </div>
        </div>
        <div v-else class="bg-white-1 p-4 rounded-lg w-full h-[300px] flex flex-col justify-center items-center">
          <img src="@/assets/verify_product.svg" alt="Verificar producto" class="w-32 mb-4">
          <h6 class="text-lg font-bold text-black-2">
            Verifica información de productos
          </h6>
          <p class="text-sm text-black-3 text-center">
            Puedes escanear el código o buscar por nombre algún producto para ver su información completa
          </p>
        </div>
      </div>
    </div>
  </dialog>

  <!-- DIALOG CANCEL CURRENT SALE -->
  <dialog id="dialogCancelSale" ref="dialogCancelSaleRef" class="modal" @keydown.escape="closeCancelSaleDialog">
    <div class="modal-box">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          Cancelar venta
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCancelSaleDialog">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <div v-if="isPinCancelSaleRequired" class="flex flex-col items-center gap-4 py-8">
        <div class="flex justify-between items-start gap-2">
          <label class="input bg-white-1 input-bordered flex items-center max-w-48 gap-2">
            <input
              ref="inputCancelSaleRef"
              class="w-full"
              placeholder="Pin de autorización"
              @keydown="validateOnlyNumbers"
              @keyup.enter="verifyCancelSale"
              v-model="cancelSaleCode"
            >
          </label>
          <delete-button @on:click="deleteCancelSaleCode" />
        </div>
        <pin-input @input="handleInputCancelSale" @enter="verifyCancelSale" dot-disabled />
      </div>

      <div v-else class="flex flex-col items-center gap-4 pt-8">
        <p class="text-black-1 font-medium text-center text-lg">
          ¿Estás seguro de cancelar la venta?
        </p>
        <div class="flex gap-4 w-full">
          <button class="btn bg-brand-pink hover:bg-brand-orange text-white w-1/2" @click="closeAndClearCart">
            Sí, cancelar
          </button>
          <button class="btn btn-ghost btn-outline border-white-3 w-1/2 hover:bg-white-3 hover:border-white-3 hover:text-brand-black" @click="closeCancelSaleDialog">
            No, regresar
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import PinInput from '@/components/inputs/PinInput.vue'
import DeleteButton from '@/components/buttons/DeleteButton.vue'
import CustomKbd from '@/components/CustomKbd.vue'
import CurrentSaleTable from './components/CurrentSaleTable.vue'
import CurrentSalePayment from './components/CurrentSalePayment.vue'
import { IconTrash, IconSearch, IconCancel, IconTransfer } from '@tabler/icons-vue'
import { useProduct } from '@/composables/useProduct'
import { toast } from 'vue3-toastify'
import { ref, watch } from 'vue'
import { Category, Product, ProductCart, Response } from '@/api/interfaces'
import { computed, onMounted, onUnmounted } from 'vue'
import { useCurrency } from '@/composables/useCurrency'
import { getProductsByCategory, getProducts } from '@/api/electron'
import { validateOnlyNumbers, validateNumbersAndDots } from '@/utils/InputValidators'
import { getNameUnitMeasurement, getAbbreviationUnitMeasurement } from '@/utils/UnitMeasurements'
import { useBranch } from '@/composables/useBranch'

// SET PRODUCTS
getProducts((response: Response<Product[]>) => {
  if (!response.success) {
    toast.error('Error al obtener los productos')
    return
  }
  setProducts(response.response)
})

// Formats
const { formatCurrency } = useCurrency()

// component ref
const inputSearchRef = ref()
const currentSaleTableRef = ref()
const dialogFoundProductsRef = ref()

const {
  products,
  categories,
  setProducts,
  addProductToCart,
  clearCurrentCart,
  isCurrentCartEmpty,
  removeProductFromCart,
  editProductQuantityInCart,
  searchProductByCodeOrName,
} = useProduct()
const { saleFolio, generateFolio, isPinCancelSaleRequired, comparePinCancelSale } = useBranch()

/**
 * *************** Add Product With Quantity ***************
 */
const showAddProductWithQuantityModal = ref(false)
const dialogAddProductWithQuantityRef = ref()
const inputAddProductQuantityRef = ref()
const addProductQuantity = ref('')
const addProductQuantityImport = ref('')
const previewProductToAdd = ref<Product | null>(null)
const isImportOption = ref(false)

const openAddProductWithQuantityModal = () => {
  showAddProductWithQuantityModal.value = true
  dialogAddProductWithQuantityRef.value.showModal()
  inputAddProductQuantityRef.value.focus()
}

const closeAddProductWithQuantityModal = () => {
  showAddProductWithQuantityModal.value = false
  dialogAddProductWithQuantityRef.value.close()
  addProductQuantity.value = ''
  addProductQuantityImport.value = ''
  previewProductToAdd.value = null
  isImportOption.value = false
}

// Product Quantity (Cuando la cantidad es por peso o piezas)
const editAddProductQuantity = (value: string) => {
  if (value === '.' && addProductQuantity.value.includes('.')) return
  addProductQuantity.value += value
}
const deleteAddProductQuantity = () => addProductQuantity.value = ''

const saveAddProductQuantity = () => {
  if (!addProductQuantity.value) {
    return
  }
  if (previewProductToAdd.value) {
    addProductToCart(previewProductToAdd.value, Number(addProductQuantity.value))
    closeAddProductWithQuantityModal()
  } else {
    toast.warn('Seleccione un producto para agregar')
  }
}

// Product Quantity Import (Cuando la cantidad es por importe)
const editAddProductQuantityImport = (value: string) => addProductQuantityImport.value += value
const removeAddProductQuantityImport = () => addProductQuantityImport.value = addProductQuantityImport.value.slice(0, -1)
const deleteAddProductQuantityImport = () => addProductQuantityImport.value = ''

const productQuantityResultFromImport = computed(() => {
  if (!addProductQuantityImport.value || !previewProductToAdd.value) return 0
  return Number(addProductQuantityImport.value) / previewProductToAdd.value?.selling_price
})

const productQuantityResultFromImportFormatted = computed(() => {
  if (!productQuantityResultFromImport.value || !previewProductToAdd.value) return '0'
  const quantity = Number.isInteger(productQuantityResultFromImport.value)
    ? productQuantityResultFromImport.value
    : productQuantityResultFromImport.value.toFixed(2)
  return `${quantity} ${getAbbreviationUnitMeasurement(previewProductToAdd.value?.unit_measurement)}`
})

const saveAddProductQuantityImport = () => {
  if (!addProductQuantityImport.value) {
    return
  }
  if (previewProductToAdd.value) {
    addProductToCart(previewProductToAdd.value, productQuantityResultFromImport.value)
    closeAddProductWithQuantityModal()
  } else {
    toast.warn('Seleccione un producto para agregar')
  }
}

const handleAddProductToCart = (product: Product) => {
  previewProductToAdd.value = null
  if (product.requires_quantity) {
    previewProductToAdd.value = product
    openAddProductWithQuantityModal()
  } else {
    addProductToCart(product)
  }
}

/*
* *************** Search Product ***************
*/
const search = ref('')

const searchProduct = (evt: any) => {
  evt.preventDefault()
  if (!search.value) return
  const response = searchProductByCodeOrName(search.value)
  if (Array.isArray(response)) {
    if (response.length > 1) {
      showFoundProductsModal.value = true
      dialogFoundProductsRef.value.showModal()
      focusFirstButton()
    } else {
      handleAddProductToCart(response[0])
      search.value = ''
    }
  } else {
    toast.warn('No se encontró coincidencias')
  }
}

const foundProducts = computed(() => {
  return searchProductByCodeOrName(search.value)
})

/**
 * *************** Found Products ***************
 */
const showFoundProductsModal = ref(false)
const selectProductButtonsRef = ref()
const focusedButtonIndex = ref(0)

const focusFirstButton = () => {
  selectProductButtonsRef.value[0].focus()
}

watch(foundProducts, () => {
  selectProductButtonsRef.value = document.querySelectorAll('button[ref="selectProductButtonsRef"]')
})

const addProductToCartAndCloseFoundModal = (product: Product) => {
  handleAddProductToCart(product)
  showFoundProductsModal.value = false
  dialogFoundProductsRef.value.close()
  search.value = ''
  inputSearchRef.value.focus()
}


/**
 * *************** Search Products ***************
 */
const showSearchProductsModal = ref(false)
const dialogSearchProductsRef = ref()
const categorySelected = ref<Category | null>(null)
const productsByCategory = ref<Product[]>([])
const searchInProductsCategory = ref('')
const inputSearchInProductsCategoryRef = ref()

const productsByCategoryFiltered = computed(() => {
  return productsByCategory.value.filter((product) => product.name.toLowerCase().includes(searchInProductsCategory.value.toLowerCase()) || product?.barcode?.includes(searchInProductsCategory.value))
})

const openSearchProductsModal = () => {
  showSearchProductsModal.value = true
  dialogSearchProductsRef.value.showModal()
  inputSearchInProductsCategoryRef.value.focus()
  searchInProductsCategory.value = ''
  if (!categorySelected.value) {
    productsByCategory.value = products.value
    return
  }
  getProductsByCategory(categorySelected.value.id, (response: Response<Product[]>) => {
    if (response.success) {
      productsByCategory.value = response.response
    } else {
      toast.error('Error al obtener los productos')
    }
  })
}

const handleChangeCategory = (category: Category | null) => {
  if (!category) {
    productsByCategory.value = products.value
    categorySelected.value = null
    return
  }
  categorySelected.value = category
  getProductsByCategory(category.id, (response: Response<Product[]>) => {
    if (response.success) {
      productsByCategory.value = response.response
    } else {
      productsByCategory.value = []
    }
  })
}

const addProductToCartAndCloseSearchModal = (product: Product) => {
  handleAddProductToCart(product)
  showSearchProductsModal.value = false
  dialogSearchProductsRef.value.close()
  search.value = ''
  inputSearchRef.value.focus()
}

/**
 * *************** Edit Quantity ***************
 */
const showEditQuantityModal = ref(false)
const dialogEditQuantityRef = ref()
const inputEditQuantityRef = ref()
const newQuantity = ref('')
const selectedProductImport = ref('')

const openEditQuantityModal = () => {
  showEditQuantityModal.value = true
  dialogEditQuantityRef.value.showModal()
  inputEditQuantityRef.value.focus()
}

const closeEditQuantityModal = () => {
  showEditQuantityModal.value = false
  dialogEditQuantityRef.value.close()
  newQuantity.value = ''
  selectedProductImport.value = ''
  selectedProduct.value = null
  isImportOption.value = false
}

const productEditQuantityResultFromImport = computed(() => {
  if (!selectedProductImport.value || !selectedProduct.value) return 0
  return Number(selectedProductImport.value) / selectedProduct.value?.selling_price
})

const productEditQuantityResultFromImportFormatted = computed(() => {
  if (!productEditQuantityResultFromImport.value || !selectedProduct.value) return '0'
  const quantity = Number.isInteger(productEditQuantityResultFromImport.value)
    ? productEditQuantityResultFromImport.value
    : productEditQuantityResultFromImport.value.toFixed(2)
  return `${quantity} ${getAbbreviationUnitMeasurement(selectedProduct.value?.unit_measurement)}`
})

const productEditImport = computed(() => {
  if (!selectedProduct.value || !newQuantity.value) return formatCurrency(0)
  return formatCurrency(Number(newQuantity.value) * selectedProduct.value?.selling_price)
})

const editQuantity = (value: string) => {
  if (value === '.' && newQuantity.value.includes('.')) return
  newQuantity.value += value
}
const deleteQuantity = () => newQuantity.value = ''

const saveNewQuantity = () => {
  if (!newQuantity.value) {
    toast.warn('Ingrese una cantidad válida')
    return
  }
  if (selectedProduct.value && newQuantity.value) {
    editProductQuantityInCart(selectedProduct.value.id, Number(newQuantity.value))
    currentSaleTableRef.value.unselectProduct()
    closeEditQuantityModal()
  } else {
    toast.warn('Seleccione un producto para cambiar la cantidad')
  }
}

// Selected Product Import
const editSelectedProductImport = (value: string) => selectedProductImport.value += value
const removeSelectedProductImport = () => selectedProductImport.value = selectedProductImport.value.slice(0, -1)
const deleteSelectedProductImport = () => selectedProductImport.value = ''

const saveSelectedProductImport = () => {
  if (!selectedProductImport.value) {
    toast.warn('Ingrese un importe válido')
    return
  }
  if (selectedProduct.value && selectedProductImport.value) {
    editProductQuantityInCart(selectedProduct.value.id, productEditQuantityResultFromImport.value)
    currentSaleTableRef.value.unselectProduct()
    closeEditQuantityModal()
  } else {
    toast.warn('Seleccione un producto para cambiar la cantidad')
  }
}

/*
* *************** Verify Product ***************
*/
const showVerifyProductModal = ref(false)
const dialogVerifyProductRef = ref()
const inputSearchVerifyProductRef = ref()
const verifyProductSuccess = ref<Product | null>(null)
const searchVerifyProduct = ref('')

const openVerifyProductModal = () => {
  clearVerifyProduct()
  showVerifyProductModal.value = true
  dialogVerifyProductRef.value.showModal()
  inputSearchVerifyProductRef.value.focus()
}

const closeVerifyProductModal = () => {
  showVerifyProductModal.value = false
  dialogVerifyProductRef.value.close()
  searchVerifyProduct.value = ''
}

const clearVerifyProduct = () => {
  verifyProductSuccess.value = null
  searchVerifyProduct.value = ''
}

const getVerifyProductArrayInfo = computed(() => {
  if (verifyProductSuccess.value) {
    return [
      { title: 'Código de barra', value: verifyProductSuccess.value.barcode },
      { title: 'Nombre', value: verifyProductSuccess.value.name },
      { title: 'Precio de venta', value: formatCurrency(verifyProductSuccess.value.selling_price) },
      { title: 'Categoría', value: verifyProductSuccess.value.category },
      { title: 'Unidad de medida', value: getNameUnitMeasurement(verifyProductSuccess.value.unit_measurement) },
      { title: 'Stock', value: verifyProductSuccess.value.stock },
    ]
  } else {
    return []
  }
})

const searchProductToVerify = (evt: any) => {
  evt.preventDefault()
  if (!searchVerifyProduct.value) return
  const response = searchProductByCodeOrName(searchVerifyProduct.value)
  if (Array.isArray(response)) {
    if (response.length > 1) {
      toast.warn('Se encontraron varios productos, por favor busque por código de barra')
    } else {
      verifyProductSuccess.value = response[0]
    }
  } else {
    toast.warn('No se encontró coincidencias')
  }
}


// Navigation Listeneres
const navigateButtons = (event: any) => {
  // add F2 key to open dialog
  if (event.key == "F2" && !showFoundProductsModal.value) {
    openSearchProductsModal()
  }
  // add F3 key to open dialog
  if (event.key == "F3" && !showVerifyProductModal.value) {
    openVerifyProductModal()
  }

  if (showFoundProductsModal.value) {
    if (!foundProducts.value) return
    if (foundProducts.value?.length === 0) return
    if (event.key === "ArrowDown") {
      focusedButtonIndex.value = (focusedButtonIndex.value + 1) % foundProducts.value?.length
    } else if (event.key === "ArrowUp") {
      focusedButtonIndex.value  = (focusedButtonIndex.value  - 1 + foundProducts.value?.length) % foundProducts.value?.length
    }
    selectProductButtonsRef.value[focusedButtonIndex.value].focus()
  }
}


// Removing product
const selectedProduct = ref<ProductCart | null>(null)

const selectProduct = (product: ProductCart | null) => {
  selectedProduct.value = product
}

const removeFromCart = () => {
  if (selectedProduct.value) {
    removeProductFromCart(selectedProduct.value.id)
    selectedProduct.value = null
    currentSaleTableRef.value.unselectProduct()
  } else {
    toast.warn('Seleccione un producto para remover')
  }
}

// Cancel sale
const showCancelSaleModal = ref(false)
const dialogCancelSaleRef = ref()
const inputCancelSaleRef = ref()
const cancelSaleCode = ref('')

const handleInputCancelSale = (value: string) => cancelSaleCode.value += value
const deleteCancelSaleCode = () => cancelSaleCode.value = ''

const openCancelSaleModal = () => {
  showCancelSaleModal.value = true
  dialogCancelSaleRef.value.showModal()
  isPinCancelSaleRequired.value && inputCancelSaleRef.value.focus()
}

const verifyCancelSale = () => {
  if (!cancelSaleCode.value) {
    toast.warn('Ingrese un código de autorización')
    return
  }
  if (comparePinCancelSale(cancelSaleCode.value)) {
    closeAndClearCart()
  } else {
    toast.error('Código de autorización incorrecto')
  }
}

const closeCancelSaleDialog = () => {
  showCancelSaleModal.value = false
  dialogCancelSaleRef.value.close()
  cancelSaleCode.value = ''
}

const closeAndClearCart = () => {
  clearCurrentCart()
  closeCancelSaleDialog()
}


// hooks
onMounted(() => {
  window.addEventListener('keydown', navigateButtons)
  inputSearchRef.value.focus()
  generateFolio()
})

onUnmounted(() => {
  window.removeEventListener('keydown', navigateButtons)
})
</script>

<style lang="scss" scoped>
.grid-sales {
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 50px 57px 1fr 150px;
}

.search-products-grid {
  display: grid;
  grid-template-rows: 20px auto auto auto 1fr;
}
</style>