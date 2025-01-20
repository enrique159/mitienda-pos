<template>
  <section class="h-full bg-white border-r border-white-3 p-2">
    <ul class="list-none">
      <li
        v-for="item in itemsMenu"
        :key="`nav-option-menu-settings-${item.title}`"
        class="mb-2"
      >
        <router-link
          :to="item.path"
          class="hover:bg-white-2 rounded-lg pl-4 pr-2 py-2 flex items-center gap-2 transition-all active:scale-95 active:bg-white-3 text-[0.9rem] relative"
          :class="[
            currentRoutePath === item.path
              ? 'text-brand-orange show-badge'
              : 'text-black-1',
          ]"
        >
          <component :is="item.icon" size="18" stroke-width="2" />
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
interface ItemMenu {
  title: string
  path: string
  icon: any
}
import { computed } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()

const currentRoutePath = computed(() => route.path)

const props = defineProps({
  itemsMenu: {
    type: Array<ItemMenu>,
    required: true,
  },
})
</script>

<style scoped>
.show-badge::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 4px;
  width: 5px;
  border-radius: 5px;
  height: 24px;
  transform: translateY(-12px);
  background-color: #FF7270;
}
</style>