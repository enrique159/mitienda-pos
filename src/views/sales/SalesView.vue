<template>
  <div class="grid-sales h-full">
    <section class="w-full pb-1 pt-2 px-4 bg-white flex">
      <p class="text-2xl font-semibold text-gray-800">Ticket No. 2300001</p>
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
        />
        <button
          class="bg-white-2 hover:bg-white-3 px-4 h-10 rounded-md active:scale-95 transition-all text-sm"
          @click="searchProduct"
        >
          Agregar artículo
        </button>
        <button
          class="bg-white-2 hover:bg-white-3 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2"
          @click="openSearchProductsModal"
        >
          Buscar artículo
          <CustomKbd>F2</CustomKbd>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="bg-white-2 hover:bg-white-3 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Artículos comunes
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button
          class="bg-white-2 hover:bg-white-3 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2"
          @click="removeFromCart"
        >
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
      <h3 class="text-lg font-bold mb-4">Productos encontrados</h3>
      <p class="font-medium mb-2">Seleccione el producto que desea agregar</p>
      <div class="grid grid-cols-1 gap-2 h-fit max-h-[440px] overflow-y-auto">
        <button
          v-for="(product, index) in foundProducts"
          :key="`product-found-button-${product.id}`"
          ref="selectProductButtonsRef"
          class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 hover:bg-white-2 cursor-pointer rounded-md"
          :class="{ 'focus:outline-2 outline-brand-orange' : focusedButtonIndex === index  }"
          @click="addProductToCartAndCloseFoundModal(product)"
        >
          <div class="text-left">
            <p class="text-sm leading-4 text-black-3">{{ product.barcode }}</p>
            <p class="font-bold leading-6">{{ product.name }}</p>
          </div>
          <p class="text-sm">{{ formatCurrency(product.selling_price) }}</p>
        </button>
      </div>
      <div class="modal-action">
        <form method="dialog" @submit="showFoundProductsModal = false">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-ghost btn-sm">
            cerrar
            <CustomKbd>ESC</CustomKbd>
          </button>
        </form>
      </div>
    </div>
  </dialog>


  <!-- DIALOG SEARCH PRODUCT -->
  <dialog id="dialogSearchProducts" ref="dialogSearchProductsRef" class="modal" @keydown.escape="showSearchProductsModal = false">
    <div class="modal-box search-products-grid min-w-[800px] min-h-[600px] h-fit max-h-[700px]">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-bold">Buscar productos</h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="showSearchProductsModal = false">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-ghost btn-sm">
              cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <p class="font-medium mb-2 w-full text-center text-black-3">Categorías</p>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <button
          v-for="category in categories"
          :key="`category-button-${category.category}`"
          class="px-4 py-2 border rounded-md active:scale-95 transition-all text-sm"
          :class="[ category.category === categorySelected ? 'bg-brand-pink text-white border-brand-pink' : 'border-white-2' ]"
          @click="handleChangeCategory(category.category)"
        >
          {{ category.category }}
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
        />
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
            <p class="text-sm leading-4 text-black-3">{{ product.barcode }}</p>
            <p class="font-bold leading-6">{{ product.name }}</p>
          </div>
          <p class="text-sm">{{ formatCurrency(product.selling_price) }}</p>
        </button>
      </div>
    </div>
  </dialog>

  <!-- DIALOG EDIT QUANTITY -->
  <dialog id="dialogEditQuantity" ref="dialogEditQuantityRef" class="modal" @keydown.escape="showEditQuantityModal = false">
    <div class="modal-box max-w-[380px]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Cambiar cantidad</h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="showEditQuantityModal = false">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-ghost btn-sm">
              cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      
      <div class="flex flex-col items-center gap-4 py-8">
        <div class="flex justify-between items-start gap-2">
          <label class="input bg-white-1 input-bordered flex items-center max-w-36 gap-2">
            <input
              ref="inputEditQuantityRef"
              class="w-full"
              placeholder="Cantidad"
              @keydown="validateOnlyNumbers"
              @keyup.enter="saveNewQuantity"
              v-model="newQuantity"
            />
          </label>
          <delete-button @on:click="deletePin" />
        </div>
        <pin-input @input="editQuantity" @enter="saveNewQuantity" />
      </div>
      
    </div>
  </dialog>
</template>

<script setup lang="ts">
import PinInput from '@/components/inputs/PinInput.vue';
import DeleteButton from '@/components/buttons/DeleteButton.vue';
import CustomKbd from '@/components/CustomKbd.vue';
import CurrentSaleTable from './components/CurrentSaleTable.vue';
import CurrentSalePayment from './components/CurrentSalePayment.vue';
import { IconTrash, IconSearch, IconCancel } from '@tabler/icons-vue';
import { useProduct } from '@/composables/useProduct';
import { toast } from 'vue3-toastify';
import { ref, watch } from 'vue';
import { Product, ProductCart, Response } from '@/api/interfaces';
import { computed, onMounted, onUnmounted } from 'vue';
import { useCurrency } from '@/composables/useCurrency';
import { getProductsByCategory } from '@/api/electron';
import { validateOnlyNumbers } from '@/utils/InputValidators';

