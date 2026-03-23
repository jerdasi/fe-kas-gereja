import { defineStore } from "pinia";
import type { TUserSession } from "~/constants/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const currentUser: Ref<TUserSession | null> = ref(null);

    const isLoggedIn = computed(() => !!currentUser.value);

    const setCurrentUser = (data: TUserSession) => {
      currentUser.value = data;
    };

    const clearCurrentUser = () => {
      currentUser.value = null;
    };

    return {
      currentUser,
      isLoggedIn,
      setUser: setCurrentUser,
      clearUser: clearCurrentUser
    };
  },
  { persist: true }
);
