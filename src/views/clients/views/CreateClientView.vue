<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Crear nuevo cliente
    </h6>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Nombre completo</span>
          </div>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Ej. Juan Pérez"
            class="input input-bordered w-full"
          >
          <div
            v-for="(error, index) in v$.name.$errors"
            :key="`error-name-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">RFC</span>
          </div>
          <input
            id="rfc"
            v-model="formData.rfc"
            maxlength="13"
            type="text"
            placeholder="Ej. XXXX1122334X5"
            class="input input-bordered w-full"
          >
          <div
            v-for="(error, index) in v$.rfc.$errors"
            :key="`error-rfc-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Email</span>
          </div>
          <input
            id="email"
            v-model="formData.email"
            type="text"
            placeholder="Ej. juan.perez@email.com"
            class="input input-bordered w-full"
          >
          <div
            v-for="(error, index) in v$.email.$errors"
            :key="`error-email-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Teléfono</span>
          </div>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            maxlength="10"
            placeholder="Ej. 555555555"
            @keypress="validateOnlyNumbers"
            class="input input-bordered w-full"
          >
          <div
            v-for="(error, index) in v$.phone.$errors"
            :key="`error-phone-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <label class="form-control w-full md:col-span-2">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Dirección</span>
          </div>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="Ej. Calle 123, Colonia 12345, Ciudad, Estado"
          />
          <div
            v-for="(error, index) in v$.address.$errors"
            :key="`error-address-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>
      </div>

      <!-- Nuevos campos para crédito -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <!-- HAS CREDIT -->
        <div class="form-control col-span-2">
          <label class="label cursor-pointer w-fit">
            <input
              type="checkbox"
              class="checkbox"
              :checked="formData.has_credit"
              @change="formData.has_credit = !formData.has_credit"
            >
            <div class="flex flex-col items-start ml-2">
              <span class="font-semibold text-black-1 mr-2">Tiene crédito</span>
              <span class="text-sm text-black-2">
                El cliente puede comprar a crédito
              </span>
            </div>
          </label>
        </div>

        <!-- CREDIT LIMIT -->
        <label v-if="formData.has_credit" class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Límite de crédito</span>
          </div>
          <div class="relative w-full">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="credit_limit"
              v-model.number="formData.credit_limit"
              type="number"
              min="0"
              class="input input-bordered w-full pl-8"
              @keypress="validateOnlyNumbers"
            >
          </div>
          <div
            v-for="(error, index) in v$.credit_limit.$errors"
            :key="`error-credit_limit-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- DAYS UNTIL DUE -->
        <label v-if="formData.has_credit" class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Días hasta vencimiento</span>
          </div>
          <input
            id="days_until_due"
            v-model.number="formData.days_until_due"
            type="number"
            min="1"
            class="input input-bordered w-full"
          >
          <div
            v-for="(error, index) in v$.days_until_due.$errors"
            :key="`error-days_until_due-${index}`"
          >
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>
      </div>

      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="$router.back()">
          Cancelar
        </base-button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
        >
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { minLength, required, helpers, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createCustomer } from '@/api/electron'
import { CreateCustomer, Response } from '@/api/interfaces'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { useBranch } from '@/composables/useBranch'
import { toast } from 'vue3-toastify'

const { branch } = useBranch()
const router = useRouter()

const formData = reactive({
  id_company: '',
  name: '',
  rfc: '',
  email: '',
  phone: '',
  address: '',
  has_credit: false,
  credit_limit: 1000,
  days_until_due: 30,
})

// Validadores personalizados para campos dependientes de has_credit
const creditRequired = helpers.withMessage(
  'Campo requerido si tiene crédito',
  (value: any) => !formData.has_credit || !!value || value === 0
)
const minCreditLimit = helpers.withMessage(
  'Debe ser mayor o igual a 0',
  (value: any) => !formData.has_credit || value >= 0
)
const minDaysUntilDue = helpers.withMessage(
  'Debe ser mayor o igual a 1',
  (value: any) => !formData.has_credit || value >= 1
)

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('El campo es requerido', required),
      minLength: helpers.withMessage(
        `Este campo requiere al menos 3 caracteres`,
        minLength(3)
      ),
    },
    rfc: {
      minLength: helpers.withMessage(
        `Este campo requiere al menos 12 caracteres`,
        minLength(12)
      ),
    },
    email: {
      email: helpers.withMessage('El correo electrónico no es válido', email),
    },
    phone: {
      minLength: helpers.withMessage(
        `Este campo requiere al menos 10 caracteres`,
        minLength(10)
      ),
    },
    address: {
      minLength: helpers.withMessage(
        `Este campo requiere al menos 10 caracteres`,
        minLength(10)
      ),
    },
    has_credit: {},
    credit_limit: {
      creditRequired,
      minCreditLimit,
    },
    days_until_due: {
      creditRequired,
      minDaysUntilDue,
    },
  }
})

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  try {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
      toast.warn('Formulario no válido, revise los errores')
      return
    }
    const newCustomer: CreateCustomer = {
      id_company: branch.value.id_company,
      name: formData.name,
      rfc: formData.rfc,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      has_credit: formData.has_credit,
      credit_limit: formData.has_credit ? formData.credit_limit * 100 : 0,
      days_until_due: formData.has_credit ? formData.days_until_due : 10,
    }
    createCustomer(newCustomer, (response: Response<any>) => {
      if (!response.success) {
        toast.error(response.message)
      }
      toast.success('Cliente creado exitosamente')
      router.push('/main/clients')
    })
  } catch (error) {
    console.error('Error creating customer:', error)
  }
}
</script>

<style lang="scss" scoped></style>
