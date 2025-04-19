<template>
  <dialog id="dialogConfirmAudit" ref="dialogConfirmAuditRef" class="modal" @keydown.escape="closeConfirmAuditModal">
    <div class="modal-box min-w-[400px] h-fit overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Confirmar cierre de caja
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeConfirmAuditModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="closeConfirmAuditModal">
          Cancelar
        </base-button>
        <base-button type="button" @click="submitConfirmAudit">
          Confirmar
        </base-button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const dialogConfirmAuditRef = ref()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm:audit'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openConfirmAuditModal()
  }
})

const openConfirmAuditModal = () => {
  dialogConfirmAuditRef.value.showModal()
}

const closeConfirmAuditModal = () => {
  show.value = false
  dialogConfirmAuditRef.value.close()
}

const submitConfirmAudit = () => {
  emit('confirm:audit')
  closeConfirmAuditModal()
}
</script>