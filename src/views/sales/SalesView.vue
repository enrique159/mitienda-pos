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
          class="w-[260px] h-10 px-4 border border-gray-300 rounded-md"
          placeholder="Buscar por código o nombre"
          @keydown.enter="searchProduct"
        />
        <button class="bg-white-3 hover:bg-white-2 px-4 h-10 rounded-md active:scale-95 transition-all text-sm" @click="searchProduct">
          Agregar artículo
        </button>
        <button class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Buscar artículo
          <CustomKbd>F2</CustomKbd>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Artículos comunes
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button
          class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2"
          @click="removeFromCart"
        >
          Remover artículo
          <IconTrash class="w-4 h-4 text-brand-pink" />
        </button>
      </div>
    </section>
    <!-- CURRENT SALE TABLE -->
    <CurrentSaleTable ref="currentSaleTableRef" @on:select-product="selectProduct"/>

    <!-- PAYMENT SECTION -->
    <CurrentSalePayment />
  </div>


  <dialog id="dialogFoundProducts" ref="dialogFoundProductsRef" class="modal" @keydown.escape="showFoundProductsModal = false">
    <div class="modal-box">
      <h3 class="text-lg font-bold mb-4">Productos encontrados</h3>
      <p class="font-medium mb-2">Seleccione el producto que desea agregar</p>
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="product in foundProducts"
          :key="product.id"
          ref="selectProductButtonsRef"
          class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 shadow-card hover:bg-white-2 cursor-pointer rounded-md"
          @click="addProductToCartAndCloseModal(product)"
        >
          <div>
            <p class="text-sm text-black-3">{{ product.barcode }}</p>
            <p class="text-sm">{{ product.name }}</p>
          </div>
          <p class="text-sm">{{ product.selling_price }}</p>
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
</template>

<script setup lang="ts">
import CustomKbd from '@/components/CustomKbd.vue';
import CurrentSaleTable from './components/CurrentSaleTable.vue';
import CurrentSalePayment from './components/CurrentSalePayment.vue';
import { IconTrash } from '@tabler/icons-vue';
import { useProduct } from '@/composables/useProduct';
import { toast } from 'vue3-toastify';
import { ref, watch } from 'vue';
import { Product, ProductCart } from '@/api/interfaces';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';

// component ref
const inputSearchRef = ref()
const currentSaleTableRef = ref()
const dialogFoundProductsRef = ref()

const { searchProductByCodeOrName, addProductToCart, removeProductFromCart } = useProduct();

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

const navigateButtons = (event: any) => {
  // add F2 key to open dialog
  if (event.key == "F2" && !showFoundProductsModal.value) {
    toast.info('F2')
  }

  if (!showFoundProductsModal.value) return
  if (!foundProducts.value) return
  if (foundProducts.value?.length === 0) return
  if (event.key === "ArrowDown") {
    focusedButtonIndex.value = (focusedButtonIndex.value + 1) % foundProducts.value?.length
  } else if (event.key === "ArrowUp") {
    focusedButtonIndex.value  = (focusedButtonIndex.value  - 1 + foundProducts.value?.length) % foundProducts.value?.length
  }
  selectProductButtonsRef.value[focusedButtonIndex.value].focus()
}

const addProductToCartAndCloseModal = (product: Product) => {
  addProductToCart(product);
  showFoundProductsModal.value = false;
  dialogFoundProductsRef.value.close();
  search.value = '';
  inputSearchRef.value.focus();
}

// Removing product
const selectedProduct = ref<ProductCart | null>(null);

const selectProduct = (product: ProductCart) => {
  selectedProduct.value = product;
};

const removeFromCart = () => {
  if (selectedProduct.value) {
    removeProductFromCart(selectedProduct.value.id);
  }
  selectedProduct.value = null;
  currentSaleTableRef.value.unselectProduct();
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
  display: grid;
  grid-template-rows: 50px 57px 1fr 200px;  
}
</style>