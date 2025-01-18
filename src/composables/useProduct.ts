import { useProductStore } from "@/stores/productStore"
import { Category, Product } from "@/api/interfaces"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useProduct = () => {
  const productStore = useProductStore()

  const { products, currentCart, categories } = storeToRefs(productStore)

  const currentCartTotal = computed(() => {
    return currentCart.value.reduce((acc, product) => acc + product.selling_price * product.quantity, 0)
  })

  // Computed
  const isCurrentCartEmpty = computed(() => currentCart.value.length === 0)

  // Functions
  const setProducts = (products: Product[]) => {
    productStore.setProducts(products)
  }

  const setCategories = (categories: Category[]) => {
    productStore.setCategories(categories)
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find((product) => product.id === id)
  }

  const searchProductByCodeOrName = (search: string): Product[] | null => {
    if (!search || search === '') return null
    const foundProducts = products.value.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.id.toLowerCase().includes(search.toLowerCase())
    )
    if (foundProducts.length === 0) {
      return null
    }
    return foundProducts
  }

  const addProductToCart = (product: Product, quantity = 1) => {
    const productCart = {
      ...product,
      quantity,
    }
    productStore.addCart(productCart)
  }

  const removeProductFromCart = (productId: string) => {
    productStore.removeCart(productId)
  }

  const editProductQuantityInCart = (productId: string, quantity: number) => {
    productStore.editQuantityCart(productId, quantity)
  }

  const clearCurrentCart = () => {
    productStore.clearCart()
  }

  return {
    products,
    setProducts,
    getProductById,
    searchProductByCodeOrName,

    currentCart,
    addProductToCart,
    currentCartTotal,
    removeProductFromCart,
    editProductQuantityInCart,
    isCurrentCartEmpty,
    clearCurrentCart,

    categories,
    setCategories,
  }
}