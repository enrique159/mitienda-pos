<template>
  <section
    class="w-full grid grid-cols-12 bg-white pb-1 pt-3 px-3 border-t border-gray-200"
  >
    <div class="col-span-8 flex justify-between items-start pl-4 pr-8">
      <div class="flex items-center gap-2">
        <div v-if="customerCurrentSale" class="border border-white-3 rounded-lg px-3 pr-1 h-10 text-sm max-w-48 overflow-x-hidden flex justify-between items-center gap-2 min-w-36">
          <p class="truncate">
            {{ customerCurrentSale?.name }}
          </p>
          <button @click="clearCustomerCurrentSale" class="btn btn-ghost btn-circle btn-xs">
            <IconX size="18" />
          </button>
        </div>
        <base-button v-else class="flex items-center gap-1" @click="openSelectClientModal">
          Asignar cliente
          <IconUserPlus class="text-brand-black" size="18" />
        </base-button>

        <base-button @click="selectImage">
          Cuenta pendiente
        </base-button>
      </div>

      <button
        class="btn bg-brand-black hover:bg-brand-blue text-brand-white text-lg flex items-center gap-2"
        @click="openPaymentModal"
      >
        Pagar cuenta
        <icon-receipt-2 size="24" />
      </button>
    </div>

    <div class="col-span-4">
      <div class="h-fit py-1 bg-white-1 rounded-2xl">
        <div class="flex justify-between items-center px-4 py-1">
          <p class="font-bold text-black-1">
            Subtotal
          </p>
          <p class="font-bold">
            {{ formatCurrency(currentCartSubtotal) }}
          </p>
        </div>

        <div
          class="flex justify-between items-center px-4 py-1 border-b border-gray-200"
        >
          <p class="font-bold text-black-1">
            Descuento
          </p>
          <p class="font-bold">
            {{ formatCurrency(currentCartDiscount) }}
          </p>
        </div>

        <div class="flex justify-between items-center px-4 py-3">
          <p class="font-black text-xl">
            Total a pagar
          </p>
          <p class="font-black text-xl text-green-600">
            {{ formatCurrency(currentCartTotal) }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- DIALOG PAY SALE -->
  <dialog
    id="dialogPaymentSale"
    ref="dialogPaymentSaleRef"
    class="modal"
    @keydown.escape="closePaymentModal"
  >
    <div class="modal-box h-[700px] w-full max-w-[900px] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          Realizar pago
        </h3>

        <h6 class="font-bold text-sm">
          Ticket: {{ saleFolio }}
        </h6>

        <div class="modal-action mt-0">
          <form method="dialog" @submit="closePaymentModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4 h-full">
        <!-- SUMMARY PAYMENT -->
        <div class="col-span-7">
          <div class="bg-white-1 rounded-2xl p-4 pt-2 h-fit mb-4">
            <p class="border-b border-white-3 pb-2 text-lg text-black-1 mb-2">
              Resumen de compra
            </p>

            <section class="grid grid-cols-2 gap-2">
              <p>Subtotal</p>
              <p class="text-end">
                {{ formatCurrency(currentCartSubtotal) }}
              </p>

              <p>Descuento</p>
              <p class="text-end">
                {{ formatCurrency(currentCartDiscount) }}
              </p>

              <p>Impuestos</p>
              <p class="text-end">
                {{ formatCurrency(currentCartTax) }}
              </p>

              <p class="font-bold text-xl">
                Total a pagar
              </p>
              <p class="font-bold text-xl text-green-600 text-end">
                {{ formatCurrency(currentCartTotal) }}
              </p>
            </section>
          </div>

          <!-- DIVIDER -->
          <div class="border-b border-gray-200 mb-4" />

          <!-- PAYMENT METHODS -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-black-1 font-semibold"> Método de pago </span>
            <div class="flex items-center gap-2">
              <label
                for="inputMultiplePaymentMethods"
                class="text-sm text-black-2 cursor-pointer"
              >
                Múltiples formas de pago
              </label>
              <input
                id="inputMultiplePaymentMethods"
                type="checkbox"
                class="toggle toggle-sm"
                :checked="multiplePaymentMethods"
                @change="multiplePaymentMethods = !multiplePaymentMethods"
              >
            </div>
          </div>
          <div v-if="!multiplePaymentMethods" class="grid grid-cols-2 gap-4 mb-6">
            <button
              v-for="method in paymentMethodsOptions"
              :key="method.id"
              class="px-4 h-12 rounded-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              :class="[ onePaymentMethod.payment_method === method.id ? 'bg-brand-black text-white' : 'text-black-1 bg-white-2 hover:bg-white-3' ]"
              @click="selectPaymentMethod(method.id)"
            >
              <component v-if="method.icon" :is="method.icon" :size="21" />
              {{ method.name }}
            </button>
          </div>

          <div v-else class="flex flex-wrap gap-4 mb-6 items-center">
            <div
              v-for="method in paymentMethods"
              :key="`payment-method-card-${method.id}`"
              class="bg-white min-w-[128px] rounded-lg py-1 px-3 relative border-4 transition-all cursor-pointer"
              :class="[
                selectedPaymentMethodEdit && selectedPaymentMethodEdit.id === method.id
                  ? 'border-brand-blue shadow-lg' : 'border-white shadow-md'
              ]"
              @click="selectPaymentMethodEdit(method)"
            >
              <p class="text-sm font-medium text-black-1">
                {{ getPaymentMethodName(method.payment_method) }}
              </p>
              <span class="font-bold text-lg">{{ formatCurrency(method.amount) }}</span>
              <button
                class="btn bg-black-3 text-black-1 hover:text-white hover:bg-red-500 hover:border-red-400 btn-circle btn-xs absolute -top-2 -right-2"
                @click="removePaymentMethod(method)"
              >
                <IconX size="18" class="text-white" />
              </button>
            </div>

            <div class="dropdown">
              <div tabindex="0" role="button" class="btn btn-ghost h-10 min-w-10 aspect-square bg-white-1 hover:bg-white-2 rounded-full grid place-items-center" @click.stop="() => {}">
                <IconPlus size="24" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow">
                <li
                  v-for="method in availablePaymentMethods"
                  :key="method.id"
                  @click.stop="() => {
                    paymentMethods.push({ id: Math.random().toString(), payment_method: method.id, amount: 0 });
                    selectPaymentMethodEdit(paymentMethods[paymentMethods.length - 1])
                    nextTick(() => {
                      if (multipleCurrencyInputRef.value) {
                        multipleCurrencyInputRef.value.focus()
                      }
                    })
                  }"
                >
                  <a>
                    {{ method.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- DIVIDER -->
          <div class="border-b border-gray-200 mb-4" />

          <div v-if="customerCurrentSale" class="flex justify-between items-center w-full border border-white-3 rounded-lg p-4 mb-4">
            <span class="text-black-1 font-normal">
              Cliente: <span class="font-bold">{{ customerCurrentSale.name }}</span>
            </span>
            <span class="text-black-1 font-normal">
              Disponible: {{ formatCurrency(customerCurrentSale.credit_limit - customerCurrentSale.used_credit) }}
            </span>
          </div>

          <!-- SALE COMMENTS -->
          <div class="flex flex-col w-full">
            <textarea
              v-model="saleComments"
              class="textarea bg-white-1 resize-none textarea-sm max-h-24 leading-5"
              placeholder="Comentarios de la venta"
              maxlength="220"
              rows="4"
            />
          </div>
        </div>
        <div class="col-span-5 flex flex-col items-center justify-between">
          <!-- ONE TYPE PAYMENT -->
          <div v-if="!multiplePaymentMethods" class="grid grid-cols-1 gap-4 w-full place-items-center">
            <div class="flex items-center">
              <currency-input
                ref="currencyInputRef"
                class-name="max-w-[180px]"
                :value="paymentQuantity"
                :disabled="isCurrencyInputDisabled"
                @add:value="editPaymentQuantity"
                @backspace="removePaymentQuantity"
              />
              <delete-button @click="removePaymentQuantity" />
            </div>
            <pin-input @input="editPaymentQuantity" />
            <span class="text-black-1 text-lg">
              Cambio: <strong> {{ formatCurrency(cashPaymentChange) }} </strong>
            </span>
          </div>
          <!-- MULTIPLE PAYMENT METHODS -->
          <div v-else class="grid grid-cols-1 gap-4 w-full place-items-center">
            <div class="flex items-center">
              <currency-input
                ref="multipleCurrencyInputRef"
                class-name="max-w-[180px]"
                :value="selectedPaymentMethodEdit?.amount.toString()"
                @add:value="editCurrentPaymentMethodAmount"
                @backspace="removeCurrentPaymentMethodAmount"
              />
              <delete-button @click="removeCurrentPaymentMethodAmount" />
            </div>
            <pin-input @input="editCurrentPaymentMethodAmount" />
            <span class="text-black-1 text-lg">
              Cambio: <strong :class="{ 'text-brand-orange': cashPaymentChange > 0 }"> {{ formatCurrency(cashPaymentChange) }} </strong>
            </span>
          </div>
          <div class="w-full flex flex-col items-center">
            <div class="form-control mb-2">
              <label class="label cursor-pointer hover:bg-white-1 px-4 rounded-full transition-all">
                <span class="label-text mr-2 text-black-2">Imprimir ticket</span>
                <input type="checkbox" :checked="printTicket" class="checkbox checkbox-accent">
              </label>
            </div>
            <button
              class="btn btn-lg bg-brand-pink hover:bg-brand-orange text-white w-3/4"
              @click="createCurrentSale"
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
    <SnackBar
      v-model="snackbarPayment.show"
      :message="snackbarPayment.message"
      :type="snackbarPayment.type"
    />
  </dialog>


  <!-- DIALOG SELECT CLIENT -->
  <dialog id="dialogSelectClient" ref="dialogSelectClientRef" class="modal" @keydown.escape="closeSelectClientModal">
    <div class="modal-box">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          Seleccionar cliente
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeSelectClientModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <div class="flex flex-col items-center gap-4 py-2">
        <label class="input bg-white-1 input-bordered flex items-center gap-2 w-full">
          <input
            type="text"
            class="grow"
            placeholder="Buscar cliente"
            v-model="searchClient"
          >
          <IconSearch class="w-4 h-4 text-gray-400" />
        </label>

        <div class="grid grid-cols-1 gap-2 w-full h-fit max-h-[300px] overflow-y-auto">
          <button
            v-for="client in filteredCustomers"
            :key="client.id"
            class="btn btn-ghost bg-white-1 hover:bg-white-2 flex items-center gap-2"
            @click="() => { setCustomerCurrentSale(client); closeSelectClientModal() }"
          >
            <IconUser class="w-4 h-4 text-gray-400" />
            {{ client.name }}
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/inputs/CurrencyInput.vue'
import SnackBar from '@/components/SnackBar.vue'
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { IconUserPlus, IconReceipt2, IconCash, IconCreditCard, IconTransferVertical, IconSearch, IconUser, IconX, IconPlus } from '@tabler/icons-vue'
import { PaymentPayload, PaymentMethods, CreateSalePayload, SaleStatus, SaleDetailPayload, Response, TaxDetail } from '@/api/interfaces'
import { getPaymentMethodName } from '@/utils/Payments'
import { createSale, printSaleTicket, setBranchLogo } from '@/api/electron'
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useBranch } from '@/composables/useBranch'
import { useCashRegister } from '@/composables/useCashRegister'
import { useCustomer } from '@/composables/useCustomer'
import { useUser } from '@/composables/useUser'
import { useCompany } from '@/composables/useCompany'
import { useConfiguration } from '@/composables/useConfiguration'
import { toast } from 'vue3-toastify'
import { Snackbar } from '@/types/Snackbar'
import { getCustomers } from '@/api/electron'
import { parseAmount, fixedAmount } from '@/utils/Payments'

const { formatCurrency, formatWithoutSymbol } = useCurrency()

const {
  currentCart,
  currentCartTotal,
  currentCartSubtotal,
  currentCartDiscount,
  currentCartTax,
  currentCartProductsWithDiscount,
  currentCartTaxesPerProduct,
  clearCurrentCart,
} = useProduct()

const { company } = useCompany()
const { configuration } = useConfiguration()
const { saleFolio, branch, generateFolio } = useBranch()
const { user } = useUser()
const { cashRegister } = useCashRegister()
const { getActiveCustomers, customerCurrentSale, setCustomerCurrentSale, clearCustomerCurrentSale, setCustomers } = useCustomer()

/**
 * *************** Select client ***************
 */
const showSelectClientModal = ref(false)
const dialogSelectClientRef = ref()
const searchClient = ref('')

const openSelectClientModal = () => {
  showSelectClientModal.value = true
  dialogSelectClientRef.value.showModal()
}

const closeSelectClientModal = () => {
  showSelectClientModal.value = false
  dialogSelectClientRef.value.close()
}

const filteredCustomers = computed(() => {
  return getActiveCustomers.value.filter((customer) => {
    return customer.name.toLowerCase().includes(searchClient.value.toLowerCase())
  })
})

const getAllCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    toast.error('Error al obtener los clientes')
    return
  }
  setCustomers(response.response)
}

