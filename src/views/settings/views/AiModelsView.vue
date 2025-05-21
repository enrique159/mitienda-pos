<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Modelos de inteligencia artificial
    </h6>

    <section class="space-y-4">
      <div class="flex items-center justify-between mb-4 bg-white p-4 rounded-xl">
        <span class="text-black-2 font-semibold">
          Configura y selecciona tus modelos de IA
        </span>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-sm capitalize font-medium" :disabled="noConfiguredModels">
            {{ defaultAiModelName }}
            <IconChevronDown size="18" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </div>
      </div>

      <div
        v-for="model in availableModels"
        :key="`ai-model-card-${model.type}`"
        class="flex items-center justify-between px-2 py-4 pl-4 bg-white rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img
            :src="model.image"
            :alt="model.name"
            class="w-7"
          >
          <div>
            <h6 class="font-medium text-black-2">
              {{ model.name }}
            </h6>
            <p class="text-sm text-black-3" v-html="model.description" />
          </div>
        </div>

        <!-- CONFIG -->
        <div class="flex items-center gap-2">
          <span
            class="badge badge-lg text-sm"
            :class="model.isConfigured ? 'bg-green-600/10 text-green-600' : 'bg-gray-600/10 text-gray-600'"
          >
            {{ model.isConfigured ? 'configurado' : 'no configurado' }}
          </span>
          <button class="btn btn-sm btn-circle btn-ghost text-black-2" @click="openConfigModelModal(model.type)">
            <IconSettings size="21" />
          </button>
        </div>
      </div>
    </section>
  </div>

  <dialog id="dialogConfigModel" ref="dialogConfigModelRef" class="modal" @keydown.escape="closeConfigModelModal">
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Configurar modelo
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeConfigModelModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <form @submit.prevent="handleSubmitModel" class="w-full space-y-2">
        <!-- SELECT MODEL -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Modelos disponibles:</span>
          </div>
          <select
            id="model"
            class="select select-bordered w-full"
            v-model="formData.model"
          >
            <option disabled value="">
              Selecciona un modelo
            </option>
            <option
              v-for="model in currentModelConfigured?.models"
              :key="`select-option-model-${model}`"
              :value="model"
            >
              {{ model }}
            </option>
          </select>
          <InputErrors :errors="v$.model.$errors" />
        </label>

        <!-- API KEY -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">API Key:</span>
          </div>
          <div class="relative">
            <input
              id="api_key"
              :type="showApiKey ? 'text' : 'password'"
              class="input input-bordered w-full"
              v-model="formData.api_key"
            >
            <button class="w-8 h-8 rounded-full hover:bg-gray-100 text-sm text-black-2 grid place-items-center absolute right-2 top-1/2 -translate-y-1/2" @click="showApiKey = !showApiKey">
              <IconEye v-if="showApiKey" />
              <IconEyeClosed v-else />
            </button>
          </div>
          <InputErrors :errors="v$.api_key.$errors" />
          <div class="label">
            <span class="label-text-alt">Las claves de API son sensibles y no se recomienda compartirlas.</span>
          </div>
        </label>

        <!-- BUTTONS -->
        <div class="flex justify-end space-x-4">
          <base-button
            type="button"
            @click="closeConfigModelModal"
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
  </dialog>
</template>

<script setup lang="ts">
import { IconSettings, IconChevronDown, IconEye, IconEyeClosed } from '@tabler/icons-vue'
import { useConfiguration } from '@/composables/useConfiguration'
import { computed, reactive, ref } from 'vue'
import { AiModelType } from '@/api/interfaces/aiModels'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

const { aiModels } = useConfiguration()

const geminiConfigured = computed(() => {
  return aiModels.value.find((model) => model.default)?.name === AiModelType.GEMINI
})

const selectedModelToConfigure = ref<AiModelType | null>(null)
const currentModelConfigured = computed(() => {
  return availableModels.find((model) => model.type === selectedModelToConfigure.value) || null
})
const availableModels = reactive([
  {
    name: 'Google Gemini',
    description: 'Modelo IA de Google, más info. <a href="https://ai.google.dev/" target="_blank" class="text-brand-blue">https://ai.google.dev/</a>',
    type: AiModelType.GEMINI,
    image: new URL('@/assets/google-gemini-icon.svg', import.meta.url).href,
    models: [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-lite',
    ],
    isConfigured: geminiConfigured.value,
  },
])

const noConfiguredModels = computed(() => {
  return aiModels.value.length === 0
})

const defaultAiModelName = computed(() => {
  return aiModels.value.find((model) => model.default)?.name || 'Selecciona un modelo'
})

// DIALOG SETTINGS
const dialogConfigModelRef = ref()
const showApiKey = ref(false)
const formData = reactive({
  model: '',
  api_key: '',
})

const formDataRules = {
  model: { required: helpers.withMessage('El nombre es requerido', required) },
  api_key: { required: helpers.withMessage('La clave es requerida', required) },
}
const v$ = useVuelidate(formDataRules, formData)

const openConfigModelModal = (model: AiModelType) => {
  selectedModelToConfigure.value = model
  dialogConfigModelRef.value?.showModal()
}

const closeConfigModelModal = () => {
  selectedModelToConfigure.value = null
  dialogConfigModelRef.value?.close()
}

const handleSubmitModel = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return
}

</script>

