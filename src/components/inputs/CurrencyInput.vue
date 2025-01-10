<template>
  <label class="input bg-white-1 input-bordered flex items-center gap-2" :class="className">
    <input
      class="w-full"
      :placeholder="placeholder"
      @keydown="validateInputAmount"
      @keyup.enter="emits('enter')"
      :value="amountFormatted"
    />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    required: true,
    default: ''
  },
  showCurrency: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'Monto'
  }
})

const emits = defineEmits(['add:value', 'enter', 'backspace'])

const amount = computed(() => props.value);

const validateInputAmount = (e: KeyboardEvent) => {
  const key = e.key;
  const regex = /^[0-9]$/;

  if (key === 'Backspace') {
    emits('backspace');
  }

  if (regex.test(key)) {
    emits('add:value', key)
  }
  e.preventDefault();
};

const amountFormatted = computed(() => {
  if (amount.value === '') return '0.00';
  const numericValue = parseFloat(amount.value.replace(/,/g, '')) / 100;
  return numericValue.toLocaleString('es-MX', { style: props.showCurrency ? 'currency' : 'decimal', currency: 'MXN', minimumFractionDigits: 2 });
});
</script>

<style lang="scss" scoped>

</style>