import { useProductStore } from "@/stores/productStore"
import { Category, Product } from "@/api/interfaces"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useProduct = () => {
  const productStore = useProductStore()
  const today = new Date()

  const { products, currentCart, categories, discounts } = storeToRefs(productStore)

  // Computed
  const availableCategories = computed(() => {
    return categories.value.filter((category) => category.status === 'active')
  })

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
        if (tax.type === 'tasa') {
          const taxAmount = tax.value ? product.subtotal * (tax.value / 100) : 0
          return acc + taxAmount
        } else if (tax.type === 'cuota') {
          return acc + tax.value! * 100
        } else {
          return acc
        }
      }, 0)
      return acc + productTaxes
    }, 0)
  })

  const currentCartTaxesPerProduct = computed(() => {
    return currentCart.value.map((product) => {
      const tax_amount = product.taxes.reduce((acc, tax) => {
        if (tax.type === 'tasa') {
          if (!tax.value) return acc
          const taxPercentageCoeff = (tax.value / 100) + 1
          const totalPlusTax = product.subtotal * taxPercentageCoeff
          const taxAmount = totalPlusTax - product.subtotal
          return acc + taxAmount
        } else if (tax.type === 'cuota') {
          return acc + (tax.value ?? 0) * 100
        }
        return acc
      }, 0)

      return {
        id: product.id,
        tax_amount,
        subtotal: product.subtotal - tax_amount,
      }
    })
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
    const foundProducts = products.value.filter((product) => {
      const isMatchingSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(search.toLowerCase())

      // Check if the product's category is active
      const productCategory = categories.value.find((category) => category.id === product.id_category)
      const isCategoryActive = productCategory?.status === 'active'

      return isMatchingSearch && isCategoryActive
    })

    if (foundProducts.length === 0) {
      return null
    }
    return foundProducts
  }

  const addProductToCart = (product: Product, quantity = 1) => {
    const productCart = {
      ...product,
      quantity,
      subtotal: quantity * product.selling_price,
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

    availableCategories,
    currentCart,
    addProductToCart,
    currentCartTotal,
    currentCartSubtotal,
    currentCartDiscount,
    currentCartTax,
    currentCartTaxesPerProduct,
    removeProductFromCart,
    editProductQuantityInCart,
    isCurrentCartEmpty,
    clearCurrentCart,

    categories,
    setCategories,
  }
}