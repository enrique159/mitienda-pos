<template>
  <section
    class="w-full grid grid-cols-12 bg-white pb-1 pt-3 px-3 border-t border-gray-200"
  >
    <div class="col-span-8 flex justify-between items-start pl-4 pr-8">
      <div class="flex items-center gap-2">
        <div v-if="customerCurrentSale" class="border border-white-3 rounded-lg px-3 pr-1 h-10 text-sm max-w-48 overflow-x-hidden flex items-center gap-2">
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

        <base-button> Cuenta pendiente </base-button>
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
            Total
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

              <p>Impuestos (IVA)</p>
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
              :key="`payment-method-card-${method.payment_method}`"
              class="bg-white min-w-[128px] rounded-lg py-1 px-3 relative border-4 transition-all cursor-pointer"
              :class="[
                selectedPaymentMethodEdit && selectedPaymentMethodEdit.payment_method === method.payment_method
                  ? 'border-brand-blue shadow-lg' : 'border-white shadow-md'
              ]"
              @click="selectPaymentMethodEdit(method)"
            >
              <p class="text-sm font-medium text-black-1">
                {{ getPaymentMethodName(method.payment_method) }}
              </p>
              <span class="font-bold text-lg">{{ formatCurrency(method.amount) }}</span>
              <button class="btn bg-black-3 text-black-1 hover:text-white hover:bg-red-500 hover:border-red-400 btn-circle btn-xs absolute -top-2 -right-2" @click="() => paymentMethods.splice(paymentMethods.indexOf(method), 1)">
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
                    paymentMethods.push({ payment_method: method.id, amount: 0 });
                    selectPaymentMethodEdit(paymentMethods[paymentMethods.length - 1])
                    currencyInputRef.focus()
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

          <div v-if="customerCurrentSale" class="w-full border border-white-3 rounded-lg p-4 mb-4">
            <p class="text-black-1 font-normal">
              Cliente: <span class="font-bold">{{ customerCurrentSale.name }}</span>
            </p>
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
          <div class="grid grid-cols-1 gap-4 w-full place-items-center">
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
import { PaymentPayload, PaymentMethods, CreateSalePayload, SaleStatus, SaleDetailPayload, Response } from '@/api/interfaces'
import { getPaymentMethodName } from '@/utils/Payments'
import { createSale } from '@/api/electron'
import { ref, reactive, computed, watch } from 'vue'
import { useBranch } from '@/composables/useBranch'
import { useCashRegister } from '@/composables/useCashRegister'
import { useCustomer } from '@/composables/useCustomer'
import { useUser } from '@/composables/useUser'
import { toast } from 'vue3-toastify'
import { Snackbar } from '@/types/Snackbar'
import { parseAmount, fixedAmount } from '@/utils/Payments'

const { formatCurrency } = useCurrency()

const {
  currentCart,
  currentCartTotal,
  currentCartSubtotal,
  currentCartDiscount,
  currentCartTax,
  clearCurrentCart,
} = useProduct()

const { saleFolio, branch, generateFolio } = useBranch()
const { user } = useUser()
const { cashRegister } = useCashRegister()
const { getActiveCustomers, customerCurrentSale, setCustomerCurrentSale, clearCustomerCurrentSale } = useCustomer()

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

/*
 * *************** Payment Sale ***************
 */
const paymentQuantity = ref('')
const showPaymentModal = ref(false)
const dialogPaymentSaleRef = ref()
const currencyInputRef = ref()
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

const paymentMethods = ref<PaymentPayload[]>([
  {
    payment_method: PaymentMethods.CASH,
    amount: 0,
  },
])

watch(multiplePaymentMethods, () => {
  if (multiplePaymentMethods.value) {
    if (paymentMethods.value.length === 0) {
      paymentMethods.value.push({
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
    return !paymentMethods.value.some((payment) => payment.payment_method === method.id)
  })
})

const selectedPaymentMethodEdit = ref<PaymentPayload | null>(null)

const selectPaymentMethodEdit = (method: PaymentPayload) => {
  selectedPaymentMethodEdit.value = method
  currencyInputRef.value.focus()
}

const resetPaymentMethods = () => {
  paymentMethods.value = [
    {
      payment_method: PaymentMethods.CASH,
      amount: 0,
    },
  ]
}

const selectPaymentMethod = (method: PaymentMethods) => {
  switch (method) {
  case PaymentMethods.CASH:
    onePaymentMethod.value.payment_method = PaymentMethods.CASH
    currencyInputRef.value.focus()
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
  const payment = parseAmount(paymentQuantity.value)
  return !payment ? 0 : Math.max(0, payment - currentCartTotal.value)
})

const saleComments = ref('')

// Show Dialog Payment Error Snackbar
const showSnackbarPaymentError = (message: string) => {
  snackbarPayment.message = message
  snackbarPayment.show = true
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
  const details: SaleDetailPayload[] = currentCart.value.map((product) => {
    return {
      id_product: product.id,
      product_name: product.name,
      quantity: product.quantity,
      selling_price: product.selling_price,
      tax_amount: product.taxes.reduce((acc, tax) => acc + (tax.fixed ?? 0), 0),
      // TODO: Integrar los descuentos
      discount: 0,
      total: product.selling_price * product.quantity,
      profit: (product.selling_price - product.purchase_price) * product.quantity,
    }
  })
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
      change: fixedAmount(cashPaymentChange.value),
      discount: currentCartDiscount.value,
      tax: fixedAmount(currentCartTax.value),
      on_trust: isPaidAmountLowerThanTotal.value,
      due_date: isPaidAmountLowerThanTotal.value ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : undefined,
      status: getStatusSale(),
      customer_notes: saleComments.value.trim(),
      is_ticket_printed: printTicket.value,
    },
    details,
    payments: [
      {
        payment_method: onePaymentMethod.value.payment_method,
        amount: parseAmount(paymentQuantity.value) - fixedAmount(cashPaymentChange.value),
      },
    ],
  }

  createSale(payload, (response: Response<any>) => {
    if (response.success) {
      toast.success('Venta realizada con éxito')
      closePaymentModal()
      generateFolio()
      clearCurrentCart()
      clearCustomerCurrentSale()
    } else {
      toast.error('Ha ocurrido un error al realizar la venta')
    }
  })
}

const printTicket = ref(true)

const getStatusSale = () => {
  const paidAmount = parseAmount(paymentQuantity.value)

  if (paidAmount >= currentCartTotal.value) return SaleStatus.PAID
  if (paidAmount === 0) return SaleStatus.PENDING
  return SaleStatus.PARTIALLY_PAID
}

const isPaidAmountLowerThanTotal = computed(() => {
  return parseAmount(paymentQuantity.value) < currentCartTotal.value
})
</script>

<style scoped></style>
