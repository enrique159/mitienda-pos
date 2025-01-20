<template>
  <section
    class="w-full grid grid-cols-12 bg-white pb-1 pt-3 px-3 border-t border-gray-200"
  >
    <div class="col-span-8 flex justify-between items-start pl-4 pr-8">
      <div class="flex items-center gap-2">
        <base-button class="flex items-center gap-1">
          Agregar cliente
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
        <div class="col-span-7 pb-6">
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
              >
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              class="px-4 h-12 rounded-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              :class="[ onePaymentMethod.payment_method === method.id ? 'bg-brand-black text-white' : 'text-black-1 bg-white-2 hover:bg-white-3' ]"
              @click="selectPaymentMethod(method.id)"
            >
              <component v-if="method.icon" :is="method.icon" :size="21" />
              {{ method.name }}
            </button>
          </div>

          <!-- DIVIDER -->
          <div class="border-b border-gray-200 mb-4" />

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
          <button
            class="btn btn-lg bg-brand-pink hover:bg-brand-orange text-white w-3/4 mt-4"
            @click="createCurrentSale"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/inputs/CurrencyInput.vue'
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { IconUserPlus, IconReceipt2, IconCash, IconCreditCard, IconTransferVertical } from '@tabler/icons-vue'
import { PaymentPayload, PaymentMethods, CreateSalePayload, SaleStatus, SaleDetailPayload, Response } from '@/api/interfaces'
import { createSale } from '@/api/electron'
import { ref } from 'vue'
import { computed } from 'vue'
import { useBranch } from '@/composables/useBranch'
import { useUser } from '@/composables/useUser'
import { toast } from 'vue3-toastify'
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

/*
 * *************** Payment Sale ***************
 */
const paymentQuantity = ref('')
const showPaymentModal = ref(false)
const dialogPaymentSaleRef = ref()
const currencyInputRef = ref()

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
const paymentMethods = [
  { id: PaymentMethods.CASH, name: 'Efectivo', icon: IconCash },
  { id: PaymentMethods.CARD, name: 'Tarjeta', icon: IconCreditCard },
  { id: PaymentMethods.TRANSFER, name: 'Transferencia', icon: IconTransferVertical },
  { id: PaymentMethods.OTHER, name: 'Otro' },
]

const onePaymentMethod = ref<PaymentPayload>({
  payment_method: PaymentMethods.CASH,
  amount: 0,
})

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
  if (paymentQuantity.value === '') return 0
  return parseFloat(paymentQuantity.value) - currentCartTotal.value < 0
    ? 0
    : parseFloat(paymentQuantity.value) - currentCartTotal.value
})

const saleComments = ref('')

/*
  * *************** Create Sale ***************
*/

const createCurrentSale = () => {
  if (currentCart.value.length === 0) return
  const details: SaleDetailPayload[] = currentCart.value.map((product) => {
    return {
      id_product: product.id,
      product_name: product.name,
      quantity: product.quantity,
      selling_price: product.selling_price,
      tax_rate: product.tax_rate,
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
      id_customer: undefined,
      folio: saleFolio.value,
      subtotal: currentCartSubtotal.value,
      total: currentCartTotal.value,
      amount_paid: currentCartTotal.value,
      balance_due: 0,
      discount: currentCartDiscount.value,
      tax: currentCartTax.value,
      on_trust: false,
      due_date: undefined,
      status: SaleStatus.PAID,
      customer_notes: saleComments.value.trim(),
    },
    details,
    payments: [
      {
        payment_method: onePaymentMethod.value.payment_method,
        amount: parseFloat(paymentQuantity.value),
      },
    ],
  }

  createSale(payload, (response: Response<any>) => {
    if (response.success) {
      toast.success('Venta realizada con éxito')
      closePaymentModal()
      generateFolio()
      clearCurrentCart()
    } else {
      toast.error('Ha ocurrido un error al realizar la venta')
    }
  })
}
</script>

<style scoped></style>
