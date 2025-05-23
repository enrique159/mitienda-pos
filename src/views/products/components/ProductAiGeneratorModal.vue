<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 w-full h-screen bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="w-full max-w-[720px] h-2/3 bg-white rounded-3xl relative gradient-outline p-4 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold">
          Asistente de Productos IA
        </h3>
        <button class="btn btn-sm btn-circle" @click="close">
          <IconX size="21" />
        </button>
      </div>

      <!-- Chat Messages Area -->
      <div class="flex-1 overflow-y-auto mb-4 p-2" ref="chatContainer">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-2">
          <p class="text-center title text-3xl font-bold">
            Bienvenido
          </p>
          <p class="text-center text-black-3 w-[90%]">
            Comienza a generar productos con IA, puedes describir el producto que deseas generar y la IA te ayudará a crearlo.
            Ejemplo: "Necesito agregar un jabón líquido para ropa de 1 litro con un precio de 46 pesos..."
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.type === 'user' ? 'flex justify-end' : 'flex justify-start'"
          >
            <div
              :class="[
                'max-w-[80%] p-3 rounded-lg',
                message.type === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
              ]"
            >
              <div class="whitespace-pre-wrap">
                {{ message.content }}
              </div>
              <div
                :class="[
                  'text-xs mt-1',
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                ]"
              >
                {{ message.timestamp }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-md mt-4">
          <h3 class="font-bold mb-2">
            Error:
          </h3>
          <div>{{ error }}</div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="mt-auto">
        <div class="flex flex-col items-center gap-2 bg-gray-100/70 rounded-2xl">
          <textarea
            v-model="prompt"
            class="w-full rounded-2xl outline-none px-4 pt-3 pb-0 bg-transparent resize-none overflow-hidden"
            rows="1"
            placeholder="Escribe tu mensaje aquí..."
            @keydown.enter.exact.prevent="generate"
            @input="autoGrow"
            @keydown.shift.enter.exact="allowNewLine"
            ref="textareaRef"
          />
          <div class="w-full flex justify-between px-4 pb-2">
            <div id="left-actions" class="flex items-center gap-2">
              <!-- ADD FILE -->
              <button class="tooltip tooltip-right" data-tip="Agregar archivo">
                <IconPlus size="21" />
              </button>
            </div>
            <div id="right-actions" class="flex items-center gap-2">
              <div class="tooltip tooltip-left" data-tip="Limpiar conversación">
                <button
                  @click="clearAll"
                  class="w-10 aspect-square rounded-full grid place-items-center hover:bg-white-3 transition-all"
                >
                  <IconEraser size="21" />
                </button>
              </div>
              <button
                @click="generate"
                class="w-10 aspect-square rounded-full grid place-items-center hover:bg-white-3 transition-all disabled:opacity-50"
                :disabled="isLoading || !prompt || !isInitialized"
              >
                <IconSend v-if="!isLoading" size="21" />
                <div v-else class="loading-spinner" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconX, IconSend, IconPlus, IconEraser } from '@tabler/icons-vue'
import { useAI } from '@/composables/useAI'
import { toast } from 'vue3-toastify'
import { ref, nextTick, watch, onMounted } from 'vue'

interface Message {
  type: 'user' | 'ai'
  content: string
  timestamp: string
}

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
  generateContent,
} = useAI()

const prompt = ref('')
const error = ref('')
const messages = ref<Message[]>([])
const chatContainer = ref<any>(null)
const textareaRef = ref(null)

// Formatear la hora actual
const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Scroll al final del chat cuando se añaden nuevos mensajes
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const generate = async () => {
  if (!prompt.value || !isInitialized.value || isLoading.value) return

  const userMessage = prompt.value.trim()

  // Añadir mensaje del usuario
  messages.value.push({
    type: 'user',
    content: userMessage,
    timestamp: formatTime(),
  })

  // Limpiar el input
  const currentPrompt = prompt.value
  prompt.value = ''
  error.value = ''

  try {
    const result = await generateContent(currentPrompt)
    if (result) {
      // Añadir respuesta de la IA
      messages.value.push({
        type: 'ai',
        content: result.text,
        timestamp: formatTime(),
      })
    } else {
      error.value = aiError.value?.message || 'Error desconocido al generar contenido'
      toast.error('Error al generar contenido')
    }
  } catch (err: any) {
    error.value = err.message || 'Error al generar contenido'
    toast.error('Error al generar contenido')
  }
}

// Función para ajustar automáticamente la altura del textarea
const autoGrow = () => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value as any

  // Resetear la altura para calcular correctamente
  textarea.style.height = 'auto'

  // Establecer la altura basada en el contenido (máximo 200px)
  const scrollHeight = textarea.scrollHeight
  const maxHeight = 200
  textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
}

// Función para permitir nuevas líneas con Shift+Enter
const allowNewLine = (e: KeyboardEvent) => {
  // No hacemos nada especial, solo evitamos que se genere el mensaje
  // El comportamiento predeterminado de shift+enter ya inserta una nueva línea
  // Después de insertar la línea, el evento @input activará autoGrow
}

// Limpiar todos los campos
const clearAll = () => {
  prompt.value = ''
  messages.value = []
  error.value = ''

  // Resetear la altura del textarea
  if (textareaRef.value) {
    (textareaRef.value as any).style.height = 'auto'
  }

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
    animation: gradientRotate 4s linear infinite;
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

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.title {
  background: linear-gradient(to right, var(--bittersweet-orange), var(--soft-blue));
  background-size: cover;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>