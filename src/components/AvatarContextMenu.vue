<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button">
      <div class="avatar placeholder">
        <div class="bg-neutral text-neutral-content w-10 rounded-full">
          <span class="uppercase">{{ getFirst2Letters }}</span>
        </div>
      </div>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
    >
      <li class="menu-title capitalize">{{ user.name }}</li>
      <li>
        <router-link to="/profile">
          <icon-user size="1.1rem" stroke-width="2" />
          Ver mi perfil
        </router-link>
      </li>
      <li>
        <a>
          <icon-logout size="1.1rem" stroke-width="2" />
          Cerrar mi sesión
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IconUser, IconLogout } from '@tabler/icons-vue'
import { useUser } from '@/composables/useUser'
import { computed } from 'vue'

const { user } = useUser()

const getFirst2Letters = computed(
  () => user.value && user.value?.name?.slice(0, 2)
)
</script>

<style lang="scss" scoped></style>
