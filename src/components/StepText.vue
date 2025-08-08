<template>
  <div class="step-text-container">
    <transition
      name="fade-text"
      mode="out-in"
    >
      <p
        :key="currentStep"
        class="step-text"
        :class="textClass"
      >
        {{ currentText }}
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TextStep {
  step: number
  text: string
}

interface Props {
  texts: TextStep[]
  step: number
  textClass?: string
}

const props = defineProps<Props>()

const currentStep = computed(() => props.step)
const currentText = computed(() => {
  const textItem = props.texts.find((item) => item.step === props.step)
  return textItem ? textItem.text : ''
})
</script>

<style scoped>
.step-text-container {
  position: relative;
  height: 1.5em; /* Adjust based on your text size */
  overflow: hidden;
}

.step-text {
  margin: 0;
}

.fade-text-enter-active,
.fade-text-leave-active {
  transition: all 0.5s ease;
}

.fade-text-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-text-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
