<template>
  <div class="w-full h-full flex flex-col items-center justify-start">
    <h2 class="text-xl font-semibold text-white-1">Datos de tu cuenta</h2>
    <p class="text-white-2 text-sm mb-4 text-center">
      Esta información se usará para iniciar sesión en el punto de venta como
      administrador
    </p>

    <form class="w-full h-fit max-w-3xl" @submit.prevent="handleSubmit">
      <div
        class="w-full min-h-[400px] grid grid-cols-4 gap-4 place-content-start"
      >
        <!-- NAME -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="label-text text-white-1">Nombre</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Carlos García"
            v-model="formData.name"
            class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
          />
          <InputErrors :errors="v$.name.$errors" text-color="text-red-700" />
        </div>

        <!-- EMAIL -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="label-text text-white-1">Correo electrónico</span>
          </label>
          <input
            type="email"
            placeholder="Ej. carlos@mitienda.com"
            v-model="formData.email"
            class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
          />
          <InputErrors :errors="v$.email.$errors" text-color="text-red-700" />
        </div>

        <!-- PASSWORD -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="label-text text-white-1">Contraseña</span>
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Agrega tu contraseña"
              v-model="formData.password"
              class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
            />
            <button
              type="button"
              tabindex="-1"
              class="btn btn-sm btn-ghost btn-circle absolute top-2 right-2 text-white-1"
              @click="showPassword = !showPassword"
            >
              <IconEye size="16" v-if="showPassword" />
              <IconEyeOff size="16" v-else />
            </button>
          </div>
          <InputErrors
            :errors="v$.password.$errors"
            text-color="text-red-700"
          />
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="form-control col-span-2">
          <label class="label">
            <span class="label-text text-white-1">Confirmar contraseña</span>
          </label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirma tu contraseña"
              v-model="formData.confirmPassword"
              class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
            />
            <button
              type="button"
              tabindex="-1"
              class="btn btn-sm btn-ghost btn-circle absolute top-2 right-2 text-white-1"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <IconEye size="16" v-if="showConfirmPassword" />
              <IconEyeOff size="16" v-else />
            </button>
          </div>
          <InputErrors
            :errors="v$.confirmPassword.$errors"
            text-color="text-red-700"
          />
        </div>
      </div>

      <div class="w-full flex justify-end items-center">
        <!-- <BaseButton
          type="button"
          class="w-fit flex items-center gap-2"
          tabindex="-1"
          @click="emit('prevStep')"
        >
          <IconArrowLeft size="16" />
          Regresar
        </BaseButton> -->

        <BaseButton type="submit" class="w-fit flex items-center gap-2">
          Continuar
          <IconArrowRight size="16" />
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { toast } from '@/composables/useToast'
import { onMounted, reactive, ref } from 'vue'
import { IconArrowRight, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { strongPassword } from '@/utils/Validators'

interface UserData {
  name: string
  email: string
  password: string
}

const props = defineProps({
  userData: {
    type: Object as () => UserData,
    default: () => ({}),
  },
})
const emit = defineEmits(['nextStep'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  name: {
    required: helpers.withMessage('El nombre es requerido', required),
  },
  email: {
    required: helpers.withMessage(
      'El correo electrónico es requerido',
      required
    ),
    email: helpers.withMessage('El correo electrónico no es válido', email),
  },
  password: {
    required: helpers.withMessage('La contraseña es requerida', required),
    strongPassword: helpers.withMessage(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
      strongPassword
    ),
  },
  confirmPassword: {
    required: helpers.withMessage(
      'La confirmación de contraseña es requerida',
      required
    ),
    sameAsPassword: helpers.withMessage(
      'Las contraseñas no coinciden',
      (value) => value === formData.password
    ),
  },
}

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    return toast.warning('Por favor, corrige los errores en el formulario')
  }

  const data = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  }
  emit('nextStep', data)
}

onMounted(() => {
  if (props.userData) {
    formData.name = props.userData.name
    formData.email = props.userData.email
    formData.password = props.userData.password
    formData.confirmPassword = props.userData.password
    v$.value.$reset()
  }
})
</script>
