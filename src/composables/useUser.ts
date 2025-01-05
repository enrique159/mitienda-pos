import { User } from "@/api/interfaces";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";

export const useUser = () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  // Functions
  function setUser(newUser: Partial<User>) {
    userStore.setUser(newUser);
  }

  return {
    user,
    setUser,
  }
}