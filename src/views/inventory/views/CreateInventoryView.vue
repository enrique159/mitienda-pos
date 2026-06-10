<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto space-y-4">
    <h6 class="text-2xl font-bold mb-4">Crear nuevo inventario</h6>

    <div class="flex justify-between items-end gap-4">
      <label class="form-control w-full max-w-[420px]">
        <div class="label">
          <span class="label-text text-black-1 font-medium"
            >Notas del inventario</span
          >
        </div>
        <input
          v-model="notes"
          type="text"
          class="input input-bordered"
          placeholder="Ej. Conteo general de cierre"
          maxlength="255"
        />
      </label>

      <div class="flex items-center gap-2">
        <button
          class="btn btn-ghost text-black-2"
          :disabled="isCreatingInventory"
          @click="$router.push('/main/inventory')"
        >
          Cancelar
        </button>
        <button
          class="btn bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          :disabled="
            controlledStockProducts.length === 0 || isCreatingInventory
          "
          @click="handleCreateInventory"
        >
          <span
            v-if="isCreatingInventory"
            class="loading loading-spinner loading-sm"
          />
          <IconArrowRight v-else class="w-4 h-4" />
          {{ isCreatingInventory ? 'Creando...' : 'Crear inventario' }}
        </button>
      </div>
    </div>

    <div class="divider" />

    <section class="space-y-4">
      <div class="bg-white rounded-xl">
        <div class="p-4 flex justify-between items-center gap-4">
          <div class="form-control">
            <label class="label cursor-pointer w-fit p-0">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="showLowStockProducts"
                @change="showLowStockProducts = !showLowStockProducts"
              />
              <div class="flex flex-col items-start ml-2">
                <span class="text-black-1 text-sm"
                  >Mostrar solo productos <br />
                  con stock bajo</span
                >
              </div>
            </label>
          </div>

          <label
            class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
          >
            <input
              v-model="search"
              type="text"
              class="grow"
              placeholder="Buscar producto..."
            />
            <IconSearch class="w-4 h-4 text-black-2" />
          </label>
        </div>
      </div>

      <div class="overflow-auto h-table">
        <table class="table table-sm bg-white rounded-xl shadow-card">
          <thead>
            <tr>
              <th class="w-12" />
              <th>Código de barras</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Existencia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, i) in filteredProducts"
              :key="`inventory-product-row-${product.id}`"
            >
              <td>
                <span class="text-sm text-black-3">{{ i + 1 }}</span>
              </td>
              <td>{{ product.barcode || 'N/A' }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category || '-' }}</td>
              <td>{{ product.provider || '-' }}</td>
              <td
                :class="
                  isLowStock(product) ? 'text-brand-pink' : 'text-black-1'
                "
              >
                {{ product.stock ?? 0 }}
                <div
                  v-if="isLowStock(product)"
                  class="badge font-medium border-none bg-brand-pink/10 text-brand-pink"
                >
                  bajo
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="text-center text-black-3 py-8">
                No hay productos con inventario controlado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconArrowRight, IconSearch } from '@tabler/icons-vue'
import { createInventory } from '@/api/electron'
import { Product, Response } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'
import { useProduct } from '@/composables/useProduct'
import { useUser } from '@/composables/useUser'
import { toast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { useInventory } from '@/composables/useInventory'

const router = useRouter()
const { branch } = useBranch()
const { user } = useUser()
const { allProducts } = useProduct()
const { refreshInventories } = useInventory()

const search = ref('')
const notes = ref('')
const showLowStockProducts = ref(false)
const isCreatingInventory = ref(false)

const controlledStockProducts = computed(() => {
  return allProducts.value.filter(
    (product) => product.is_active && !product.unlimited_stock
  )
})

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()

  return controlledStockProducts.value.filter((product) => {
    const matchesLowStock = !showLowStockProducts.value || isLowStock(product)
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.barcode?.toLowerCase().includes(term) ||
      product.provider?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)

    return matchesLowStock && matchesSearch
  })
})

const isLowStock = (product: Product) => {
  return Number(product.stock ?? 0) < Number(product.stock_minimum ?? 0)
}

const handleCreateInventory = () => {
  if (!branch.value.id || !branch.value.id_company) {
    toast.error('No hay una sucursal activa para crear el inventario')
    return
  }

  isCreatingInventory.value = true
  createInventory(
    {
      id_company: branch.value.id_company,
      id_branch: branch.value.id,
      id_seller_init: user.value.id || null,
      notes: notes.value || null,
      status: 'pending',
    },
    (response: Response<{ id: string }>) => {
      isCreatingInventory.value = false
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success('Inventario creado exitosamente')
      refreshInventories().then(() => {
        router.push({
          name: 'InventoryDetailView',
          params: { id: response.response.id },
        })
      })
    }
  )
}
</script>
