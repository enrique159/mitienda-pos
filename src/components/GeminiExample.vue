<template>
  <div class="gemini-container">
    <h2 class="text-xl font-bold mb-4">
      Gemini AI Assistant
    </h2>

    <div v-if="!isInitialized" class="mb-4 p-4 bg-yellow-100 rounded-md">
      <p class="text-yellow-800">
        Para probar el modelo de IA, ingresa tu clave API de Google Gemini:
      </p>
      <div class="mt-2">
        <input
          v-model="tempApiKey"
          type="password"
          class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ingresa tu clave API de Google Gemini"
        >
        <button
          @click="saveApiKey"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Guardar clave API
        </button>
      </div>
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

// Guardar la clave API e inicializar el modelo
const saveApiKey = async () => {
  if (!tempApiKey.value) {
    toast.error('Por favor ingresa una clave API válida')
    return
  }

  try {
    // Guardar la clave API en localStorage (solo para este ejemplo)
    // En un caso real, podrías guardarla en tu base de datos
    window.localStorage.setItem('gemini_api_key', tempApiKey.value)

    // Inicializar el modelo Gemini con la API key
    const success = await initializeModel('gemini', {
      apiKey: tempApiKey.value,
      modelName: 'gemini-2.5-flash',
    })

    if (success) {
      toast.success('Modelo Gemini inicializado correctamente')
      tempApiKey.value = ''
    } else {
      toast.error('Error al inicializar el modelo Gemini')
    }
  } catch (err: any) {
    console.error('Error al guardar la clave API:', err)
    toast.error('Error al guardar la clave API')
  }
}

// Verificar si hay una clave API guardada e inicializar el modelo al montar el componente
onMounted(async () => {
  try {
    // Aquí deberías obtener la clave API de tu store o de donde la tengas almacenada
    // Por ejemplo, si tienes un store de Pinia para la compañía:
    // const companyStore = useCompanyStore()
    // const apiKey = companyStore.company?.google_gemini_api_key

    // Para este ejemplo, usaremos una clave API guardada en localStorage
    const apiKey = window.localStorage.getItem('gemini_api_key') || ''

    if (apiKey) {
      // Si hay una clave API, inicializar el modelo Gemini
      await initializeModel('gemini', {
        apiKey,
        modelName: 'gemini-2.5-flash',
      })
    }
  } catch (err) {
    console.error('Error al inicializar el modelo de IA:', err)
  }
})

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
