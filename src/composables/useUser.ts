import { Seller } from "@/api/interfaces"
import { useUserStore } from "@/stores/userStore"
import { storeToRefs } from "pinia"
import { closeSession } from "@/api/electron"

export const useUser = () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  // Functions
  function setUser(newUser: Seller) {
    userStore.setUser(newUser)
  }

  function logout() {
    userStore.logout()
    closeSession(user.value.id)
  }

  return {
    user,
    setUser,
    logout,
  }
}