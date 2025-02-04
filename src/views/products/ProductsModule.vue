<template>
  <div class="w-full flex side-menu-grid">
    <side-menu :items-menu="productsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconBox, IconCategory, IconCirclePlus, IconCoins } from '@tabler/icons-vue'
import { getTaxes, getProducts, getCategories } from '@/api/electron'
import { Response, Product, Category } from '@/api/interfaces'
import { useTax } from '@/composables/useTax'
import { useProduct } from '@/composables/useProduct'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const { taxes } = useTax()
const { setProducts, setCategories } = useProduct()

const loadData = async () => {
  // Load Products
  getProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setProducts(response.response)
  })
  // Load Categories
  getCategories((response: Response<Category[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setCategories(response.response)
  })
  // Load Taxes
  const response = await getTaxes()
  if (!response.success) {
    toast.error(response.message)
    return
  }
  taxes.value = response.response
}

onMounted(() => {
  loadData()
})

const productsMenu = [
  {
    title: 'Productos',
    path: '/main/products',
    icon: IconBox,
  },
  {
    title: 'Nuevo producto',
    path: '/main/products/create',
    icon: IconCirclePlus,
  },
  {
    title: 'Categorías',
    path: '/main/products/categories',
    icon: IconCategory,
  },
  {
    title: 'Impuestos',
    path: '/main/products/taxes',
    icon: IconCoins,
  },
]
</script>

<style scoped></style>
