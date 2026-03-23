import { type TLogin, type TSchemaLogin } from "~/constants/auth";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { POST } from "~/composables/fetch";

export const useAuth = () => {
  const authStore = useAuthStore();

  const accessToken = useCookie<string | null>("accessToken", { default: () => null });

  const loadingLogin: Ref<boolean> = ref(false);
  const isLoggedIn = computed(() => !!accessToken.value);

  const { currentUser } = storeToRefs(authStore);

  const login = async (dataLogin: Partial<TSchemaLogin>) => {
    loadingLogin.value = true;
    try {
      const response = await POST<TLogin>(`${import.meta.env.VITE_API_KAS_GEREJA}/auth/login`, dataLogin);

      accessToken.value = response.token;
      authStore.setUser(response.user);

      navigateTo("/");
    } catch (err) {
      console.log(err);
    }
    loadingLogin.value = false;
  };

  const logout = async () => {
    try {
      await POST<TLogin>(`${import.meta.env.VITE_API_KAS_GEREJA}/auth/logout`);

      accessToken.value = null;
      authStore.clearUser();

      navigateTo("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return {
    accessToken,
    isLoggedIn,
    currentUser,
    loadingLogin,
    login,
    logout
  };
};
