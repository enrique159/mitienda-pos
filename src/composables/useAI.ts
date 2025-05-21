import { ref, computed } from 'vue'
import Gemini from '@/plugins/gemini.plugin'
import { AIError, AIModelConfig, AiModelType, AIResponse } from '@/api/interfaces/aiModels'

/**
 * Composable para interactuar con modelos de IA
 * Actualmente soporta Google Gemini, pero está diseñado para ser extensible
 */
export function useAI() {
  // Estado
  const isInitialized = ref(false)
  const currentModel = ref<AiModelType | null>(null)
  const isLoading = ref(false)
  const error = ref<AIError | null>(null)
  const lastResponse = ref<AIResponse | null>(null)

  // Instancias de los modelos
  const geminiInstance = ref<Gemini | null>(null)

  /**
   * Inicializa un modelo de IA específico
   */
  const initializeModel = async (type: AiModelType, config: AIModelConfig) => {
    isLoading.value = true
    error.value = null

    try {
      switch (type) {
      case AiModelType.GEMINI:
        geminiInstance.value = new Gemini({ defaultModel: config.modelName })
        geminiInstance.value.setApiKey(config.apiKey)

        if (!geminiInstance.value.isApiKeySet()) {
          throw new Error('No se pudo inicializar el modelo Gemini. Verifica la API key.')
        }

        currentModel.value = AiModelType.GEMINI
        isInitialized.value = true
        break

      // Aquí puedes añadir más modelos en el futuro
      default:
        throw new Error(`Modelo de IA no soportado: ${type}`)
      }

      return true
    } catch (err: any) {
      error.value = {
        message: err.message || 'Error al inicializar el modelo de IA',
        raw: err,
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Genera contenido utilizando el modelo de IA actualmente inicializado
   */
  const generateContent = async (prompt: string): Promise<AIResponse | null> => {
    if (!isInitialized.value || !currentModel.value) {
      error.value = {
        message: 'No hay un modelo de IA inicializado. Llama a initializeModel primero.',
      }
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      let response: string = ''

      switch (currentModel.value) {
      case AiModelType.GEMINI:
        if (!geminiInstance.value) {
          throw new Error('Instancia de Gemini no inicializada')
        }
        response = await geminiInstance.value.generateContent(prompt)
        break

      // Aquí puedes añadir más modelos en el futuro
      default:
        throw new Error(`Modelo no soportado: ${currentModel.value}`)
      }

      lastResponse.value = { text: response }
      return lastResponse.value
    } catch (err: any) {
      error.value = {
        message: err.message || 'Error al generar contenido',
        raw: err,
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reinicia el estado del composable
   */
  const reset = () => {
    isInitialized.value = false
    currentModel.value = null
    isLoading.value = false
    error.value = null
    lastResponse.value = null
    geminiInstance.value = null
  }

  return {
    // Estado
    isInitialized: computed(() => isInitialized.value),
    currentModel: computed(() => currentModel.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    lastResponse: computed(() => lastResponse.value),

    // Métodos
    initializeModel,
    generateContent,
    reset,
  }
}
