<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 w-full h-screen bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="w-full max-w-[720px] h-2/3 bg-white rounded-3xl relative gradient-outline p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">
          Generar producto
        </h3>
        <button class="btn btn-sm btn-circle" @click="close">
          <IconX size="21" />
        </button>
      </div>

      <div class="mb-4">
        <textarea
          v-model="prompt"
          class="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Escribe tu pregunta aquí..."
        />
      </div>

      <div class="flex justify-between mb-4">
        <button
          @click="generate"
          class="px-4 py-2 bg-blue-600 text-white rounded-md"
          :disabled="isLoading || !prompt || !isInitialized"
        >
          {{ isLoading ? 'Generando...' : 'Generar respuesta' }}
        </button>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Limpiar
        </button>
      </div>

      <div v-if="response" class="p-4 bg-gray-100 rounded-md">
        <h3 class="font-bold mb-2">
          Respuesta:
        </h3>
        <div class="whitespace-pre-wrap">
          {{ response }}
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-md mt-4">
        <h3 class="font-bold mb-2">
          Error:
        </h3>
        <div>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { useAI } from '@/composables/useAI'
import { toast } from 'vue3-toastify'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}


const {
  isInitialized,
  isLoading,
  error: aiError,
  initializeModel,
  generateContent,
  reset,
} = useAI()

const prompt = ref('')
const response = ref('')
const error = ref('')

const generate = async () => {
  if (!prompt.value || !isInitialized.value) return

  try {
    const result = await generateContent(prompt.value)
    if (result) {
      response.value = result.text
    } else {
      error.value = aiError.value?.message || 'Error desconocido al generar contenido'
      toast.error('Error al generar contenido')
    }
  } catch (err: any) {
    error.value = err.message || 'Error al generar contenido'
    toast.error('Error al generar contenido')
  }
}

// Limpiar todos los campos
const clearAll = () => {
  prompt.value = ''
  response.value = ''
  error.value = ''
  // No reiniciamos el modelo para mantener la API key
}
</script>

<style lang="scss" scoped>
.gradient-outline {
  box-shadow: 0 0 60px 30px rgba(255, 114, 112, 0.2);
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    background: linear-gradient(45deg, var(--bittersweet-orange), var(--soft-blue), var(--bittersweet-orange), var(--soft-blue));
    border-radius: 1.8rem;
    z-index: -1;
    background-size: 300% 300%;
    animation: gradientRotate 8s linear infinite;
  }
}

@keyframes gradientRotate {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>