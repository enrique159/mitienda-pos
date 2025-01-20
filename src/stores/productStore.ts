import { Category, Product, ProductCart, Discount } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useProductStore = defineStore('product', () => {
  // Products
  const products = ref<Product[]>([])

  const setProducts = (newProducts: Product[]) => {
    products.value = newProducts
  }

  // Cart
  const currentCart = ref<ProductCart[]>([])
  const discounts = ref<Discount[]>([])

  const addCart = (product: ProductCart) => {
    // check if there is already a product with the same id, if so, increase the quantity
    const productIndex = currentCart.value.findIndex((item) => item.id === product.id)
    if (productIndex !== -1) {
      currentCart.value[productIndex].quantity += product.quantity
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
    currentCart.value = currentCart.value.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          quantity,
        }
      }
      return product
    })
  }


  // CATEGORIES
  const categories = ref<Category[]>([])

  const setCategories = (newCategories: Category[]) => {
    categories.value = newCategories
  }

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