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
                <li @click.stop="">
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
  </div>
</template>

<script lang="ts" setup>
import { useProduct } from '@/composables/useProduct'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'

const { categories } = useProduct()
</script>