/*
 * *************** Payment Sale ***************
 */
const paymentQuantity = ref('')
const showPaymentModal = ref(false)
const dialogPaymentSaleRef = ref()
const currencyInputRef = ref()
const multipleCurrencyInputRef = ref()
const snackbarPayment = reactive<Snackbar>({
  show: false,
  message: '',
  type: 'warning',
})

const openPaymentModal = () => {
  showPaymentModal.value = true
  dialogPaymentSaleRef.value.showModal()
  currencyInputRef.value.focus()
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  dialogPaymentSaleRef.value.close()
  paymentQuantity.value = ''
  onePaymentMethod.value.payment_method = PaymentMethods.CASH
  onePaymentMethod.value.amount = 0
  saleComments.value = ''
  printTicket.value = true
  multiplePaymentMethods.value = false
  selectPaymentMethod(PaymentMethods.CASH)
  resetPaymentMethods()
}

const editPaymentQuantity = (value: string) => {
  if (isCurrencyInputDisabled.value) return
  paymentQuantity.value += value
}
const removePaymentQuantity = () => {
  if (isCurrencyInputDisabled.value) return
  paymentQuantity.value = paymentQuantity.value.slice(0, -1)
}

const multiplePaymentMethods = ref(false)
const paymentMethodsOptions = [
  { id: PaymentMethods.CASH, name: 'Efectivo', icon: IconCash },
  { id: PaymentMethods.CARD, name: 'Tarjeta', icon: IconCreditCard },
  { id: PaymentMethods.TRANSFER, name: 'Transferencia', icon: IconTransferVertical },
  { id: PaymentMethods.OTHER, name: 'Otro' },
]

