<template>
  <dialog id="dialogCreateCategory" ref="dialogCreateCategoryRef" class="modal" @keydown.escape="closeCreateCategoryModal">
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Crear categoría
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

      <form @submit.prevent="handleSubmitCreate" class="w-full space-y-4">
        <!-- NAME CATEGORY -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Nombre de la categoría</span>
          </div>
          <input
            id="name"
            type="text"
            v-model="formData.categoryName"
            placeholder="Ej. Alimentos"
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.categoryName.$errors" :key="`error-name-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <!-- DESCRIPTION -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium">Descripción</span>
          </div>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="textarea textarea-bordered w-full"
            placeholder="Descripción del producto..."
          />
        </label>

        <!-- BUTTONS -->
        <div class="flex justify-end space-x-4">
          <base-button type="button" @click="closeCreateCategoryModal">
            Cancelar
          </base-button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { ref, reactive, computed, watch } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { Category, CreateCategory, Response } from '@/api/interfaces'
import { createCategory, getCategories } from '@/api/electron'
import { useBranch } from '@/composables/useBranch'
import { toast } from 'vue3-toastify'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openCreateCategoryModal()
  }
})

const { setCategories } = useProduct()
const { branch } = useBranch()

// CREATE CATEGORY
const dialogCreateCategoryRef = ref()
const formData = reactive({
  categoryName: '',
  description: '',
})

const createCategoryRules = {
  categoryName: { required: helpers.withMessage('El nombre es requerido', required) },
}

const vCreate$ = useVuelidate(createCategoryRules, formData)

const openCreateCategoryModal = () => {
  formData.categoryName = ''
  formData.description = ''
  dialogCreateCategoryRef.value.showModal()
}

const closeCreateCategoryModal = () => {
  emit('update:modelValue', false)
  dialogCreateCategoryRef.value.close()
  vCreate$.value.$reset()
  clearFormData()
}

const clearFormData = () => {
  formData.categoryName = ''
  formData.description = ''
}

const handleSubmitCreate = async () => {
  const isFormValid = await vCreate$.value.$validate()
  if (!isFormValid) {
    toast.warn('Formulario no válido, revise los errores')
    return
  }
  const newCategory: CreateCategory = {
    id_company: branch.value.id_company,
    id_branch: branch.value.id,
    name: formData.categoryName,
    description: formData.description,
    status: 'active',
  }
  createCategory(newCategory, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllCategories()
    closeCreateCategoryModal()
    toast.success('Categoría creada exitosamente')
  })
}

const getAllCategories = () => {
  getCategories((response: Response<Category[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setCategories(response.response)
  })
}
</script>