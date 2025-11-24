<template>
  <dialog
    ref="permissionsModalRef"
    class="modal"
    @keydown.escape="closePermissionsModal"
  >
    <div class="modal-box min-w-[780px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">Permisos</h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closePermissionsModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-4 mb-8 px-4">
          <button
            v-for="role in defaultRoles"
            :key="`button-role-${role.label}`"
            class="btn btn-ghost btn-outline btn-sm rounded-full px-6 shadow-none"
            @click="permissions = role.value"
          >
            {{ role.label }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div
            v-for="group in groupedPermissions"
            :key="`permissions-${group.name}`"
          >
            <h3 class="font-bold capitalize mb-2">
              {{ group.name }}
            </h3>
            <div class="space-y-1">
              <div
                v-for="permission in group.permissions"
                :key="permission.value"
                class="form-control"
              >
                <label class="cursor-pointer label justify-start gap-3 py-0">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-neutral checkbox-sm"
                    :checked="hasPermission(permission.value)"
                    @change="togglePermission(permission.value)"
                  />
                  <span class="label-text">{{ permission.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn btn-primary" @click="handleSavePermissions">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import {
  checkPermission,
  DEFAULT_ROLES,
  PERMISSIONS_LIST,
} from '@/api/interfaces/permissions'
import { updatePermissionsSeller } from '@/api/electron/sellers'
import { ref, computed, watch } from 'vue'
import { toast } from '@/composables/useToast'
import { Response, Seller } from '@/api/interfaces'

const permissionsModalRef = ref()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  idUser: {
    type: String,
    default: '',
  },
  permissions: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue', 'update:table'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(show, (value) => {
  if (value) {
    openPermissionsModal()
  }
})

const openPermissionsModal = () => {
  permissionsModalRef.value.showModal()
  permissions.value = props.permissions || 0
}
const closePermissionsModal = () => {
  permissionsModalRef.value.close()
  show.value = false
}

const permissions = ref(0)
const defaultRoles = ref(DEFAULT_ROLES)

const hasPermission = (permission: number) => {
  return checkPermission(permissions.value, permission)
}

// Alternar un permiso específico
const togglePermission = (permission: number) => {
  if (hasPermission(permission)) {
    // Quitar permiso
    permissions.value &= ~permission
  } else {
    // Añadir permiso
    permissions.value |= permission
  }
}

// Agrupar permisos por categoría
interface PermissionGroup {
  name: string
  permissions: typeof PERMISSIONS_LIST
}

const groupedPermissions = ref<PermissionGroup[]>([])
const generateGroupedPermissions = () => {
  const groups: Record<string, typeof PERMISSIONS_LIST> = {}

  PERMISSIONS_LIST.forEach((permission) => {
    if (!groups[permission.group]) {
      groups[permission.group] = []
    }
    groups[permission.group].push(permission)
  })

  groupedPermissions.value = Object.entries(groups)
    .map(([name, permissions]) => ({
      name,
      permissions,
    }))
    .sort((a, b) => {
      // Ordenar grupos por cantidad de permisos (de mayor a menor)
      return b.permissions.length - a.permissions.length
    })
}
generateGroupedPermissions()

// SAVE PERMISSIONS
const handleSavePermissions = () => {
  if (!props.idUser) {
    toast.warn('No se ha seleccionado un vendedor')
    return
  }

  updatePermissionsSeller(
    { id: props.idUser, permissions: permissions.value },
    (response: Response<Seller>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success('Permisos actualizados correctamente')
      emit('update:table')
      closePermissionsModal()
    }
  )
}
</script>