const onePaymentMethod = ref<PaymentPayload>({
  payment_method: PaymentMethods.CASH,
  amount: 0,
})

const paymentMethods = ref<Array<PaymentPayload & { id: string }>>([
  {
    id: Math.random().toString(),
    payment_method: PaymentMethods.CASH,
    amount: 0,
  },
])

watch(multiplePaymentMethods, () => {
  if (multiplePaymentMethods.value) {
    if (paymentMethods.value.length === 0) {
      paymentMethods.value.push({
        id: Math.random().toString(),
        payment_method: PaymentMethods.CASH,
        amount: 0,
      })
    } else if (paymentMethods.value.length === 1) {
      selectPaymentMethodEdit(paymentMethods.value[0])
    } else {
      selectedPaymentMethodEdit.value = null
    }
  }
})

const availablePaymentMethods = computed(() => {
  return paymentMethodsOptions.filter((method) => {
    return method.id !== PaymentMethods.CASH || !paymentMethods.value.some((payment) => payment.payment_method === PaymentMethods.CASH)
  })
})

const selectedPaymentMethodEdit = ref<PaymentPayload & { id: string } | null>(null)

const selectPaymentMethodEdit = (method: PaymentPayload & { id: string }) => {
  selectedPaymentMethodEdit.value = method
  nextTick(() => {
    if (multipleCurrencyInputRef.value) {
      multipleCurrencyInputRef.value.focus()
    }
  })
}

