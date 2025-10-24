import { Seller } from "@/api/interfaces"
import { useUserStore } from "@/stores/userStore"
import { storeToRefs } from "pinia"
import { closeSession } from "@/api/electron"
import type { Response } from '@/api/interfaces'


export const useUser = () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  // Functions
  function setUser(newUser: Seller) {
    userStore.setUser(newUser)
  }

  async function logout() {
    const response = await closeSession(user.value.id)
    if (!response.success) {
      return;
    }
    userStore.logout()
  }

  return {
    user,
    setUser,
    logout,
  }
}