<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Crear nuevo cliente
    </h6>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block mb-2 pl-1 text-sm font-medium text-black-2 required">Nombre completo</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Ej. Juan Pérez"
            class="w-full p-2 border rounded-md"
          >
          <div v-for="(error, index) in v$.name.$errors" :key="`error-name-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </div>

        <div>
          <label for="rfc" class="block mb-2 pl-1 text-sm font-medium text-black-2">RFC</label>
          <input
            id="rfc"
            v-model="formData.rfc"
            maxlength="13"
            type="text"
            placeholder="Ej. XXXX1122334X5"
            class="w-full p-2 border rounded-md"
          >
          <div v-for="(error, index) in v$.rfc.$errors" :key="`error-rfc-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </div>

        <div>
          <label for="email" class="block mb-2 pl-1 text-sm font-medium text-black-2">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="text"
            placeholder="Ej. juan.perez@email.com"
            class="w-full p-2 border rounded-md"
          >
          <div v-for="(error, index) in v$.email.$errors" :key="`error-email-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </div>

        <div>
          <label for="phone" class="block mb-2 pl-1 text-sm font-medium text-black-2">Teléfono</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            maxlength="10"
            placeholder="Ej. 555555555"
            @keypress="validateOnlyNumbers"
            class="w-full p-2 border rounded-md"
          >
          <div v-for="(error, index) in v$.phone.$errors" :key="`error-phone-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </div>

        <div class=" md:col-span-2">
          <label for="address" class="block mb-2 pl-1 text-sm font-medium text-black-2">Dirección</label>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            class="w-full p-2 border rounded-md"
            placeholder="Ej. Calle 123, Colonia 12345, Ciudad, Estado"
          />
          <div v-for="(error, index) in v$.address.$errors" :key="`error-address-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <base-button
          type="button"
          @click="$router.back()"
        >
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
})

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('El campo es requerido', required),
      minLength: helpers.withMessage(`Este campo requiere al menos 3 caracteres`, minLength(3)),
    },
    rfc: { minLength: helpers.withMessage(`Este campo requiere al menos 12 caracteres`, minLength(12)) },
    email: { email: helpers.withMessage('El correo electrónico no es válido', email) },
    phone: { minLength: helpers.withMessage(`Este campo requiere al menos 10 caracteres`, minLength(10)) },
    address: { minLength: helpers.withMessage(`Este campo requiere al menos 10 caracteres`, minLength(10)) },
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
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
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

<style lang="scss" scoped>

</style>