const editCurrentPaymentMethodAmount = (value: string) => {
  if (!selectedPaymentMethodEdit.value) return
  let currentAmount = selectedPaymentMethodEdit.value.amount.toString()
  currentAmount += value
  selectedPaymentMethodEdit.value.amount = parseAmount(currentAmount)
  setAmountOnSelectedPaymentMethod(selectedPaymentMethodEdit.value.amount)
}

const removeCurrentPaymentMethodAmount = () => {
  if (!selectedPaymentMethodEdit.value) return
  let currentAmount = selectedPaymentMethodEdit.value.amount.toString()
  currentAmount = currentAmount.slice(0, -1)
  selectedPaymentMethodEdit.value.amount = parseAmount(currentAmount)
  setAmountOnSelectedPaymentMethod(selectedPaymentMethodEdit.value.amount)
}

const setAmountOnSelectedPaymentMethod = (amount: number) => {
  const findIndex = paymentMethods.value.findIndex((payment) => payment.id === selectedPaymentMethodEdit.value?.id)
  if (findIndex !== -1) {
    paymentMethods.value[findIndex].amount = amount
  }
}

const removePaymentMethod = (method: PaymentPayload & { id: string }) => {
  paymentMethods.value.splice(paymentMethods.value.indexOf(method), 1)
  selectedPaymentMethodEdit.value = null
}

