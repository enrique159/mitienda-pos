<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th class="w-12" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, i) in categories" :key="`category-row-${category.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="[category.status === 'active' ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
            >
              {{ category.status === 'active' ? 'activo' : 'inactivo' }}
            </div>
          </td>
          <td>
            <div class="dropdown dropdown-left">
              <div
                tabindex="0"
                role="button"
                class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center"
              >
                <icon-dots-vertical class="w-4 h-4" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow"
              >
                <li @click.stop="openEditCategoryModal(category)">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Editar categoría
                  </a>
                </li>
                <li @click.stop="">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Eliminar categoría
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <dialog id="dialogEditCategory" ref="dialogEditCategoryRef" class="modal" @keydown.escape="closeEditCategoryModal">
      <div class="modal-box min-w-[480px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">
            Editar categoría
          </h3>
          <div class="modal-action mt-0">
            <form method="dialog" @submit="closeEditCategoryModal">
              <button class="close-btn">
                Cerrar
                <CustomKbd>ESC</CustomKbd>
              </button>
            </form>
          </div>
        </div>

        <form @submit.prevent="handleSubmitEdit" class="w-full space-y-4">
          <!-- NAME CATEGORY -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Nombre de la categoría</span>
            </div>
            <input
              id="name"
              type="text"
              v-model="formDataEditCategory.name"
              placeholder="Ej. Alimentos"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in vEdit$.name.$errors" :key="`error-name-${index}`">
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
              v-model="formDataEditCategory.description"
              rows="3"
              class="textarea textarea-bordered w-full"
              placeholder="Descripción del producto..."
            />
          </label>

          <!-- STATUS -->
          <div class="form-control">
            <label class="label cursor-pointer w-fit">
              <input
                type="checkbox"
                class="toggle checked:text-success"
                :checked="formDataEditCategory.status === 'active'"
                @change="formDataEditCategory.status = formDataEditCategory.status !== 'active' ? 'active' : 'inactive'"
              >
              <div class="flex flex-col items-start ml-2">
                <span class="font-semibold text-black-1 mr-2">Activo</span>
                <span class="text-sm text-black-2">
                  El producto se vende en la tienda
                </span>
              </div>
            </label>
          </div>
          <!-- BUTTONS -->
          <div class="flex justify-end space-x-4">
            <base-button
              type="button"
              @click="closeEditCategoryModal"
            >
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
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { ref, reactive, computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'
import { Category, Response } from '@/api/interfaces'
import { updateCategory, getCategories, deleteCategory } from '@/api/electron'
import { toast } from 'vue3-toastify'

const { categories, setCategories } = useProduct()

// EDIT CATEGORY
const dialogEditCategoryRef = ref()
const selectedCategory = ref<Category | null>(null)
const formDataEditCategory = reactive({
  name: '',
  description: '',
  status: 'active',
})

const rules = computed(() => {
  return {
    name: { required: helpers.withMessage('El nombre es requerido', required) },
  }
})

const vEdit$ = useVuelidate(rules, formDataEditCategory)

const openEditCategoryModal = (category: Category) => {
  selectedCategory.value = category
  formDataEditCategory.name = category.name
  formDataEditCategory.description = category.description
  formDataEditCategory.status = category.status
  dialogEditCategoryRef.value.showModal()
}

const closeEditCategoryModal = () => {
  selectedCategory.value = null
  dialogEditCategoryRef.value.close()
  clearFormDataEditCategory()
}

const clearFormDataEditCategory = () => {
  formDataEditCategory.name = ''
  formDataEditCategory.description = ''
  formDataEditCategory.status = 'active'
}

const handleSubmitEdit = async () => {
  const isFormValid = await vEdit$.value.$validate()
  if (!isFormValid) {
    toast.warn('Formulario no válido, revise los errores')
    return
  }
  const editedCategory: Category = {
    ...selectedCategory.value!,
    name: formDataEditCategory.name,
    description: formDataEditCategory.description,
    status: formDataEditCategory.status === 'active' ? 'active' : 'inactive',
  }
  updateCategory(editedCategory, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllCategories()
    closeEditCategoryModal()
    toast.success('Categoría actualizada exitosamente')
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