// Formats
const { formatCurrency } = useCurrency();

// component ref
const inputSearchRef = ref()
const currentSaleTableRef = ref()
const dialogFoundProductsRef = ref()

const {
  products,
  categories,
  addProductToCart,
  removeProductFromCart, 
  editProductQuantityInCart,
  searchProductByCodeOrName,
} = useProduct();

const search = ref('');

const searchProduct = (evt: any) => {
  evt.preventDefault();
  if (!search.value) return;
  const response = searchProductByCodeOrName(search.value);
  if (Array.isArray(response)) {
    if (response.length > 1) {
      showFoundProductsModal.value = true;
      dialogFoundProductsRef.value.showModal();
      focusFirstButton();
    } else {
      addProductToCart(response[0]);
      search.value = '';
    }
  } else {
    toast.warn('No se encontró coincidencias');
  }
}

const foundProducts = computed(() => {
  return searchProductByCodeOrName(search.value);
});

// Dialog found products
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
  addProductToCart(product);
  showFoundProductsModal.value = false;
  dialogFoundProductsRef.value.close();
  search.value = '';
  inputSearchRef.value.focus();
}


// Dialog Search Products
const showSearchProductsModal = ref(false)
const dialogSearchProductsRef = ref()
const categorySelected = ref('Todos')
const productsByCategory = ref<Product[]>([])
const searchInProductsCategory = ref('')
const inputSearchInProductsCategoryRef = ref()

const productsByCategoryFiltered = computed(() => {
  return productsByCategory.value.filter(product => product.name.toLowerCase().includes(searchInProductsCategory.value.toLowerCase()) || product?.barcode?.includes(searchInProductsCategory.value))
})

const openSearchProductsModal = () => {
  showSearchProductsModal.value = true;
  dialogSearchProductsRef.value.showModal();
  inputSearchInProductsCategoryRef.value.focus();
  searchInProductsCategory.value = '';
  if (categorySelected.value === 'Todos') {
    productsByCategory.value = products.value
    return
  }
  getProductsByCategory(categorySelected.value, (response: Response<Product[]>) => {
    if (response.success) {
      productsByCategory.value = response.response;
    } else {
      toast.error('Error al obtener los productos');
    }
  });
}

const handleChangeCategory = (category: string) => {
  categorySelected.value = category;
  if (category === 'Todos') {
    productsByCategory.value = products.value
    return
  }
  getProductsByCategory(category, (response: Response<Product[]>) => {
    if (response.success) {
      productsByCategory.value = response.response;
    } else {
      productsByCategory.value = []
    }
  });
}

const addProductToCartAndCloseSearchModal = (product: Product) => {
  addProductToCart(product);
  showSearchProductsModal.value = false;
  dialogSearchProductsRef.value.close();
  search.value = '';
  inputSearchRef.value.focus();
}

// Edit quantity Modal
const showEditQuantityModal = ref(false)
const dialogEditQuantityRef = ref()
const inputEditQuantityRef = ref()
const newQuantity = ref('')

const openEditQuantityModal = () => {
  showEditQuantityModal.value = true;
  dialogEditQuantityRef.value.showModal();
  inputEditQuantityRef.value.focus();
}

const editQuantity = (value: string) => newQuantity.value += value
const deletePin = () => newQuantity.value = ''

const saveNewQuantity = () => {
  if (!newQuantity.value) {
    toast.warn('Ingrese una cantidad válida');
    return;
  }
  if (selectedProduct.value && newQuantity.value) {
    editProductQuantityInCart(selectedProduct.value.id, Number(newQuantity.value));
    showEditQuantityModal.value = false;
    dialogEditQuantityRef.value.close();
    selectedProduct.value = null;
    currentSaleTableRef.value.unselectProduct();
    newQuantity.value = '';
  } else {
    toast.warn('Seleccione un producto para cambiar la cantidad');
  }
}

// Navigation Listeneres
const navigateButtons = (event: any) => {
  // add F2 key to open dialog
  if (event.key == "F2" && !showFoundProductsModal.value) {
    openSearchProductsModal();
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
const selectedProduct = ref<ProductCart | null>(null);

const selectProduct = (product: ProductCart | null) => {
  selectedProduct.value = product;
};

const removeFromCart = () => {
  if (selectedProduct.value) {
    removeProductFromCart(selectedProduct.value.id);
    selectedProduct.value = null;
    currentSaleTableRef.value.unselectProduct();
  } else {
    toast.warn('Seleccione un producto para remover');
  }
}

// hooks
onMounted(() => {
  window.addEventListener('keydown', navigateButtons)
  inputSearchRef.value.focus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', navigateButtons)
})
</script>

<style lang="scss" scoped>
.grid-sales {
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 50px 57px 1fr 200px;  
}

.search-products-grid {
  display: grid;
  grid-template-rows: 20px auto auto auto 1fr;
}
</style>