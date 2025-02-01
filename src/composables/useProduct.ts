import { useProductStore } from "@/stores/productStore"
import { Category, Product } from "@/api/interfaces"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useProduct = () => {
  const productStore = useProductStore()
  const today = new Date()

  const { products, currentCart, categories, discounts } = storeToRefs(productStore)

  // Computed
  const currentCartSubtotal = computed(() => {
    return currentCart.value.reduce((acc, product) => acc + product.selling_price * product.quantity, 0)
  })

  // TODO: Verificar al implementar descuentos
  const currentCartDiscount = computed(() => {
    return currentCart.value.reduce((acc, product) => {
      const discount = discounts.value.find((d) => d.id_product === product.id)
      if (!discount) return acc
      if (discount.start_date && discount.start_date > today) return acc
      if (discount.end_date && discount.end_date < today) return acc
      if (discount.condition_quantity > product.quantity) return acc
      if (discount.id_discount_type === 'percentage') {
        return acc + (product.selling_price * discount.discount_value) / 100
      }
      return acc + discount.discount_value
    }, 0)
  })

  const currentCartTax = computed(() => {
    return currentCart.value.reduce((acc, product) => {
      const productTaxes = product.taxes.reduce((acc, tax) => {
        const taxAmount = tax.fixed * product.quantity
        return acc + taxAmount
      }, 0)
      return acc + productTaxes
    }, 0)
  })

  const currentCartTotal = computed(() => {
    return currentCartSubtotal.value - currentCartDiscount.value
  })

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
    currentCartSubtotal,
    currentCartDiscount,
    currentCartTax,
    removeProductFromCart,
    editProductQuantityInCart,
    isCurrentCartEmpty,
    clearCurrentCart,

    categories,
    setCategories,
  }
}