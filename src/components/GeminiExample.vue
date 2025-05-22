<template>
  <div class="gemini-container">
    <h2 class="text-xl font-bold mb-4">
      Gemini AI Assistant
    </h2>

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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useAI } from '@/composables/useAI'

const prompt = ref('')
const response = ref('')
const error = ref('')
const tempApiKey = ref('')

// Usar el composable de IA
const {
  isInitialized,
  isLoading,
  error: aiError,
  initializeModel,
  generateContent,
  reset,
} = useAI()

// Generar contenido con el modelo de IA
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

<style scoped>
.gemini-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
