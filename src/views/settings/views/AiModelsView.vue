<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Modelos de inteligencia artificial
    </h6>

    <section class="space-y-4">
      <div class="flex items-center justify-between mb-4 bg-white p-4 pr-8 rounded-xl">
        <span class="text-black-2 font-semibold">
          Configura y selecciona tus modelos de IA
        </span>

        <div class="flex flex-col text-end">
          <span class="text-xs text-black-3">
            Modelo activo:
          </span>
          <div v-if="isLoading">
            <span class="loading loading-infinity text-brand-blue" />
          </div>
          <div v-else-if="defaultAiModel" class="flex items-center gap-2">
            <img :src="defaultAiModel?.image" alt="logo" class="w-4 h-4 aspect-square">
            <span class="text-black-1 font-bold capitalize">
              {{ defaultAiModel?.name }}
            </span>
          </div>
          <span v-else class="text-black-1 font-bold text-sm">
            No hay un modelo activo
          </span>
        </div>
      </div>

      <div
        v-for="model in availableModels"
        :key="`ai-model-card-${model.type}`"
        class="flex items-center justify-between py-4 px-4 bg-white rounded-xl"
      >
        <div class="flex items-center gap-2">
          <img
            :src="model.image"
            :alt="model.name"
            class="w-7"
          >
          <div>
            <h6 class="font-medium text-black-2 flex items-center gap-2 mb-2">
              {{ model.name }}
              <span
                class="badge badge-lg text-sm"
                :class="model.isConfigured ? 'bg-green-600/10 text-green-600' : 'bg-gray-600/10 text-gray-600'"
              >
                {{ model.isConfigured ? 'configurado' : 'no configurado' }}
              </span>
            </h6>
            <p class="text-sm text-black-3 w-2/3">
              {{ model.description }}
              Más info.
              <a
                href="#"
                @click.prevent="openExternalLink(model.url)"
                class="text-brand-blue"
              >
                {{ model.url }}
              </a>
            </p>
          </div>
        </div>

        <!-- CONFIG -->
        <div class="flex items-center gap-2">
          <button
            v-if="model.isConfigured"
            class="btn btn-sm"
            :class="!getAiModelByType(model.type)?.default ? 'bg-brand-orange hover:bg-brand-orange/80 text-white' : null"
            :disabled="getAiModelByType(model.type)?.default"
            @click="setDefaultModel(getAiModelByType(model.type)?.id || '')"
          >
            {{ getAiModelByType(model.type)?.default ? 'Activo' : 'Activar' }}
          </button>
          <button class="btn btn-sm btn-circle btn-ghost text-black-2" @click="openConfigModelModal(model.type)">
            <IconSettings size="21" />
          </button>
        </div>
      </div>

      <p class="text-xs text-black-3 text-center w-[90%] mx-auto py-8">
        El uso de los modelos de IA está vinculado a la cuenta personal del usuario.
        MiTienda POS no se hace responsable del uso que se dé a estos servicios ni de los costos asociados.
        Los <strong>cargos por utilización</strong> de las APIs de IA son responsabilidad exclusiva del usuario según las tarifas establecidas por los proveedores de IA.
        Recomendamos revisar los términos de servicio y políticas de precios de cada proveedor.
      </p>
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

      <form @submit.prevent="handleSubmit" class="w-full space-y-2">
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
            <button
              type="button"
              class="w-8 h-8 rounded-full hover:bg-gray-100 text-sm text-black-2 grid place-items-center absolute right-2 top-1/2 -translate-y-1/2"
              @click="showApiKey = !showApiKey"
            >
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
        <div class="flex justify-between">
          <base-button
            v-if="currentModelConfigured?.isConfigured"
            type="button"
            @click="deleteCurrentModel(currentAiModelToConfigure?.id || '')"
          >
            Descartar
          </base-button>
          <div v-else />
          <div class="flex items-center gap-4">
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
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { IconSettings, IconEye, IconEyeClosed } from '@tabler/icons-vue'
import { useConfiguration } from '@/composables/useConfiguration'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { AiModel, AiModelType, CreateAiModel } from '@/api/interfaces/aiModels'
import { useBranch } from '@/composables/useBranch'
import { createAiModel, deleteAiModel, getAiModels, setDefaultAiModel, updateAiModel } from '@/api/electron'
import { Response } from '@/api/interfaces'
import { openExternalLink } from '@/api/electron'
import { useAI } from '@/composables/useAI'
import { toast } from 'vue3-toastify'

const { branch } = useBranch()
const { aiModels } = useConfiguration()
const { isLoading, isInitialized, initializeModel, reset } = useAI()