const resetPaymentMethods = () => {
  paymentMethods.value = [
    {
      id: Math.random().toString(),
      payment_method: PaymentMethods.CASH,
      amount: 0,
    },
  ]
}

const selectPaymentMethod = async (method: PaymentMethods) => {
  switch (method) {
  case PaymentMethods.CASH:
    onePaymentMethod.value.payment_method = PaymentMethods.CASH
    nextTick(() => {
      currencyInputRef.value?.focus()
    })
    break
  case PaymentMethods.CARD:
    onePaymentMethod.value.payment_method = PaymentMethods.CARD
    paymentQuantity.value = currentCartTotal.value.toString()
    break
  case PaymentMethods.TRANSFER:
    onePaymentMethod.value.payment_method = PaymentMethods.TRANSFER
    paymentQuantity.value = currentCartTotal.value.toString()
    break
  case PaymentMethods.OTHER:
    onePaymentMethod.value.payment_method = PaymentMethods.OTHER
    break
  }
}

const isCurrencyInputDisabled = computed(() => {
  return onePaymentMethod.value.payment_method !== PaymentMethods.CASH
})

const cashPaymentChange = computed(() => {
  if (multiplePaymentMethods.value) {
    const total = paymentMethods.value.reduce((acc, payment) => acc + payment.amount, 0)
    return Math.max(0, total - currentCartTotal.value)
  }
  const payment = parseAmount(paymentQuantity.value)
  return !payment ? 0 : Math.max(0, payment - currentCartTotal.value)
})

const saleComments = ref('')

