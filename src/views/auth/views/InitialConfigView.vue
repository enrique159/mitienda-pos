<template>
  <div
    class="w-full h-full bg-brand-orange p-6 flex flex-col items-start gap-2"
  >
    <router-link
      :to="{ name: 'Login' }"
      role="button"
      class="btn btn-ghost btn-lg rounded-full text-white-1"
      :class="{ 'success-left': isSuccess }"
    >
      <icon-arrow-left />
      Regresar
    </router-link>
    <div class="w-full max-w-[1080px] h-[80%] grid grid-cols-2 mx-auto px-12">
      <!-- LEFT SIDE -->
      <div
        class="flex flex-col justify-center items-start"
        :class="{
          'success-left': isSuccess,
        }"
      >
        <h6 class="text-white-1 text-3xl font-bold mb-8">
          Configurar Punto de Venta
        </h6>
        <p class="text-white-2 mb-4">
          Perfecto. Ahora lo que necesitamos es que ingreses el correo
          electrónico de la cuenta principal, luego seleccione la sucursal donde
          se encuentra el punto de venta, ingrese el alias y PIN de seguridad
          para comenzar con la configuración.
        </p>

        <div class="flex items-start gap-2 text-white-3 text-sm">
          <IconInfoCircle />
          <span>
            Si aún no tienes un punto de venta creado, puedes crear uno nuevo
            desde el panel principal en
            <a
              href="#"
              @click.prevent="openExternalLink('https://mitiendapos.com')"
              class="text-brand-black/50 underline"
            >
              mitiendapos.com
            </a>
          </span>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div
        class="flex flex-col justify-center items-center"
        :class="{
          'success-right': isSuccess,
        }"
      >
        <div
          class="w-full max-w-[400px] h-full bg-brand-black/10 p-6 rounded-3xl"
        >
          <!-- STEP 1 -->
          <form v-if="step === 1" class="flex flex-col justify-between h-full">
            <!-- EMAIL -->
            <div class="form-control">
              <label class="label">
                <span class="label-text text-white-1">Correo electrónico</span>
              </label>
              <input
                type="text"
                placeholder="Ej. johndoe@domain.com"
                v-model="formDataSearchBranches.email"
                @keydown="validateOnlyEmail"
                class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
              >
              <InputErrors
                :errors="vSearchBranches$.email.$errors"
                text-color="text-red-600"
              />
            </div>

            <button
              type="button"
              class="btn bg-brand-black text-brand-white border-none hover:bg-brand-black/50 w-full"
              @click="fetchBranchesByEmail()"
            >
              <span v-if="isLoadingBranches" class="loading loading-spinner" />
              Continuar
            </button>
          </form>
          <!-- STEP 2 -->
          <form v-if="step === 2" class="flex flex-col justify-between h-full">
            <div>
              <!-- BRANCHES SELECTOR -->
              <div
                class="form-control"
                :class="{ hidden: isAvailableBranchesEmpty }"
              >
                <label class="label">
                  <span class="label-text text-white-1">Sucursal</span>
                </label>
                <select
                  v-model="formDataInitConfig.idBranch"
                  ref="branchSelect"
                  class="select text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
                >
                  <option disabled value="">
                    Selecciona una sucursal
                  </option>
                  <option
                    v-for="branch in availableBranches"
                    :key="branch.id"
                    :value="branch.id"
                  >
                    {{ branch.branchName }}
                  </option>
                </select>
                <InputErrors
                  :errors="vInitConfig$.idBranch.$errors"
                  text-color="text-red-600"
                />
              </div>

              <!-- ALIAS -->
              <div
                class="form-control"
                :class="{ hidden: isAvailableBranchesEmpty }"
              >
                <label class="label">
                  <span class="label-text text-white-1">Alias</span>
                </label>
                <input
                  type="text"
                  placeholder="Escribe el alias del Punto de venta"
                  v-model="formDataInitConfig.alias"
                  class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40 uppercase placeholder:lowercase"
                  @keydown="validateOnlyNumbersAndLetters"
                >
                <InputErrors
                  :errors="vInitConfig$.alias.$errors"
                  text-color="text-red-600"
                />
              </div>

              <!-- PIN -->
              <div
                class="form-control"
                :class="{ hidden: isAvailableBranchesEmpty }"
              >
                <label class="label">
                  <span class="label-text text-white-1">PIN de seguridad</span>
                </label>
                <input
                  type="password"
                  placeholder="escribe el PIN del punto de venta"
                  v-model="formDataInitConfig.pin"
                  @keydown="validateOnlyNumbers"
                  class="input text-white-1 bg-black-1/30 w-full placeholder:text-white/40"
                >
                <InputErrors
                  :errors="vInitConfig$.pin.$errors"
                  text-color="text-red-600"
                />
              </div>
            </div>

            <div class="space-y-2">
              <button
                type="button"
                class="btn btn-ghost text-white-1 w-full"
                @click="goBack()"
              >
                <IconArrowLeft />
                Regresar
              </button>
              <button
                type="button"
                class="btn bg-brand-black text-brand-white border-none hover:bg-brand-black/50 w-full"
                :disabled="isLoading"
                @click="handleSubmit()"
              >
                <span v-if="isLoading" class="loading loading-spinner" />
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { required, helpers, email, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-vue'
import {
  openExternalLink,
  initialConfiguration,
  getBranchesByEmail
} from '@/api/electron'
import { computed, nextTick, reactive, ref } from 'vue'
import {
  validateOnlyEmail,
  validateOnlyNumbers,
  validateOnlyNumbersAndLetters
} from '@/utils/InputValidators'
import { toast } from 'vue3-toastify'
import { Response } from '@/api/interfaces'
import { Branch } from '@/types/api/Branches'
import { useRouter } from 'vue-router'

const router = useRouter()

// STEPS
const step = ref(1)
const branchSelect = ref()

const formDataInitConfig = reactive({
  idBranch: '',
  alias: '',
  pin: '',
})

const rules = {
  idBranch: {
    required: helpers.withMessage('La sucursal es requerida', required),
  },
  alias: {
    required: helpers.withMessage('El alias es requerido', required),
  },
  pin: {
    required: helpers.withMessage('El PIN es requerido', required),
    minLength: helpers.withMessage(
      'El PIN debe tener al menos 4 caracteres',
      minLength(4)
    ),
  },
}

const vInitConfig$ = useVuelidate(rules, formDataInitConfig)

const isLoading = ref(false)
const isSuccess = ref(false)
const handleSubmit = async () => {
  vInitConfig$.value.$touch()
  const result = await vInitConfig$.value.$validate()
  if (!result)
    return toast.warn('Por favor, corrige los errores en el formulario')

  const payload = {
    idBranch: formDataInitConfig.idBranch,
    alias: formDataInitConfig.alias.toUpperCase().trim(),
    pin: formDataInitConfig.pin.trim(),
  }

  isLoading.value = true
  await initialConfiguration(payload, (response: Response<any>) => {
    if (response.success) {
      toast.success('Configuración exitosa')
      isSuccess.value = true
      setTimeout(() => {
        router.push({ name: 'Syncing' })
      }, 1000)
    } else {
      if (response.response instanceof Array) {
        for (const error of response.response) {
          toast.error(error)
        }
      } else {
        toast.error(response.response)
      }
    }
  })
  isLoading.value = false
}

// Branches
const formDataSearchBranches = reactive({
  email: '',
})

const rulesSearchBranches = {
  email: {
    required: helpers.withMessage(
      'El correo electrónico es requerido',
      required
    ),
    email: helpers.withMessage('El correo electrónico es inválido', email),
  },
}

const vSearchBranches$ = useVuelidate(
  rulesSearchBranches,
  formDataSearchBranches
)

const availableBranches = ref<Pick<Branch, 'id' | 'branchName'>[]>([])
const isLoadingBranches = ref(false)

const isAvailableBranchesEmpty = computed(
  () => availableBranches.value.length === 0
)

const fetchBranchesByEmail = async () => {
  vSearchBranches$.value.$touch()
  const result = await vSearchBranches$.value.$validate()
  if (!result)
    return toast.warn('Por favor, corrige los errores en el formulario')

  isLoadingBranches.value = true
  await getBranchesByEmail(
    formDataSearchBranches.email,
    (response: Response<Pick<Branch, 'id' | 'branchName'>[]>) => {
      if (response.success) {
        availableBranches.value = response.response
        step.value = 2
        nextTick(() => {
          if (branchSelect.value) {
            branchSelect.value.focus()
          }
        })
      } else {
        for (const error of response.response) {
          toast.error(error)
        }
      }
      isLoadingBranches.value = false
    }
  )
}

const goBack = () => {
  step.value = 1
  formDataSearchBranches.email = ''
  formDataInitConfig.idBranch = ''
  availableBranches.value = []
  vSearchBranches$.value.$reset()
  vInitConfig$.value.$reset()
}
</script>

<style lang="scss" scoped>
.success-left {
  animation: slideOutLeft 1s forwards;
}

.success-right {
  animation: slideOutRight 1s forwards;
}

@keyframes slideOutLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideOutRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