const selectedModelToConfigure = ref<AiModelType | null>(null)
const currentModelConfigured = computed(() => {
  return availableModels.find((model) => model.type === selectedModelToConfigure.value) || null
})
const currentAiModelToConfigure = computed(() => {
  return aiModels.value.find((model) => model.name === selectedModelToConfigure.value)
})

const availableModels = reactive([
  {
    name: 'Google Gemini',
    description: 'Modelos de IA de Google con capacidades multimodales. Gemini 2.0 para tareas complejas y versiones Flash para respuestas rápidas.',
    url: 'https://ai.google.dev/',
    type: AiModelType.GEMINI,
    image: new URL('@/assets/google-gemini-icon.svg', import.meta.url).href,
    models: [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-lite',
    ],
    isConfigured: computed(() => {
      return aiModels.value.some((model) => model.name === AiModelType.GEMINI)
    }),
  },
  {
    name: 'OpenAI',
    description: 'Modelos de IA de OpenAI con procesamiento de lenguaje avanzado. GPT-4o ofrece máximo rendimiento y GPT-4o-mini mayor eficiencia.',
    url: 'https://openai.com/',
    type: AiModelType.OPENAI,
    image: new URL('@/assets/openai-icon.svg', import.meta.url).href,
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo',
    ],
    isConfigured: computed(() => {
      return aiModels.value.some((model) => model.name === AiModelType.OPENAI)
    }),
  },
])

const defaultAiModel = computed(() => {
  return aiModels.value.find((model) => model.default)
    ? {
      ...aiModels.value.find((model) => model.default),
      image: availableModels.find((m) => m.type === aiModels.value.find((model) => model.default)?.name)?.image,
    }
    : null
})

const getAiModelByType = (type: AiModelType) => {
  return aiModels.value.find((model) => model.name === type)
}

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
  if (currentModelConfigured.value?.isConfigured) {
    formData.model = currentAiModelToConfigure.value?.model || ''
    formData.api_key = currentAiModelToConfigure.value?.api_key || ''
  }
  dialogConfigModelRef.value?.showModal()
}

const closeConfigModelModal = () => {
  dialogConfigModelRef.value?.close()
  selectedModelToConfigure.value = null
  formData.model = ''
  formData.api_key = ''
  showApiKey.value = false
  v$.value.$reset()
}

const handleSubmit = async () => {
  if (currentModelConfigured.value?.isConfigured) {
    handleEditModel()
    return
  }
  handleSubmitModel()
}

const handleSubmitModel = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  const newAiModel: CreateAiModel = {
    id_company: branch.value.id_company,
    name: selectedModelToConfigure.value!,
    model: formData.model,
    api_key: formData.api_key,
    status: 'active',
    default: false,
  }
  createAiModel(newAiModel, (response: Response<AiModel>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllAiModels()
    closeConfigModelModal()
    toast.success('Modelo configurado exitosamente')
  })
}

const handleEditModel = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return
  if (!currentAiModelToConfigure.value) return

  const updatedAiModel: AiModel = {
    ...currentAiModelToConfigure.value,
    model: formData.model,
    api_key: formData.api_key,
  }

  const payload = {
    id: currentAiModelToConfigure.value.id,
    aiModel: updatedAiModel,
  }

  updateAiModel(payload, (response: Response<AiModel>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllAiModels()
    closeConfigModelModal()
    if (updatedAiModel.default) {
      reset()
      initializeDefaultModel(updatedAiModel)
    }
    toast.success('Modelo editado exitosamente')
  })
}

const deleteCurrentModel = (id: string) => {
  deleteAiModel(id, (response: Response<AiModel>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllAiModels()
    closeConfigModelModal()
    toast.success('Modelo descartado exitosamente')
  })
}

const setDefaultModel = (id: string) => {
  setDefaultAiModel({ id, companyId: branch.value.id_company }, (response: Response<AiModel>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllAiModels()
    const selectedModel = aiModels.value.find((model) => model.id === id)
    if (!selectedModel) return
    initializeDefaultModel(selectedModel)
  })
}

const getAllAiModels = () => {
  getAiModels((response: Response<AiModel[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    aiModels.value = response.response
  })
}

const initializeDefaultModel = async (model: AiModel) => {
  initializeModel(model.name, {
    apiKey: model.api_key,
    modelName: model.model,
  })
}

onMounted(() => {
  getAllAiModels()
})

watch(isInitialized, () => {
  if (isInitialized.value) {
    toast.info('Modelo inicializado', {
      theme: 'colored',
    })
  }
})
</script>

