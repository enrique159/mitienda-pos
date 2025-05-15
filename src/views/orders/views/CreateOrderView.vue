<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto space-y-4">
    <h6 class="text-2xl font-bold mb-4">
      Crear nuevo pedido
    </h6>
    <div class="flex justify-between items-end gap-4">
      <label class="form-control">
        <div class="label">
          <span class="label-text text-black-1 font-medium">Seleccione un proveedor</span>
        </div>
        <select
          id="provider"
          v-model="selectedProviderId"
          class="select select-bordered w-[200px]"
        >
          <option v-for="provider in providers" :key="`select-option-${provider.id}`" :value="provider.id">
            {{ provider.name }}
          </option>
        </select>
      </label>
      <button
        class="btn bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
        :disabled="itemsToSupply.length === 0"
        @click="handleCreateOrder"
      >
        <icon-arrow-right class="w-4 h-4" />
        Crear pedido
      </button>
    </div>

    <div class="divider" />

    <section class="space-y-4">
      <div class="bg-white rounded-xl">
        <div class="p-4 flex justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="form-control">
              <label class="label cursor-pointer w-fit p-0">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="showLowStockProducts"
                  @change="showLowStockProducts = !showLowStockProducts"
                >
                <div class="flex flex-col items-start ml-2">
                  <span class="text-black-1 text-sm">Mostrar solo productos <br> con stock bajo</span>
                </div>
              </label>
            </div>
          </div>

          <label
            class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
          >
            <input
              v-model="search"
              type="text"
              class="grow"
              placeholder="Buscar producto..."
            >
            <IconSearch class="w-4 h-4 text-black-2" />
          </label>
        </div>
      </div>

      <div class="overflow-auto h-table">
        <table class="table table-sm bg-white rounded-xl shadow-card">
          <!-- head -->
          <thead>
            <tr>
              <th class="w-12" />
              <th>Código de barras</th>
              <th>Nombre</th>
              <th>Existencia</th>
              <th class="w-16">
                Cantidad a solicitar
              </th>
              <th class="w-12" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, i) in providerProducts"
              :key="`product-row-${product.id}`"
            >
              <td>
                <span class="text-sm text-black-3">{{ i + 1 }}</span>
              </td>
              <td>{{ product.barcode || 'N/A' }}</td>
              <td>{{ product.name }}</td>
              <td :class="product.stock < product.stock_minimum ? 'text-brand-pink' : 'text-black-1'">
                {{ product.stock }}
                <div
                  v-if="product.stock < product.stock_minimum"
                  class="badge font-medium border-none bg-brand-pink/10 text-brand-pink"
                >
                  bajo
                </div>
              </td>
              <td class="text-center">
                {{ getItemQuantity(product.id) || '-' }}
              </td>

              <td class="px-0">
                <button
                  class="btn btn-sm btn-circle"
                  :class="isProductInOrder(product.id) ? 'bg-brand-pink/10 text-brand-pink' : 'text-brand-blue'"
                  @click="handleActionButton(product)"
                >
                  <IconX v-if="isProductInOrder(product.id)" />
                  <IconPlus v-else />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <!-- ADD ITEM TO SUPPLY -->
  <dialog id="dialogAddItemToSupply" ref="dialogAddItemToSupplyRef" class="modal" @keydown.escape="closeAddItemToSupplyModal">
    <div class="modal-box w-[320px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Solicitar producto
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeAddItemToSupplyModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex flex-col justify-center items-center gap-8">
        <label class="form-control w-full max-w-[168px]">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Cantidad</span>
          </div>
          <input
            id="quantity"
            ref="quantityInputRef"
            type="text"
            v-model="quantityToRequest"
            placeholder="Ej. 10"
            @keydown="validateOnlyNumbers"
            @keyup.enter="handleAddItemToSupply"
            class="input input-bordered w-full"
          >
        </label>

        <!-- BUTTONS -->
        <div class="flex justify-center space-x-4 w-full">
          <base-button
            type="button"
            class="w-full"
            @click="closeAddItemToSupplyModal"
          >
            Cancelar
          </base-button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink w-full"
            @click="handleAddItemToSupply"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  </dialog>

  <!-- PROVIDER ALERT -->
  <dialog id="dialogProviderAlert" ref="dialogProviderAlertRef" class="modal" @keydown.escape.prevent="() => {}">
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          No hay proveedores disponibles
        </h3>
      </div>

      <div class="flex flex-col justify-center items-center gap-4 mt-8">
        <p class="text-center text-black-1 mb-4">
          Para crear un producto, debes agregar al menos un proveedor. <br>¿Deseas agregar uno ahora?
        </p>
        <base-button
          type="button"
          class="flex items-center gap-2"
          @click="$router.push('/main/products/providers')"
        >
          <IconTruckLoading :size="18" />
          Ir a proveedores
        </base-button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { IconArrowRight, IconPlus, IconX, IconSearch, IconTruckLoading } from '@tabler/icons-vue'
