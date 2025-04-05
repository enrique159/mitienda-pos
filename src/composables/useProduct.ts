import { useProductStore } from '@/stores/productStore'
import { Category, Discount, Product } from '@/api/interfaces'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const dayNames = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const useProduct = () => {
  const productStore = useProductStore()
  const today = new Date()

  const { products, currentCart, categories, discounts } =
    storeToRefs(productStore)

  // Computed
  const availableCategories = computed(() => {
    return categories.value.filter((category) => category.status === 'active')
  })

  const currentCartSubtotal = computed(() => {
    return currentCart.value.reduce(
      (acc, product) => acc + product.selling_price * product.quantity,
      0
    )
  })

  const currentCartDiscount = computed(() => {
    // Utilizar currentCartProductsWithDiscount para calcular el descuento total
    return currentCartProductsWithDiscount.value.reduce((totalDiscount, product) => {
      // Si el producto no tiene descuentos, no hay nada que sumar
      if (!product?.discounts?.length) return totalDiscount
      // Calcular la diferencia entre el subtotal original y el subtotal con descuento
      const originalSubtotal = product.selling_price * product.quantity
      return totalDiscount + (originalSubtotal - product.subtotal)
    }, 0)
  })

  const currentCartProductsWithDiscount = computed(() => {
    const currentDay = dayNames[today.getDay()]
    const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    // return all products with their discount applied that have discount valid
    return currentCart.value.map((product) => {
      if (!product?.discounts?.length) return product

      // Filtrar todos los descuentos válidos
      const validDiscounts = product.discounts.filter((discount) => {
        const isValidQuantity =
          product.quantity >= (discount?.condition_quantity ?? 0)
        const isValidDate =
          (!discount.start_date || new Date(discount.start_date) <= today) &&
          (!discount.end_date || new Date(discount.end_date) >= today)
        // Verificar horario si existe
        let isValidSchedule = true
        if (discount.schedule?.length) {
          const currentTimeMinutes = convertTimeToMinutes(currentTime)
          isValidSchedule = discount.schedule.some(
            (scheduleDay) =>
              scheduleDay.day === currentDay &&
              convertTimeToMinutes(scheduleDay.start_time) <=
                currentTimeMinutes &&
              convertTimeToMinutes(scheduleDay.end_time) >= currentTimeMinutes
          )
        }

        return isValidDate && isValidQuantity && isValidSchedule
      })

      if (!validDiscounts.length) return { ...product, valid_discounts: [] }

      // Calcular el total de descuento sumando todos los descuentos válidos
      const totalDiscountAmount = validDiscounts.reduce((acc, discount) => {
        if (discount.discount_for_one) {
          const quantityApplied = Math.floor(product.quantity / (discount.condition_quantity ?? 1))
          return acc + calculateDiscountAmount(product.selling_price, discount) * quantityApplied
        }
        return acc + calculateDiscountAmount(product.selling_price, discount) * product.quantity
      }, 0)

      return {
        ...product,
        valid_discounts: validDiscounts,
        subtotal: product.selling_price * product.quantity - totalDiscountAmount,
      }
    })
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
          const taxPercentageCoeff = tax.value / 100 + 1
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

  const setDiscounts = (discounts: Discount[]) => {
    productStore.setDiscounts(discounts)
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
      const productCategory = categories.value.find(
        (category) => category.id === product.id_category
      )
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

  const calculateDiscountAmount = (
    price: number,
    discount: Discount
  ): number => {
    return discount.type === 'percentage'
      ? (price * discount.value) / 100
      : discount.value
  }

  // Convert time strings to minutes for proper comparison
  const convertTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
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
    currentCartProductsWithDiscount,
    removeProductFromCart,
    editProductQuantityInCart,
    isCurrentCartEmpty,
    clearCurrentCart,

    categories,
    setCategories,

    discounts,
    setDiscounts,
  }
}
