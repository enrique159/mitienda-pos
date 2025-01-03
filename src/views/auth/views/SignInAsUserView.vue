<template>
  <div class="w-full h-full grid grid-cols-2">
    <section
      class="h-full col-span-1 bg-white-2 flex flex-col justify-between items-center py-8 px-6"
      @click.self="userSelected = null"
    >
      <div class="flex items-center gap-2">
        <img src="@/assets/logo_fill_orange.png" alt="Logo" class="w-16" />
        <div>
          <h1 class="text-brand-orange font-medium text-[2.5rem] leading-10">
            Mi Tienda
          </h1>
          <p class="text-brand-pink font-medium pl-1">
            El punto de venta ideal para ti
          </p>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-2 w-2/3 max-w-[380px]">
        <p class="text-lg font-bold mb-4 pl-1">Selecciona tu usuario</p>

        <div class="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
          <button
            v-for="user in users"
            :key="`user-card-${user.id}`"
            class="bg-white-1 border-4 shadow-card rounded-2xl p-4 w-full h-18 active:scale-[0.99] active:shadow-md transition-all"
            :class="[
              userSelected?.id === user.id
                ? 'border-brand-blue'
                : 'border-white-1',
            ]"
            @click="selectUser(user)"
          >
            <div class="flex items-center gap-4">
              <icon-user-circle class="w-8 h-8 text-brand-blue" />
              <p class="text-lg font-bold">{{ user.name }}</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <p class="text-black-3 text-sm text-center">
          Si tiene problemas para ingresar puede acceder <br>con la <router-link class="text-brand-pink underline" to="/admin/signin-as-admin">cuenta principal</router-link>
        </p>
      </div>
    </section>

    <!-- PIN INPUT -->
    <section
      class="h-full col-span-1 bg-white-1 flex flex-col gap-8 justify-center items-center"
    >
      <div class="flex items-center gap-2 w-full max-w-[240px]">
        <input
          ref="pinInputRef"
          type="password"
          placeholder="PIN"
          class="input input-bordered w-full"
          v-model="pin"
          @keydown="validateOnlyNumbers"
          @keyup.enter="validatePin"
        />
        <delete-button @on:click="deletePin" />
      </div>
      <pin-input dot-disabled @input="editPin" @enter="validatePin" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PinInput from '@/components/inputs/PinInput.vue'
import DeleteButton from '@/components/buttons/DeleteButton.vue'
import { useTitle } from '@vueuse/core'
import { IconUserCircle } from '@tabler/icons-vue'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { getUsers, startSession } from '@/api/electron'
import type { User, Response, StartSessionParams } from '@/api/interfaces'
import { ref } from 'vue'

useTitle('Ingresa a Mi Tienda')

const router = useRouter()

// Input PIN
const pinInputRef = ref<HTMLInputElement | null>(null)
const pin = ref<string>('')
const editPin = (value: string) => {
  if (userSelected.value) {
    pin.value += value
  }
}
const deletePin = () => {
  pin.value = ''
}

const validatePin = () => {
  if (userSelected.value && userSelected.value.id) {
    const params: StartSessionParams = {
      id: userSelected.value.id,
      pin: pin.value,
    }
    startSession(params, (response: Response<Partial<User>>) => {
      if (response.success) {
        router.push('/admin')
      } else {
        toast.error('El PIN ingresado es incorrecto')
        pin.value = ''
        pinInputRef.value?.focus()
      }
    })
  }
}

// Users
const userSelected = ref<Partial<User> | null>(null)
const users = ref<Array<Partial<User>>>([])

getUsers((response: Response<Partial<User>[]>) => {
  users.value = response.response
})

const selectUser = (user: Partial<User>) => {
  userSelected.value = user
  pin.value = ''
  pinInputRef.value?.focus()
}
</script>

<style lang="scss" scoped>
.delete-button:active {
  transform: scale(0.95);
  filter: brightness(0.8);
}
</style>
