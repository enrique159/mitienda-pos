<template>
  <div
    class="w-full h-full bg-brand-orange p-6 flex flex-col items-start gap-2 relative"
  >
    <router-link
      :to="{ name: 'Starting' }"
      role="button"
      class="btn btn-ghost btn-lg rounded-full text-white-1 absolute top-6 left-6"
    >
      <IconArrowLeft />
      Regresar
    </router-link>

    <div class="w-full flex flex-col items-center justify-center pt-6 mb-6">
      <h1 class="text-4xl font-bold text-white-1 mb-2">Comencemos</h1>
      <SetupStepper :steps="steps" :active-step="activeStep" />
    </div>

    <component
      :is="components[activeStep]"
      :userData="userData"
      @nextStep="handleNextStep"
    />
  </div>
</template>

<script setup lang="ts">
import SetupStepper from '@/components/SetupStepper.vue'
import UserForm from '@/views/setup/components/UserForm.vue'
import CompanyForm from '@/views/setup/components/CompanyForm.vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { reactive, ref } from 'vue'

const steps = ['Cuenta principal', 'Datos del negocio', 'Usuarios', 'Productos']

const components = [UserForm, CompanyForm]

const activeStep = ref(0)

// USER DATA STEP 0
const userData = reactive({
  name: '',
  email: '',
  password: '',
})
const setUserData = (data: any) => {
  userData.name = data.name
  userData.email = data.email
  userData.password = data.password
}

const handleNextStep = (data: any) => {
  switch (activeStep.value) {
    case 0:
      setUserData(data)
      break
    default:
      break
  }
  activeStep.value++
}
</script>
