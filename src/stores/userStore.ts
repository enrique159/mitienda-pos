import { User } from "@/api/interfaces";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
  const user = ref<Partial<User>>({});

  const setUser = (newUser: Partial<User>) => {
    user.value = newUser;
  }

  return {
    // State
    user,
    // Actions
    setUser,
  }
})