import { useBranch } from '@/composables/useBranch'
import { useUser } from '@/composables/useUser'
import { useProvider } from '@/composables/useProvider'
import { useProduct } from '@/composables/useProduct'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { createPurchaseOrder } from '@/api/electron'
import { CreatePurchaseOrder, CreatePurchaseOrderItem, Product, Response } from '@/api/interfaces'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { CreatePurchaseOrderPayload, PurchaseOrder, PurchaseOrderStatus } from '@/api/interfaces/purchase_orders'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const { branch } = useBranch()
const { user } = useUser()
const { providers } = useProvider()
const { allProducts } = useProduct()
const router = useRouter()
// Providers
const dialogProviderAlertRef = ref()
const dialogAddItemToSupplyRef = ref()
const quantityInputRef = ref()
const emptyProviders = computed(() => providers.value.length === 0)

const openProviderAlertModal = () => {
  dialogProviderAlertRef.value?.showModal()
}

watch(emptyProviders, (value: boolean) => {
  if (value) {
    openProviderAlertModal()
  }
})

onMounted(() => {
  if (emptyProviders.value) {
    openProviderAlertModal()
  }
})


// NEW PURCHASE ORDER
const search = ref('')
const selectedProviderId = ref('')
const showLowStockProducts = ref(false)
const providerProducts = computed(() => {
  return allProducts.value.filter((product) => {
    return product.id_provider === selectedProviderId.value
      && product.name.toLowerCase().includes(search.value.toLowerCase())
      && (showLowStockProducts.value ? product.stock < product.stock_minimum : true)
  })
})

const quantityToRequest = ref<number | string>('')
const productToRequest = ref<Product | null>(null)
const itemsToSupply = ref<CreatePurchaseOrderItem[]>([])

const getItemQuantity = (productId: string) => {
  const item = itemsToSupply.value.find((item: CreatePurchaseOrderItem) => item.id_product === productId)
  return item ? item.quantity_ordered : null
}

const isProductInOrder = (productId: string) => {
  return itemsToSupply.value.some((item: CreatePurchaseOrderItem) => item.id_product === productId)
}

const handleActionButton = (product: Product) => {
  if (isProductInOrder(product.id)) {
    itemsToSupply.value = itemsToSupply.value.filter((item: CreatePurchaseOrderItem) => item.id_product !== product.id)
    clearValues()
    return
  }

  openAddItemToSupplyModal(product)
}

const handleAddItemToSupply = () => {
  if (Number(quantityToRequest.value) <= 0) {
    return
  }

  itemsToSupply.value.push({
    id_product: productToRequest.value?.id!,
    quantity_ordered: Number(quantityToRequest.value),
    quantity_received: null,
    incidence: null,
    note: null,
  })

  closeAddItemToSupplyModal()
}

const openAddItemToSupplyModal = (product: Product) => {
  productToRequest.value = product
  dialogAddItemToSupplyRef.value?.showModal()
  quantityInputRef.value?.focus()
}

const closeAddItemToSupplyModal = () => {
  dialogAddItemToSupplyRef.value?.close()
  clearValues()
}

const clearValues = () => {
  quantityToRequest.value = ''
  productToRequest.value = null
}


// HANDLE CREATE ORDER
const handleCreateOrder = () => {
  const purchaseOrder: CreatePurchaseOrder = {
    id_company: branch.value.id_company,
    id_branch: branch.value.id,
    id_provider: selectedProviderId.value,
    id_seller: user.value.id,
    status: PurchaseOrderStatus.SENT,
    notes: null,
    ordered_at: null,
    received_at: null,
  }
  const payload: CreatePurchaseOrderPayload = {
    purchaseOrder,
    items: itemsToSupply.value.map((item: CreatePurchaseOrderItem) => {
      return {
        id_product: item.id_product,
        quantity_ordered: item.quantity_ordered,
        quantity_received: null,
        incidence: null,
        note: null,
      }
    }),
  }
  try {
    console.log(payload)
    createPurchaseOrder(payload, (response: Response<PurchaseOrder>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success('Orden de compra creada exitosamente')
      router.push({ name: 'Orders' })
    })
  } catch (error) {
    console.log(error)
    toast.error('Error al crear la orden de compra')
  }
}

onMounted(() => {
  if (providers.value.length > 0) {
    selectedProviderId.value = providers.value[0].id
  }
})
</script>
