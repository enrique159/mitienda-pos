import { Seller } from "@/api/interfaces"
import { useUserStore } from "@/stores/userStore"
import { storeToRefs } from "pinia"

export const useUser = () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  // Functions
  function setUser(newUser: Seller) {
    userStore.setUser(newUser)
  }

  return {
    user,
    setUser,
  }
}