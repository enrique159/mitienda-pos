<template>
  <div class="w-full flex side-menu-grid">
    <side-menu :items-menu="productsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconBox, IconCategory, IconCirclePlus, IconCoins, IconDiscount } from '@tabler/icons-vue'
import { getTaxes, getProducts, getCategories, getDiscounts } from '@/api/electron'
import { Response, Product, Category, Discount } from '@/api/interfaces'
import { useTax } from '@/composables/useTax'
import { useProduct } from '@/composables/useProduct'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const { setTaxes } = useTax()
const { setProducts, setCategories, setDiscounts } = useProduct()

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
  const responseTaxes = await getTaxes()
  if (!responseTaxes.success) {
    toast.error(responseTaxes.message)
    return
  }
  setTaxes(responseTaxes.response)
  // Load Discounts
  await getDiscounts((response: Response<Discount[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setDiscounts(response.response)
  })
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
    title: 'Descuentos',
    path: '/main/products/discounts',
    icon: IconDiscount,
  },
  {
    title: 'Impuestos',
    path: '/main/products/taxes',
    icon: IconCoins,
  },
]
</script>

<style scoped></style>
