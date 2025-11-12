<template>
  <dialog id="dialogCreateCategory" ref="dialogCreateSellerRef" class="modal"
    @keydown.escape="closeCreateCategoryModal">
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Crear nuevo usuario / vendedor
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCreateCategoryModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="w-full space-y-4">
        <!-- NAME USER / SELLER -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Nombre completo</span>
          </div>
          <input id="name" type="text" v-model="formData.name" placeholder="Ej. Alfonso Quintero"
            class="input input-bordered w-full">

        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">PIN de acceso</span>
          </div>
          <input id="pin" type="text" v-model="formData.pin" placeholder="Ej. 1234" class="input input-bordered w-full">
        </label>

        <!-- PERMISSIONS CHECKLIST -->
        <fieldset class="form-control w-full">
          <legend class="label">
            <span class="label-text text-black-1 font-medium required">Permisos</span>
          </legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <label v-for="opt in permissionsOptions" :key="opt.value"
              class="cursor-pointer inline-flex items-center space-x-2">
              <input type="checkbox" :value="opt.value" v-model="selectedPermissions" class="checkbox" />
              <span class="text-sm">{{ opt.label }}</span>
            </label>
          </div>
          <p class="text-xs text-muted mt-2">Seleccione uno o más permisos para el usuario/vendedor {{
            formData.permissions }}.</p>
        </fieldset>

        <!-- BUTTONS -->
        <div class="flex justify-end space-x-4">
          <base-button type="button" @click="closeCreateCategoryModal">
            Cancelar
          </base-button>
          <button type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { createSeller } from '@/api/electron'
import { CreateSeller, Response } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'

//composables
const { branch } = useBranch()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'update:table'])

const permissionsOptions = [
  { value: 1, label: 'Administrador' },
  { value: 2, label: 'Vendedor' },
  { value: 3, label: 'Cajero' },
  { value: 4, label: 'Gestionar productos' },
  { value: 5, label: 'Gestionar clientes' },
  { value: 6, label: 'Crear/editar ventas' },
  { value: 7, label: 'Ver reportes' },
  { value: 8, label: 'Exportar datos' },
  { value: 9, label: 'Configurar sistema' },
]

const dialogCreateSellerRef = ref()
const formData = reactive({
  name: '',
  pin: '',
  permissions: 0 as number
})

const selectedPermissions = ref<number[]>([])

watch(selectedPermissions, (val) => {
  if (!val || val.length === 0) {
    formData.permissions = 0
    return
  }
  const sorted = [...val].sort((a, b) => a - b)
  formData.permissions = Number(sorted.join(''))
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openCreateCategoryModal()
  }
})

const closeCreateCategoryModal = () => {
  dialogCreateSellerRef.value.close()
  show.value = false
}

const openCreateCategoryModal = () => {
  formData.name = ''
  selectedPermissions.value = []
  formData.permissions = 0
  dialogCreateSellerRef.value.showModal()
}

const handleSubmit = async () => {
  if (!formData.permissions || formData.permissions === 0) {
    alert('Seleccione al menos un permiso para el usuario.')
    return
  }
  if (!branch || !branch.value || !branch.value.id_company) {
    console.error('Branch not set or missing id_company', branch)
    alert('Falta seleccionar la sucursal. Verifique la configuración de la tienda.')
    return
  }

  const result = await createNewSeller()

  if (result && (result as any).success) {
    emit('update:table')
    closeCreateCategoryModal()
  } else {
    // Mostrar más detalles si el backend devolvió info adicional
    const extra = result && (result as any).response ? JSON.stringify((result as any).response) : ''
    alert('Error al crear el vendedor: ' + ((result && (result as any).message) || 'Error desconocido') + (extra ? '\nDetalles: ' + extra : ''))
  }
}

const createNewSeller = async () => {

  const newSeller: CreateSeller = {
    id_company: branch.value.id_company,
    name: formData.name,
    pin: formData.pin,
    permissions: formData.permissions
  }

  return new Promise((resolve) => {
    createSeller(newSeller as any, (response: Response<void>) => {
      resolve(response)
    })
  })
}

</script>