// Show Dialog Payment Error Snackbar
type SnackbarType = 'warning' | 'error' | 'success'
const showSnackbarPaymentError = (message: string, type: SnackbarType = 'warning') => {
  snackbarPayment.message = message
  snackbarPayment.type = type
  snackbarPayment.show = true
}

// Validate if customer has available credit
const validateCustomerCredit = () => {
  const availableCredit = (customerCurrentSale.value?.credit_limit ?? 0) - (customerCurrentSale.value?.used_credit ?? 0)
  if (customerCurrentSale.value && availableCredit < currentCartTotal.value) {
    showSnackbarPaymentError('El cliente no tiene crédito disponible')
    return false
  }
  return true
}

/*
  * *************** Create Sale ***************
*/

const createCurrentSale = () => {
  if (currentCart.value.length === 0) return
  if (!cashRegister.value) return
  if (isPaidAmountLowerThanTotal.value && !customerCurrentSale.value) {
    showSnackbarPaymentError('Debes asignar un cliente para realizar una venta a crédito')
    return
  }
  if (multiplePaymentMethods.value && paymentMethods.value.every((payment) => payment.payment_method !== PaymentMethods.CASH)) {
    showSnackbarPaymentError('La suma de los pagos no puede ser mayor a la cantidad total')
    return
  }
  if (isPaidAmountLowerThanTotal.value && !validateCustomerCredit()) {
    showSnackbarPaymentError('El cliente no tiene crédito disponible')
    return
  }
  const details: SaleDetailPayload[] = currentCart.value.map((product) => {
    const productWithDiscount = currentCartProductsWithDiscount.value.find((p) => p.id === product.id)
    return {
      id_product: product.id,
      product_name: product.name,
      quantity: product.quantity,
      selling_price: product.selling_price,
      tax_amount: currentCartTaxesPerProduct.value.find((tax) => tax.id === product.id)?.tax_amount ?? 0,
      taxes: product.taxes.map((tax): TaxDetail => {
        return {
          code: tax.code,
          type: tax.type,
          value: tax.value ?? null,
          fixed: tax.type === 'tasa' ? (product.subtotal * (tax.value! / 100) / product.quantity)
            : tax.type === 'cuota' ? tax.value! * 100 : 0,
        }
      }),
      discount: productWithDiscount?.discount_amount ?? 0,
      total: product.selling_price * product.quantity - (productWithDiscount?.discount_amount ?? 0),
      profit: (product.selling_price - product.purchase_price) * product.quantity - (productWithDiscount?.discount_amount ?? 0),
    }
  })
  const payments: PaymentPayload[] = paymentMethods.value.map((payment) => ({
    payment_method: payment.payment_method,
    amount: payment.amount,
    change: payment.payment_method === PaymentMethods.CASH ? cashPaymentChange.value : 0,
  }))
  const payload: CreateSalePayload = {
    sale: {
      id_company: branch.value.id_company,
      id_branch: branch.value.id,
      id_seller: user.value.id,
      id_cash_register: cashRegister.value.id,
      id_customer: customerCurrentSale.value?.id,
      folio: saleFolio.value,
      subtotal: fixedAmount(currentCartSubtotal.value),
      total: fixedAmount(currentCartTotal.value),
      amount_paid: isPaidAmountLowerThanTotal.value ? fixedAmount(parseAmount(paymentQuantity.value)) : fixedAmount(currentCartTotal.value),
      balance_due: isPaidAmountLowerThanTotal.value ? fixedAmount(currentCartTotal.value - parseAmount(paymentQuantity.value)) : 0,
      discount: currentCartDiscount.value,
      tax: fixedAmount(currentCartTax.value),
      on_trust: isPaidAmountLowerThanTotal.value,
      due_date: isPaidAmountLowerThanTotal.value ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : undefined,
      status: getStatusSale(),
      customer_notes: saleComments.value.trim(),
      is_ticket_printed: printTicket.value,
    },
    details,
    payments: multiplePaymentMethods.value ? payments : [
      {
        payment_method: onePaymentMethod.value.payment_method,
        amount: parseAmount(paymentQuantity.value) - fixedAmount(cashPaymentChange.value),
        change: fixedAmount(cashPaymentChange.value),
      },
    ],
  }

  createSale(payload, (response: Response<any>) => {
    if (response.success) {
      toast.success('Venta realizada con éxito')
      handlePrintTicket()
      closePaymentModal()
      generateFolio()
      clearCurrentCart()
      clearCustomerCurrentSale()
      getAllCustomers()
    } else {
      showSnackbarPaymentError('Ha ocurrido un error al realizar la venta', 'error')
    }
  })
}

