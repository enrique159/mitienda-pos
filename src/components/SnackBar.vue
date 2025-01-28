<template>
  <div
    class="px-4 py-3 rounded-md w-fit max-w-[380px] bg-white text-brand-black overflow-hidden fixed transition-all right-12 flex items-center gap-2 shadow-lg show-bar-color"
    :class="[
      show ? 'show-snackbar' : 'hide-snackbar',
      show && autoClose ? 'show-bar-color-animated' : '',
    ]"
  >
    <component :is="icon" :size="32" class="icon-color" />
    <p class="text-black-2">
      {{ message }}
    </p>
    <button class="bg-transparent hover:opacity-50 " @click="show = false">
      <IconX size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  IconX,
  IconAlertTriangleFilled,
  IconExclamationCircleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled
} from '@tabler/icons-vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String as () => 'info' | 'success' | 'warning' | 'error',
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const show = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

watch(show, (value) => {
  if (value && props.autoClose) {
    setTimeout(() => {
      show.value = false
    }, props.duration)
  }
})

const backgroundColor = computed(() => {
  switch (props.type) {
  case 'info':
    return '#007bff'
  case 'success':
    return '#28a745'
  case 'warning':
    return '#ffc107'
  case 'error':
    return '#dc3545'
  default:
    return '#007bff'
  }
})

const icon = computed(() => {
  switch (props.type) {
  case 'info':
    return IconInfoCircleFilled
  case 'success':
    return IconCircleCheckFilled
  case 'warning':
    return IconAlertTriangleFilled
  case 'error':
    return IconExclamationCircleFilled
  default:
    return IconInfoCircleFilled
  }
})

const progress = computed(() => {
  return `${props.duration}ms`
})
</script>

<style lang="scss" scoped>
.show-snackbar {
  animation: slide-in 0.2s ease-out forwards;
  top: 20px;
}

.hide-snackbar {
  animation: slide-out 0.2s ease-out forwards;
  top: 20px;
}

.show-bar-color::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 0%;
  height: 5px;
  border-radius: 5px;
  background-color: v-bind(backgroundColor);
}

.show-bar-color-animated::before {
  animation: progress v-bind(progress) linear forwards;
}

.icon-color {
  color: v-bind(backgroundColor);
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>