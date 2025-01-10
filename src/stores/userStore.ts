import { Seller } from "@/api/interfaces";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const checkPermision = (permission: number, mask: number) => (permission & mask) > 0

export const useUserStore = defineStore('user', () => {
  const user = ref<Seller>({} as Seller);

  const setUser = (newUser: Seller) => {
    user.value = newUser;
  }

  const permissions = computed(() => {
    return {
      canSell: checkPermision(user.value.permissions, 1),
    }
  })

  return {
    // State
    user,
    // Getters
    permissions,
    // Actions
    setUser,
  }
})