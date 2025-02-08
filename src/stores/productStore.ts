import { Category, Product, ProductCart, Discount } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useProductStore = defineStore('product', () => {
  // PRODUCTS
  const products = ref<Product[]>([])

  const setProducts = (newProducts: Product[]) => {
    products.value = newProducts
  }

  // CART
  const currentCart = ref<ProductCart[]>([])

  const addCart = (product: ProductCart) => {
    // check if there is already a product with the same id, if so, increase the quantity
    const productIndex = currentCart.value.findIndex((item) => item.id === product.id)
    if (productIndex !== -1) {
      currentCart.value[productIndex].quantity += product.quantity
      currentCart.value[productIndex].subtotal = product.subtotal
      return
    }
    currentCart.value.push(product)
  }

  const removeCart = (productId: string) => {
    currentCart.value = currentCart.value.filter((product) => product.id !== productId)
  }

  const clearCart = () => {
    currentCart.value = []
  }

  const editQuantityCart = (productId: string, quantity: number) => {
    const productIndex = currentCart.value.findIndex((item) => item.id === productId)
    if (productIndex !== -1) {
      currentCart.value[productIndex].quantity = quantity
      currentCart.value[productIndex].subtotal = quantity * currentCart.value[productIndex].selling_price
    }
  }


  // CATEGORIES
  const categories = ref<Category[]>([])

  const setCategories = (newCategories: Category[]) => {
    categories.value = newCategories
  }

  // DISCOUNTS
  const discounts = ref<Discount[]>([])

  return {
    // Products
    products,
    setProducts,

    // Cart
    currentCart,
    addCart,
    removeCart,
    editQuantityCart,
    clearCart,

    // Categories
    categories,
    setCategories,

    // Discounts
    discounts,
  }
})