const printTicket = ref(true)

const getStatusSale = () => {
  let paidAmount = 0
  if (multiplePaymentMethods.value) {
    paidAmount = paymentMethods.value.reduce((acc, payment) => acc + payment.amount, 0)
  } else {
    paidAmount = parseAmount(paymentQuantity.value)
  }

  if (paidAmount >= currentCartTotal.value) return SaleStatus.PAID
  if (paidAmount === 0) return SaleStatus.PENDING
  return SaleStatus.PARTIALLY_PAID
}

const isPaidAmountLowerThanTotal = computed(() => {
  if (multiplePaymentMethods.value) {
    const total = paymentMethods.value.reduce((acc, payment) => acc + payment.amount, 0)
    return total < currentCartTotal.value
  }
  return parseAmount(paymentQuantity.value) < currentCartTotal.value
})


// PRINT TICKET
const handlePrintTicket = () => {
  const paymentMethodsInSale = multiplePaymentMethods.value ? paymentMethods.value : [
    {
      payment_method: onePaymentMethod.value.payment_method,
      amount: parseAmount(paymentQuantity.value) - fixedAmount(cashPaymentChange.value),
    },
  ]

  const amountGiven = multiplePaymentMethods.value ? paymentMethods.value.reduce((acc, payment) => acc + payment.amount, 0) : parseAmount(paymentQuantity.value)

  const saleTicketPayload = {
    businessInfo: {
      businessName: company.value.trade_name,
      legalName: company.value.legal_name,
      address: `${company.value.fiscal_address}, ${company.value.neighborhood}, ${company.value.postal_code.toString()}`,
      location: `${company.value.municipality}, ${company.value.state}, ${company.value.country}`,
      rfc: company.value.tax_id,
      branchInfo: branch.value.branch_name,
    },
    ticketInfo: {
      ticketId: saleFolio.value,
      cashier: branch.value.branch_alias,
      attendedBy: user.value.name,
      date: new Date(),
    },
    items: currentCart.value.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: formatWithoutSymbol(product.selling_price),
      subtotal: formatWithoutSymbol(product.selling_price * product.quantity),
    })),
    paymentInfo: {
      total: formatWithoutSymbol(currentCartTotal.value),
      tax: formatWithoutSymbol(currentCartTax.value),
      paymentMethods: paymentMethodsInSale.map((payment) => ({
        name: paymentMethodsOptions.find((method) => method.id === payment.payment_method)?.name,
        amount: formatWithoutSymbol(payment.amount),
      })),
      amountGiven: formatWithoutSymbol(amountGiven),
      change: formatWithoutSymbol(cashPaymentChange.value),
    },
    invoiceInstructions: 'SIN INSTRUCCIONES',
    invoiceUrl: 'https://mitienda.app',
    qrCode: 'https://mitienda.app',
    thankYouMessage: 'Gracias por su compra',
    businessUrl: 'https://mitienda.app',
  }

  const printer = printTicket.value ? configuration.value.default_printer : null
  printSaleTicket(printer, saleTicketPayload, (response: Response<any>) => {
    if (!response.success) {
      toast.error('Error al imprimir el ticket')
    }
  })
}

const selectImage = (setDefaultImage = false) => {
  setBranchLogo(setDefaultImage, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Logo actualizado')
  })
}

</script>
